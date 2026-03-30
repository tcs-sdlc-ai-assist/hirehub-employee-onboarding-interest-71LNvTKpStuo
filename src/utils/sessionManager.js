const STORAGE_KEY = 'hirehub_admin_auth';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    console.error('SessionStorage is unavailable.');
    return false;
  }
}

export function login(username, password) {
  if (!username || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }

  if (!password || !password.trim()) {
    return { success: false, error: 'Password is required.' };
  }

  if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid credentials.' };
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    return { success: true };
  } catch {
    console.error('SessionStorage is unavailable.');
    return { success: false, error: 'Unable to save session. Please try again.' };
  }
}

export function logout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error('SessionStorage is unavailable.');
  }
}