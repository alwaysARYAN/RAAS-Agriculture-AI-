import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      alert(t('disease.noImage'));
      return;
    }

    setDetecting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      // Make crop_id optional - backend will handle it
      formData.append('crop_id', 'general');

      const response = await api.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Detection error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(t('disease.uploadFailed') + ': ' + errorMessage);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🔬 {t('disease.title')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('disease.uploadImage')}
        </p>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('disease.uploadImage')}
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition">
              <span className="text-4xl mb-2">📸</span>
              <span className="text-sm text-gray-600">
                {t('disease.dragDrop')}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-6">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-md mx-auto rounded-lg shadow"
            />
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="mt-4 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {detecting ? t('disease.analyzing') : `🔍 ${t('disease.detectNow')}`}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {t('disease.results')}
            </h3>
            <div className="space-y-3">
              <p>
                <strong>{t('disease.disease')}:</strong> {result.disease_name}
              </p>
              <p>
                <strong>{t('disease.confidence')}:</strong> {result.confidence_score}%
              </p>
              <p>
                <strong>{t('disease.severity')}:</strong> {result.severity}
              </p>
              <div>
                <strong>{t('disease.treatment')}:</strong>
                <p className="text-gray-700 mt-1">{result.treatment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>Note:</strong> AI detection requires API quota. Currently
            limited to 20 requests/day on free tier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
