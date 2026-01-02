import { LoginComponent } from "../components";
import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
  // Check if user is already authenticated
  const authToken = localStorage.getItem("authToken");
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get error message from URL params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(error);
      // Clear error from URL
      searchParams.delete("error");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  // If user is already authenticated, redirect to home
  if (authToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dark:bg-blackPrimary bg-whiteSecondary min-h-[100vh] w-full flex justify-center items-center py-10">
      <LoginComponent initialError={errorMessage} />
    </div>
  );
};
export default Login;
