import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ onLanguageSelect }) => {
  const { i18n, t } = useTranslation();

  const selectLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    localStorage.setItem('languageSelected', 'true');
    if (onLanguageSelect) {
      onLanguageSelect(code);
    }
  };

  // Translation keys for the language selector
  const translations = {
    en: {
      title: 'Welcome to Agriculture AI',
      subtitle: 'Choose your preferred language',
      description: 'Select a language to get started with smart farming solutions',
      button: 'Select Language',
      footer1: 'Agriculture AI - Smart Farming Solutions',
      footer2: '🌾 Empowering Farmers with Technology',
      name: 'English'
    },
    hi: {
      title: 'एग्रीकल्चर AI में आपका स्वागत है',
      subtitle: 'अपनी पसंदीदा भाषा चुनें',
      description: 'स्मार्ट खेती समाधान के साथ शुरुआत करने के लिए एक भाषा चुनें',
      button: 'भाषा चुनें',
      footer1: 'एग्रीकल्चर AI - स्मार्ट खेती समाधान',
      footer2: '🌾 प्रौद्योगिकी से किसानों को सशक्त बनाना',
      name: 'हिंदी'
    },
    gu: {
      title: 'એગ્રીકલ્ચર AI માં આપનું સ્વાગત છે',
      subtitle: 'તમારી પસંદીદા ભાષા પસંદ કરો',
      description: 'સ્માર્ટ ખેતી સોલ્યુશન્સ સાથે શરૂ કરવા માટે ભાષા પસંદ કરો',
      button: 'ભાષા પસંદ કરો',
      footer1: 'એગ્રીકલ્ચર AI - સ્માર્ટ ખેતી સોલ્યુશન્સ',
      footer2: '🌾 ટેક્નોલોજી સાથે ખેડૂતોને સશક્ત બનાવવું',
      name: 'ગુજરાતી'
    }
  };

  const currentLang = i18n.language || 'en';
  const text = translations[currentLang];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{text.title}</h1>
          <p className="text-lg text-gray-600 mb-1">{text.subtitle}</p>
          <p className="text-sm text-gray-500">{text.description}</p>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* English */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">GB</h3>
              <p className="text-lg text-gray-700 font-semibold mb-1">English</p>
              <p className="text-base text-gray-600 mb-6">English</p>
              <button 
                onClick={() => selectLanguage('en')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-full transition duration-200"
              >
                {currentLang === 'en' ? text.button : 'Select Language'}
              </button>
            </div>
          </div>

          {/* Hindi */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">IN</h3>
              <p className="text-lg text-gray-700 font-semibold mb-1">Hindi</p>
              <p className="text-base text-gray-600 mb-6">हिंदी</p>
              <button 
                onClick={() => selectLanguage('hi')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-6 rounded-full transition duration-200"
              >
                {currentLang === 'hi' ? text.button : 'भाषा चुनें'}
              </button>
            </div>
          </div>

          {/* Gujarati */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">IN</h3>
              <p className="text-lg text-gray-700 font-semibold mb-1">Gujarati</p>
              <p className="text-base text-gray-600 mb-6">ગુજરાતી</p>
              <button 
                onClick={() => selectLanguage('gu')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-6 rounded-full transition duration-200"
              >
                {currentLang === 'gu' ? text.button : 'ભાષા પસંદ કરો'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">{text.footer1}</p>
          <p className="text-red-500 text-xs">{text.footer2}</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
