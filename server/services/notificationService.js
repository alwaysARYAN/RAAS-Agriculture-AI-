const { createNotification } = require('../controllers/notificationController');

class NotificationService {
  // Send weather alert
  static async sendWeatherAlert(userId, weatherData) {
    return createNotification(userId, {
      title: '🌦️ Weather Alert',
      message: `${weatherData.condition} expected in your area. ${weatherData.advisory}`,
      type: 'weather',
      priority: weatherData.severe ? 'urgent' : 'medium',
      icon: '🌦️',
      link: '/weather',
      data: weatherData
    });
  }

  // Send disease detection alert
  static async sendDiseaseAlert(userId, diseaseData) {
    return createNotification(userId, {
      title: '🦠 Disease Detected',
      message: `${diseaseData.diseaseName} detected with ${diseaseData.confidence}% confidence. Check recommendations.`,
      type: 'disease',
      priority: diseaseData.severity === 'High' ? 'urgent' : 'high',
      icon: '🦠',
      link: '/disease-detection',
      data: diseaseData
    });
  }

  // Send market price update
  static async sendMarketUpdate(userId, marketData) {
    return createNotification(userId, {
      title: '💰 Market Price Update',
      message: `${marketData.crop} price: ₹${marketData.price}/quintal in ${marketData.market}`,
      type: 'market',
      priority: 'medium',
      icon: '💰',
      link: '/market',
      data: marketData
    });
  }

  // Send new scheme alert
  static async sendSchemeAlert(userId, schemeData) {
    return createNotification(userId, {
      title: '📋 New Scheme Available',
      message: `${schemeData.schemeName} - Check eligibility and benefits`,
      type: 'scheme',
      priority: 'medium',
      icon: '📋',
      link: '/schemes',
      data: schemeData
    });
  }

  // Send crop health reminder
  static async sendCropReminder(userId, cropData) {
    return createNotification(userId, {
      title: '🌾 Crop Health Reminder',
      message: `Time to check ${cropData.cropName} at ${cropData.farmName}. Stage: ${cropData.stage}`,
      type: 'crop',
      priority: 'medium',
      icon: '🌾',
      link: '/crops',
      data: cropData
    });
  }

  // Send system notification
  static async sendSystemNotification(userId, title, message, priority = 'low') {
    return createNotification(userId, {
      title,
      message,
      type: 'system',
      priority,
      icon: '🔔',
      link: '',
      data: {}
    });
  }

  // Send welcome notification
  static async sendWelcomeNotification(userId, userName) {
    return createNotification(userId, {
      title: '🎉 Welcome to Agriculture AI!',
      message: `Hello ${userName}! Start by adding your farms and crops to get personalized recommendations.`,
      type: 'system',
      priority: 'low',
      icon: '🎉',
      link: '/farms',
      data: {}
    });
  }

  // Send harvest reminder
  static async sendHarvestReminder(userId, cropData) {
    return createNotification(userId, {
      title: '⏰ Harvest Time Approaching',
      message: `${cropData.cropName} is ready for harvest in approximately ${cropData.daysRemaining} days.`,
      type: 'reminder',
      priority: 'high',
      icon: '⏰',
      link: '/crops',
      data: cropData
    });
  }
}

module.exports = NotificationService;
