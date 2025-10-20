# Enhanced PIN Verification Implementation Guide

## 🚀 Quick Start

### 1. **Replace Existing PIN Components**

Replace your current `VerifyPinModal` usage with the new `EnhancedVerifyPinModal`:

```tsx
// OLD WAY ❌
import VerifyPinModal from '@/components/VerifyPinModal';
import { useVerifyPin } from '@/hooks/use-verify-pin';

// NEW WAY ✅
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';
import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';
```

### 2. **Update Your Components**

#### **Before (Old Implementation):**
```tsx
// Old way - manual error handling
const { verifyPin, loading } = useVerifyPin();

const handlePinVerification = async (pin: string) => {
  try {
    const response = await verifyPin(pin);
    if (response.status === 200) {
      // Success
      Alert.alert('Success', 'PIN verified');
    }
  } catch (err: any) {
    if (err?.response?.data?.error === 'Invalid PIN') {
      Alert.alert('Error', 'Invalid PIN');
    }
  }
};

<VerifyPinModal
  visible={showModal}
  callback={handleSuccess}
  onClose={handleClose}
/>
```

#### **After (Enhanced Implementation):**
```tsx
// New way - automatic error handling
const [showPinModal, setShowPinModal] = useState(false);

const handlePinSuccess = () => {
  setShowPinModal(false);
  // Proceed with your action
  console.log('PIN verified successfully');
};

const handlePinClose = () => {
  setShowPinModal(false);
};

<EnhancedVerifyPinModal
  visible={showPinModal}
  onSuccess={handlePinSuccess}
  onClose={handlePinClose}
  title="Verify Your PIN"
  subtitle="Enter your 6-digit PIN to continue"
/>
```

## 🔧 **Step-by-Step Implementation**

### **Step 1: Update Your App Layout**

Make sure your app has the proper providers:

```tsx
// app/_layout.tsx
import { AppStateProvider } from '@/contexts/AppStateContext';
import { ErrorProvider } from '@/contexts/ErrorContext';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <ErrorProvider>
        {/* Your app content */}
      </ErrorProvider>
    </AppStateProvider>
  );
}
```

### **Step 2: Update Transfer Components**

Replace PIN verification in transfer flows:

```tsx
// app/transfer.tsx or similar
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';

export default function TransferScreen() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [transferData, setTransferData] = useState(null);

  const handleTransfer = (data) => {
    setTransferData(data);
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    // Process the transfer
    processTransfer(transferData);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleTransfer({ amount: 100 })}>
        <Text>Transfer Money</Text>
      </TouchableOpacity>

      <EnhancedVerifyPinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onClose={() => setShowPinModal(false)}
        title="Confirm Transfer"
        subtitle="Enter your PIN to complete the transfer"
      />
    </View>
  );
}
```

### **Step 3: Update Account Management**

For PIN changes and sensitive operations:

```tsx
// app/account.tsx or similar
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';

export default function AccountScreen() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [action, setAction] = useState('');

  const handleSensitiveAction = (actionType: string) => {
    setAction(actionType);
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    switch (action) {
      case 'changePin':
        // Navigate to change PIN screen
        break;
      case 'viewDetails':
        // Show account details
        break;
      case 'deleteAccount':
        // Show delete confirmation
        break;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleSensitiveAction('changePin')}>
        <Text>Change PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSensitiveAction('viewDetails')}>
        <Text>View Account Details</Text>
      </TouchableOpacity>

      <EnhancedVerifyPinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onClose={() => setShowPinModal(false)}
        title={`Verify PIN for ${action}`}
        subtitle="Enter your 6-digit PIN to continue"
      />
    </View>
  );
}
```

## 🎯 **Advanced Usage**

### **Custom Hook Integration**

For more control, use the hook directly:

```tsx
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
      {/* Your custom PIN input */}
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

### **Configuration Options**

Customize the PIN verification behavior:

```tsx
// In useEnhancedPinVerification.ts, you can modify:
const DEFAULT_MAX_ATTEMPTS = 3;        // Change to 5 for more attempts
const DEFAULT_LOCKOUT_DURATION = 15;   // Change to 30 for longer lockout
```

## 🔄 **Migration Checklist**

### **✅ Files to Update:**

1. **Replace imports in:**
   - `app/transfer.tsx` (if exists)
   - `app/account.tsx`
   - `app/change-pin.tsx`
   - Any component using PIN verification

2. **Update existing VerifyPinModal usage:**
   ```tsx
   // Find and replace:
   // OLD: import VerifyPinModal from '@/components/VerifyPinModal';
   // NEW: import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';
   ```

3. **Update hook usage:**
   ```tsx
   // Find and replace:
   // OLD: import { useVerifyPin } from '@/hooks/use-verify-pin';
   // NEW: import { useEnhancedPinVerification } from '@/hooks/useEnhancedPinVerification';
   ```

### **✅ Testing Steps:**

1. **Test Invalid PIN:**
   - Enter wrong PIN 3 times
   - Verify account lockout
   - Check lockout timer

2. **Test Valid PIN:**
   - Enter correct PIN
   - Verify success flow
   - Check attempt reset

3. **Test UI/UX:**
   - Check animations
   - Verify translations
   - Test accessibility

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Modal not showing:**
   ```tsx
   // Check if visible prop is true
   <EnhancedVerifyPinModal
     visible={true} // Make sure this is true
     onSuccess={handleSuccess}
     onClose={handleClose}
   />
   ```

2. **Translations not working:**
   ```tsx
   // Ensure i18n is properly configured
   import '../utils/i18n';
   ```

3. **API errors:**
   ```tsx
   // Check if API endpoint is correct
   // Verify authentication headers
   // Check network connectivity
   ```

### **Debug Mode:**

Enable debug logging:

```tsx
// Add to your component
const DEBUG_PIN = true;

if (DEBUG_PIN) {
  console.log('PIN verification state:', {
    attempts,
    isLocked,
    remainingAttempts,
    isVerifying
  });
}
```

## 📱 **Example Integration**

Here's a complete example of how to integrate the enhanced PIN verification:

```tsx
// Complete example
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import EnhancedVerifyPinModal from '@/components/EnhancedVerifyPinModal';

export default function PaymentScreen() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handlePayment = (amount: number, recipient: string) => {
    setPaymentData({ amount, recipient });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    Alert.alert(
      'Payment Successful',
      `Payment of $${paymentData.amount} to ${paymentData.recipient} completed!`
    );
    setPaymentData(null);
  };

  const handlePinClose = () => {
    setShowPinModal(false);
    setPaymentData(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Payment</Text>
      
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => handlePayment(100, 'John Doe')}
      >
        <Text style={styles.buttonText}>Pay $100 to John Doe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => handlePayment(250, 'Jane Smith')}
      >
        <Text style={styles.buttonText}>Pay $250 to Jane Smith</Text>
      </TouchableOpacity>

      <EnhancedVerifyPinModal
        visible={showPinModal}
        onSuccess={handlePinSuccess}
        onClose={handlePinClose}
        title="Confirm Payment"
        subtitle="Enter your PIN to complete the payment"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## 🎉 **Benefits of Enhanced PIN Verification**

- ✅ **Better UX**: Animated modals with clear feedback
- ✅ **Enhanced Security**: Account lockout and attempt tracking  
- ✅ **Multi-language**: Full localization support
- ✅ **Accessibility**: Better error messages and actions
- ✅ **Easy Integration**: Drop-in replacement for existing modals
- ✅ **Comprehensive Documentation**: Complete usage guide and examples

Your enhanced PIN verification system is now ready to use! 🚀
