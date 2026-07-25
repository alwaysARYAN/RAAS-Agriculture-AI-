# RAAS Frontend Deployment Script for Vercel
# Run this from PowerShell: .\deploy-frontend.ps1

Write-Host "===================================" -ForegroundColor Green
Write-Host "   RAAS Frontend Deployment" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""

# Get backend URL from user
Write-Host "Please enter your Backend URL (from Vercel):" -ForegroundColor Yellow
Write-Host "   Example: https://raas-backend-xyz123.vercel.app" -ForegroundColor Gray
$backendUrl = Read-Host "Backend URL"

if (-not $backendUrl) {
    Write-Host "Backend URL is required!" -ForegroundColor Red
    Write-Host "Deploy backend first using: .\deploy-backend.ps1" -ForegroundColor Yellow
    exit 1
}

# Remove trailing slash if present
$backendUrl = $backendUrl.TrimEnd('/')

Write-Host "Backend URL set to: $backendUrl" -ForegroundColor Green
Write-Host ""

# Navigate to client directory
Write-Host "Navigating to client directory..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\client"

Write-Host ""

# Update .env.production
Write-Host "Updating .env.production..." -ForegroundColor Yellow
$envContent = @"
# Production Environment Variables for Frontend
REACT_APP_API_URL=$backendUrl/api
REACT_APP_NAME=RAAS Agriculture AI
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production
"@

Set-Content -Path ".env.production" -Value $envContent
Write-Host "Environment variables updated!" -ForegroundColor Green

Write-Host ""

# Build the project
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Set-Location -Path $PSScriptRoot
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Check if user is logged in
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
$authCheck = vercel whoami 2>&1

if ($authCheck -like "*Error*") {
    Write-Host "Not logged in to Vercel" -ForegroundColor Red
    Write-Host "Please login to Vercel..." -ForegroundColor Yellow
    vercel login
} else {
    Write-Host "Logged in as: $authCheck" -ForegroundColor Green
}

Write-Host ""

# Deploy to Vercel
Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Final steps:" -ForegroundColor Cyan
Write-Host "1. Copy your frontend URL from above" -ForegroundColor White
Write-Host "2. Update CORS_ORIGIN in backend Vercel Dashboard:" -ForegroundColor White
Write-Host "   - Go to backend project -> Settings -> Environment Variables" -ForegroundColor Gray
Write-Host "   - Edit CORS_ORIGIN to your frontend URL" -ForegroundColor Gray
Write-Host "   - Redeploy backend" -ForegroundColor Gray
Write-Host ""
Write-Host "Your RAAS app is now LIVE!" -ForegroundColor Green
Write-Host ""

# Return to root directory
Set-Location -Path $PSScriptRoot
