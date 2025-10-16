import { useError } from '@/contexts/ErrorContext';
import { processApiError } from '@/utils/errorHandler';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Example component demonstrating how the error handling works with your API response structure
 */
export default function ErrorResponseExample() {
    const { showError } = useError();

    // Simulate your API error response
    // Official API Error Codes Examples
    const simulateInvalidFormatError = () => {
        const mockError = {
            response: {
                status: 400,
                data: {
                    error: {
                        responseCode: "1101",
                        responseMessage: "Invalid Field Format {fieldName}"
                    },
                    message: "Request failed",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateMissingFieldError = () => {
        const mockError = {
            response: {
                status: 400,
                data: {
                    error: {
                        responseCode: "1102",
                        responseMessage: "Invalid Mandatory Field {fieldName}"
                    },
                    message: "Request failed",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateUnauthorizedError = () => {
        const mockError = {
            response: {
                status: 401,
                data: {
                    error: {
                        responseCode: "1100",
                        responseMessage: "Unauthorized Client"
                    },
                    message: "Unauthorized",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateNotFoundError = () => {
        const mockError = {
            response: {
                status: 404,
                data: {
                    error: {
                        responseCode: "1111",
                        responseMessage: "Invalid Card/Account/Customer[info]/VirtualAccount"
                    },
                    message: "Not Found",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateConflictError = () => {
        const mockError = {
            response: {
                status: 409,
                data: {
                    error: {
                        responseCode: "1100",
                        responseMessage: "Conflict"
                    },
                    message: "Conflict",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateServerError = () => {
        const mockError = {
            response: {
                status: 500,
                data: {
                    error: {
                        responseCode: "1100",
                        responseMessage: "General Error"
                    },
                    message: "Internal Server Error",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateTimeoutError = () => {
        const mockError = {
            response: {
                status: 504,
                data: {
                    error: {
                        responseCode: "1100",
                        responseMessage: "Timeout"
                    },
                    message: "Gateway Timeout",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateInvalidCredentialsError = () => {
        const mockError = {
            response: {
                status: 400,
                data: {
                    error: "invalid credentials",
                    message: "Request failed",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateSessionExpiredError = () => {
        const mockError = {
            response: {
                status: 401,
                data: {
                    error: {
                        responseCode: "4010001",
                        responseMessage: "Session expired"
                    },
                    message: "Unauthorized",
                    success: false
                }
            }
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    const simulateNetworkError = () => {
        const mockError = {
            response: null, // No response = network error
            message: "Network Error"
        };

        const processedError = processApiError(mockError);
        showError(processedError.message, {
            title: processedError.title,
            showRetry: processedError.showRetry,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>API Error Response Examples</Text>
            <Text style={styles.subtitle}>Testing with your API error structure</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateInvalidFormatError}
            >
                <Text style={styles.buttonText}>HTTP 400 - Invalid Format</Text>
                <Text style={styles.buttonSubtext}>"Invalid Field Format fieldName" → "Format data tidak valid..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateMissingFieldError}
            >
                <Text style={styles.buttonText}>HTTP 400 - Missing Field</Text>
                <Text style={styles.buttonSubtext}>"Invalid Mandatory Field fieldName" → "Data wajib tidak lengkap..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateUnauthorizedError}
            >
                <Text style={styles.buttonText}>HTTP 401 - Session Expired</Text>
                <Text style={styles.buttonSubtext}>Always shows: "Sesi Anda telah berakhir..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateNotFoundError}
            >
                <Text style={styles.buttonText}>HTTP 404 - Data Not Found</Text>
                <Text style={styles.buttonSubtext}>"Invalid Card/Account/Customer[info]/VirtualAccount" → "Data tidak ditemukan..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateConflictError}
            >
                <Text style={styles.buttonText}>HTTP 409 - Conflict</Text>
                <Text style={styles.buttonSubtext}>"Conflict" → "Terjadi konflik data..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateServerError}
            >
                <Text style={styles.buttonText}>HTTP 500 - Server Error</Text>
                <Text style={styles.buttonSubtext}>"General Error" → "Terjadi kesalahan pada server..."</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={simulateTimeoutError}
            >
                <Text style={styles.buttonText}>HTTP 504 - Timeout</Text>
                <Text style={styles.buttonSubtext}>"Timeout" → "Koneksi timeout..."</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Your API Error Structure:</Text>
                <Text style={styles.infoText}>
                    {`{
  "error": {
    "responseCode": "4001600",
    "responseMessage": "Bad Request. Beneficiary Account not found"
  },
  "message": "Request failed",
  "success": false
}`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    button: {
        backgroundColor: '#178AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    buttonSubtext: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
        opacity: 0.8,
    },
    infoBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
});
