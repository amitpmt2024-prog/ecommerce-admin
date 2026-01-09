import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import { Sidebar } from "../components";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "admin_cms";

type FormValues = {
  title: string;
  content: string;
  slug: string;
};

const defaultValues: FormValues = {
  title: "",
  content: "",
  slug: "",
};

interface CMS {
  id: string;
  title: string;
  content: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper functions for localStorage
const getCMSFromStorage = (): CMS[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading CMS from localStorage:", error);
    return [];
  }
};

const saveCMSToStorage = (cmsItems: CMS[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsItems));
  } catch (error) {
    console.error("Error saving CMS to localStorage:", error);
  }
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validation rules
const validationRules = {
  title: {
    required: "Title is required",
  },
  content: {
    required: "Content is required",
  },
  slug: {
    required: false,
  },
};

const CreateCMS = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = watch("title");
  const slug = watch("slug");

  // Auto-generate slug from title when title changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && title && !slug) {
      setValue("slug", generateSlug(title));
    }
  }, [title, slug, isEditMode, setValue]);

  // Fetch CMS data if in edit mode
  useEffect(() => {
    const fetchCMS = () => {
      if (!isEditMode) return;

      setFetching(true);
      try {
        const cmsItems = getCMSFromStorage();
        const item = cmsItems.find((c) => c.id === id);

        if (item) {
          setValue("title", item.title || "");
          setValue("content", item.content || "");
          setValue("slug", item.slug || "");
        } else {
          setError("CMS content not found");
        }
      } catch (err) {
        console.error("Error fetching CMS content: ", err);
        setError("Failed to load CMS content. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    fetchCMS();
  }, [id, isEditMode, setValue]);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const cmsItems = getCMSFromStorage();
      
      // Generate slug if not provided
      const finalSlug = data.slug || generateSlug(data.title);

      if (isEditMode && id) {
        // Update existing CMS content
        const updatedCMS = cmsItems.map((item) =>
          item.id === id
            ? {
                ...item,
                title: data.title,
                content: data.content,
                slug: finalSlug,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        saveCMSToStorage(updatedCMS);
        console.log("CMS content updated with ID: ", id);
        setSuccess("CMS content updated successfully!");
        navigate("/cms");
      } else {
        // Add new CMS content
        const newCMS: CMS = {
          id: `cms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: data.title,
          content: data.content,
          slug: finalSlug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedCMS = [...cmsItems, newCMS];
        saveCMSToStorage(updatedCMS);
        console.log("CMS content created with ID: ", newCMS.id);
        setSuccess("CMS content created successfully!");
        reset();
        navigate("/cms");
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} CMS content: `, err);
      setError(
        `Failed to ${isEditMode ? "update" : "create"} CMS content. Please try again.`
      );
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
                {isEditMode ? "Edit CMS Content" : "Add new CMS Content"}
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                CMS Information
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                {fetching && (
                  <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    Loading CMS content...
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
                  name="title"
                  rules={validationRules.title}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter a title..."
                        disabled={loading || fetching}
                      />
                      {errors.title && (
                        <small className="text-danger">
                          {errors.title.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Slug (optional, auto-generated from title)</label>
                <Controller
                  control={control}
                  name="slug"
                  rules={validationRules.slug}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter a slug (e.g., about-us)..."
                        disabled={loading || fetching}
                      />
                      {errors.slug && (
                        <small className="text-danger">
                          {errors.slug.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Content</label>
                <Controller
                  control={control}
                  name="content"
                  rules={validationRules.content}
                  render={({ field }) => (
                    <>
                      <TextAreaInput
                        {...field}
                        rows={10}
                        placeholder="Enter content..."
                        disabled={loading || fetching}
                      />
                      {errors.content && (
                        <small className="text-danger">
                          {errors.content.message}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={loading || fetching}
                className="mt-5 border-round text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCMS;
