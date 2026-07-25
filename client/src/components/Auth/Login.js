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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{
           backgroundImage: 'url(/farm-bg.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-yellow-900/20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Wheat */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{animationDuration: '3s'}}>🌾</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>🌾</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>🌾</div>
        
        {/* Farming Elements */}
        <div className="absolute top-1/4 left-5 text-5xl opacity-60">🧑‍🌾</div>
        <div className="absolute bottom-1/4 right-10 text-5xl opacity-60">🚜</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-40">🌱</div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-40">🍃</div>
      </div>
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
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
      <div className="glass-card w-full max-w-md p-8 animate-fade-in-up relative z-10" 
           style={{
             background: 'rgba(255, 255, 255, 0.95)',
             backdropFilter: 'blur(20px)',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
           }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full shadow-2xl shadow-green-500/40 mb-4 animate-pulse-glow relative">
            <span className="text-5xl">🌾</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-2">
            RAAS Agriculture
          </h1>
          <p className="text-gray-700 font-medium text-lg">
            {t('auth.loginSubtitle') || 'Smart Farming Dashboard'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 animate-shake">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              🔒 {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300 text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('auth.loggingIn') || 'Logging in...'}</span>
              </>
            ) : (
              <>
                <span>{t('auth.login')}</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700 font-medium">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-bold text-green-600 hover:text-green-700 transition-colors hover:underline"
            >
              {t('auth.register')} →
            </Link>
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <p className="text-xs text-gray-700 text-center font-bold flex items-center justify-center gap-2">
            <span>🔑</span>
            <span>Test: <span className="text-green-700">9876543210</span> / <span className="text-green-700">test123</span></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
