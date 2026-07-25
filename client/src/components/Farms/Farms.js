import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { exportFarmsToCSV } from '../../utils/exportCSV';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    farmName: '',
    location: { state: '', district: '', village: '', pincode: '' },
    area: '',
    soil_type: 'Loamy',
    irrigation_type: 'Drip',
    water_source: 'Well'
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms');
      setFarms(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await api.put(`/farms/${editingFarm._id}`, formData);
      } else {
        await api.post('/farms', formData);
      }
      fetchFarms();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save farm');
    }
  };

  const resetForm = () => {
    setFormData({
      farmName: '',
      location: { state: '', district: '', village: '', pincode: '' },
      area: '',
      soil_type: 'Loamy',
      irrigation_type: 'Drip',
      water_source: 'Well'
    });
    setEditingFarm(null);
    setShowForm(false);
  };

  const handleEdit = (farm) => {
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      area: farm.area,
      soil_type: farm.soil_type,
      irrigation_type: farm.irrigation_type,
      water_source: farm.water_source
    });
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleExportPDF = () => {
    if (farms.length === 0) {
      alert(t('farms.noFarmsToExport'));
      return;
    }
    
    const success = exportFarmsToCSV(farms, user?.name || 'User');
    
    if (success) {
      alert(t('farms.exportSuccess'));
    } else {
      alert(t('farms.exportFailed'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('farms.deleteConfirm'))) {
      try {
        await api.delete(`/farms/${id}`);
        fetchFarms();
      } catch (error) {
        alert(t('farms.deleteFailed') || 'Failed to delete farm');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🌾 {t('farms.title')}</h2>
            <p className="text-gray-600">{t('farms.subtitle') || 'Manage your farms and track their details'}</p>
          </div>
          <div className="flex space-x-3">
            {farms.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t('export.exportPDF')}</span>
              </button>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {showForm ? t('common.cancel') : `+ ${t('farms.addFarm')}`}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingFarm ? t('farms.editFarm') : t('farms.addFarm')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.farmName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.area')} *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.state')} *</label>
                <input
                  type="text"
                  required
                  value={formData.location.state}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.district')} *</label>
                <input
                  type="text"
                  required
                  value={formData.location.district}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.village')}</label>
                <input
                  type="text"
                  value={formData.location.village}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, village: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.pincode')}</label>
                <input
                  type="text"
                  value={formData.location.pincode}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, pincode: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.soilType')} *</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Silt">Silt</option>
                  <option value="Black">Black</option>
                  <option value="Red">Red</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.irrigationType')}</label>
                <select
                  value={formData.irrigation_type}
                  onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Flood">Flood</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('farms.waterSource')}</label>
                <select
                  value={formData.water_source}
                  onChange={(e) => setFormData({ ...formData, water_source: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Well">Well</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Canal">Canal</option>
                  <option value="River">River</option>
                  <option value="Pond">Pond</option>
                  <option value="Rainwater">Rainwater</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {editingFarm ? t('farms.updateFarm') : t('farms.addFarm')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Farms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">{t('farms.noFarmsAdded')}</p>
            <p className="text-gray-500 mt-2">{t('farms.clickAddFarm')}</p>
          </div>
        ) : (
          farms.map((farm) => (
            <div key={farm._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-700">{farm.farmName}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {farm.area} {t('dashboard.acres')}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>{t('farms.location')}:</strong> {farm.location.village ? `${farm.location.village}, ` : ''}{farm.location.district}, {farm.location.state}</p>
                <p><strong>{t('farms.soilType')}:</strong> {farm.soil_type}</p>
                <p><strong>{t('farms.irrigationType')}:</strong> {farm.irrigation_type}</p>
                <p><strong>{t('farms.waterSource')}:</strong> {farm.water_source}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(farm)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  {t('farms.edit')}
                </button>
                <button
                  onClick={() => handleDelete(farm._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                >
                  {t('farms.delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Farms;
