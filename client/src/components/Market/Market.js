import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const Market = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    commodity: '',
    state: '',
    district: ''
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPrices();
    
    // Auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing market prices...');
      fetchPrices(filters);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchPrices = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filterParams);
      const response = await api.get(`/market/prices?${params}`);
      setPrices(response.data.data || []);
      calculateStats(response.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    const minPrice = Math.min(...data.map(p => p.min_price || p.modal_price));
    const maxPrice = Math.max(...data.map(p => p.max_price || p.modal_price));
    const avgPrice = data.reduce((sum, p) => sum + (p.modal_price || 0), 0) / data.length;

    setStats({
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      avgPrice: avgPrice.toFixed(2),
      totalMarkets: data.length
    });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Build filter params (only include non-empty values)
    const filterParams = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) filterParams[k] = newFilters[k];
    });
    
    fetchPrices(filterParams);
  };

  const clearFilters = () => {
    setFilters({ commodity: '', state: '', district: '' });
    fetchPrices();
  };

  // Get unique values for dropdowns
  const uniqueCommodities = [...new Set(prices.map(p => p.commodity).filter(Boolean))];
  const uniqueStates = [...new Set(prices.map(p => p.state).filter(Boolean))];
  const uniqueDistricts = [...new Set(prices.map(p => p.district).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('market.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📊 {t('market.title')}</h2>
            <p className="text-gray-600">{t('market.subtitle')}</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                {t('market.lastUpdated')}: {lastUpdated.toLocaleTimeString()} • {t('market.autoRefresh')}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchPrices(filters)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            🔄 {t('market.refresh')}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <input
            type="text"
            placeholder={t('market.searchCommodity')}
            value={filters.commodity}
            onChange={(e) => handleFilterChange('commodity', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder={t('market.searchState')}
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder={t('market.searchDistrict')}
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            {t('market.clearFilters')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <div className="text-blue-600 text-sm font-semibold mb-2">{t('market.markets')}</div>
            <div className="text-3xl font-bold text-blue-700">{stats.totalMarkets}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="text-green-600 text-sm font-semibold mb-2">{t('market.avgPrice')}</div>
            <div className="text-3xl font-bold text-green-700">₹{stats.avgPrice}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <div className="text-red-600 text-sm font-semibold mb-2">{t('market.minPrice')}</div>
            <div className="text-3xl font-bold text-red-700">₹{stats.minPrice}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-6">
            <div className="text-purple-600 text-sm font-semibold mb-2">{t('market.maxPrice')}</div>
            <div className="text-3xl font-bold text-purple-700">₹{stats.maxPrice}</div>
          </div>
        </div>
      )}

      {/* Price Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.commodity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.market')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.state')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.district')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.minPrice')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.maxPrice')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.modalPrice')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('market.date')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    {t('market.noData')} {filters.commodity || filters.state || filters.district ? t('market.tryDifferentFilters') : t('market.dataWillLoad')}
                  </td>
                </tr>
              ) : (
                prices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{price.commodity}</div>
                      {price.variety && (
                        <div className="text-xs text-gray-500">{price.variety}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {price.market || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {price.state || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {price.district || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-semibold">
                      ₹{price.min_price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">
                      ₹{price.max_price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-bold">
                      ₹{price.modal_price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {price.arrival_date || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {t('market.infoMessage')} <span className="font-semibold"> {t('market.modalPriceNote')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
