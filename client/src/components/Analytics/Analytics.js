import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import api from '../../services/api';
import PDFExportService from '../../utils/pdfExport';
import ShareButton from '../ShareButton/ShareButton';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/dashboard');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (analytics) {
      PDFExportService.exportAnalyticsReport(analytics, user?.name || 'User');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">{t('analytics.noData') || 'No analytics data available'}</p>
      </div>
    );
  }

  const { overview, charts, recentDiseases, recommendations } = analytics;

  // Chart data configurations
  const healthChartData = {
    labels: Object.keys(charts.healthDistribution).map(key => t(`analytics.health.${key}`) || key),
    datasets: [{
      data: Object.values(charts.healthDistribution),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const cropTypeChartData = {
    labels: Object.keys(charts.cropsByType),
    datasets: [{
      label: t('analytics.numberOfCrops') || 'Number of Crops',
      data: Object.values(charts.cropsByType),
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 1
    }]
  };

  const monthlyChartData = {
    labels: Object.keys(charts.cropsByMonth),
    datasets: [{
      label: t('analytics.cropsAdded') || 'Crops Added',
      data: Object.values(charts.cropsByMonth),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const soilChartData = {
    labels: Object.keys(charts.soilTypes),
    datasets: [{
      data: Object.values(charts.soilTypes),
      backgroundColor: ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#BC8F8F'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">📊 {t('analytics.title')}</h2>
            <p className="mt-2 opacity-90">{t('analytics.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('export.exportPDF')}</span>
            </button>
            <ShareButton
              title={t('analytics.shareTitle') || 'Check out my Farm Analytics'}
              description={`${t('analytics.productivityScore')}: ${analytics?.overview?.productivityScore || 0}/100 | ${t('dashboard.totalCrops')}: ${analytics?.overview?.totalCrops || 0}`}
              hashtags={['AgricultureAI', 'SmartFarming', 'FarmAnalytics']}
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('dashboard.totalFarms')}</p>
              <p className="text-3xl font-bold text-green-600">{overview.totalFarms}</p>
            </div>
            <div className="text-4xl">🏡</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('dashboard.totalCrops')}</p>
              <p className="text-3xl font-bold text-blue-600">{overview.totalCrops}</p>
            </div>
            <div className="text-4xl">🌾</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('analytics.totalLand') || 'Total Land'}</p>
              <p className="text-3xl font-bold text-purple-600">{overview.totalLand.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{t('dashboard.acres')}</p>
            </div>
            <div className="text-4xl">📏</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{t('analytics.detections') || 'Detections'}</p>
              <p className="text-3xl font-bold text-orange-600">{overview.totalDiseaseDetections}</p>
            </div>
            <div className="text-4xl">🔍</div>
          </div>
        </div>
      </div>

      {/* Productivity Score & Risk Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">{t('analytics.productivityScore')}</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={overview.productivityScore >= 70 ? '#10B981' : overview.productivityScore >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(overview.productivityScore / 100) * 439.6} 439.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(overview.productivityScore)}`}>
                  {overview.productivityScore}
                </span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            {overview.productivityScore >= 70 ? `🎉 ${t('analytics.excellent') || 'Excellent performance!'}` :
             overview.productivityScore >= 40 ? `👍 ${t('analytics.good') || 'Good, room for improvement'}` :
             `⚠️ ${t('analytics.needsAttention') || 'Needs attention'}`}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">{t('analytics.riskAssessment')}</h3>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`inline-block px-8 py-4 rounded-lg text-2xl font-bold ${getRiskColor(overview.riskLevel)}`}>
                {t(`analytics.risk.${overview.riskLevel}`) || overview.riskLevel} {t('analytics.risk') || 'Risk'}
              </div>
              <p className="mt-4 text-gray-600">
                {overview.riskLevel === 'Low' ? `✅ ${t('analytics.cropsWell') || 'Your crops are doing well'}` :
                 overview.riskLevel === 'Medium' ? `⚠️ ${t('analytics.monitorCrops') || 'Monitor crops regularly'}` :
                 `🚨 ${t('analytics.actionRequired') || 'Immediate action required'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">💡 {t('analytics.recommendations')}</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'urgent' ? 'border-red-500 bg-red-50' :
                  rec.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                  rec.priority === 'medium' ? 'border-blue-500 bg-blue-50' :
                  'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{rec.icon}</span>
                  <div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-6">📈 {t('analytics.detailedAnalytics') || 'Detailed Analytics'}</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-center">{t('analytics.healthDistribution')}</h4>
            <div className="h-64">
              <Pie data={healthChartData} options={chartOptions} />
            </div>
          </div>

          {/* Crops by Type */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-center">{t('analytics.cropsByType')}</h4>
            <div className="h-64">
              <Bar data={cropTypeChartData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-center">{t('analytics.monthlyTrend')}</h4>
            <div className="h-64">
              <Line data={monthlyChartData} options={chartOptions} />
            </div>
          </div>

          {/* Soil Types */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-center">{t('analytics.soilDistribution')}</h4>
            <div className="h-64">
              <Pie data={soilChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Disease Detections */}
      {recentDiseases.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">🦠 {t('analytics.recentDiseases')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('disease.disease')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('crops.cropName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('disease.confidence')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('disease.severity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.date') || 'Date'}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDiseases.map((disease, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {disease.disease}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disease.crop}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {disease.confidence}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        disease.severity === 'High' ? 'bg-red-100 text-red-800' :
                        disease.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {t(`analytics.severity.${disease.severity}`) || disease.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(disease.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
