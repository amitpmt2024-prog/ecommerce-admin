import { LoginComponent } from "../components";
import { Navigate } from "react-router-dom";

const Login = () => {
  // Check if user is already authenticated
  const authToken = localStorage.getItem("authToken");

  // If user is already authenticated, redirect to home
  if (authToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dark:bg-blackPrimary bg-whiteSecondary min-h-[100vh] w-full flex justify-center items-center py-10">
      <LoginComponent />
    </div>
  );
};
export default Login;
