/**
 * Security audit utilities for checking security compliance
 */

import { SECURITY_CONFIG, SECURITY_CONSTANTS } from '@/config/security';
import { SecureStorage } from './secureStorage';

export interface SecurityAuditResult {
    score: number;
    issues: SecurityIssue[];
    recommendations: string[];
}

export interface SecurityIssue {
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    recommendation: string;
}

/**
 * Perform comprehensive security audit
 */
export async function performSecurityAudit(): Promise<SecurityAuditResult> {
    const issues: SecurityIssue[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check environment configuration
    const envIssues = await checkEnvironmentSecurity();
    issues.push(...envIssues);
    score -= envIssues.length * 10;

    // Check storage security
    const storageIssues = await checkStorageSecurity();
    issues.push(...storageIssues);
    score -= storageIssues.length * 15;

    // Check authentication security
    const authIssues = await checkAuthenticationSecurity();
    issues.push(...authIssues);
    score -= authIssues.length * 20;

    // Check API security
    const apiIssues = await checkApiSecurity();
    issues.push(...apiIssues);
    score -= apiIssues.length * 15;

    // Generate recommendations
    if (issues.length > 0) {
        recommendations.push('Review and fix all security issues identified in the audit');
    }

    if (score < 80) {
        recommendations.push('Consider implementing additional security measures');
    }

    return {
        score: Math.max(0, score),
        issues,
        recommendations
    };
}

/**
 * Check environment configuration security
 */
async function checkEnvironmentSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check if using default API URL
    if (SECURITY_CONFIG.API_BASE_URL.includes('ngrok') || SECURITY_CONFIG.API_BASE_URL.includes('localhost')) {
        issues.push({
            severity: 'high',
            category: 'Environment',
            description: 'Using development API URL in production',
            recommendation: 'Use production API URL with proper SSL certificate'
        });
    }

    // Check if using default device ID
    if (SECURITY_CONFIG.DEVICE_ID === 'secure-device-id') {
        issues.push({
            severity: 'medium',
            category: 'Environment',
            description: 'Using default device ID',
            recommendation: 'Generate unique device ID for each installation'
        });
    }

    // Check if using default bank card token
    if (SECURITY_CONFIG.BANK_CARD_TOKEN === 'secure-bank-card-token') {
        issues.push({
            severity: 'high',
            category: 'Environment',
            description: 'Using default bank card token',
            recommendation: 'Use proper bank card token from secure configuration'
        });
    }

    return issues;
}

/**
 * Check storage security
 */
async function checkStorageSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    try {
        // Check if sensitive data is stored securely
        const jwt = await SecureStorage.getJWT();
        const refreshToken = await SecureStorage.getRefreshToken();

        if (jwt && jwt.length < 10) {
            issues.push({
                severity: 'medium',
                category: 'Storage',
                description: 'JWT token appears to be invalid or too short',
                recommendation: 'Ensure JWT tokens are properly generated and stored'
            });
        }

        if (refreshToken && refreshToken.length < 10) {
            issues.push({
                severity: 'medium',
                category: 'Storage',
                description: 'Refresh token appears to be invalid or too short',
                recommendation: 'Ensure refresh tokens are properly generated and stored'
            });
        }

    } catch (error) {
        issues.push({
            severity: 'high',
            category: 'Storage',
            description: 'Error accessing secure storage',
            recommendation: 'Check secure storage configuration and permissions'
        });
    }

    return issues;
}

/**
 * Check authentication security
 */
async function checkAuthenticationSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    try {
        const isAuthenticated = await SecureStorage.isAuthenticated();

        if (!isAuthenticated) {
            issues.push({
                severity: 'low',
                category: 'Authentication',
                description: 'User is not authenticated',
                recommendation: 'This is normal for unauthenticated users'
            });
        }

        // Check session timeout
        const sessionTimeout = SECURITY_CONSTANTS.SESSION_TIMEOUT;
        if (sessionTimeout < 15 * 60 * 1000) { // Less than 15 minutes
            issues.push({
                severity: 'medium',
                category: 'Authentication',
                description: 'Session timeout is too short',
                recommendation: 'Consider increasing session timeout for better user experience'
            });
        }

    } catch (error) {
        issues.push({
            severity: 'high',
            category: 'Authentication',
            description: 'Error checking authentication status',
            recommendation: 'Fix authentication system'
        });
    }

    return issues;
}

/**
 * Check API security
 */
async function checkApiSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check API timeout
    if (SECURITY_CONFIG.API_TIMEOUT < 5000) {
        issues.push({
            severity: 'medium',
            category: 'API',
            description: 'API timeout is too short',
            recommendation: 'Increase API timeout to prevent premature timeouts'
        });
    }

    // Check if SSL pinning is enabled
    if (!SECURITY_CONFIG.ENABLE_SSL_PINNING) {
        issues.push({
            severity: 'high',
            category: 'API',
            description: 'SSL pinning is disabled',
            recommendation: 'Enable SSL pinning to prevent man-in-the-middle attacks'
        });
    }

    // Check if certificate validation is enabled
    if (!SECURITY_CONFIG.ENABLE_CERTIFICATE_VALIDATION) {
        issues.push({
            severity: 'high',
            category: 'API',
            description: 'Certificate validation is disabled',
            recommendation: 'Enable certificate validation for secure connections'
        });
    }

    return issues;
}

/**
 * Get security score color
 */
export function getSecurityScoreColor(score: number): string {
    if (score >= 90) return '#4CAF50'; // Green
    if (score >= 70) return '#FF9800'; // Orange
    if (score >= 50) return '#FF5722'; // Red
    return '#D32F2F'; // Dark red
}

/**
 * Get security score label
 */
export function getSecurityScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
}
