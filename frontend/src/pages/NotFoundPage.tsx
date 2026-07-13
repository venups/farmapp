import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8 relative">
          <h1 className="text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-bounce">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={() => window.location.href = '/'}>
           Go to Dashboard
          </Button>
          <Link to="/trips">
            <Button variant="secondary">Explore Trips</Button>
          </Link>
        </div>

        <div className="mt-12 text-slate-500">
          <p>Tip: Check the URL for typos or navigate using the menu.</p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
