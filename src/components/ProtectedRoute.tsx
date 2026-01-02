// *********************
// Role of the component: Protected route wrapper that checks authentication
// Name of the component: ProtectedRoute.tsx
// Developer: Auto-generated
// Version: 1.0
// Component call: <ProtectedRoute><Component /></ProtectedRoute>
// Input parameters: { children: React.ReactNode }
// Output: Protected route component that redirects to login if not authenticated
// *********************

import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if user is authenticated by checking localStorage
  const authToken = localStorage.getItem("authToken");

  // If user is not authenticated, redirect to login
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;

