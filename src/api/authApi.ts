// *********************
// Role of the file: Authentication API service with backend login endpoint
// Name of the file: authApi.ts
// Developer: Auto-generated
// Version: 2.0
// *********************

// API Base URL - Update this with your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      email: string;
      fullName: string;
      role: string | null;
    };
  };
}

/**
 * Login API that makes a request to the backend authentication endpoint
 * @param credentials - Email and password for login
 * @returns Promise with login response
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Validate input
  if (!credentials.email || !credentials.password) {
    return {
      status: false,
      message: "Email and password are required",
    };
  }

  try {
    // Make API request to backend login endpoint
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    // Check if response is ok before parsing
    if (!response.ok && response.status === 0) {
      // Status 0 usually indicates a CORS error
      return {
        status: false,
        message: "CORS Error: The server is blocking requests from this origin. Please enable CORS on your backend server.",
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, it might be a CORS or network issue
      return {
        status: false,
        message: "CORS Error: Unable to parse response. Please check your backend CORS configuration.",
      };
    }

    // Handle successful response
    if (response.ok && data.status) {
      return {
        status: true,
        message: data.message || "Login successful",
        data: data.data,
      };
    }

    // Handle error response
    return {
      status: false,
      message: data.message || data.error || "Invalid email or password. Please try again.",
    };
  } catch (error) {
    console.error("Login API error:", error);
    
    // Handle CORS errors specifically
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : "Unknown";
    
    if (errorMessage === "Failed to fetch" || errorName === "TypeError") {
      // Check if it's a CORS error
      const isCorsError = errorMessage.includes("CORS") || 
                         errorMessage.includes("cross-origin") ||
                         errorMessage.includes("strict-origin-when-cross-origin") ||
                         !errorMessage; // Network errors often have empty messages
      
      if (isCorsError) {
        return {
          status: false,
          message: "CORS Error: The server is not allowing requests from this origin. Please check your backend CORS configuration.",
        };
      }
      
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred during login. Please try again.",
    };
  }
};

