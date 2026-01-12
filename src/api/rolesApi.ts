// *********************
// Role of the file: Roles API service with backend role endpoints
// Name of the file: rolesApi.ts
// Developer: Auto
// Version: 1.0
// *********************

// API Base URL - Update this with your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Import auth utilities
import { checkUnauthorized } from "../utils/authUtils";

export interface Role {
  id: string;
  name: string;
  roleModules?: Array<{ module: { id: string; name: string } }>; // Nested structure: roleModules.module.name
  modules?: Array<{ id: string; name: string }> | string[]; // Alternative structure: direct modules array
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

export interface CreateRoleRequest {
  name: string;
  moduleIds: number[];
}

export interface CreateRoleResponse {
  status: boolean;
  message: string;
  data?: Role;
}

export interface GetRoleResponse {
  status: boolean;
  message: string;
  data?: Role;
}

export interface UpdateRoleRequest {
  name: string;
  moduleIds: number[];
}

export interface UpdateRoleResponse {
  status: boolean;
  message: string;
  data?: Role;
}

export interface DeleteRoleResponse {
  status: boolean;
  message: string;
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

/**
 * Create a new role
 * @param roleData - Role data (name and moduleIds)
 * @returns Promise with create role response
 */
export const createRoleApi = async (roleData: CreateRoleRequest): Promise<CreateRoleResponse> => {
  // Validate input
  if (!roleData.name || roleData.name.trim() === "") {
    return {
      status: false,
      message: "Role name is required",
    };
  }

  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/roles/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        name: roleData.name,
        moduleIds: roleData.moduleIds || [],
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
      message: data.message || "Role created successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Create role API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while creating the role. Please try again.",
    };
  }
};

/**
 * Get role details by ID
 * @param roleId - Role ID
 * @returns Promise with role response
 */
export const getRoleApi = async (roleId: string): Promise<GetRoleResponse> => {
  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
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
      message: data.message || "Role fetched successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Get role API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while fetching the role. Please try again.",
    };
  }
};

/**
 * Update a role
 * @param roleId - Role ID
 * @param roleData - Role data (name and moduleIds)
 * @returns Promise with update role response
 */
export const updateRoleApi = async (roleId: string, roleData: UpdateRoleRequest): Promise<UpdateRoleResponse> => {
  // Validate input
  if (!roleData.name || roleData.name.trim() === "") {
    return {
      status: false,
      message: "Role name is required",
    };
  }

  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/roles/update/${roleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        name: roleData.name,
        moduleIds: roleData.moduleIds || [],
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
      message: data.message || "Role updated successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Update role API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while updating the role. Please try again.",
    };
  }
};

/**
 * Delete a role
 * @param roleId - Role ID
 * @returns Promise with delete role response
 */
export const deleteRoleApi = async (roleId: string): Promise<DeleteRoleResponse> => {
  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/roles/delete/${roleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
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
      message: data.message || "Role deleted successfully",
    };
  } catch (error) {
    console.error("Delete role API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while deleting the role. Please try again.",
    };
  }
};
