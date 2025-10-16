# Error Handling System Guide

This guide explains the new centralized error handling system implemented in the application.

## Overview

The new error handling system provides:
- **Centralized error management** via ErrorContext
- **Consistent error modals** with retry functionality
- **User-friendly error messages** with automatic processing
- **Global error state** accessible from any component

## Components

### 1. ErrorModal Component (`components/ErrorModal.tsx`)

A reusable modal component that displays errors with:
- Consistent styling matching the app theme
- Optional retry button
- Customizable title and message
- Warning icon for visual clarity

**Props:**
```typescript
interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
    showRetry?: boolean;
    onRetry?: () => void;
}
```

### 2. ErrorContext (`contexts/ErrorContext.tsx`)

Provides global error state management:
- `showError(message, options)` - Display error modal
- `hideError()` - Hide error modal
- Automatically renders ErrorModal in the provider

**Usage:**
```typescript
import { useError } from '@/contexts/ErrorContext';

const { showError, hideError } = useError();
```

### 3. Error Handler Utility (`utils/errorHandler.ts`)

Processes API errors and returns user-friendly messages:
- Network error detection
- Status code handling (401, 400, 403, 404, 500+)
- Specific error message mapping
- Retry suggestion logic

**Functions:**
- `processApiError(error)` - Process any API error
- `createErrorHandler(showError)` - Create error handler with modal display

## Integration

### 1. Layout Integration

The `ErrorProvider` is added to `app/_layout.tsx`:

```typescript
import { ErrorProvider } from '@/contexts/ErrorContext';

export default function RootLayout() {
  return (
    <ErrorProvider>
      <ThemeProvider>
        {/* Your app content */}
      </ThemeProvider>
    </ErrorProvider>
  );
}
```

### 2. Hook Integration

All API hooks have been updated to use the new error handling:

```typescript
import { useError } from '@/contexts/ErrorContext';
import { createErrorHandler } from '@/utils/errorHandler';

export function useMyApi() {
    const { showError } = useError();
    const handleError = createErrorHandler(showError);
    
    const myApiCall = async () => {
        try {
            // API call
        } catch (error) {
            handleError(error, { 
                title: 'Custom Title',
                showRetry: true 
            });
            throw error;
        }
    };
}
```

## Usage Examples

### 1. Manual Error Display

```typescript
import { useError } from '@/contexts/ErrorContext';

function MyComponent() {
    const { showError } = useError();
    
    const handleError = () => {
        showError('Something went wrong!', {
            title: 'Error',
            showRetry: true,
            onRetry: () => {
                console.log('Retry pressed');
            }
        });
    };
}
```

### 2. Automatic API Error Handling

```typescript
import { useTransfer } from '@/hooks/use-transfer';

function TransferComponent() {
    const { transferToAccount, loading } = useTransfer();
    
    const handleTransfer = async () => {
        try {
            await transferToAccount(transferData);
            // Success - no error modal shown
        } catch (error) {
            // Error modal already shown by hook
            // For 401 errors (except invalid PIN): automatically redirects to signin
            console.log('Transfer failed');
        }
    };
}
```

### 3. Automatic Navigation for Session Expired

The error handler now automatically handles navigation for session expired errors:
- **401 errors (except "invalid pin")**: Automatically redirects to `/signin`
- **Clears stored data**: Removes JWT, refresh_token, and user data
- **No manual intervention needed**: Users are seamlessly redirected

```typescript
// No additional code needed - this happens automatically
// When API returns 401 (not invalid PIN):
// 1. Shows "Sesi Anda telah berakhir. Silakan login kembali." modal
// 2. User clicks "OK" to close modal
// 3. Clears AsyncStorage (jwt, refresh_token, user)
// 4. Redirects to /signin screen
```

### 4. Custom Error Processing

```typescript
import { processApiError } from '@/utils/errorHandler';

const handleApiCall = async () => {
    try {
        const response = await api.post('/endpoint');
        return response.data;
    } catch (error) {
        const processedError = processApiError(error);
        
        if (processedError.isSessionExpired) {
            // Handle session expiry
            router.replace('/signin');
        } else if (processedError.isNetworkError) {
            // Handle network error
            showError(processedError.message, { showRetry: true });
        }
    }
};
```

## API Error Response Structure

Your API returns errors in the following format:
```json
{
  "error": {
    "responseCode": "4001600",
    "responseMessage": "Bad Request. Beneficiary Account not found"
  },
  "message": "Request failed",
  "success": false
}
```

## Simplified Error Handling

The error handling system now uses a simple approach based on HTTP status codes and your official error message list:

### HTTP Status Code Handling

| **HTTP Code** | **Behavior** | **User-Friendly Message** |
|---------------|--------------|---------------------------|
| 200 | Success | "Transaksi berhasil dilakukan." |
| 401 | Session Expired | "Sesi Anda telah berakhir. Silakan login kembali." |
| Others | Show Error Message | Converted from your error message list |

### Error Message Pattern Matching

The system uses `includes()` method to handle dynamic messages with field names:

| **Pattern Contains** | **User-Friendly Message** |
|---------------------|---------------------------|
| "successful" or "success" | "Transaksi berhasil dilakukan." |
| "invalid field format" | "Format data tidak valid. Periksa kembali input Anda." |
| "invalid mandatory field" | "Data wajib tidak lengkap. Lengkapi semua field yang diperlukan." |
| "unauthorized client" or "unauthoried" | "Akses ditolak. Silakan login kembali." |
| "invalid card/account/customer" or "virtual account" | "Data tidak ditemukan. Periksa kembali informasi yang dimasukkan." |
| "conflict" | "Terjadi konflik data. Silakan coba lagi." |
| "general error" | "Terjadi kesalahan pada server. Silakan coba lagi nanti." |
| "timeout" | "Koneksi timeout. Silakan coba lagi." |
| "request in progress" | "Permintaan sedang diproses. Silakan tunggu sebentar." |
| "exceeds transaction amount limit" | "Jumlah transaksi melebihi batas yang diizinkan." |
| "dormant account" | "Rekening dalam status tidak aktif. Hubungi bank untuk aktivasi." |
| "insufficient funds" | "Saldo tidak mencukupi untuk melakukan transaksi ini." |
| "transaction not permitted" | "Transaksi tidak diizinkan. Silakan hubungi bank untuk informasi lebih lanjut." |
| "suspend transaction" | "Transaksi ditangguhkan. Silakan hubungi bank untuk informasi lebih lanjut." |
| "inactive card/account/customer" | "Akun tidak aktif. Silakan hubungi bank untuk aktivasi." |
| "invalid amount" | "Jumlah tidak valid. Periksa kembali nominal yang dimasukkan." |
| "duplicate partnerreferenceno" | "Nomor referensi sudah digunakan. Gunakan nomor referensi yang berbeda." |
| "internal server error" | "Terjadi kesalahan pada server. Silakan coba lagi nanti." |
| "bad request" | "Permintaan tidak valid. Periksa kembali data yang dikirim." |
| "invalid bill/virtual account" | "Nomor tagihan atau virtual account tidak valid." |
| "paid bill" | "Tagihan sudah dibayar." |
| "expired bill" | "Tagihan sudah kedaluwarsa." |
| "transaction not found" | "Transaksi tidak ditemukan." |
| "invalid customer token" | "Token pelanggan tidak valid. Silakan login kembali." |

### Special 401 Handling

For HTTP 401 responses, the system checks for "invalid pin" in the error message:
- **Contains "invalid pin"**: Shows "PIN yang dimasukkan salah. Silakan coba lagi."
- **Other 401 errors**: 
  - Shows "Sesi Anda telah berakhir. Silakan login kembali." modal
  - **When user closes modal**: Automatically redirects to signin screen
  - **When user closes modal**: Clears stored JWT, refresh_token, and user data

### Legacy Message Conversion Examples

| **Technical API Message** | **User-Friendly Message** |
|---------------------------|---------------------------|
| "Bad Request. Beneficiary Account not found" | "Nomor rekening tidak ditemukan. Periksa kembali nomor rekening Anda." |
| "Invalid amount format" | "Jumlah transaksi tidak valid. Periksa kembali nominal yang dimasukkan." |
| "Insufficient balance for transaction" | "Saldo tidak mencukupi untuk melakukan transaksi ini." |
| "Invalid credentials" | "Email atau password salah. Periksa kembali kredensial Anda." |
| "Session expired" | "Sesi Anda telah berakhir. Silakan login kembali." |
| "Account inactive" | "Akun tidak aktif. Hubungi bank untuk aktivasi." |
| "Transfer limit exceeded" | "Transaksi melebihi batas harian yang diizinkan." |
| "PIN blocked" | "PIN telah diblokir. Hubungi bank untuk reset PIN." |

## Error Types and Messages

### Network Errors
- **No Response**: "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi."
- **Timeout**: "Koneksi timeout. Silakan coba lagi."
- **Service Unavailable**: "Layanan sedang tidak tersedia. Silakan coba lagi nanti."

### Authentication Errors
- **401 - Session Expired**: "Sesi Anda telah berakhir. Silakan login kembali."
- **401 - Invalid PIN**: "PIN yang Anda masukkan salah. Silakan coba lagi."
- **Invalid Credentials**: "Email atau password salah. Periksa kembali kredensial Anda."
- **Unauthorized**: "Akses ditolak. Silakan login kembali."

### Validation Errors (400)
- **Error Code 4001600 / Beneficiary Account Not Found**: "Nomor rekening tidak ditemukan. Periksa kembali nomor rekening Anda."
- **Invalid Account**: "Nomor rekening tidak valid. Periksa kembali nomor rekening Anda."
- **Invalid Format**: "Format data tidak valid. Periksa kembali input Anda."
- **Invalid Amount**: "Jumlah transaksi tidak valid. Periksa kembali nominal yang dimasukkan."
- **Insufficient Balance**: "Saldo tidak mencukupi untuk melakukan transaksi ini."
- **Limit Exceeded**: "Transaksi melebihi batas harian yang diizinkan."
- **Required Field**: "Data wajib tidak lengkap. Lengkapi semua field yang diperlukan."

### Account Status Errors
- **Account Inactive**: "Akun tidak aktif. Hubungi bank untuk aktivasi."
- **Account Blocked**: "Akun diblokir. Hubungi bank untuk bantuan."
- **PIN Blocked**: "PIN telah diblokir. Hubungi bank untuk reset PIN."

### Virtual Account Errors
- **Virtual Account Not Found**: "Nomor virtual account tidak ditemukan. Periksa kembali nomor VA Anda."
- **Virtual Account Expired**: "Virtual account telah kedaluwarsa."

### Permission Errors (403)
- **Access Denied**: "Anda tidak memiliki izin untuk melakukan aksi ini."

### Not Found Errors (404)
- **Data Not Found**: "Data yang diminta tidak ditemukan."

### Server Errors (500+)
- **Server Error**: "Terjadi kesalahan pada server. Silakan coba lagi nanti."
- **Internal Server Error**: "Terjadi kesalahan pada server. Silakan coba lagi nanti."

### Transaction Errors
- **Transaction Failed**: "Transaksi gagal. Silakan coba lagi."
- **Duplicate Transaction**: "Transaksi duplikat terdeteksi. Periksa riwayat transaksi Anda."

## Updated Hooks

The following hooks have been updated with the new error handling:

1. **use-signin.ts** - Login error handling
2. **use-transfer.ts** - Transfer and transaction listing errors
3. **use-mutasi-rekening.ts** - Account statement errors
4. **use-virtual-account-inquiry.ts** - Virtual account validation errors
5. **use-virtual-account-transfer.ts** - Virtual account transfer errors
6. **use-inquiry.ts** - Bank account inquiry errors
7. **use-verify-pin.ts** - PIN verification errors

## Benefits

1. **Consistency**: All errors use the same modal design and behavior
2. **User Experience**: Clear, actionable error messages in Indonesian
3. **Developer Experience**: Simple API for error handling
4. **Maintainability**: Centralized error processing logic
5. **Retry Functionality**: Automatic retry options where appropriate
6. **Accessibility**: Proper error messaging for screen readers

## Migration Notes

### For Existing Components

1. Remove custom error modals and use `useError()` hook instead
2. Update error handling in API calls to use the new system
3. Remove duplicate error styling and use the centralized modal

### For New Components

1. Always use `useError()` hook for error display
2. Let API hooks handle their own errors automatically
3. Use `processApiError()` for custom error processing

## Best Practices

1. **Don't show multiple error modals** - The system handles this automatically
2. **Use descriptive error messages** - Help users understand what went wrong
3. **Provide retry options** - For recoverable errors
4. **Handle session expiry** - Redirect to login when appropriate
5. **Log errors for debugging** - Keep console.error() for development

## Testing

Test the error handling system with:
1. Network disconnection scenarios
2. Invalid API responses
3. Authentication failures
4. Validation errors
5. Server errors

Use the `ErrorHandlingExample` component to test different error scenarios during development.
