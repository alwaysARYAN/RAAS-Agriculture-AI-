import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('Delhi');
  const { t } = useTranslation();

  useEffect(() => {
    fetchWeather(searchCity);
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        api.get(`/weather/current?city=${cityName}`),
        api.get(`/weather/forecast?city=${cityName}`)
      ]);
      
      // Extract data from API response
      const currentData = currentRes.data.data;
      const forecastData = forecastRes.data.data;
      
      // Transform to match component expectations
      const transformedWeather = {
        name: currentData.location.name,
        main: {
          temp: currentData.current.temperature,
          feels_like: currentData.current.feels_like,
          temp_min: currentData.current.temp_min,
          temp_max: currentData.current.temp_max,
          pressure: currentData.current.pressure,
          humidity: currentData.current.humidity
        },
        weather: [{
          main: currentData.current.weather.main,
          description: currentData.current.weather.description,
          icon: currentData.current.weather.icon
        }],
        wind: currentData.current.wind,
        clouds: { all: currentData.current.clouds },
        visibility: currentData.current.visibility
      };
      
      const transformedForecast = {
        list: forecastData.forecast
      };
      
      setWeather(transformedWeather);
      setForecast(transformedForecast);
      setSearchCity(cityName);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      alert(error.response?.data?.message || t('weather.fetchFailed') || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Fog': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  if (loading && !weather) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('weather.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌤️ {t('weather.title')}</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('weather.enterCity') || 'Enter city name...'}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {/* Current Weather */}
      {weather && weather.weather && weather.weather[0] && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold">{weather.name}</h3>
              <p className="text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-6xl">{getWeatherIcon(weather.weather[0]?.main)}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
              <div className="text-xl text-blue-100 capitalize">{weather.weather[0]?.description}</div>
              <div className="text-sm text-blue-200 mt-2">
                {t('weather.feelsLike')} {Math.round(weather.main.feels_like)}°C
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-blue-100 text-sm">{t('weather.highLow')}</div>
                <div className="text-xl font-semibold">
                  {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-blue-100 text-sm">{t('weather.humidity')}</div>
                <div className="text-xl font-semibold">{weather.main.humidity}%</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-blue-100 text-sm">{t('weather.windSpeed')}</div>
                <div className="text-xl font-semibold">
                  {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-blue-100 text-sm">{t('weather.pressure')}</div>
                <div className="text-xl font-semibold">{weather.main.pressure} hPa</div>
              </div>
            </div>
          </div>

          {weather.visibility && (
            <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
              <span className="text-blue-100">{t('weather.visibility')}:</span>{' '}
              <span className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</span>
              {weather.clouds && (
                <>
                  <span className="mx-4">•</span>
                  <span className="text-blue-100">{t('weather.cloudCover')}:</span>{' '}
                  <span className="font-semibold">{weather.clouds.all}%</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Forecast */}
      {forecast && forecast.list && forecast.list.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📅 {t('weather.forecast')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.list
              .filter((item, index) => index % 8 === 0) // Get one forecast per day (every 24h)
              .slice(0, 5)
              .map((item, index) => {
                const date = new Date(item.datetime);
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition">
                    <div className="font-semibold text-gray-700 mb-2">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-4xl mb-2">{getWeatherIcon(item.weather?.main)}</div>
                    <div className="text-xl font-bold text-gray-800 mb-1">
                      {Math.round(item.temperature)}°C
                    </div>
                    <div className="text-sm text-gray-600 capitalize mb-2">
                      {item.weather?.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      💧 {item.humidity}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Farming Advisory */}
      {weather && weather.main && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">🌾 {t('weather.advisory')}</h3>
          <div className="space-y-2 text-gray-700">
            {weather.main.humidity > 80 && (
              <p>• {t('weather.advice.highHumidity', { humidity: weather.main.humidity })}</p>
            )}
            {weather.wind && weather.wind.speed > 10 && (
              <p>• {t('weather.advice.strongWind', { speed: weather.wind.speed })}</p>
            )}
            {weather.main.temp > 35 && (
              <p>• {t('weather.advice.highTemp', { temp: Math.round(weather.main.temp) })}</p>
            )}
            {weather.main.temp < 10 && (
              <p>• {t('weather.advice.lowTemp', { temp: Math.round(weather.main.temp) })}</p>
            )}
            {weather.weather && weather.weather[0] && weather.weather[0].main === 'Rain' && (
              <p>• {t('weather.advice.rain')}</p>
            )}
            {weather.weather && weather.weather[0] && weather.weather[0].main === 'Clear' && weather.main.temp >= 25 && weather.main.temp <= 35 && (
              <p>• {t('weather.advice.goodConditions')}</p>
            )}
            {weather.main.humidity <= 80 && weather.main.temp >= 15 && weather.main.temp <= 30 && (!weather.wind || weather.wind.speed <= 10) && (
              <p>• {t('weather.advice.optimal')}</p>
            )}
            {weather.main.temp >= 30 && weather.main.temp <= 35 && (
              <p>• {t('weather.advice.moderateTemp')}</p>
            )}
            {weather.main.humidity >= 60 && weather.main.humidity <= 80 && (
              <p>• {t('weather.advice.goodHumidity')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
