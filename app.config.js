import 'dotenv/config';


export default {
    expo: {
        name: process.env.APP_NAME || 'darinol-payment-app',
        slug: 'darinol-payment-app',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'darinolpaymentapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                backgroundColor: '#E6F4FE',
                foregroundImage: './assets/images/android-icon-foreground.png',
                backgroundImage: './assets/images/android-icon-background.png',
                monochromeImage: './assets/images/android-icon-monochrome.png',
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: 'com.laksani.darinolpaymentapp',
        },
        web: {
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                    dark: {
                        backgroundColor: '#000000',
                    },
                },
            ],
            [
                'expo-secure-store',
                {
                    faceIDPermission: 'Use Face ID to authenticate',
                    touchIDPermission: 'Use Touch ID to authenticate',
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true,
        },
        extra: {
            router: {},
            eas: {
                projectId: '2ff9d6b3-9449-4ef2-8424-35d7c7cb76e3',
            },
            // Tambahkan environment variables di sini
            apiUrl: "https://unwhipt-peridotic-chante.ngrok-free.dev/api/v1/",
            bankCardToken: "6d7963617264746f6b656e",
            deviceId: "dev-device-12345",
            environment: process.env.APP_ENV || 'development',
        },
        runtimeVersion: {
            policy: 'appVersion',
        },
        updates: {
            url: 'https://u.expo.dev/2ff9d6b3-9449-4ef2-8424-35d7c7cb76e3',
            // "requestHeaders": {
            //   "expo-channel-name": "your-channel-name"
            // }
        },
    },
};