// *********************
// Role of the file: Roles API service with backend role endpoints
// Name of the file: rolesApi.ts
// Developer: Auto
// Version: 1.0
// *********************

// API Base URL - Update this with your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface Role {
  id: string;
  name: string;
  [key: string]: any; // Allow for additional properties
}

export interface GetRolesRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface RolesResponse {
  status: boolean;
  message: string;
  data?: Role[];
}

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Fetch all roles from the backend
 * @param params - Optional search, page, and limit parameters
 * @returns Promise with roles response
 */
export const getRolesApi = async (params?: GetRolesRequest): Promise<RolesResponse> => {
  try {
    const authToken = getAuthToken();
    
    // Build request body
    const requestBody = {
      search: params?.search || "",
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    
    // Use POST method since browsers don't support GET with body
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    
    // Handle different response structures
    let rolesData: Role[] = [];
    if (Array.isArray(data)) {
      rolesData = data;
    } else if (data.data && Array.isArray(data.data)) {
      rolesData = data.data;
    } else if (data.roles && Array.isArray(data.roles)) {
      rolesData = data.roles;
    }
    
    return {
      status: true,
      message: data.message || "Roles fetched successfully",
      data: rolesData,
    };
  } catch (error) {
    console.error("Get roles API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while fetching roles. Please try again.",
    };
  }
};
