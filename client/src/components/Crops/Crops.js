import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PDFExportService from '../../utils/pdfExport';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    farm: '',
    crop_name: '',
    variety: '',
    sowing_date: '',
    expected_harvest_date: '',
    area_allocated: '',
    season: 'Kharif',
    growth_stage: 'Sowing',
    health_status: 'Healthy',
    expected_yield: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cropsRes, farmsRes] = await Promise.all([
        api.get('/crops'),
        api.get('/farms')
      ]);
      setCrops(cropsRes.data.data || []);
      setFarms(farmsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map frontend field names to backend expected names
      const cropData = {
        farm_id: formData.farm,
        crop_name: formData.crop_name,
        variety: formData.variety,
        sowing_date: formData.sowing_date,
        expected_harvest_date: formData.expected_harvest_date,
        area_planted: formData.area_allocated,
        season: formData.season,
        stage: formData.growth_stage,
        health_status: formData.health_status,
        expected_yield: formData.expected_yield,
        notes: formData.notes
      };

      if (editingCrop) {
        await api.put(`/crops/${editingCrop._id}`, cropData);
      } else {
        await api.post('/crops', cropData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save crop');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('crops.deleteConfirm') || 'Are you sure you want to delete this crop?')) {
      try {
        await api.delete(`/crops/${id}`);
        fetchData();
      } catch (error) {
        alert(t('crops.deleteFailed') || 'Failed to delete crop');
      }
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farm: crop.farm_id?._id || crop.farm_id,
      crop_name: crop.crop_name,
      variety: crop.variety,
      sowing_date: crop.sowing_date?.split('T')[0] || '',
      expected_harvest_date: crop.expected_harvest_date?.split('T')[0] || '',
      area_allocated: crop.area_planted,
      season: crop.season || 'Kharif',
      growth_stage: crop.stage,
      health_status: crop.health_status,
      expected_yield: crop.expected_yield,
      notes: crop.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      farm: '',
      crop_name: '',
      variety: '',
      sowing_date: '',
      expected_harvest_date: '',
      area_allocated: '',
      season: 'Kharif',
      growth_stage: 'Sowing',
      health_status: 'Healthy',
      expected_yield: '',
      notes: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Sowing': 'bg-blue-100 text-blue-800',
      'Germination': 'bg-green-100 text-green-800',
      'Vegetative': 'bg-teal-100 text-teal-800',
      'Flowering': 'bg-purple-100 text-purple-800',
      'Fruiting': 'bg-orange-100 text-orange-800',
      'Maturity': 'bg-yellow-100 text-yellow-800',
      'Harvest': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getHealthColor = (health) => {
    const colors = {
      'Healthy': 'bg-green-100 text-green-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[health] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  if (farms.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌱 {t('crops.noFarms') || 'No Farms Found'}</h2>
        <p className="text-gray-600 mb-4">{t('crops.needFarm') || 'You need to add a farm before managing crops'}</p>
        <button
          onClick={() => window.location.href = '/farms'}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          {t('crops.goToFarms') || 'Go to Farms'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🌱 {t('crops.title')}</h2>
            <p className="text-gray-600">{t('crops.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            {crops.length > 0 && (
              <button
                onClick={() => PDFExportService.exportCropReport(crops, user?.name || 'User')}
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
              {showForm ? t('common.cancel') : `+ ${t('crops.addCrop')}`}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingCrop ? t('crops.editCrop') : t('crops.addNewCrop')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.farm')} *</label>
                <select
                  required
                  value={formData.farm}
                  onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">{t('crops.selectFarm')}</option>
                  {farms.map(farm => (
                    <option key={farm._id} value={farm._id}>{farm.farmName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.cropName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.crop_name}
                  onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                  placeholder={t('crops.cropNamePlaceholder') || 'e.g., Wheat, Rice, Corn'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.variety')}</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder={t('crops.varietyPlaceholder') || 'e.g., Basmati, IR64'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.area')} *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.area_allocated}
                  onChange={(e) => setFormData({ ...formData, area_allocated: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.season')} *</label>
                <select
                  required
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Kharif">{t('crops.seasons.kharif')}</option>
                  <option value="Rabi">{t('crops.seasons.rabi')}</option>
                  <option value="Zaid">{t('crops.seasons.zaid')}</option>
                  <option value="Year-round">{t('crops.seasons.yearRound')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.sowingDate')} *</label>
                <input
                  type="date"
                  required
                  value={formData.sowing_date}
                  onChange={(e) => setFormData({ ...formData, sowing_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.harvestDate')}</label>
                <input
                  type="date"
                  value={formData.expected_harvest_date}
                  onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.growthStage')}</label>
                <select
                  value={formData.growth_stage}
                  onChange={(e) => setFormData({ ...formData, growth_stage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Sowing">{t('crops.stages.sowing')}</option>
                  <option value="Germination">{t('crops.stages.germination')}</option>
                  <option value="Vegetative">{t('crops.stages.vegetative')}</option>
                  <option value="Flowering">{t('crops.stages.flowering')}</option>
                  <option value="Fruiting">{t('crops.stages.fruiting')}</option>
                  <option value="Maturity">{t('crops.stages.maturity')}</option>
                  <option value="Harvest">{t('crops.stages.harvest')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.healthStatus')}</label>
                <select
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Healthy">{t('crops.health.healthy')}</option>
                  <option value="Fair">{t('crops.health.fair')}</option>
                  <option value="Poor">{t('crops.health.poor')}</option>
                  <option value="Critical">{t('crops.health.critical')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('crops.expectedYield')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.expected_yield}
                  onChange={(e) => setFormData({ ...formData, expected_yield: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('crops.notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder={t('crops.notesPlaceholder') || 'Any additional notes about this crop...'}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {editingCrop ? t('crops.updateCrop') : t('crops.addCrop')}
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

      {/* Crops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">{t('crops.noCrops')}</p>
            <p className="text-gray-500 mt-2">{t('crops.clickAdd')}</p>
          </div>
        ) : (
          crops.map((crop) => (
            <div key={crop._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-green-700">{crop.crop_name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {crop.area_planted} {t('dashboard.acres')}
                </span>
              </div>
              {crop.variety && (
                <p className="text-sm text-gray-600 mb-3">{t('crops.variety')}: {crop.variety}</p>
              )}
              <div className="space-y-2 text-sm mb-4">
                <p><strong>{t('crops.farm')}:</strong> {crop.farm_id?.farmName || 'N/A'}</p>
                <p><strong>{t('crops.season')}:</strong> {t(`crops.seasons.${crop.season?.toLowerCase()}`) || crop.season || 'N/A'}</p>
                <p><strong>{t('crops.sowing')}:</strong> {new Date(crop.sowing_date).toLocaleDateString()}</p>
                {crop.expected_harvest_date && (
                  <p><strong>{t('crops.harvest')}:</strong> {new Date(crop.expected_harvest_date).toLocaleDateString()}</p>
                )}
                {crop.expected_yield && (
                  <p><strong>{t('crops.expectedYield')}:</strong> {crop.expected_yield} kg</p>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded ${getStageColor(crop.stage)}`}>
                  {t(`crops.stages.${crop.stage?.toLowerCase()}`) || crop.stage}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getHealthColor(crop.health_status)}`}>
                  {t(`crops.health.${crop.health_status?.toLowerCase()}`) || crop.health_status}
                </span>
              </div>
              {crop.notes && (
                <p className="text-xs text-gray-500 italic mb-4 line-clamp-2">{crop.notes}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(crop)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(crop._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Crops;
