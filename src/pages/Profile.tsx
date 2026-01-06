import { HiOutlineSave, HiOutlineUpload, HiOutlineLogout } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const defaultValues: FormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const validationRules = {
  fullName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Full name must be at least 2 characters long",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    validate: (value: string) => {
      if (!value || value === "") {
        return true; // Optional field
      }
      if (value.length < 6) {
        return "Password must be at least 6 characters long";
      }
      return true;
    },
  },
  confirmPassword: {
    validate: (value: string, formValues: { password: string }) => {
      if (!formValues.password) {
        return true; // If password is empty, confirm password is optional
      }
      if (value !== formValues.password) {
        return "Passwords do not match";
      }
      return true;
    },
  },
};

const Profile = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ fullName?: string; email?: string } | null>(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr);
        setUserData(parsedUserData);
        if (parsedUserData.fullName) {
          setValue("fullName", parsedUserData.fullName);
        }
        if (parsedUserData.email) {
          setValue("email", parsedUserData.email);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, [setValue]);

  const handleLogout = () => {
    // Remove authToken and userData from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const authToken = localStorage.getItem("authToken");
      
      const response = await fetch("http://localhost:3000/info?id=1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSuccess("Profile updated successfully!");
      reset();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setError(errorMessage);
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Your Profile
              </h2>
            </div>
            {/* Profile update button or any other action */}
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button
                onClick={handleLogout}
                className="dark:bg-red-600 bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 w-48 py-2 text-lg duration-200 flex items-center justify-center gap-x-2 text-white font-semibold"
              >
                <HiOutlineLogout className="text-white text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            {/* Profile details section */}
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="flex flex-col gap-4">
                {/* Example: Displaying user information */}
                <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-10">
                  <div className="flex items-center gap-4">
                    <img
                      src="/src/assets/profile.jpg"
                      alt="Profile"
                      className="rounded-full w-20 h-20"
                    />
                    <div>
                      <p className="dark:text-whiteSecondary text-blackPrimary text-xl">
                        {userData?.fullName || "User"}
                      </p>
                      <p className="dark:text-whiteSecondary text-blackPrimary">
                        {userData?.email || "Email"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-72 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2"
                  >
                    <HiOutlineUpload className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                    <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                      Change profile picture
                    </span>
                  </button>
                </div>
                
                {/* Form fields */}
                <div className="flex flex-col gap-3 mt-5">
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {success}
                    </div>
                  )}

                  <InputWithLabel label="Full Name">
                    <Controller
                      control={control}
                      name="fullName"
                      rules={validationRules.fullName}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="text"
                            placeholder="Your full name"
                            disabled={loading}
                          />
                          {errors.fullName && (
                            <small className="text-red-500 block mt-1">
                              {errors.fullName.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Your email">
                    <Controller
                      control={control}
                      name="email"
                      rules={validationRules.email}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="email"
                            placeholder="Your email"
                            disabled={true}
                          />
                          {errors.email && (
                            <small className="text-red-500 block mt-1">
                              {errors.email.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>
{/* 
                  <InputWithLabel label="New password">
                    <Controller
                      control={control}
                      name="password"
                      rules={validationRules.password}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="password"
                            placeholder="Enter your new password..."
                            disabled={loading}
                          />
                          {errors.password && (
                            <small className="text-red-500 block mt-1">
                              {errors.password.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Confirm new password">
                    <Controller
                      control={control}
                      name="confirmPassword"
                      rules={validationRules.confirmPassword}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="password"
                            placeholder="Confirm your new password..."
                            disabled={loading}
                          />
                          {errors.confirmPassword && (
                            <small className="text-red-500 block mt-1">
                              {errors.confirmPassword.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel> */}
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-gray-800 duration-200 flex items-center justify-center gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                    <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                      {loading ? "Updating..." : "Update profile"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Notifications section, already implemented in the provided code */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
