# Agriculture AI - Smart Farming & Decision Support System

A complete, production-ready AI-powered Progressive Web App (PWA) designed to assist farmers with crop disease detection, weather-based irrigation advice, market intelligence, and 24x7 agricultural assistance.

## 🌾 Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication with bcrypt password hashing
- User registration with profile information (state, land size, soil type)
- Profile management and password change functionality

### 🏡 Farm & Crop Management
- Create and manage multiple farms with location details
- Track crops with sowing dates, growth stages, and yield data
- Monitor crop health status and growth progress
- Record harvest data and statistics

### 🔬 AI-Powered Disease Detection
- Upload crop/leaf images for instant AI analysis
- **Gemini Vision API** analyzes images and provides:
  - Disease name with confidence score
  - Severity assessment (Low, Medium, High, Critical)
  - Organic and chemical treatment recommendations
  - Preventive measures
- Image storage via **Cloudinary** with automatic optimization
- Complete disease history tracking

### 🌤️ Weather & Smart Irrigation
- Real-time weather data via **OpenWeather API**
- 5-day weather forecasts
- **Smart Irrigation Recommendations** based on:
  - Expected rainfall analysis
  - Temperature and humidity levels
  - Soil type water retention characteristics
- Weather alerts for extreme conditions

### 🌱 AI Crop Recommender
- **Gemini AI** analyzes farmer's context to recommend top 3 profitable crops
- Provides yield expectations, market prices, and profit margins
- Cultivation tips and seasonal guidance
- Pest prevention and soil health analysis

### 💰 Market Intelligence
- Live crop prices from multiple mandis
- Price comparison across markets
- Trending commodities tracking
- Price history and trend analysis
- Sample data for 8+ major crops (Wheat, Rice, Cotton, Tomato, Onion, etc.)

### 🏛️ Government Schemes
- 8 major schemes with complete details:
  - PM-KISAN (Income Support)
  - PMFBY (Crop Insurance)
  - KCC (Credit Facility)
  - Soil Health Card
  - e-NAM (Market Platform)
  - PKVY (Organic Farming)
  - Micro Irrigation Fund
  - SMAM (Mechanization)
- Automatic eligibility checking based on state and land size
- Application process and required documents

### 🤖 24x7 AI Chatbot Assistant
- Context-aware conversations with **Gemini Pro**
- Expert agricultural advice in natural language
- Quick help suggestions across 6 categories
- Daily farming tips based on season
- Conversation history and session management

### 📱 Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline functionality with service workers
- Responsive, mobile-first design
- Fast and optimized performance

---

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB Atlas** for database
- **Mongoose** ODM with validation
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini AI** (Vision & Text models)
- **OpenWeather API** for weather data
- **Cloudinary** for image storage
- **Multer** for file uploads

### Frontend
- **React.js** 18.x
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management
- **Service Workers** for PWA functionality

---

## 📋 Prerequisites

Before installation, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas)
3. **Google Gemini API Key** - [Get Key](https://makersuite.google.com/app/apikey)
4. **OpenWeather API Key** - [Get Key](https://openweathermap.org/api)
5. **Cloudinary Account** - [Sign Up](https://cloudinary.com/)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd agriculture-ai
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agriculture-ai?retryWrites=true&w=majority

# JWT Secret (Use a strong random string)
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google Gemini AI API
GEMINI_API_KEY=your_google_gemini_api_key_here

# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 3: Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Agriculture AI
REACT_APP_VERSION=1.0.0
```

### Step 4: Run the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

---

## 📱 Building for Production

### Backend Production Build

```bash
cd server
npm start
```

**Deployment Checklist:**
- Set `NODE_ENV=production` in environment variables
- Use strong JWT secret
- Enable MongoDB Atlas network access for production IPs
- Configure CORS for production frontend URL
- Set up proper logging and monitoring

### Frontend Production Build

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

**Deploy the build folder to:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/account` - Deactivate account

### Farms
- `GET /api/farms` - Get all farms
- `POST /api/farms` - Create farm
- `GET /api/farms/:id` - Get farm by ID
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm
- `GET /api/farms/stats/summary` - Get farm statistics

### Crops
- `GET /api/crops` - Get all crops
- `POST /api/crops` - Add crop
- `GET /api/crops/:id` - Get crop details
- `PUT /api/crops/:id` - Update crop
- `PATCH /api/crops/:id/stage` - Update crop stage
- `POST /api/crops/:id/harvest` - Record harvest
- `DELETE /api/crops/:id` - Delete crop
- `GET /api/crops/stats/summary` - Get crop statistics

### Disease Detection
- `POST /api/disease/detect` - Detect disease from image
- `GET /api/disease` - Get disease history
- `GET /api/disease/:id` - Get disease details
- `PATCH /api/disease/:id/status` - Update disease status
- `DELETE /api/disease/:id` - Delete disease record
- `GET /api/disease/stats/summary` - Get disease statistics

### Weather & Irrigation
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get 5-day forecast
- `GET /api/weather/farm/:farmId` - Get farm weather
- `GET /api/weather/irrigation/:farmId` - Get irrigation advice
- `GET /api/weather/alerts` - Get weather alerts

### AI Services
- `POST /api/ai/recommend-crops` - Get crop recommendations
- `POST /api/ai/farming-tips` - Get farming tips
- `POST /api/ai/pest-prevention` - Get pest prevention advice
- `POST /api/ai/soil-analysis` - Get soil analysis
- `POST /api/ai/harvest-timing` - Get harvest timing advice

### Market Prices
- `GET /api/market/prices` - Get market prices
- `GET /api/market/compare/:commodity` - Compare prices
- `GET /api/market/trending` - Get trending commodities
- `GET /api/market/history/:commodity` - Get price history
- `POST /api/market/prices` - Add market price

### Government Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/eligible` - Get eligible schemes
- `GET /api/schemes/:id` - Get scheme details
- `GET /api/schemes/search` - Search schemes

### AI Chatbot
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/session/:sessionId` - Get chat session
- `DELETE /api/chat/session/:sessionId` - Delete session
- `DELETE /api/chat/history` - Clear all history
- `GET /api/chat/suggestions` - Get quick suggestions
- `POST /api/chat/insights` - Get agricultural insights
- `GET /api/chat/daily-tip` - Get daily farming tip

---

## 🗄️ Database Schema

### User Schema
- name, phone (unique), password (hashed)
- state, landSize, soilType
- role (farmer/admin), isActive, lastLogin

### Farm Schema
- farmer_id, farmName, location (address, village, district, state, coordinates)
- soil_type, area, areaUnit, irrigationType, waterSource

### Crop Schema
- farm_id, farmer_id, crop_name, variety
- sowing_date, expected/actual_harvest_date
- area_planted, stage, health_status, season
- expected/actual_yield, notes

### Disease Schema
- crop_id, farmer_id, image_url, cloudinary_public_id
- disease_name, confidence_score, severity
- treatment, organic_treatment, chemical_treatment
- preventive_measures, affected_area, status

### Scheme Schema
- scheme_name, scheme_code, description, scheme_type
- government_level, eligible_states, eligibility_criteria
- benefits, subsidy_amount, application_process
- required_documents, official_website, helpline

### Market Schema
- commodity, variety, market_name, state, district
- price_data (min, max, modal), price_unit
- price_date, price_trend, arrival_quantity

### ChatHistory Schema
- farmer_id, session_id, messages (role, content, timestamp)
- topic, language, is_active, last_interaction

---

## 🔒 Security Features

- JWT-based authentication with 30-day token expiration
- Bcrypt password hashing with salt rounds
- Protected routes with auth middleware
- Input validation and sanitization
- MongoDB injection prevention
- CORS configuration
- File upload size limits (10MB)
- Secure environment variable management
- Error handling without sensitive data exposure

---

## 🧪 Testing

### Backend API Testing

Test health endpoint:
```bash
curl http://localhost:5000/health
```

Test authentication:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Farmer","phone":"9876543210","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"test123"}'
```

---

## 📁 Project Structure

```
agriculture-ai/
├── client/                    # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json      # PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/         # Login, Register
│   │   │   └── Dashboard/    # Main dashboard
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication state
│   │   ├── services/
│   │   │   └── api.js        # API service layer
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css         # Tailwind styles
│   │   └── service-worker.js # PWA service worker
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   ├── cloudinary.js     # Cloudinary config
│   │   └── gemini.js         # Gemini AI config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── farmController.js
│   │   ├── cropController.js
│   │   ├── diseaseController.js
│   │   ├── weatherController.js
│   │   ├── aiController.js
│   │   ├── marketController.js
│   │   ├── schemeController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Farm.js
│   │   ├── Crop.js
│   │   ├── Disease.js
│   │   ├── Scheme.js
│   │   ├── Market.js
│   │   └── ChatHistory.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── farmRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── diseaseRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── schemeRoutes.js
│   │   └── chatRoutes.js
│   ├── utils/
│   │   └── tokenGenerator.js
│   ├── server.js             # Express app entry
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🎯 Usage Guide

### For Farmers

1. **Register/Login**: Create an account with your phone number
2. **Complete Profile**: Add state, land size, and soil type for personalized recommendations
3. **Add Farm**: Register your farm with location and soil details
4. **Track Crops**: Add crops with sowing dates to monitor growth
5. **Disease Detection**: Upload leaf photos for instant AI diagnosis
6. **Check Weather**: Get smart irrigation advice based on forecast
7. **Market Prices**: Compare prices across mandis before selling
8. **Government Schemes**: Check eligibility for subsidies and loans
9. **AI Assistant**: Ask any farming question 24x7

### For Developers

1. **Extend Backend**: Add new controllers in `server/controllers/`
2. **Add Routes**: Register routes in `server/server.js`
3. **Create Models**: Add Mongoose schemas in `server/models/`
4. **Build UI**: Create React components in `client/src/components/`
5. **API Integration**: Use service layer in `client/src/services/api.js`
6. **Styling**: Use Tailwind classes or extend `client/src/index.css`

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify MongoDB URI in `.env`
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted

**Gemini API Errors**
- Verify API key is correct
- Check API quota/limits
- Ensure proper internet connection

**Image Upload Fails**
- Check Cloudinary credentials
- Verify file size < 10MB
- Ensure file type is JPEG/PNG

**CORS Errors**
- Update CORS origin in `server/server.js`
- Set correct frontend URL in production

**JWT Token Expired**
- Re-login to get new token
- Check token expiration setting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@agriculture-ai.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced AI capabilities
- **OpenWeather** for weather data
- **Cloudinary** for image management
- **MongoDB Atlas** for database hosting
- **React** and **Tailwind CSS** communities

---

## 📊 System Requirements

### Minimum Requirements
- **Backend**: 512MB RAM, 1 CPU core
- **Database**: MongoDB Atlas Free Tier (M0)
- **Frontend**: Any modern browser (Chrome, Firefox, Safari, Edge)

### Recommended for Production
- **Backend**: 2GB RAM, 2 CPU cores
- **Database**: MongoDB Atlas M10 or higher
- **CDN**: Cloudflare or AWS CloudFront
- **Monitoring**: New Relic, DataDog, or similar

---

## 🚀 Future Enhancements

- [ ] Multi-language support (Hindi, Telugu, Tamil, etc.)
- [ ] Voice-based AI assistant
- [ ] Crop yield prediction models
- [ ] Drone imagery integration
- [ ] Farmer community forum
- [ ] SMS/WhatsApp notifications
- [ ] Livestock management module
- [ ] Financial planning tools
- [ ] Mobile apps (iOS & Android)
- [ ] Blockchain-based supply chain tracking

---

**Built with ❤️ for Indian Farmers**

*Empowering agriculture through AI and technology*
