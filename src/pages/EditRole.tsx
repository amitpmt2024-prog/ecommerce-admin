import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SimpleInput from "../components/SimpleInput";
import { Sidebar } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { getRoleApi, updateRoleApi } from "../api/rolesApi";
import { getModulesApi, Module } from "../api/modulesApi";

type FormValues = {
  name: string;
  moduleIds: number[];
};

const defaultValues: FormValues = {
  name: "",
  moduleIds: [],
};

// Validation rules
const validationRules = {
  name: {
    required: "Role name is required",
    minLength: {
      value: 2,
      message: "Role name must be at least 2 characters long",
    },
  },
};

const EditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  // Fetch modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      setLoadingModules(true);
      try {
        const response = await getModulesApi({
          search: "",
          page: 1,
          limit: 10,
        });
        
        if (response.status && response.data) {
          setModules(response.data);
        } else {
          setError(response.message || "Failed to load modules");
        }
      } catch (err) {
        console.error("Error fetching modules: ", err);
        setError("An error occurred while fetching modules");
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  // Fetch role details after modules are loaded
  useEffect(() => {
    const fetchRole = async () => {
      if (!id || loadingModules) return;

      setFetching(true);
      setError(null);
      
      try {
        const response = await getRoleApi(id);
        
        if (response.status && response.data) {
          const role = response.data;
          console.log("Role data received:", role); // Debug log
          setValue("name", role.name || "");
          
          // Handle different response structures for module IDs
          let moduleIds: number[] = [];
          
          // Case 1: moduleIds is an array
          if (role.moduleIds && Array.isArray(role.moduleIds)) {
            moduleIds = role.moduleIds.map((id: any) => {
              if (typeof id === 'string') {
                const parsed = parseInt(id);
                return isNaN(parsed) ? null : parsed;
              }
              return typeof id === 'number' ? id : null;
            }).filter((id: number | null): id is number => id !== null);
          }
          // Case 2: modules is an array of module objects
          else if (role.modules && Array.isArray(role.modules)) {
            moduleIds = role.modules.map((module: any) => {
              const moduleId = module.id || module.moduleId;
              if (typeof moduleId === 'string') {
                const parsed = parseInt(moduleId);
                return isNaN(parsed) ? null : parsed;
              }
              return typeof moduleId === 'number' ? moduleId : null;
            }).filter((id: number | null): id is number => id !== null);
          }
          
          // Match module IDs with available modules (handle both string and number IDs)
          const matchedModuleIds: number[] = [];
          moduleIds.forEach((roleModuleId) => {
            const matchedModule = modules.find((module) => {
              const moduleId = typeof module.id === 'string' ? parseInt(module.id) : module.id;
              return moduleId === roleModuleId;
            });
            if (matchedModule) {
              const moduleId = typeof matchedModule.id === 'string' ? parseInt(matchedModule.id) : matchedModule.id;
              matchedModuleIds.push(moduleId);
            }
          });
          
          console.log("Original module IDs from role:", moduleIds); // Debug log
          console.log("Matched module IDs:", matchedModuleIds); // Debug log
          setSelectedModules(matchedModuleIds);
        } else {
          setError(response.message || "Failed to load role");
        }
      } catch (err) {
        console.error("Error fetching role: ", err);
        setError("An error occurred while fetching role");
      } finally {
        setFetching(false);
      }
    };

    // Only fetch role after modules are loaded to ensure proper matching
    if (!loadingModules && modules.length > 0) {
      fetchRole();
    }
  }, [id, setValue, loadingModules, modules]);

  const handleModuleToggle = (moduleId: number) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  const submitForm = async (data: FormValues) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateRoleApi(id, {
        name: data.name,
        moduleIds: selectedModules,
      });

      if (response.status && response.data) {
        setSuccess("Role updated successfully!");
        
        // Redirect to roles list after 1 second
        setTimeout(() => {
          navigate("/roles");
        }, 1000);
      } else {
        setError(response.message || "Failed to update role. Please try again.");
      }

      // Clear success/error messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating role: ", err);
      setError("An error occurred while updating the role. Please try again.");
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
                Edit Role
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Role Information
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                {fetching && (
                  <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    Loading role...
                  </div>
                )}
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
                <label className="form-label">Title</label>
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
                        placeholder="Enter role title (e.g., Manager)..."
                        disabled={loading || fetching}
                      />
                      {errors.name && (
                        <small className="text-danger">
                          {errors.name.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Modules</label>
                {loadingModules ? (
                  <div className="border border-gray-600 dark:border-gray-700 p-4 rounded">
                    <p className="text-sm dark:text-whiteSecondary text-blackPrimary">Loading modules...</p>
                  </div>
                ) : (
                  <div className="border border-gray-600 dark:border-gray-700 p-4 rounded max-h-64 overflow-y-auto">
                    {modules.length === 0 ? (
                      <p className="text-sm dark:text-whiteSecondary text-blackPrimary">No modules available</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {modules.map((module) => {
                          // Convert module ID to number for API compatibility
                          const moduleId = typeof module.id === 'string' ? parseInt(module.id) : module.id;
                          return (
                            <div
                              key={module.id}
                              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded border border-gray-300 dark:border-gray-600"
                            >
                              <input
                                type="checkbox"
                                id={`module-${module.id}`}
                                checked={selectedModules.includes(moduleId)}
                                onChange={() => handleModuleToggle(moduleId)}
                                disabled={loading || fetching}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                              />
                              <label
                                htmlFor={`module-${module.id}`}
                                className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary cursor-pointer flex-1"
                              >
                                {module.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {selectedModules.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedModules.length} module(s) selected
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || fetching}
                className="mt-5 border-round text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditRole;
