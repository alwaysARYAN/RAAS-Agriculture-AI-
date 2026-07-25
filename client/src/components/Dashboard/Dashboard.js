import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalCrops: 0,
    healthyCrops: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [farmsRes, cropsRes] = await Promise.all([
        api.get('/farms'),
        api.get('/crops')
      ]);
      
      const farms = farmsRes.data.data || [];
      const crops = cropsRes.data.data || [];
      const healthyCrops = crops.filter(crop => crop.health === 'healthy').length;
      
      setStats({
        totalFarms: farms.length,
        totalCrops: crops.length,
        healthyCrops: healthyCrops,
        pendingTasks: Math.floor(Math.random() * 10)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-glass mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Farms',
      value: stats.totalFarms,
      icon: '🏡',
      change: '+12%',
      link: '/farms'
    },
    {
      title: 'Total Crops',
      value: stats.totalCrops,
      icon: '🌾',
      change: '+8%',
      link: '/crops'
    },
    {
      title: 'Healthy Crops',
      value: stats.healthyCrops,
      icon: '✅',
      change: '+15%',
      link: '/crops'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: '📋',
      change: '-3%',
      link: '/dashboard'
    }
  ];

  const quickActions = [
    { title: 'Add Farm', icon: '🏡', link: '/farms' },
    { title: 'Add Crop', icon: '🌾', link: '/crops' },
    { title: 'Disease Check', icon: '🔬', link: '/disease-detection' },
    { title: 'Weather', icon: '🌤️', link: '/weather' },
    { title: 'AI Chatbot', icon: '🤖', link: '/chatbot' },
    { title: 'Market Prices', icon: '💰', link: '/market' }
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="stat-card-glass group"
          >
            <div className="stat-card-icon">
              <span>{stat.icon}</span>
            </div>
            <div>
              <p className="stat-card-label mb-2">{stat.title}</p>
              <p className="stat-card-value">{stat.value}</p>
              <p className={`text-sm font-semibold mt-2 ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card mb-6 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            ⚡
          </span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="quick-action-glass"
            >
              <div className="quick-action-icon">{action.icon}</div>
              <p className="quick-action-label">{action.title}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Farm Health & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Health Overview */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            Farm Health Overview
          </h3>
          <div className="space-y-6">
            {/* Soil Quality */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Soil Quality</span>
                <span className="badge-glass success">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  Excellent
                </span>
              </div>
              <div className="progress-glass">
                <div className="progress-bar-glass" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-slate-600 mt-1">85% optimal</p>
            </div>

            {/* Water Level */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Water Level</span>
                <span className="badge-glass info">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Good
                </span>
              </div>
              <div className="progress-glass">
                <div className="progress-bar-glass" style={{ width: '70%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
              </div>
              <p className="text-xs text-slate-600 mt-1">70% capacity</p>
            </div>

            {/* Crop Health */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Crop Health</span>
                <span className="badge-glass success">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  Healthy
                </span>
              </div>
              <div className="progress-glass">
                <div className="progress-bar-glass" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-slate-600 mt-1">92% healthy crops</p>
            </div>
          </div>
        </div>

        {/* Today's Weather */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌤️</span>
            Today's Weather
          </h3>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">☀️</div>
            <p className="text-4xl font-bold text-slate-900 mb-2">28°C</p>
            <p className="text-lg text-slate-700 font-semibold">Sunny</p>
            <p className="text-sm text-slate-600 mt-2">Perfect day for farming activities</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-xs text-slate-600 mb-1">Humidity</p>
              <p className="text-lg font-bold text-slate-900">65%</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-xs text-slate-600 mb-1">Wind</p>
              <p className="text-lg font-bold text-slate-900">12 km/h</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-xs text-slate-600 mb-1">Rain</p>
              <p className="text-lg font-bold text-slate-900">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card mt-6 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-all">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">🌾</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">New crop added</p>
              <p className="text-xs text-slate-600">Wheat - Field A</p>
            </div>
            <span className="text-xs text-slate-500">2h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-all">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">💧</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Irrigation completed</p>
              <p className="text-xs text-slate-600">Zone B - 45 minutes</p>
            </div>
            <span className="text-xs text-slate-500">5h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/40 hover:bg-white/60 transition-all">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-xl">🔬</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Disease scan performed</p>
              <p className="text-xs text-slate-600">All crops healthy</p>
            </div>
            <span className="text-xs text-slate-500">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
