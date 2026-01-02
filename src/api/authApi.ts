// *********************
// Role of the file: Authentication API service with dummy login endpoint
// Name of the file: authApi.ts
// Developer: Auto-generated
// Version: 1.0
// *********************

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Dummy login API that simulates an authentication request
 * @param credentials - Email and password for login
 * @returns Promise with login response
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Valid credentials
  const validEmail = "johndoe@gmail.com";
  const validPassword = "Test@123";

  // Validate credentials
  if (!credentials.email || !credentials.password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  // Check if credentials match
  if (credentials.email === validEmail && credentials.password === validPassword) {
    return {
      success: true,
      message: "Login successful",
      token: "dummy-jwt-token-" + Date.now(),
      user: {
        id: "1",
        email: credentials.email,
        name: "John Doe",
      },
    };
  }

  // Return error for invalid credentials
  return {
    success: false,
    message: "Invalid email or password. Please try again.",
  };
};

