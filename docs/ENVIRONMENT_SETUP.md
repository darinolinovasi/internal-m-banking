# Environment Setup Guide

This guide explains how to set up and manage environment variables for different deployment environments.

## 📁 Environment Files

The project uses separate environment files for different environments:

- `env.development` - Development environment
- `env.staging` - Staging environment  
- `env.production` - Production environment
- `env.example` - Template for creating new environment files

## 🚀 Quick Start

### 1. Set up Development Environment
```bash
npm run env:dev
npm run dev
```

### 2. Set up Staging Environment
```bash
npm run env:staging
npm run staging
```

### 3. Set up Production Environment
```bash
npm run env:prod
npm run prod
```

## 🔧 Manual Setup

### Using the Setup Script
```bash
# Set development environment
node scripts/setup-env.js development

# Set staging environment
node scripts/setup-env.js staging

# Set production environment
node scripts/setup-env.js production
```

### Manual Environment File Copy
```bash
# Copy development environment
cp env.development .env

# Copy staging environment
cp env.staging .env

# Copy production environment
cp env.production .env
```

## 📋 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | API base URL | `https://api.yourbank.com/api/v1/` |
| `EXPO_PUBLIC_API_TIMEOUT` | API timeout in milliseconds | `10000` |
| `EXPO_PUBLIC_DEVICE_ID` | Unique device identifier | `unique-device-id` |
| `EXPO_PUBLIC_BANK_CARD_TOKEN` | Bank card token | `your-bank-card-token` |
| `EXPO_PUBLIC_CHANNEL` | Channel identifier | `mobilephone` |

### Security Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_ENABLE_SSL_PINNING` | Enable SSL certificate pinning | `true` |
| `EXPO_PUBLIC_ENABLE_CERTIFICATE_VALIDATION` | Enable certificate validation | `true` |

### Environment Variables

| Variable | Description | Options |
|----------|-------------|---------|
| `EXPO_PUBLIC_ENVIRONMENT` | Current environment | `development`, `staging`, `production` |
| `EXPO_PUBLIC_DEBUG_MODE` | Enable debug mode | `true`, `false` |

## 🔒 Security Considerations

### Development Environment
- SSL pinning: **Disabled** (for easier debugging)
- Certificate validation: **Disabled**
- Debug mode: **Enabled**
- API timeout: **15 seconds** (longer for debugging)

### Staging Environment
- SSL pinning: **Enabled**
- Certificate validation: **Enabled**
- Debug mode: **Enabled** (for testing)
- API timeout: **12 seconds**

### Production Environment
- SSL pinning: **Enabled**
- Certificate validation: **Enabled**
- Debug mode: **Disabled**
- API timeout: **10 seconds**

## 🛠️ Custom Environment

To create a custom environment:

1. Copy `env.example` to `env.custom`
2. Update the values in `env.custom`
3. Add the environment to `scripts/setup-env.js`
4. Run: `node scripts/setup-env.js custom`

## 📝 Environment File Template

```bash
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1/
EXPO_PUBLIC_API_TIMEOUT=10000

# Security Configuration
EXPO_PUBLIC_DEVICE_ID=your-unique-device-id
EXPO_PUBLIC_BANK_CARD_TOKEN=your-bank-card-token
EXPO_PUBLIC_CHANNEL=mobilephone

# Environment Configuration
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_DEBUG_MODE=false

# Security Headers
EXPO_PUBLIC_ENABLE_SSL_PINNING=true
EXPO_PUBLIC_ENABLE_CERTIFICATE_VALIDATION=true
```

## 🚨 Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Use `env.example`** as a template for team members
3. **Update `.gitignore`** to exclude `.env` files
4. **Use different tokens** for different environments
5. **Enable SSL pinning** in production for security

## 🔍 Troubleshooting

### Environment Not Loading
- Check if `.env` file exists in project root
- Verify environment variable names start with `EXPO_PUBLIC_`
- Restart the development server after changing environment files

### API Connection Issues
- Verify `EXPO_PUBLIC_API_BASE_URL` is correct
- Check if API server is running
- Verify network connectivity

### Security Issues
- Ensure SSL pinning is enabled in production
- Verify certificate validation is enabled
- Check that debug mode is disabled in production

## 📚 Additional Resources

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [React Native Environment Variables](https://reactnative.dev/docs/environment-setup)
- [Security Best Practices](https://docs.expo.dev/guides/security/)
