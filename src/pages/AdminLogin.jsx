import { useState } from 'react';
import { login } from '../utils/sessionManager';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const result = login(username, password);

    if (result.success) {
      if (onLogin) {
        onLogin();
      }
    } else {
      setErrorMessage(result.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="admin-login-page">
      <h1 className="form-heading">Admin Login</h1>
      <p className="form-subheading">
        Enter your credentials to access the admin dashboard.
      </p>

      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary form-submit">
          Login
        </button>
      </form>
    </div>
  );
}