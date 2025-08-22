import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerUser, setAuthToken } from '../../lib/api/authApi';
import { useAuth } from '../../Context/AuthContext';
import AuthLayout from '../../components/Layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import axios from 'axios';

// Password validation regex patterns
const passwordValidation = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  // ✅ New state for registration status checking
  const [registrationEnabled, setRegistrationEnabled] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);

  const navigate = useNavigate();
  const { dispatch } = useAuth();

  // ✅ Check if registration is enabled on component mount
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setCheckingStatus(true);
        const API_URL = process.env.REACT_APP_API_URL || '/api';
        const response = await axios.get(`${API_URL}/auth/registration-status`);
        setRegistrationEnabled(response.data.registrationEnabled);
        setRegistrationStatus(response.data.message);
      } catch (error) {
        console.error('Registration status check failed:', error);
        setRegistrationEnabled(false);
        setRegistrationStatus('Unable to check registration status. Please contact administrator.');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time password validation
    if (name === 'password') {
      setPasswordStrength({
        minLength: passwordValidation.minLength.test(value),
        hasUpperCase: passwordValidation.hasUpperCase.test(value),
        hasLowerCase: passwordValidation.hasLowerCase.test(value),
        hasNumber: passwordValidation.hasNumber.test(value),
        hasSpecialChar: passwordValidation.hasSpecialChar.test(value)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = [];
      if (!passwordStrength.minLength) passwordErrors.push('at least 8 characters');
      if (!passwordStrength.hasUpperCase) passwordErrors.push('one uppercase letter');
      if (!passwordStrength.hasLowerCase) passwordErrors.push('one lowercase letter');
      if (!passwordStrength.hasNumber) passwordErrors.push('one number');
      if (!passwordStrength.hasSpecialChar) passwordErrors.push('one special character');
      
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = form;
      
      const response = await registerUser({
        ...submitData,
        mobile: '1234567890', // Default mobile for admin registration
        role: 'admin' // Always create admin users from register page
      });
      
      const { user, token } = response.data;

      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user, token }
      });

      toast.success(`Admin account created successfully! Welcome, ${user.name}!`);
      
      // Admin always goes to admin dashboard
      navigate('/dashboard', { replace: true });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      
      // ✅ Handle specific registration disabled error
      if (err.response?.data?.error === 'REGISTRATION_DISABLED') {
        toast.error('Public registration has been disabled. Contact your administrator.');
        setRegistrationEnabled(false);
        setRegistrationStatus(errorMessage);
      } else {
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength percentage
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthPercentage = (strengthScore / 5) * 100;
  const getStrengthColor = () => {
    if (strengthPercentage < 40) return 'bg-red-500';
    if (strengthPercentage < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // ✅ Loading state while checking registration status
  if (checkingStatus) {
    return (
      <AuthLayout title="Loading...">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Checking registration status...</p>
        </div>
      </AuthLayout>
    );
  }

  // ✅ Registration disabled state
  if (registrationEnabled === false) {
    return (
      <AuthLayout title="Registration Disabled">
        <div className="text-center space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Public Registration is Disabled
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{registrationStatus}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600">
              An administrator has already been set up for this system. 
              New user accounts can only be created by existing administrators.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Need an account?
              </h4>
              <p className="text-sm text-blue-700">
                Contact your system administrator to request access through the User Management panel.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all text-center"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ✅ Registration form (when enabled - first admin creation)
  return (
    <AuthLayout title="Create First Admin Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* ✅ First Admin Notice */}
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>
                You're creating the <strong>first admin account</strong>. 
                After this, public registration will be disabled and only admins can create new users through the User Management panel.
              </p>
            </div>
          </div>
        </div>

        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@restaurant.com"
          error={errors.email}
          required
        />

        <div>
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          {/* Password Strength Indicator */}
          {form.password && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Password Strength</span>
                <span>{Math.round(strengthPercentage)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${strengthPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                <div className={`flex items-center ${passwordStrength.minLength ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordStrength.minLength ? '✓' : '✗'}</span>
                  8+ characters
                </div>
                <div className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordStrength.hasUpperCase ? '✓' : '✗'}</span>
                  Uppercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordStrength.hasLowerCase ? '✓' : '✗'}</span>
                  Lowercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordStrength.hasNumber ? '✓' : '✗'}</span>
                  Number
                </div>
                <div className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{passwordStrength.hasSpecialChar ? '✓' : '✗'}</span>
                  Special character
                </div>
              </div>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        {/* ✅ Role Information Display */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Account Type:</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-sm font-semibold">
              Administrator
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Full access to all system features including user management, orders, menu, and reports.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-900 hover:underline">
            Sign in
          </Link>
        </p>

        {/* ✅ Additional Information */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Need to add Staff, Manager, or Cashier users?<br />
            Use the <strong>User Management</strong> panel after logging in as Admin.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
