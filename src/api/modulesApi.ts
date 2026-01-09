// *********************
// Role of the file: Modules API service with backend module endpoints
// Name of the file: modulesApi.ts
// Developer: Auto
// Version: 1.0
// *********************

// API Base URL - Update this with your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Import auth utilities
import { checkUnauthorized } from "../utils/authUtils";

export interface Module {
  id: string;
  name: string;
  roleIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModuleRequest {
  name: string;
  roleIds: string[];
}

export interface GetModulesRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ModulesResponse {
  status: boolean;
  message: string;
  data?: Module[];
}

export interface CreateModuleResponse {
  status: boolean;
  message: string;
  data?: Module;
}

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Fetch all modules from the backend
 * @param params - Optional search, page, and limit parameters
 * @returns Promise with modules response
 */
export const getModulesApi = async (params?: GetModulesRequest): Promise<ModulesResponse> => {
  try {
    const authToken = getAuthToken();
    
    // Build request body
    const requestBody = {
      search: params?.search || "",
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    
    // Use POST method since browsers don't support GET with body
    // The backend curl shows GET with --data, but browsers require POST for requests with body
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(requestBody),
    });

    // Check for unauthorized response
    if (checkUnauthorized(response)) {
      return {
        status: false,
        message: "Unauthorized. Please login again.",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    
    // Handle different response structures
    let modulesData: Module[] = [];
    if (Array.isArray(data)) {
      modulesData = data;
    } else if (data.data && Array.isArray(data.data)) {
      modulesData = data.data;
    } else if (data.modules && Array.isArray(data.modules)) {
      modulesData = data.modules;
    }
    
    return {
      status: true,
      message: data.message || "Modules fetched successfully",
      data: modulesData,
    };
  } catch (error) {
    console.error("Get modules API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while fetching modules. Please try again.",
    };
  }
};

/**
 * Create a new module
 * @param moduleData - Module data (name and roleIds)
 * @returns Promise with create module response
 */
export const createModuleApi = async (moduleData: CreateModuleRequest): Promise<CreateModuleResponse> => {
  // Validate input
  if (!moduleData.name || moduleData.name.trim() === "") {
    return {
      status: false,
      message: "Module name is required",
    };
  }

  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/modules/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        name: moduleData.name,
        roleIds: moduleData.roleIds || [],
      }),
    });

    // Check for unauthorized response
    if (checkUnauthorized(response)) {
      return {
        status: false,
        message: "Unauthorized. Please login again.",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      status: true,
      message: data.message || "Module created successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Create module API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while creating the module. Please try again.",
    };
  }
};
