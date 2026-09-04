import { Tag } from '../components/Tag/Tag';
import { useThemeMode } from '../hooks/useThemeMode';

function Home() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <main style={{ padding: 32 }}>
      <h1>Clube de Leitura D&apos;Elas</h1>
      <p>Projeto web em branco. Comece editando `src/pages/Home.tsx`.</p>

      {/* Demonstração do tema e do componente de exemplo. Pode apagar ao criar a Home de verdade. */}
      <button type="button" onClick={toggleMode}>
        Tema atual: {mode} — alternar
      </button>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Tag>Gestora</Tag>
        <Tag color="neutral">Ficção</Tag>
      </div>
    </main>
  );
}

export default Home;
