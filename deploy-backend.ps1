# RAAS Backend Deployment Script for Vercel
# Run this from PowerShell: .\deploy-backend.ps1

Write-Host "🚀 RAAS Backend Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📦 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""

# Navigate to server directory
Write-Host "📂 Navigating to server directory..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\server"

Write-Host ""

# Check if user is logged in
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
$authCheck = vercel whoami 2>&1

if ($authCheck -like "*Error*") {
    Write-Host "❌ Not logged in to Vercel" -ForegroundColor Red
    Write-Host "🔑 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
} else {
    Write-Host "✅ Logged in as: $authCheck" -ForegroundColor Green
}

Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying backend to Vercel..." -ForegroundColor Yellow
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy your backend URL from above" -ForegroundColor White
Write-Host "2. Add environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host "3. Run .\deploy-frontend.ps1 to deploy frontend" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Don't forget to:" -ForegroundColor Yellow
Write-Host "   - Configure MongoDB Atlas network access (0.0.0.0/0)" -ForegroundColor White
Write-Host "   - Add all environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host ""

# Return to root directory
Set-Location -Path $PSScriptRoot
