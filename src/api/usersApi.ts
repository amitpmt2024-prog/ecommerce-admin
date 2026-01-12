// *********************
// Role of the file: Users API service with backend user endpoints
// Name of the file: usersApi.ts
// Developer: Auto
// Version: 1.0
// *********************

// API Base URL - Update this with your backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Import auth utilities
import { checkUnauthorized } from "../utils/authUtils";

export interface User {
  id: string;
  fullName: string;
  email: string;
  roleId?: string;
  role?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for additional properties
}

export interface GetUsersRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  status: boolean;
  message: string;
  data?: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface CreateUserResponse {
  status: boolean;
  message: string;
  data?: User;
}

export interface GetUserResponse {
  status: boolean;
  message: string;
  data?: User;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  password?: string; // Optional for updates
  roleId: string;
}

export interface UpdateUserResponse {
  status: boolean;
  message: string;
  data?: User;
}

export interface DeleteUserResponse {
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
 * Fetch all users from the backend
 * @param params - Optional search, page, and limit parameters
 * @returns Promise with users response
 */
export const getUsersApi = async (params?: GetUsersRequest): Promise<UsersResponse> => {
  try {
    const authToken = getAuthToken();
    
    // Build request body
    const requestBody = {
      search: params?.search || "",
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
    
    // Use POST method since browsers don't support GET with body
    const response = await fetch(`${API_BASE_URL}/users`, {
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
    let usersData: User[] = [];
    if (Array.isArray(data)) {
      usersData = data;
    } else if (data.data && Array.isArray(data.data)) {
      usersData = data.data;
    } else if (data.users && Array.isArray(data.users)) {
      usersData = data.users;
    }
    
    // Extract pagination metadata - check multiple possible response formats
    let pagination;
    
    // Format 1: Direct pagination object
    if (data.pagination) {
      pagination = {
        currentPage: data.pagination.currentPage || data.pagination.page || requestBody.page || 1,
        totalPages: data.pagination.totalPages || data.pagination.totalPage || Math.ceil((data.pagination.total || data.pagination.totalItems || 0) / (data.pagination.itemsPerPage || data.pagination.limit || requestBody.limit || 10)),
        totalItems: data.pagination.total || data.pagination.totalItems || 0,
        itemsPerPage: data.pagination.itemsPerPage || data.pagination.limit || requestBody.limit || 10,
      };
    }
    // Format 2: Meta object
    else if (data.meta) {
      pagination = {
        currentPage: data.meta.currentPage || data.meta.page || requestBody.page || 1,
        totalPages: data.meta.totalPages || data.meta.totalPage || Math.ceil((data.meta.total || data.meta.totalItems || 0) / (data.meta.itemsPerPage || data.meta.limit || requestBody.limit || 10)),
        totalItems: data.meta.total || data.meta.totalItems || 0,
        itemsPerPage: data.meta.itemsPerPage || data.meta.limit || requestBody.limit || 10,
      };
    }
    // Format 3: Pagination fields at root level
    else if (data.totalPages || data.total || data.totalItems) {
      const total = data.total || data.totalItems || 0;
      const limit = data.limit || data.itemsPerPage || requestBody.limit || 10;
      pagination = {
        currentPage: data.currentPage || data.page || requestBody.page || 1,
        totalPages: data.totalPages || data.totalPage || Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      };
    }
    // Format 4: Check for count and calculate
    else if (data.count !== undefined) {
      const limit = requestBody.limit || 10;
      pagination = {
        currentPage: requestBody.page || 1,
        totalPages: Math.ceil(data.count / limit),
        totalItems: data.count,
        itemsPerPage: limit,
      };
    }
    
    // Log for debugging
    if (!pagination) {
      console.warn("No pagination metadata found in API response. Response structure:", data);
    } else {
      console.log("Pagination metadata extracted:", pagination);
    }
    
    return {
      status: true,
      message: data.message || "Users fetched successfully",
      data: usersData,
      pagination,
    };
  } catch (error) {
    console.error("Get users API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while fetching users. Please try again.",
    };
  }
};

/**
 * Create a new user
 * @param userData - User data (fullName, email, password, roleId)
 * @returns Promise with create user response
 */
export const createUserApi = async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
  // Validate input
  if (!userData.fullName || userData.fullName.trim() === "") {
    return {
      status: false,
      message: "Full name is required",
    };
  }
  
  if (!userData.email || userData.email.trim() === "") {
    return {
      status: false,
      message: "Email is required",
    };
  }
  
  if (!userData.password || userData.password.trim() === "") {
    return {
      status: false,
      message: "Password is required",
    };
  }
  
  if (!userData.roleId || userData.roleId.trim() === "") {
    return {
      status: false,
      message: "Role is required",
    };
  }

  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        roleId: userData.roleId,
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
      message: data.message || "User created successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Create user API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while creating the user. Please try again.",
    };
  }
};

/**
 * Get user details by ID
 * @param userId - User ID
 * @returns Promise with user response
 */
export const getUserApi = async (userId: string): Promise<GetUserResponse> => {
  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
      message: data.message || "User fetched successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Get user API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while fetching the user. Please try again.",
    };
  }
};

/**
 * Update a user
 * @param userId - User ID
 * @param userData - User data (fullName, email, password (optional), roleId)
 * @returns Promise with update user response
 */
export const updateUserApi = async (userId: string, userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
  // Validate input
  if (!userData.fullName || userData.fullName.trim() === "") {
    return {
      status: false,
      message: "Full name is required",
    };
  }
  
  if (!userData.email || userData.email.trim() === "") {
    return {
      status: false,
      message: "Email is required",
    };
  }
  
  if (!userData.roleId || userData.roleId.trim() === "") {
    return {
      status: false,
      message: "Role is required",
    };
  }

  try {
    const authToken = getAuthToken();
    
    const updateData: any = {
      fullName: userData.fullName,
      email: userData.email,
      roleId: userData.roleId,
    };
    
    // Only include password if provided
    if (userData.password && userData.password.trim() !== "") {
      updateData.password = userData.password;
    }
    
    const response = await fetch(`${API_BASE_URL}/users/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(updateData),
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
      message: data.message || "User updated successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Update user API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while updating the user. Please try again.",
    };
  }
};

/**
 * Delete a user
 * @param userId - User ID
 * @returns Promise with delete user response
 */
export const deleteUserApi = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    const authToken = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
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
      message: data.message || "User deleted successfully",
    };
  } catch (error) {
    console.error("Delete user API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage === "Failed to fetch") {
      return {
        status: false,
        message: "Unable to connect to the server. Please check your connection and ensure the backend is running.",
      };
    }

    return {
      status: false,
      message: "An error occurred while deleting the user. Please try again.",
    };
  }
};
