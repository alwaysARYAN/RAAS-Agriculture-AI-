# Deployment Guide - Agriculture AI

## Quick Start Commands

### Development Mode

```bash
# Terminal 1 - Backend
cd server
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev

# Terminal 2 - Frontend
cd client
npm install
cp .env.example .env
npm start
```

### Production Deployment

## Backend Deployment (Node.js)

### Option 1: Heroku

```bash
cd server
heroku create agriculture-ai-backend
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set GEMINI_API_KEY="your_gemini_key"
heroku config:set OPENWEATHER_API_KEY="your_weather_key"
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
heroku config:set CLOUDINARY_API_KEY="your_cloudinary_key"
heroku config:set CLOUDINARY_API_SECRET="your_cloudinary_secret"
heroku config:set NODE_ENV="production"
git push heroku main
```

### Option 2: Railway.app

1. Connect GitHub repository
2. Select `server` directory as root
3. Add environment variables in dashboard
4. Deploy automatically on push

### Option 3: AWS EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone <your-repo>
cd agriculture-ai/server
npm install
nano .env  # Add your environment variables

# Start with PM2
pm2 start server.js --name agriculture-ai
pm2 save
pm2 startup
```

## Frontend Deployment (React)

### Option 1: Vercel

```bash
cd client
npm install -g vercel
vercel
# Follow prompts
# Add environment variables in Vercel dashboard
```

### Option 2: Netlify

```bash
cd client
npm run build
# Drag and drop 'build' folder to Netlify
# Or connect GitHub repo
```

### Option 3: AWS S3 + CloudFront

```bash
cd client
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront distribution
# Point to S3 bucket
# Add custom domain (optional)
```

## Database Setup

### MongoDB Atlas Configuration

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (Free M0 tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Replace in .env: `MONGODB_URI=mongodb+srv://...`

## API Keys Setup

### Google Gemini AI
1. Visit https://makersuite.google.com/app/apikey
2. Create API key
3. Add to .env: `GEMINI_API_KEY=your_key`

### OpenWeather
1. Sign up at https://openweathermap.org/api
2. Get free API key
3. Add to .env: `OPENWEATHER_API_KEY=your_key`

### Cloudinary
1. Sign up at https://cloudinary.com/
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to .env:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Environment Variables Checklist

### Backend (.env)
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] GEMINI_API_KEY
- [x] OPENWEATHER_API_KEY
- [x] CLOUDINARY_CLOUD_NAME
- [x] CLOUDINARY_API_KEY
- [x] CLOUDINARY_API_SECRET
- [x] PORT (default: 5000)
- [x] NODE_ENV (production)

### Frontend (.env)
- [x] REACT_APP_API_URL (your backend URL)

## SSL/HTTPS Setup

### Using Let's Encrypt (for EC2)

```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Backend
- Enable compression: `npm install compression`
- Add rate limiting: `npm install express-rate-limit`
- Implement caching: Redis or in-memory cache
- Use PM2 cluster mode for multiple instances

### Frontend
- Enable production build: `npm run build`
- Use CDN for static assets
- Implement code splitting
- Enable PWA caching

## Monitoring & Logging

### Backend Monitoring
```bash
# PM2 Monitoring
pm2 monit

# Logs
pm2 logs agriculture-ai
```

### Error Tracking
- Sentry.io
- LogRocket
- New Relic

## Backup Strategy

### Database Backup
```bash
# MongoDB Atlas: Use built-in backup feature
# Or manual backup:
mongodump --uri="your_mongodb_uri" --out=./backup
```

### Automated Backups
- Set up daily backups in MongoDB Atlas
- Store backups in S3 or Google Cloud Storage

## Security Checklist

- [x] HTTPS enabled
- [x] Environment variables secured
- [x] CORS configured properly
- [x] Rate limiting enabled
- [x] Input validation implemented
- [x] MongoDB injection prevention
- [x] JWT tokens with expiration
- [x] Password hashing with bcrypt
- [x] File upload size limits
- [x] API key rotation policy

## Scaling Considerations

### Vertical Scaling
- Increase server RAM/CPU
- Upgrade MongoDB tier

### Horizontal Scaling
- Load balancer (AWS ALB, Nginx)
- Multiple backend instances
- CDN for frontend
- Database read replicas

## Health Checks

### Backend
```bash
curl https://your-api.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Agriculture AI Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## Troubleshooting Production Issues

### Check Logs
```bash
# PM2
pm2 logs

# System logs
sudo journalctl -u nginx
```

### Common Issues
1. **503 Errors**: Backend server down - restart with `pm2 restart`
2. **CORS Errors**: Update CORS origin in server.js
3. **Database Connection**: Check MongoDB Atlas network access
4. **API Rate Limits**: Implement caching or upgrade API tier

## Cost Estimation

### Free Tier (Development)
- MongoDB Atlas: M0 (Free)
- Vercel/Netlify: Free
- Railway: $5/month (with free credits)
- Total: ~$0-5/month

### Production (Small Scale)
- MongoDB Atlas: M10 ($57/month)
- AWS EC2: t3.small ($15/month)
- Cloudinary: Free tier (25GB)
- Domain: $12/year
- SSL: Free (Let's Encrypt)
- Total: ~$75-100/month

### Production (Medium Scale)
- MongoDB Atlas: M30 ($225/month)
- AWS: Load Balancer + 2x t3.medium ($100/month)
- Cloudinary: Advanced ($99/month)
- CloudFront CDN ($20/month)
- Total: ~$450-500/month

## Support & Maintenance

### Regular Tasks
- Weekly: Check logs and error rates
- Monthly: Review API usage and costs
- Quarterly: Security updates and dependency updates
- Yearly: SSL certificate renewal (automated with Let's Encrypt)

---

**Deployment Checklist Complete! 🚀**

Your Agriculture AI system is now production-ready.
