import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SimpleInput from "../components/SimpleInput";
import { Sidebar } from "../components";
import { useNavigate } from "react-router-dom";
import { createUserApi } from "../api/usersApi";
import { getRolesApi, Role } from "../api/rolesApi";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
};

const defaultValues: FormValues = {
  fullName: "",
  email: "",
  password: "",
  roleId: "",
};

// Validation rules
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
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
  roleId: {
    required: "Role is required",
  },
};

const CreateUser = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await getRolesApi({
          search: "",
          page: 1,
          limit: 100, // Get all roles
        });
        
        if (response.status && response.data) {
          setRoles(response.data);
        } else {
          setError(response.message || "Failed to load roles");
        }
      } catch (err) {
        console.error("Error fetching roles: ", err);
        setError("An error occurred while fetching roles");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createUserApi({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      });

      if (response.status && response.data) {
        setSuccess("User created successfully!");
        reset();
        
        // Redirect to users list after 1 second
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        setError(response.message || "Failed to create user. Please try again.");
      }

      // Clear success/error messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (err) {
      console.error("Error creating user: ", err);
      setError("An error occurred while creating the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Add New User
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                User Information
              </h3>
              <div className="mt-4 flex flex-col gap-5">
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
                <label className="form-label">Full Name</label>
                <Controller
                  control={control}
                  name="fullName"
                  rules={validationRules.fullName}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter full name..."
                        disabled={loading}
                      />
                      {errors.fullName && (
                        <small className="text-danger">
                          {errors.fullName.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Email</label>
                <Controller
                  control={control}
                  name="email"
                  rules={validationRules.email}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="email"
                        className="form-control"
                        placeholder="Enter email address..."
                        disabled={loading}
                      />
                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Password</label>
                <Controller
                  control={control}
                  name="password"
                  rules={validationRules.password}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="password"
                        className="form-control"
                        placeholder="Enter password..."
                        disabled={loading}
                      />
                      {errors.password && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Role</label>
                {loadingRoles ? (
                  <div className="border border-gray-600 dark:border-gray-700 p-4 rounded">
                    <p className="text-sm dark:text-whiteSecondary text-blackPrimary">Loading roles...</p>
                  </div>
                ) : (
                  <Controller
                    control={control}
                    name="roleId"
                    rules={validationRules.roleId}
                    render={({ field }) => (
                      <>
                        <select
                          {...field}
                          className="w-full h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                          disabled={loading}
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        {errors.roleId && (
                          <small className="text-danger">
                            {errors.roleId.message}
                          </small>
                        )}
                      </>
                    )}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading || loadingRoles}
                className="mt-5 border-round text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateUser;
