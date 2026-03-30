import { isAdminLoggedIn } from '../utils/sessionManager';
import AdminLogin from './AdminLogin';

export default function ProtectedRoute({ children, onLogin }) {
  if (isAdminLoggedIn()) {
    return children;
  }

  return <AdminLogin onLogin={onLogin} />;
}