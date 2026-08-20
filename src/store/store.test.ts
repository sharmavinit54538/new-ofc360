import { describe, it, expect } from 'vitest';
import { store } from './index';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { getInventoryAuditReport } from './api/apiRegistry';

describe('Redux Central Store & RTK Query Architecture', () => {
  it('should initialize store with expected slices and baseApi reducer', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ui');
    expect(state).toHaveProperty('notification');
    expect(state).toHaveProperty('permission');
    expect(state).toHaveProperty('api');
  });

  it('should handle auth credentials dispatch', () => {
    const mockUser = {
      id: 'usr-1',
      name: 'Admin User',
      email: 'admin@ofc360.com',
      fullName: 'Admin User',
      role: 'Admin',
    };
    store.dispatch(setCredentials({ user: mockUser, token: 'mock-token-123' }));

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user?.email).toBe('admin@ofc360.com');
    expect(state.auth.token).toBe('mock-token-123');

    store.dispatch(logout());
    const clearedState = store.getState();
    expect(clearedState.auth.isAuthenticated).toBe(false);
    expect(clearedState.auth.user).toBeNull();
  });

  it('should return 100% complete endpoint audit report', () => {
    const report = getInventoryAuditReport();
    expect(report.totalBackendEndpoints).toBe(336);
    expect(report.integratedEndpoints).toBe(336);
    expect(report.notIntegratedEndpoints).toBe(0);
  });
});