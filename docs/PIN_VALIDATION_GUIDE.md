# PIN Validation System Guide

## Overview

This guide explains how to use the enhanced PIN validation system that provides better user experience with informative error messages, attempt tracking, and account lockout protection.

## Features

### 🔒 **Security Features**
- **Attempt Tracking**: Tracks failed PIN attempts
- **Account Lockout**: Locks account after maximum attempts
- **Lockout Timer**: Configurable lockout duration
- **Session Management**: Handles session expiration

### 🎨 **User Experience**
- **Animated Modals**: Smooth animations for better UX
- **Visual Feedback**: Progress indicators and attempt counters
- **Multi-language Support**: English, Indonesian, Japanese
- **Accessibility**: Clear error messages and actions

### 🛡️ **Error Handling**
- **Invalid PIN Modal**: Shows remaining attempts
- **Lockout Modal**: Displays lockout duration
- **Forgot PIN Flow**: Contact support option
- **Retry Mechanism**: Easy retry after errors

## Components

### 1. InvalidPinModal

Shows user-friendly error messages for invalid PIN attempts.

```tsx
import InvalidPinModal from '@/components/InvalidPinModal';

<InvalidPinModal
  visible={showModal}
  attempts={2}
  maxAttempts={3}
  onClose={() => setShowModal(false)}
  onRetry={() => handleRetry()}
  onForgotPin={() => handleForgotPin()}
  lockoutTime={15}
/>
```

**Props:**
- `visible`: Boolean to show/hide modal
- `attempts`: Current number of failed attempts
- `maxAttempts`: Maximum attempts before lockout
- `onClose`: Function to close modal
- `onRetry`: Function to retry PIN entry
- `onForgotPin`: Function for forgot PIN flow
- `lockoutTime`: Lockout duration in minutes

### 2. EnhancedVerifyPinModal

Complete PIN verification modal with integrated error handling.

```tsx
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';

<EnhancedVerifyPinModal
  visible={showPinModal}
  onSuccess={() => handleSuccess()}
  onClose={() => setShowPinModal(false)}
  title="Verify Your PIN"
  subtitle="Enter your 6-digit PIN to continue"
/>
```

**Props:**
- `visible`: Boolean to show/hide modal
- `onSuccess`: Function called on successful verification
- `onClose`: Function called when modal is closed
- `title`: Custom title for the modal
- `subtitle`: Custom subtitle for the modal

### 3. useEnhancedPinVerification Hook

Manages PIN verification state and logic.

```tsx
import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';

const {
  attempts,
  maxAttempts,
  isLocked,
  remainingAttempts,
  remainingLockoutTime,
  isVerifying,
  showInvalidPinModal,
  verifyPin,
  resetAttempts,
  handleRetry,
  handleForgotPin,
  closeInvalidPinModal,
} = useEnhancedPinVerification();
```

## Usage Examples

### Basic PIN Verification

```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';

export default function MyComponent() {
  const [showPinModal, setShowPinModal] = useState(false);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    // Proceed with the action
    console.log('PIN verified successfully');
  };

  const handlePinClose = () => {
    setShowPinModal(false);
    // Handle cancellation
    console.log('PIN verification cancelled');
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPinModal(true)}>
        <Text>Verify PIN</Text>
      </TouchableOpacity>

      <EnhancedVerifyPinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onClose={handlePinClose}
      />
    </View>
  );
}
```

### Custom PIN Verification with Hook

```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';
import InvalidPinModal from '@/components/InvalidPinModal';

export default function CustomPinComponent() {
  const [pin, setPin] = useState('');
  const {
    attempts,
    maxAttempts,
    isLocked,
    remainingAttempts,
    isVerifying,
    showInvalidPinModal,
    verifyPin,
    handleRetry,
    handleForgotPin,
    closeInvalidPinModal,
  } = useEnhancedPinVerification();

  const handleVerifyPin = async () => {
    if (pin.length === 6) {
      const success = await verifyPin(pin);
      if (success) {
        setPin('');
        // Handle success
      } else {
        setPin('');
      }
    }
  };

  return (
    <View>
      {/* Your PIN input component */}
      <TouchableOpacity onPress={handleVerifyPin}>
        <Text>Verify PIN</Text>
      </TouchableOpacity>

      <InvalidPinModal
        visible={showInvalidPinModal}
        attempts={attempts}
        maxAttempts={maxAttempts}
        onClose={closeInvalidPinModal}
        onRetry={handleRetry}
        onForgotPin={handleForgotPin}
      />
    </View>
  );
}
```

## Configuration

### Default Settings

```tsx
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_LOCKOUT_DURATION = 15; // minutes
```

### Customizing Settings

You can modify the default settings in `useEnhancedPinVerification.ts`:

```tsx
// Change maximum attempts
const maxAttempts = 5;

// Change lockout duration (in minutes)
const lockoutDuration = 30;
```

## Localization

The system supports multiple languages. Add translations to your locale files:

### English (en.json)
```json
{
  "pin_incorrect_title": "Invalid PIN",
  "pin_incorrect_message": "The PIN you entered is incorrect. Please try again.",
  "pin_locked_title": "Account Locked",
  "pin_locked_message": "Your account has been locked due to multiple incorrect PIN attempts. Please try again in {time} minutes.",
  "remaining_attempts": "Remaining attempts: {count}",
  "try_again": "Try Again",
  "forgot_pin": "Forgot PIN?",
  "close": "Close"
}
```

### Indonesian (id.json)
```json
{
  "pin_incorrect_title": "PIN Salah",
  "pin_incorrect_message": "PIN yang Anda masukkan salah. Silakan coba lagi.",
  "pin_locked_title": "Akun Terkunci",
  "pin_locked_message": "Akun Anda telah terkunci karena beberapa kali memasukkan PIN yang salah. Silakan coba lagi dalam {time} menit.",
  "remaining_attempts": "Percobaan tersisa: {count}",
  "try_again": "Coba Lagi",
  "forgot_pin": "Lupa PIN?",
  "close": "Tutup"
}
```

## Security Considerations

### 1. **PIN Storage**
- PINs should never be stored in plain text
- Use secure storage for any PIN-related data
- Implement proper encryption for sensitive data

### 2. **Attempt Tracking**
- Track attempts server-side for security
- Implement rate limiting
- Log suspicious activity

### 3. **Session Management**
- Handle session expiration properly
- Clear sensitive data on logout
- Implement proper token refresh

### 4. **Lockout Policy**
- Set reasonable lockout durations
- Provide recovery mechanisms
- Implement admin override capabilities

## Best Practices

### 1. **User Experience**
- Show clear error messages
- Provide helpful guidance
- Implement smooth animations
- Support accessibility features

### 2. **Security**
- Validate PINs server-side
- Implement proper logging
- Use secure communication
- Handle edge cases properly

### 3. **Performance**
- Optimize modal rendering
- Use efficient state management
- Implement proper cleanup
- Monitor performance metrics

## Troubleshooting

### Common Issues

1. **Modal not showing**
   - Check `visible` prop
   - Verify component imports
   - Check for z-index issues

2. **PIN verification failing**
   - Check API endpoint
   - Verify authentication headers
   - Check network connectivity

3. **Localization not working**
   - Verify translation keys
   - Check i18n configuration
   - Ensure proper imports

### Debug Mode

Enable debug logging by setting:

```tsx
const DEBUG_PIN_VERIFICATION = true;
```

This will log detailed information about PIN verification attempts and errors.

## Migration Guide

### From Old PIN System

1. **Replace old components:**
   ```tsx
   // Old
   import VerifyPinModal from '@/components/VerifyPinModal';
   
   // New
   import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';
   ```

2. **Update hook usage:**
   ```tsx
   // Old
   import { useVerifyPin } from '@/hooks/use-verify-pin';
   
   // New
   import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';
   ```

3. **Update error handling:**
   ```tsx
   // Old error handling
   if (err?.response?.data?.error === 'Invalid PIN') {
     // Show basic error
   }
   
   // New error handling
   const { verifyPin, showInvalidPinModal } = useEnhancedPinVerification();
   // Automatic error handling with enhanced UI
   ```

## Support

For issues or questions about the PIN validation system:

1. Check this documentation
2. Review the example components
3. Test with the provided examples
4. Contact the development team

## Changelog

### Version 1.0.0
- Initial release
- Basic PIN verification
- Error handling
- Multi-language support
- Account lockout protection
