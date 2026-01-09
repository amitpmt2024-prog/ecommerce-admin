// *********************
// Role of the file: Authentication utility functions
// Name of the file: authUtils.ts
// Developer: Auto
// Version: 1.0
// *********************

/**
 * Handle unauthorized response (401) by clearing auth data and redirecting to login
 */
export const handleUnauthorized = () => {
  // Clear authentication data
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  
  // Redirect to login page
  window.location.href = "/login?error=Your session has expired. Please login again.";
};

/**
 * Check if response is unauthorized (401) and handle it
 * @param response - Fetch response object
 * @returns true if unauthorized, false otherwise
 */
export const checkUnauthorized = (response: Response): boolean => {
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
    return true;
  }
  return false;
};
