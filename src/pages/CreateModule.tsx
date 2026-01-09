import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import SimpleInput from "../components/SimpleInput";
import { Sidebar } from "../components";
import { useNavigate } from "react-router-dom";
import { createModuleApi, getModulesApi } from "../api/modulesApi";
import { useAppDispatch } from "../hooks";
import { setModules } from "../features/modules/modulesSlice";

type FormValues = {
  name: string;
};

const defaultValues: FormValues = {
  name: "",
};

// Validation rules
const validationRules = {
  name: {
    required: "Module name is required",
    minLength: {
      value: 2,
      message: "Module name must be at least 2 characters long",
    },
  },
};

const CreateModule = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Always send empty roleIds array as per API requirement
      const response = await createModuleApi({
        name: data.name,
        roleIds: [],
      });

      if (response.status && response.data) {
        setSuccess("Module created successfully!");
        reset();
        
        // Refresh modules list from server
        const modulesResponse = await getModulesApi();
        if (modulesResponse.status && modulesResponse.data) {
          dispatch(setModules(modulesResponse.data));
        }
        
        // Redirect to modules list after 1 second
        setTimeout(() => {
          navigate("/modules");
        }, 1000);
      } else {
        setError(response.message || "Failed to create module. Please try again.");
      }

      // Clear success/error messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (err) {
      console.error("Error creating module: ", err);
      setError("An error occurred while creating the module. Please try again.");
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
                Add new Module
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Module Information
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
                <label className="form-label">Module Name</label>
                <Controller
                  control={control}
                  name="name"
                  rules={validationRules.name}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter module name (e.g., Users)..."
                        disabled={loading}
                      />
                      {errors.name && (
                        <small className="text-danger">
                          {errors.name.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 border-round text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateModule;
