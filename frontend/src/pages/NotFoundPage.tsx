import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      <h1 style={{ fontSize: 72, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 16 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>The page you&#39;re looking for doesn&#39;t exist.</p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '10px 24px', borderRadius: 8, border: 'none',
          backgroundColor: 'var(--color-primary)', color: 'white',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
