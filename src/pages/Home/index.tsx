import { Tag } from '../../components/Tag/Tag';

export const Home = () => (
  <>
    <h1>Clube de Leitura D&apos;Elas</h1>
    <p>Projeto web em branco. Comece editando `src/pages/Home/index.tsx`.</p>

    {/* Demonstração do componente de exemplo. Pode apagar ao criar a Home de verdade. */}
    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
      <Tag>Gestora</Tag>
      <Tag color="neutral">Ficção</Tag>
    </div>
  </>
);
