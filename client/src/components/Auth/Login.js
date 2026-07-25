import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.phone, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="input-glass px-4 py-2 pr-8 cursor-pointer font-medium"
        >
          <option value="en">🌐 English</option>
          <option value="hi">🌐 हिंदी</option>
          <option value="gu">🌐 ગુજરાતી</option>
        </select>
      </div>

      {/* Login Card */}
      <div className="glass-card w-full max-w-md p-8 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/30 mb-4 animate-pulse-glow">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to RAAS
          </h1>
          <p className="text-slate-700 font-medium">
            {t('auth.loginSubtitle') || 'Sign in to your farming dashboard'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              📱 {t('auth.phone')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              pattern="[0-9]{10}"
              required
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              🔒 {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="input-glass"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-glass w-full text-base"
          >
            {loading ? (
              <>
                <div className="spinner-glass w-5 h-5 border-2"></div>
                <span>{t('auth.loggingIn') || 'Logging in...'}</span>
              </>
            ) : (
              t('auth.login')
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-700">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              {t('auth.register')}
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-white/60 border border-white/60">
          <p className="text-xs text-slate-700 text-center font-medium">
            🔑 Test Login:{' '}
            <span className="font-bold text-slate-900">9876543210</span> /{' '}
            <span className="font-bold text-slate-900">test123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
