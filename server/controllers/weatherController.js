const axios = require('axios');
const Farm = require('../models/Farm');

// @desc    Get current weather for a location
// @route   GET /api/weather/current
// @access  Private
exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon, city, state } = req.query;

    let weatherUrl;

    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (city) {
      const location = state ? `${city},${state},IN` : `${city},IN`;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    const response = await axios.get(weatherUrl);
    const data = response.data;

    const weatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      current: {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        wind: {
          speed: data.wind.speed,
          deg: data.wind.deg
        },
        clouds: data.clouds.all,
        visibility: data.visibility,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000)
      },
      timestamp: new Date(data.dt * 1000)
    };

    res.status(200).json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Get current weather error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Weather service authentication failed'
      });
    }

    next(error);
  }
};

// @desc    Get 5-day weather forecast
// @route   GET /api/weather/forecast
// @access  Private
exports.getForecast = async (req, res, next) => {
  try {
    const { lat, lon, city, state } = req.query;

    let forecastUrl;

    if (lat && lon) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (city) {
      const location = state ? `${city},${state},IN` : `${city},IN`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either coordinates (lat, lon) or city name'
      });
    }

    const response = await axios.get(forecastUrl);
    const data = response.data;

    // Process forecast data
    const forecastList = data.list.map(item => ({
      datetime: new Date(item.dt * 1000),
      temperature: item.main.temp,
      feels_like: item.main.feels_like,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      pressure: item.main.pressure,
      humidity: item.main.humidity,
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      },
      clouds: item.clouds.all,
      wind: {
        speed: item.wind.speed,
        deg: item.wind.deg
      },
      pop: item.pop * 100, // Probability of precipitation
      rain: item.rain?.['3h'] || 0
    }));

    // Group by day
    const dailyForecast = {};
    forecastList.forEach(item => {
      const date = item.datetime.toISOString().split('T')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = [];
      }
      dailyForecast[date].push(item);
    });

    res.status(200).json({
      success: true,
      data: {
        location: {
          name: data.city.name,
          country: data.city.country,
          coordinates: {
            lat: data.city.coord.lat,
            lon: data.city.coord.lon
          }
        },
        forecast: forecastList,
        dailyForecast
      }
    });

  } catch (error) {
    console.error('Get forecast error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    next(error);
  }
};

// @desc    Get weather for farm location
// @route   GET /api/weather/farm/:farmId
// @access  Private
exports.getFarmWeather = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      farmer_id: req.user._id,
      isActive: true
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    let weatherUrl;

    // Use coordinates if available, otherwise use city/state
    if (farm.location.coordinates?.latitude && farm.location.coordinates?.longitude) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${farm.location.coordinates.latitude}&lon=${farm.location.coordinates.longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (farm.location.district || farm.location.state) {
      const location = farm.location.district 
        ? `${farm.location.district},${farm.location.state},IN`
        : `${farm.location.state},IN`;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Farm location information is incomplete'
      });
    }

    const response = await axios.get(weatherUrl);
    const data = response.data;

    const weatherData = {
      farm: {
        id: farm._id,
        name: farm.farmName,
        location: farm.location
      },
      current: {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        wind: {
          speed: data.wind.speed,
          deg: data.wind.deg
        },
        clouds: data.clouds.all
      },
      timestamp: new Date(data.dt * 1000)
    };

    res.status(200).json({
      success: true,
      data: weatherData
    });

  } catch (error) {
    console.error('Get farm weather error:', error.message);
    next(error);
  }
};

// @desc    Get irrigation recommendation based on weather and soil
// @route   GET /api/weather/irrigation/:farmId
// @access  Private
exports.getIrrigationRecommendation = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      farmer_id: req.user._id,
      isActive: true
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Get weather forecast
    let forecastUrl;

    if (farm.location.coordinates?.latitude && farm.location.coordinates?.longitude) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${farm.location.coordinates.latitude}&lon=${farm.location.coordinates.longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
      const location = farm.location.district 
        ? `${farm.location.district},${farm.location.state},IN`
        : `${farm.location.state},IN`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    }

    const response = await axios.get(forecastUrl);
    const forecastData = response.data;

    // Analyze next 3 days
    const next72Hours = forecastData.list.slice(0, 24); // Next 72 hours (3-hour intervals)
    
    let totalRainExpected = 0;
    let rainProbability = 0;
    let maxTemp = 0;
    let avgHumidity = 0;

    next72Hours.forEach(item => {
      totalRainExpected += item.rain?.['3h'] || 0;
      rainProbability = Math.max(rainProbability, item.pop * 100);
      maxTemp = Math.max(maxTemp, item.main.temp_max);
      avgHumidity += item.main.humidity;
    });

    avgHumidity = avgHumidity / next72Hours.length;

    // Smart irrigation logic
    let shouldIrrigate = true;
    let recommendation = '';
    let priority = 'Medium';
    let reasons = [];

    // Check for expected rain
    if (totalRainExpected > 10) {
      shouldIrrigate = false;
      recommendation = 'DO NOT irrigate. Significant rainfall expected in the next 72 hours.';
      priority = 'Low';
      reasons.push(`Expected rainfall: ${totalRainExpected.toFixed(1)}mm`);
      reasons.push(`Rain probability: ${rainProbability.toFixed(0)}%`);
    } else if (totalRainExpected > 5) {
      shouldIrrigate = false;
      recommendation = 'Consider delaying irrigation. Moderate rainfall expected.';
      priority = 'Low';
      reasons.push(`Expected rainfall: ${totalRainExpected.toFixed(1)}mm`);
    } else {
      // Check temperature and humidity
      if (maxTemp > 35 && avgHumidity < 50) {
        shouldIrrigate = true;
        recommendation = 'IRRIGATE IMMEDIATELY. High temperature and low humidity detected.';
        priority = 'High';
        reasons.push(`High temperature: ${maxTemp.toFixed(1)}°C`);
        reasons.push(`Low humidity: ${avgHumidity.toFixed(0)}%`);
      } else if (maxTemp > 30 && avgHumidity < 60) {
        shouldIrrigate = true;
        recommendation = 'Irrigation recommended. Moderate heat stress expected.';
        priority = 'Medium';
        reasons.push(`Temperature: ${maxTemp.toFixed(1)}°C`);
        reasons.push(`Humidity: ${avgHumidity.toFixed(0)}%`);
      } else {
        shouldIrrigate = true;
        recommendation = 'Normal irrigation schedule. Monitor crop water requirements.';
        priority = 'Medium';
        reasons.push('Normal weather conditions');
      }
    }

    // Adjust based on soil type
    const soilWaterRetention = {
      'Clay': 'High',
      'Loamy': 'Medium',
      'Sandy': 'Low',
      'Silty': 'Medium',
      'Black': 'High',
      'Red': 'Low',
      'Alluvial': 'Medium'
    };

    const retention = soilWaterRetention[farm.soil_type] || 'Medium';
    
    if (retention === 'Low' && shouldIrrigate) {
      reasons.push(`${farm.soil_type} soil has low water retention`);
    }

    res.status(200).json({
      success: true,
      data: {
        farm: {
          id: farm._id,
          name: farm.farmName,
          soil_type: farm.soil_type,
          irrigation_type: farm.irrigationType
        },
        analysis: {
          shouldIrrigate,
          recommendation,
          priority,
          reasons
        },
        weather_summary: {
          expected_rainfall: totalRainExpected.toFixed(1),
          rain_probability: rainProbability.toFixed(0),
          max_temperature: maxTemp.toFixed(1),
          avg_humidity: avgHumidity.toFixed(0)
        },
        soil_characteristics: {
          type: farm.soil_type,
          water_retention: retention
        },
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get irrigation recommendation error:', error.message);
    next(error);
  }
};

// @desc    Get weather alerts
// @route   GET /api/weather/alerts
// @access  Private
exports.getWeatherAlerts = async (req, res, next) => {
  try {
    const { lat, lon, city, state } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coordinates (lat, lon) for alerts'
      });
    }

    // OpenWeather One Call API for alerts (requires subscription)
    // For free tier, we'll simulate alerts based on current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;

    const alerts = [];

    // Check for extreme conditions
    if (data.main.temp > 40) {
      alerts.push({
        event: 'Extreme Heat',
        severity: 'High',
        description: 'Very high temperature detected. Ensure adequate irrigation.',
        recommendation: 'Increase watering frequency and consider shade nets'
      });
    }

    if (data.main.temp < 10) {
      alerts.push({
        event: 'Cold Weather',
        severity: 'Medium',
        description: 'Low temperature may affect crop growth.',
        recommendation: 'Protect sensitive crops from cold'
      });
    }

    if (data.wind.speed > 10) {
      alerts.push({
        event: 'Strong Wind',
        severity: 'Medium',
        description: 'High wind speed detected.',
        recommendation: 'Secure loose structures and young plants'
      });
    }

    if (data.main.humidity > 85) {
      alerts.push({
        event: 'High Humidity',
        severity: 'Medium',
        description: 'High humidity may increase disease risk.',
        recommendation: 'Monitor crops for fungal diseases'
      });
    }

    if (data.weather[0].main === 'Rain' || data.weather[0].main === 'Thunderstorm') {
      alerts.push({
        event: 'Rainfall',
        severity: 'Low',
        description: 'Rain detected or expected.',
        recommendation: 'Skip irrigation and check drainage'
      });
    }

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: {
        location: {
          name: data.name,
          coordinates: { lat, lon }
        },
        alerts,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get weather alerts error:', error.message);
    next(error);
  }
};
