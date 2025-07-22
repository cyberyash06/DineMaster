import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/api/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role:'' 

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-red-500">{error}</p>}

        
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
        required />

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={form.role}
            onChange={handleChange}
            name="role"
            className="w-full rounded-lg border px-3 py-2 text-white bg-slate-50 dark:bg-slate-800"
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-900 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}