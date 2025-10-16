# 🚀 Quick Setup Guide

Since you're running `npx expo start`, you need to set up the environment variables first.

## 📋 Quick Steps

### 1. Create .env file
Copy the development environment file:
```bash
cp env.development .env
```

### 2. Start the app
```bash
npx expo start
```

## 🔧 Alternative: Use npm scripts

Instead of `npx expo start`, you can use the configured scripts:

```bash
# Development (recommended)
npm run dev

# Staging
npm run staging

# Production
npm run prod
```

## 📁 Environment Files Available

- `env.development` - Development environment (debugging enabled)
- `env.staging` - Staging environment (security enabled)
- `env.production` - Production environment (full security)
- `env.example` - Template for custom environments

## 🔍 What's in Development Environment

- **API URL**: `https://86b16c2e59f7.ngrok-free.app/api/v1/`
- **Debug Mode**: Enabled
- **SSL Pinning**: Disabled (for easier debugging)
- **Timeout**: 15 seconds

## 🛠️ Manual Setup

If you prefer to create your own .env file:

```bash
# Create .env file
touch .env

# Add your configuration
echo "EXPO_PUBLIC_API_BASE_URL=https://86b16c2e59f7.ngrok-free.app/api/v1/" >> .env
echo "EXPO_PUBLIC_DEVICE_ID=dev-device-12345" >> .env
echo "EXPO_PUBLIC_BANK_CARD_TOKEN=6d7963617264746f6b656e" >> .env
echo "EXPO_PUBLIC_CHANNEL=mobilephone" >> .env
echo "EXPO_PUBLIC_ENVIRONMENT=development" >> .env
echo "EXPO_PUBLIC_DEBUG_MODE=true" >> .env
echo "EXPO_PUBLIC_ENABLE_SSL_PINNING=false" >> .env
echo "EXPO_PUBLIC_ENABLE_CERTIFICATE_VALIDATION=false" >> .env
```

## ✅ Verify Setup

After creating .env file, your app should work with:
```bash
npx expo start
```

The environment variables will be automatically loaded by Expo.
