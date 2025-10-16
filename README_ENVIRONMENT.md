# 🔧 Environment Configuration

Your React Native banking app now uses `.env` files instead of Expo Constants for better security and flexibility.

## 🚀 Quick Setup

### Development
```bash
npm run dev
```

### Staging
```bash
npm run staging
```

### Production
```bash
npm run prod
```

## 📁 Environment Files

- `env.development` - Development environment
- `env.staging` - Staging environment
- `env.production` - Production environment
- `env.example` - Template for new environments

## 🔒 Security Features

### Development
- SSL pinning: **Disabled** (for debugging)
- Certificate validation: **Disabled**
- Debug mode: **Enabled**
- API timeout: **15 seconds**

### Staging
- SSL pinning: **Enabled**
- Certificate validation: **Enabled**
- Debug mode: **Enabled**
- API timeout: **12 seconds**

### Production
- SSL pinning: **Enabled**
- Certificate validation: **Enabled**
- Debug mode: **Disabled**
- API timeout: **10 seconds**

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | API base URL | `https://api.yourbank.com/api/v1/` |
| `EXPO_PUBLIC_DEVICE_ID` | Device identifier | `unique-device-id` |
| `EXPO_PUBLIC_BANK_CARD_TOKEN` | Bank card token | `your-bank-card-token` |
| `EXPO_PUBLIC_ENABLE_SSL_PINNING` | SSL pinning | `true`/`false` |
| `EXPO_PUBLIC_DEBUG_MODE` | Debug mode | `true`/`false` |

## 🛠️ Manual Setup

```bash
# Copy environment file
cp env.development .env

# Start development server
expo start
```

## 📚 Documentation

See `docs/ENVIRONMENT_SETUP.md` for detailed setup instructions.

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use different tokens for different environments
- Enable SSL pinning in production
- Keep production secrets secure
