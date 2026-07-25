import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const Schemes = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    scheme_type: '',
    government_level: '',
    state: '',
    search: ''
  });
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    fetchSchemes();
    
    // Auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing schemes...');
      fetchSchemes(filters);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchSchemes = async (filterParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filterParams);
      const response = await api.get(`/schemes?${params}`);
      setSchemes(response.data.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Build filter params (only include non-empty values)
    const filterParams = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) filterParams[k] = newFilters[k];
    });
    
    fetchSchemes(filterParams);
  };

  const clearFilters = () => {
    setFilters({ scheme_type: '', government_level: '', state: '', search: '' });
    fetchSchemes();
  };

  const getTypeColor = (type) => {
    const colors = {
      'Subsidy': 'bg-green-100 text-green-800',
      'Insurance': 'bg-blue-100 text-blue-800',
      'Credit': 'bg-purple-100 text-purple-800',
      'Training': 'bg-yellow-100 text-yellow-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Central': 'bg-indigo-100 text-indigo-800',
      'State': 'bg-teal-100 text-teal-800',
      'District': 'bg-orange-100 text-orange-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('schemes.loadingSchemes')}</p>
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
            <h2 className="text-2xl font-bold text-gray-800">🏛️ {t('schemes.title')}</h2>
            <p className="text-gray-600">{t('schemes.subtitle')}</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                {t('schemes.lastUpdated')}: {lastUpdated.toLocaleTimeString()} • {t('schemes.autoRefresh')}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchSchemes(filters)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            🔄 {t('schemes.refresh')}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <input
            type="text"
            placeholder={t('schemes.searchSchemes')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filters.scheme_type}
            onChange={(e) => handleFilterChange('scheme_type', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t('schemes.allTypes')}</option>
            <option value="Subsidy">{t('schemes.subsidy')}</option>
            <option value="Insurance">{t('schemes.insurance')}</option>
            <option value="Credit">{t('schemes.credit')}</option>
            <option value="Training">{t('schemes.training')}</option>
          </select>
          <select
            value={filters.government_level}
            onChange={(e) => handleFilterChange('government_level', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">{t('schemes.allLevels')}</option>
            <option value="Central">{t('schemes.central')}</option>
            <option value="State">{t('schemes.state')}</option>
            <option value="District">{t('schemes.district')}</option>
          </select>
          <input
            type="text"
            placeholder={t('schemes.filterByState')}
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            {t('schemes.clear')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="text-green-600 text-sm font-semibold mb-2">{t('schemes.totalSchemes')}</div>
          <div className="text-3xl font-bold text-green-700">{schemes.length}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="text-blue-600 text-sm font-semibold mb-2">{t('schemes.subsidySchemes')}</div>
          <div className="text-3xl font-bold text-blue-700">
            {schemes.filter(s => s.scheme_type === 'Subsidy').length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <div className="text-purple-600 text-sm font-semibold mb-2">{t('schemes.insuranceSchemes')}</div>
          <div className="text-3xl font-bold text-purple-700">
            {schemes.filter(s => s.scheme_type === 'Insurance').length}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">{t('schemes.noSchemesFound')}</p>
            <p className="text-gray-500 mt-2">{t('schemes.tryAdjusting')}</p>
          </div>
        ) : (
          schemes.map((scheme, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
              onClick={() => setSelectedScheme(scheme)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {scheme.scheme_name}
                </h3>
              </div>
              
              <div className="flex gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded ${getTypeColor(scheme.scheme_type)}`}>
                  {scheme.scheme_type}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getLevelColor(scheme.government_level)}`}>
                  {scheme.government_level}
                </span>
              </div>

              {scheme.scheme_code && (
                <p className="text-xs text-gray-500 mb-2">{t('schemes.code')}: {scheme.scheme_code}</p>
              )}

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {scheme.description || scheme.benefits || 'Government agricultural scheme for farmers'}
              </p>

              {scheme.benefits && scheme.benefits !== scheme.description && (
                <div className="bg-green-50 rounded p-3 mb-4">
                  <p className="text-xs font-semibold text-green-700 mb-1">{t('schemes.benefits')}:</p>
                  <p className="text-xs text-green-600 line-clamp-2">{scheme.benefits}</p>
                </div>
              )}

              {scheme.eligibility && (
                <div className="bg-blue-50 rounded p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-700 mb-1">{t('schemes.eligibility')}:</p>
                  <p className="text-xs text-blue-600 line-clamp-2">{scheme.eligibility}</p>
                </div>
              )}

              {(scheme.subsidy_amount > 0 || scheme.subsidy_percentage > 0) && (
                <div className="flex gap-2 mb-3">
                  {scheme.subsidy_amount > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      ₹{scheme.subsidy_amount}
                    </span>
                  )}
                  {scheme.subsidy_percentage > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {scheme.subsidy_percentage}% subsidy
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScheme(scheme);
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm transition"
              >
                {t('schemes.viewDetails')}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedScheme(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedScheme.scheme_name}</h2>
                {selectedScheme.scheme_code && (
                  <p className="text-sm text-gray-500 mt-1">{t('schemes.code')}: {selectedScheme.scheme_code}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <span className={`text-sm px-3 py-1 rounded ${getTypeColor(selectedScheme.scheme_type)}`}>
                  {selectedScheme.scheme_type}
                </span>
                <span className={`text-sm px-3 py-1 rounded ${getLevelColor(selectedScheme.government_level)}`}>
                  {selectedScheme.government_level}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.description')}</h3>
                <p className="text-gray-600">{selectedScheme.description}</p>
              </div>

              {selectedScheme.benefits && selectedScheme.benefits !== selectedScheme.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.benefits')}</h3>
                  <div className="bg-green-50 rounded-lg p-4 text-green-700">
                    {selectedScheme.benefits}
                  </div>
                </div>
              )}

              {selectedScheme.eligibility && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.eligibility')}</h3>
                  <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
                    {selectedScheme.eligibility}
                  </div>
                </div>
              )}

              {(selectedScheme.subsidy_amount || selectedScheme.subsidy_percentage) && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.financialAssistance')}</h3>
                  <div className="flex gap-3">
                    {selectedScheme.subsidy_amount > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-4 flex-1">
                        <p className="text-sm text-yellow-600">{t('schemes.subsidyAmount')}</p>
                        <p className="text-2xl font-bold text-yellow-700">₹{selectedScheme.subsidy_amount}</p>
                      </div>
                    )}
                    {selectedScheme.subsidy_percentage > 0 && (
                      <div className="bg-orange-50 rounded-lg p-4 flex-1">
                        <p className="text-sm text-orange-600">{t('schemes.subsidyPercentage')}</p>
                        <p className="text-2xl font-bold text-orange-700">{selectedScheme.subsidy_percentage}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedScheme.eligible_states && selectedScheme.eligible_states.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.eligibleStates')}</h3>
                  <p className="text-gray-600">
                    {selectedScheme.eligible_states.includes('All') ? t('schemes.allStates') : selectedScheme.eligible_states.join(', ')}
                  </p>
                </div>
              )}

              {selectedScheme.min_land_size !== undefined && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.minLandSize')}</h3>
                  <p className="text-gray-600">
                    {selectedScheme.min_land_size === 0 ? t('schemes.noMinimum') : `${selectedScheme.min_land_size} ${t('schemes.acres')}`}
                  </p>
                </div>
              )}

              {selectedScheme.application_process && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.applicationProcess')}</h3>
                  <p className="text-gray-600">{selectedScheme.application_process}</p>
                </div>
              )}

              {selectedScheme.required_documents && selectedScheme.required_documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.requiredDocuments')}</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedScheme.required_documents.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedScheme.official_website && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.officialWebsite')}</h3>
                  <a
                    href={selectedScheme.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedScheme.official_website}
                  </a>
                </div>
              )}

              {selectedScheme.helpline_number && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t('schemes.helpline')}</h3>
                  <p className="text-gray-600 font-semibold">📞 {selectedScheme.helpline_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              {t('schemes.infoMessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
