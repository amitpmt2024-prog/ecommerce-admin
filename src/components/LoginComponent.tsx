// *********************
// Role of the component: Login component that is displayed on the login page
// Name of the component: LoginComponent.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <LoginComponent />
// Input parameters: no input parameters
// Output: Login component that contains input fields for email and password, and buttons for login with Google and GitHub
// *********************

import { FaReact } from "react-icons/fa6";
import {
  InputWithLabel,
  SimpleInput,
} from "../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setUserData } from "../features/user/userSlice";

interface LoginComponentProps {
  initialError?: string | null;
}

const LoginComponent = ({ initialError }: LoginComponentProps = {} as LoginComponentProps) => {
  const [email, setEmail] = useState("amitpmt2024@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Set initial error if provided
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginApi({ email, password });
      if (response.status && response.data) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        // Store user data in Redux and localStorage
        if (response.data.user) {
          dispatch(setUserData(response.data.user));
        }
        // Redirect to home page
        navigate("/");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px] h-[750px] dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 max-sm:w-[400px] max-[420px]:w-[320px] max-sm:h-[750px]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10 w-full">
        <FaReact className="text-5xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer max-sm:text-4xl" />
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-medium max-sm:text-xl">
          Welcome to the dashboard!
        </h2>
        <div className="w-full flex flex-col gap-5">
          <InputWithLabel label="Email">
            <SimpleInput 
              type="email" 
              placeholder="Enter a email..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </InputWithLabel>

          <InputWithLabel label="Password">
            <SimpleInput 
              type="password" 
              placeholder="Enter a password..." 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </InputWithLabel>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm w-full text-center">{error}</p>
        )}
        
        {/* <p className="dark:text-gray-400 text-gray-700 text-base dark:hover:text-gray-300 hover:text-gray-600 cursor-pointer transition-colors max-sm:text-sm">
          Forgot password?
        </p> */}
        <button
          type="submit"
          disabled={loading}
          className={`dark:bg-whiteSecondary bg-blackPrimary w-full py-2 text-lg dark:hover:bg-white hover:bg-gray-800 bg-blackPrimary duration-200 flex items-center justify-center gap-x-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
            {loading ? "Logging in..." : "Login"}
          </span>
        </button>
      </form>
    </div>
  )
}
export default LoginComponent