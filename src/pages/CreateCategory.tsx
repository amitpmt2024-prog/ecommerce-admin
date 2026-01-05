import { HiOutlineSave } from "react-icons/hi";
import { Controller, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import {
  Sidebar,
} from "../components";
import { AiOutlineSave } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";

type FormValues = {
  categoryTitle: string,
  categoryImage: string
}

const defaultValues: FormValues = {
  categoryTitle: '',
  categoryImage: ''
}
// 🔥 Step 1: Reusable validation rules
const validationRules = {
  categoryTitle: {
    required: "Category title is required",
  },
  // categoryImage: {
  //   optional: "Category image is required",
  // },
};

const CreateCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch category data if in edit mode
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEditMode) return;

      setFetching(true);
      try {
        const docRef = doc(db, "category", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setValue("categoryTitle", data.categoryTitle || "");
          setValue("categoryImage", data.categoryImage || "");
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category: ", err);
        setError("Failed to load category. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode, setValue]);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode && id) {
        const docRef = doc(db, "category", id);
        await updateDoc(docRef, {
          categoryTitle: data.categoryTitle,
          categoryImage: data.categoryImage,
          updatedAt: new Date().toISOString(),
        });

        console.log("Category updated with ID: ", id);
        setSuccess("Category updated successfully!");
        navigate('/categories');
      } else {
        // Add new document
        const docRef = await addDoc(collection(db, "category"), {
          categoryTitle: data.categoryTitle,
          categoryImage: data.categoryImage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        console.log("Category created with ID: ", docRef.id);
        setSuccess("Category created successfully!");
        reset();
        navigate('/categories');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} category: `, err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} category. Please try again.`);
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
                {isEditMode ? "Edit category" : "Add new category"}
              </h2>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Save draft
                </span>
              </button>
              <Link
                to="/categories/add-category"
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              >
                <HiOutlineSave className="dark:hover:text-blackPrimary hover:text-whiteSecondary dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Publish category
                </span>
              </Link>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Basic information
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                {fetching && (
                  <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    Loading category...
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
                <label className="form-label">
                  Category title
                </label>
                <Controller
                  control={control}
                  name="categoryTitle"
                  rules={validationRules.categoryTitle}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter a category title..."
                        disabled={loading || fetching}
                      />
                      {errors.categoryTitle && (
                        <small className="text-danger">
                          {errors.categoryTitle.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">
                  Category Image
                </label>
                <Controller control={control} name="categoryImage" render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="form-control"
                      placeholder="Enter a category image..."
                    />
                    {errors.categoryImage && (<small className="text-danger">
                      {errors.categoryImage.message}
                    </small>
                    )}
                  </>
                )}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary mt-2"
                disabled={loading || fetching}
              >
                {loading 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Category" : "Create Category")}
              </button>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};
export default CreateCategory;

