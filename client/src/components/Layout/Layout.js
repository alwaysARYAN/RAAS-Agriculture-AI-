import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../Notifications/NotificationBell';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { initializeSocket, disconnectSocket } from '../../services/socket';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    disconnectSocket();
    navigate('/login');
  };

  const menuItems = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: '📊' },
    { name: t('nav.farms'), path: '/farms', icon: '🏡' },
    { name: t('nav.crops'), path: '/crops', icon: '🌾' },
    { name: t('nav.disease'), path: '/disease-detection', icon: '🔬' },
    { name: t('nav.chatbot'), path: '/chatbot', icon: '🤖' },
    { name: t('nav.recommendations'), path: '/recommendations', icon: '💡' },
    { name: t('nav.weather'), path: '/weather', icon: '🌤️' },
    { name: t('nav.market'), path: '/market', icon: '💰' },
    { name: t('nav.schemes'), path: '/schemes', icon: '📋' },
    { name: t('nav.analytics'), path: '/analytics', icon: '📈' },
    { name: t('nav.profile'), path: '/profile', icon: '👤' },
  ];

  useEffect(() => {
    if (user?._id) {
      initializeSocket(user._id);
    }
    
    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <div className="flex min-h-screen" style={{ background: 'transparent' }}>
      {/* Sidebar - Dark Glass */}
      <aside className="glass-sidebar w-64 fixed left-0 top-0 h-full z-40 flex flex-col"
>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg animate-pulse-glow">
              🌾
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">RAAS</h1>
              <p className="text-xs text-emerald-300">Smart Farming</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="text-xl mr-3 w-6 text-center">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.phone}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 text-sm font-semibold"
          >
            <span>🚪</span>
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header - Light Glass */}
        <header className="glass-header m-4 sticky top-4 z-30">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-white/60 border border-white/40 text-slate-800 hover:bg-white/80 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Welcome Message */}
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Welcome back, {user?.name}! 👋
              </h2>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <NotificationBell />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
