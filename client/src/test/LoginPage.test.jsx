// src/test/LoginPage.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage.jsx';

// Mock AuthContext
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({ login: mockLogin, register: vi.fn() }),
}));

vi.mock('../context/DataSourceContext.jsx', () => ({
  useDataSource: () => ({
    dataSourceMode: 'instrument',
    setDataSourceMode: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('shows validation error for invalid email', async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeDefined();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows validation error for empty email', async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeDefined();
    });
  });

  it('calls login and navigates on success', async () => {
    mockLogin.mockResolvedValue({ email: 'admin@test.com', role: 'admin' });
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('shows toast error on login failure', async () => {
    const toast = await import('react-hot-toast');
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('disables submit button while submitting', async () => {
    mockLogin.mockImplementation(() => new Promise((res) => setTimeout(res, 100)));
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);

    expect(button.disabled).toBe(true);
  });
});
