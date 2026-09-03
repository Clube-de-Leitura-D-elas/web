import { Link } from 'react-router';

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para o início</Link>
    </main>
  );
}

export default NotFound;
