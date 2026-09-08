import { Tag } from '../components/Tag/Tag';

function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Clube de Leitura D&apos;Elas</h1>
      <p>Projeto web em branco. Comece editando `src/pages/Home.tsx`.</p>

      {/* Demonstração do componente de exemplo. Pode apagar ao criar a Home de verdade. */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Tag>Gestora</Tag>
        <Tag color="neutral">Ficção</Tag>
      </div>
    </main>
  );
}

export default Home;
