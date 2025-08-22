import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser, setAuthToken } from '../../lib/api/authApi';
import { useAuth } from '../../Context/AuthContext';
import AuthLayout from '../../components/Layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const getRoleBasedRedirect = (role) => {
    switch (role) {
      case 'admin':
        return '/dashboard';
      case 'manager':
        return '/dashboard';
      case 'staff':
        return '/orders';
      case 'cashier':
        return '/orders';
      default:
        return '/orders';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(form);
      const { user, token } = response.data;

      // Set token and update auth context
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      const redirectPath = getRoleBasedRedirect(user.role);
      navigate(redirectPath, { replace: true });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      dispatch({ type: 'AUTH_ERROR' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@restaurant.com"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button
          variant="primary"
          size="md"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">Demo Accounts:</p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>Admin: admin@restaurant.com</p>
            <p>Staff: staff@restaurant.com</p>
            <p>Password: password123</p>
          </div>
        </div>

        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-900 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
