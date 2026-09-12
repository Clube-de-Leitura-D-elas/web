#!/bin/sh
# Bloqueia o commit se a branch não puder ser mesclada na develop sem conflito.
#
# Roda depois do lint-staged, então o que é testado é exatamente o commit que
# está prestes a nascer: a árvore do índice (já com as correções do Prettier e
# do ESLint) sobre o HEAD atual, mesclada com a origin/develop.
#
# A checagem é feita com `git merge-tree`, que resolve a mesclagem em memória:
# nada é escrito no working tree e nenhuma branch é alterada.

BASE_BRANCH='develop'
REMOTE='origin'

aviso() {
  echo "husky > aviso: $1" >&2
  echo "husky > checagem de conflito com a $BASE_BRANCH pulada; o commit segue." >&2
  exit 0
}

# Na própria develop não há o que checar.
if [ "$(git rev-parse --abbrev-ref HEAD)" = "$BASE_BRANCH" ]; then
  exit 0
fi

# Repositório sem nenhum commit ainda.
git rev-parse --verify --quiet HEAD >/dev/null || exit 0

# `git merge-tree --write-tree` existe a partir do git 2.38.
git merge-tree --write-tree HEAD HEAD >/dev/null 2>&1 ||
  aviso "seu git não suporta 'merge-tree --write-tree' (precisa da versão 2.38 ou maior)"

# Atualiza a referência local da develop. Se estiver sem rede, seguimos com a
# cópia que já existe: falta de internet não pode travar o commit de ninguém.
if ! git fetch --quiet --no-tags "$REMOTE" "$BASE_BRANCH" 2>/dev/null; then
  echo "husky > aviso: não deu para buscar a $BASE_BRANCH em $REMOTE (sem rede?)." >&2
  echo "husky > usando a cópia local da $REMOTE/$BASE_BRANCH, que pode estar desatualizada." >&2
fi

base="$(git rev-parse --verify --quiet "$REMOTE/$BASE_BRANCH")"
[ -n "$base" ] || aviso "$REMOTE/$BASE_BRANCH não existe no seu clone"

# Monta, sem commitar, o commit que o `git commit` vai criar.
tree="$(git write-tree 2>/dev/null)" ||
  aviso "índice com arquivos não resolvidos (merge ou rebase em andamento?)"
candidate="$(git commit-tree "$tree" -p HEAD -m 'husky: checagem de conflito' 2>/dev/null)" ||
  aviso "não foi possível montar o commit de teste"

saida="$(git merge-tree --write-tree --name-only "$base" "$candidate" 2>/dev/null)"
status=$?

if [ "$status" -eq 0 ]; then
  exit 0
fi

# Saída em caso de conflito: OID da árvore, linha em branco, arquivos em
# conflito, linha em branco, mensagens informativas.
conflitos="$(printf '%s\n' "$saida" | awk 'NR > 1 { if (NF == 0) exit; print }')"

# Exit code diferente de zero sem nenhum arquivo listado é erro do comando, e
# não conflito de verdade — nesse caso não faz sentido bloquear.
if [ -z "$conflitos" ]; then
  aviso "não foi possível comparar com a $REMOTE/$BASE_BRANCH"
fi

echo "" >&2
echo "husky > commit bloqueado: esta branch conflita com a $REMOTE/$BASE_BRANCH." >&2
echo "" >&2
echo "  Arquivos em conflito:" >&2
printf '%s\n' "$conflitos" | sed 's/^/    - /' >&2
echo "" >&2
echo "  Traga a develop para a sua branch e resolva os conflitos antes de commitar:" >&2
echo "" >&2
echo "    git merge $REMOTE/$BASE_BRANCH" >&2
echo "" >&2
echo "  Em uma emergência, 'git commit --no-verify' pula esta checagem — mas o" >&2
echo "  conflito vai aparecer do mesmo jeito na hora de abrir o PR." >&2
echo "" >&2
exit 1
