# 🔄 State Management Migration Guide

This guide helps you migrate from the old state management patterns to the new optimized system.

## 📋 Migration Overview

### **Before (Old Pattern)**
```typescript
// Scattered state across multiple hooks
const { account, fetchAccountBalance, loading } = useAccount();
const { transactions, fetchTransactions } = useTransactions();
const { savedAccounts, fetchSavedAccounts } = useSavedAccounts();
const { user, signIn, signOut } = useSignIn();
```

### **After (New Pattern)**
```typescript
// Centralized state management
const { user, isAuthenticated, signIn, signOut } = useAppAuth();
const { account, fetchAccountBalance, refreshAccount } = useAppAccount();
const { transactions, fetchTransactions, addTransaction } = useAppTransactions();
const { savedAccounts, fetchSavedAccounts, addSavedAccount } = useAppSavedAccounts();
```

## 🚀 Key Improvements

### **1. Centralized State**
- ✅ Single source of truth for all app state
- ✅ Consistent state across components
- ✅ Automatic state synchronization

### **2. Intelligent Caching**
- ✅ Automatic data caching with TTL
- ✅ Persistent storage for offline access
- ✅ Smart cache invalidation

### **3. Optimistic Updates**
- ✅ Immediate UI updates
- ✅ Background data synchronization
- ✅ Rollback on errors

### **4. Performance Optimization**
- ✅ Reduced re-renders
- ✅ Debounced API calls
- ✅ Memoized selectors

## 📝 Step-by-Step Migration

### **Step 1: Update App Layout**

```typescript
// app/_layout.tsx
import { AppStateProvider } from '@/contexts/AppStateContext';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <ErrorProvider>
        {/* Your existing providers */}
      </ErrorProvider>
    </AppStateProvider>
  );
}
```

### **Step 2: Replace Old Hooks**

#### **Authentication**
```typescript
// OLD
import { useSignIn } from '@/hooks/use-signin';
const { signIn, loading, error } = useSignIn();

// NEW
import { useAppAuth } from '@/hooks/useAppAuth';
const { signIn, loading, error, user, isAuthenticated } = useAppAuth();
```

#### **Account Management**
```typescript
// OLD
import { useAccount } from '@/hooks/use-account';
const { account, fetchAccountBalance, loading } = useAccount();

// NEW
import { useAppAccount } from '@/hooks/useAppAccount';
const { 
  account, 
  fetchAccountBalance, 
  refreshAccount, 
  updateBalance,
  loading 
} = useAppAccount();
```

#### **Transactions**
```typescript
// OLD
import { useTransfer } from '@/hooks/use-transfer';
const { transferToAccount, loading } = useTransfer();

// NEW
import { useAppTransactions } from '@/hooks/useAppTransactions';
const { 
  transactions, 
  recentTransactions, 
  fetchTransactions, 
  addTransaction,
  loading 
} = useAppTransactions();
```

#### **Saved Accounts**
```typescript
// OLD
import { useSavedAccounts } from '@/hooks/use-saved-accounts';
const { accounts, fetchAccounts, loading } = useSavedAccounts();

// NEW
import { useAppSavedAccounts } from '@/hooks/useAppSavedAccounts';
const { 
  savedAccounts, 
  fetchSavedAccounts, 
  addSavedAccount,
  removeSavedAccount,
  loading 
} = useAppSavedAccounts();
```

### **Step 3: Update Component Logic**

#### **Data Fetching**
```typescript
// OLD - Manual data fetching
useEffect(() => {
  fetchAccountBalance('2000100101');
  fetchTransactions();
  fetchSavedAccounts();
}, []);

// NEW - Automatic data management
useEffect(() => {
  if (isAuthenticated) {
    // Data is automatically fetched and cached
    // No manual calls needed
  }
}, [isAuthenticated]);
```

#### **Optimistic Updates**
```typescript
// OLD - Wait for API response
const handleTransfer = async (amount, account) => {
  setLoading(true);
  const result = await transferToAccount({ amount, account });
  setLoading(false);
  // UI updates after API response
};

// NEW - Immediate UI updates
const handleTransfer = async (amount, account) => {
  // Optimistic update
  const optimisticTransaction = {
    id: Date.now().toString(),
    amount,
    account: account.account_number,
    type: 'debit',
    description: `Transfer to ${account.account_name}`,
    date: new Date().toISOString(),
  };
  
  addTransaction(optimisticTransaction);
  updateBalance(account.balance - amount);
  
  // Background API call
  try {
    await transferToAccount({ amount, account });
  } catch (error) {
    // Rollback on error
    removeTransaction(optimisticTransaction.id);
    updateBalance(account.balance + amount);
  }
};
```

### **Step 4: Performance Optimization**

#### **Debounced API Calls**
```typescript
import { useDebounce } from '@/utils/DataFlowOptimizer';

const debouncedSearch = useDebounce((query: string) => {
  searchAccounts(query);
}, 500);
```

#### **Memoized Selectors**
```typescript
import { useMemoizedSelector } from '@/utils/DataFlowOptimizer';

const expensiveComputation = useMemoizedSelector(
  (state) => {
    // Complex computation
    return state.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  },
  state,
  [state.transactions]
);
```

## 🔧 Advanced Features

### **Cache Management**
```typescript
// Clear specific cache
const { clearAccountCache } = useAppAccount();
await clearAccountCache();

// Clear all cache
import { dataCache } from '@/utils/DataCache';
await dataCache.clear();
```

### **Performance Monitoring**
```typescript
import { usePerformanceMonitor } from '@/utils/DataFlowOptimizer';

const { renderCount } = usePerformanceMonitor('MyComponent');
console.log(`Component rendered ${renderCount} times`);
```

### **Batch Updates**
```typescript
import { useBatchedUpdates } from '@/utils/DataFlowOptimizer';

const batch = useBatchedUpdates();

const handleMultipleUpdates = () => {
  batch(() => {
    dispatch(action1());
    dispatch(action2());
    dispatch(action3());
  });
  // Only one re-render instead of three
};
```

## 📊 Performance Benefits

### **Before Migration**
- ❌ Multiple API calls on component mount
- ❌ No caching - data refetched every time
- ❌ Scattered state management
- ❌ No optimistic updates
- ❌ Unnecessary re-renders

### **After Migration**
- ✅ Intelligent caching with TTL
- ✅ Optimistic updates for better UX
- ✅ Centralized state management
- ✅ Reduced API calls
- ✅ Optimized re-renders
- ✅ Offline data persistence

## 🚨 Breaking Changes

### **Hook Names Changed**
- `useAccount` → `useAppAccount`
- `useTransfer` → `useAppTransactions`
- `useSavedAccounts` → `useAppSavedAccounts`
- `useSignIn` → `useAppAuth`

### **State Structure Changed**
- State is now centralized in `AppStateContext`
- Loading states are grouped by feature
- Error states are more granular

### **API Changes**
- Some hook methods have been renamed
- New methods added for better functionality
- Cache management methods added

## 🎯 Migration Checklist

- [ ] Add `AppStateProvider` to app layout
- [ ] Replace old hooks with new optimized hooks
- [ ] Update component logic to use new state management
- [ ] Add performance optimizations where needed
- [ ] Test optimistic updates
- [ ] Verify caching behavior
- [ ] Remove old hook imports
- [ ] Update error handling
- [ ] Test offline functionality

## 📚 Examples

See `examples/MigratedHomeScreen.tsx` for a complete example of a migrated component.

## 🔍 Troubleshooting

### **State Not Updating**
- Ensure component is wrapped in `AppStateProvider`
- Check if you're using the correct hook
- Verify action dispatching

### **Cache Issues**
- Clear cache if data seems stale
- Check TTL settings
- Verify cache keys

### **Performance Issues**
- Use performance monitoring
- Check for unnecessary re-renders
- Optimize with debouncing/throttling
