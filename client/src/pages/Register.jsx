import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/api';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''

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
      const { data } = await registerUser(form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@restaurant.com"
          required
        />
        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required 
        />



        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-900 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}