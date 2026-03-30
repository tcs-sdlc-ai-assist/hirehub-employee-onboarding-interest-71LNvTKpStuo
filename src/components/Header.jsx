import { NavLink, useNavigate } from 'react-router-dom';

export default function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate('/admin');
  }

  function handleLogoutClick() {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-logo">
          HireHub
        </NavLink>
        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Admin
          </NavLink>
        </nav>
        <div className="header-auth">
          {isLoggedIn ? (
            <button className="btn btn-logout" onClick={handleLogoutClick}>
              Logout
            </button>
          ) : (
            <button className="btn btn-login" onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}