import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    landSize: '',
    soilType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const soilTypes = [
    'Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Red', 'Black', 'Alluvial'
  ];

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 30%, #B8E6B8 60%, #F4E4C1 100%)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      {/* Animated Farming Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Crops */}
        <div className="absolute top-10 left-10 text-5xl animate-bounce" style={{animationDuration: '3s'}}>🌾</div>
        <div className="absolute top-20 right-16 text-4xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>🌽</div>
        <div className="absolute bottom-24 left-16 text-4xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>🍅</div>
        <div className="absolute bottom-32 right-10 text-5xl animate-bounce" style={{animationDuration: '3.2s', animationDelay: '0.8s'}}>🥕</div>
        
        {/* Farm Scene Elements */}
        <div className="absolute top-1/4 left-8 text-6xl opacity-50">🧑‍🌾</div>
        <div className="absolute bottom-1/4 right-12 text-6xl opacity-50">🚜</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-30 animate-pulse">🌱</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl opacity-30 animate-pulse">☀️</div>
        <div className="absolute top-1/2 left-1/3 text-3xl opacity-25">🦋</div>
      </div>
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-700">🌐 {i18n.language === 'en' ? 'English' : i18n.language === 'hi' ? 'हिंदी' : 'ગુજરાતી'}</span>
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full shadow-2xl shadow-green-500/50 mb-4 relative animate-pulse-glow">
            <span className="text-6xl">🌾</span>
            <div className="absolute -top-2 -right-2 text-3xl">🌱</div>
            <div className="absolute -bottom-2 -left-2 text-3xl">🍃</div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-2">
            RAAS Agriculture
          </h1>
          <p className="text-gray-700 text-lg font-medium">Smart Farming Starts Here 🚜</p>
        </div>

        {/* Register Card */}
        <div className="p-8 rounded-3xl shadow-2xl" 
             style={{
               background: 'rgba(255, 255, 255, 0.95)',
               backdropFilter: 'blur(20px)',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
             }}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2 text-center">
            {t('auth.register')}
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">{t('auth.registerSubtitle')}</p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2 animate-shake">
              <span className="text-2xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.fullName')} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('auth.fullName')}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')} *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.confirmPassword')} *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')} ({t('common.optional') || 'optional'})</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.state')}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300 cursor-pointer"
                >
                  <option value="">{t('auth.state')}</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.district')}</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder={t('auth.district')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.village')}</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder={t('auth.village')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.pincode')}</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="380001"
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-green-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.registering')}
                </span>
              ) : (
                t('auth.registerButton')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm font-medium">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold transition-colors hover:underline">
                {t('auth.signIn')} →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-600 bg-white/60 backdrop-blur-sm py-3 px-4 rounded-full">
          <p className="font-semibold flex items-center justify-center gap-2">
            <span>🌾</span>
            <span>Agriculture AI © 2026 - Smart Farming Future</span>
            <span>🚜</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
