import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Recommendations = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('crop'); // crop, fertilizer, pest, irrigation, harvest

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      setFarms(response.data.data || []);
      if (response.data.data?.length > 0) {
        setSelectedFarm(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch farms:', error);
    }
  };

  const getRecommendations = async (type) => {
    if (!selectedFarm) {
      alert('Please select a farm');
      return;
    }

    setLoading(true);
    setActiveTab(type);
    setError(null);
    
    try {
      const farm = farms.find(f => f._id === selectedFarm);
      let response;

      switch (type) {
        case 'crop':
          response = await api.post('/ai/recommend-crops', {
            soilType: farm.soil_type,
            climate: 'Temperate',
            season: getCurrentSeason(),
            farmSize: farm.area
          });
          break;
        
        case 'fertilizer':
          response = await api.post('/ai/fertilizer-recommendation', {
            soilType: farm.soil_type,
            cropType: 'General',
            nitrogen: 20,
            phosphorus: 15,
            potassium: 25
          });
          break;
        
        case 'pest':
          response = await api.post('/ai/pest-management', {
            cropType: 'General',
            symptoms: 'Preventive management',
            season: getCurrentSeason()
          });
          break;
        
        case 'irrigation':
          response = await api.post('/ai/irrigation-schedule', {
            cropType: 'General',
            soilType: farm.soil_type,
            season: getCurrentSeason(),
            farmSize: farm.area
          });
          break;
        
        case 'harvest':
          response = await api.post('/ai/harvest-prediction', {
            cropType: 'General',
            plantingDate: new Date().toISOString().split('T')[0],
            weather: 'Normal'
          });
          break;
        
        default:
          throw new Error('Invalid recommendation type');
      }

      setRecommendations(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      let errorMessage = 'Failed to get recommendations. Please try again.';
      
      if (error.response?.status === 429) {
        errorMessage = 'AI service quota exceeded (20 requests/day limit reached). The service will reset tomorrow, or you can upgrade your API key for unlimited access.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 9) return 'Monsoon';
    return 'Winter';
  };

  const renderRecommendationContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your farm data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-800 mb-3">Unable to Get Recommendations</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!recommendations) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-4">🌾</div>
          <p className="text-lg mb-2">Select a recommendation type above to get AI-powered insights</p>
          <p className="text-sm">Our AI will analyze your farm conditions and provide personalized recommendations</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Crop Recommendations */}
        {activeTab === 'crop' && recommendations.recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.recommendations.map((crop, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-green-800">{crop.crop}</h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-white rounded p-2">
                    <span className="font-semibold">Suitability:</span> {crop.suitability_score}/100
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="font-semibold">Expected Yield:</span> {crop.expected_yield}
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="font-semibold">Growing Season:</span> {crop.growing_season}
                  </div>
                  <div className="bg-white rounded p-3 mt-3">
                    <p className="text-xs text-gray-600">{crop.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fertilizer Recommendations */}
        {activeTab === 'fertilizer' && recommendations.fertilizer_plan && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Recommended Fertilizers</h3>
              <ul className="space-y-3">
                {recommendations.fertilizer_plan.map((item, index) => (
                  <li key={index} className="bg-white rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{item.fertilizer}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.timing}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    {item.method && (
                      <p className="text-xs text-gray-500 mt-2"><strong>Method:</strong> {item.method}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {recommendations.advice && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800">{recommendations.advice}</p>
              </div>
            )}
          </div>
        )}

        {/* Pest Management */}
        {activeTab === 'pest' && recommendations.management_plan && (
          <div className="space-y-4">
            {recommendations.management_plan.map((plan, index) => (
              <div key={index} className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-purple-800 mb-3">{plan.pest_type}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <p className="font-semibold text-gray-700 mb-2">Control Method</p>
                    <p className="text-sm text-gray-600">{plan.control_method}</p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <p className="font-semibold text-gray-700 mb-2">Prevention</p>
                    <p className="text-sm text-gray-600">{plan.prevention}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Irrigation Schedule */}
        {activeTab === 'irrigation' && recommendations.schedule && (
          <div className="space-y-4">
            {recommendations.schedule.map((item, index) => (
              <div key={index} className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-cyan-800">{item.stage}</h3>
                  <span className="bg-cyan-600 text-white px-3 py-1 rounded text-sm">
                    {item.frequency}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <p className="font-semibold text-gray-700 mb-1">Water Amount</p>
                    <p className="text-2xl font-bold text-cyan-700">{item.water_amount}</p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <p className="font-semibold text-gray-700 mb-1">Duration</p>
                    <p className="text-sm text-gray-600">{item.duration}</p>
                  </div>
                </div>
                <div className="mt-3 bg-white rounded p-3">
                  <p className="text-sm text-gray-600">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Harvest Prediction */}
        {activeTab === 'harvest' && recommendations.prediction && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
            <h3 className="text-2xl font-bold text-orange-800 mb-6">Harvest Prediction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">Estimated Harvest Date</p>
                <p className="text-2xl font-bold text-orange-700">
                  {new Date(recommendations.prediction.harvest_date).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">Expected Yield</p>
                <p className="text-2xl font-bold text-orange-700">{recommendations.prediction.expected_yield}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-600 mb-2">Quality Grade</p>
                <p className="text-2xl font-bold text-orange-700">{recommendations.prediction.quality}</p>
              </div>
            </div>
            {recommendations.prediction.factors && (
              <div className="mt-6 bg-white rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">Key Factors:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {recommendations.prediction.factors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Generic text response */}
        {recommendations.recommendation && typeof recommendations.recommendation === 'string' && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-line">{recommendations.recommendation}</p>
          </div>
        )}
      </div>
    );
  };

  if (farms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌾 No Farms Found</h2>
        <p className="text-gray-600 mb-4">Add a farm to get AI-powered recommendations</p>
        <button
          onClick={() => window.location.href = '/farms'}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Farms
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI Recommendations</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {farms.map(farm => (
              <option key={farm._id} value={farm._id}>
                {farm.farmName} - {farm.area} acres ({farm.soil_type} soil)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendation Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Recommendation Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => getRecommendations('crop')}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition ${
              activeTab === 'crop' 
                ? 'border-green-600 bg-green-50 text-green-700' 
                : 'border-gray-200 hover:border-green-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🌱</div>
            <div className="font-semibold">Crop</div>
          </button>
          <button
            onClick={() => getRecommendations('fertilizer')}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition ${
              activeTab === 'fertilizer' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-blue-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🧪</div>
            <div className="font-semibold">Fertilizer</div>
          </button>
          <button
            onClick={() => getRecommendations('pest')}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition ${
              activeTab === 'pest' 
                ? 'border-purple-600 bg-purple-50 text-purple-700' 
                : 'border-gray-200 hover:border-purple-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🐛</div>
            <div className="font-semibold">Pest Control</div>
          </button>
          <button
            onClick={() => getRecommendations('irrigation')}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition ${
              activeTab === 'irrigation' 
                ? 'border-cyan-600 bg-cyan-50 text-cyan-700' 
                : 'border-gray-200 hover:border-cyan-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">💧</div>
            <div className="font-semibold">Irrigation</div>
          </button>
          <button
            onClick={() => getRecommendations('harvest')}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition ${
              activeTab === 'harvest' 
                ? 'border-orange-600 bg-orange-50 text-orange-700' 
                : 'border-gray-200 hover:border-orange-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🌾</div>
            <div className="font-semibold">Harvest</div>
          </button>
        </div>
      </div>

      {/* Recommendations Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderRecommendationContent()}
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              AI recommendations are powered by Gemini AI. Due to API quota limits (20 requests/day on free tier), recommendations may be temporarily unavailable. Upgrade your API key for unlimited access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
