import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { Link } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import SelectInput from "../components/SelectInput";
import { selectList } from "../utils/data";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  title: string;
  description: string;
  category: string;
  pricing: string;
  rating: string;
  productImage: string;
}

const defaultValues: FormValues = {
  title: '',
  description: '',
  category: '',
  pricing: '',
  rating: '1',
  productImage: ''
}

const validationRules = {
  title: {
    required: "Product title is required",
    minLength: {
      value: 3,
      message: "Product title must be at least 3 characters long",
    },
    maxLength: {
      value: 100,
      message: "Product title must not exceed 100 characters",
    },
  },
  description: {
    required: "Product description is required",
    minLength: {
      value: 10,
      message: "Product description must be at least 10 characters long",
    },
    maxLength: {
      value: 1000,
      message: "Product description must not exceed 1000 characters",
    },
  },
  category: {
    required: "Category is required",
    validate: (value: string) => 
      value !== "" && value !== "default" || "Please select a valid category",
  },
  pricing: {
    required: "Pricing is required",
    validate: (value: string) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return "Pricing must be a valid number";
      }
      if (numValue <= 0) {
        return "Pricing must be greater than 0";
      }
      return true;
    },
  },
  rating: {
    validate: (value: string) => {
      if (!value || value === "") {
        return true; // Optional field
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return "Rating must be a valid number";
      }
      if (numValue < 1 || numValue > 5) {
        return "Rating must be between 1 and 5";
      }
      return true;
    },
  },
  productImage: {
    validate: (value: string) => {
      if (!value || value === "") {
        return true; // Optional field
      }
      // Basic URL validation
      try {
        new URL(value);
        return true;
      } catch {
        return "Please enter a valid image URL";
      }
    },
  },
};

const CreateProduct = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Add Firebase integration to save product
      console.log("Product data:", data);
      setSuccess("Product created successfully!");
      reset();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error creating product: ", err);
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Add new product
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
                to="/products/add-product"
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black duration-200 flex items-center justify-center gap-x-2"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Publish product
                </span>
              </Link>
            </div>
          </div>

          {/* Add Product section here  */}
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
              {/* left div */}
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Basic information
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

                  <InputWithLabel label="Title">
                    <Controller
                      control={control}
                      name="title"
                      rules={validationRules.title}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="text"
                            placeholder="Enter a product title..."
                            disabled={loading}
                          />
                          {errors.title && (
                            <small className="text-red">
                              {errors.title.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Description">
                    <Controller
                      control={control}
                      name="description"
                      rules={validationRules.description}
                      render={({ field }) => (
                        <>
                          <TextAreaInput
                            {...field}
                            placeholder="Enter a product description..."
                            rows={4}
                            cols={50}
                            disabled={loading}
                          />
                          {errors.description && (
                            <small className="text-danger">
                              {errors.description.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Category">
                    <Controller
                      control={control}
                      name="category"
                      rules={validationRules.category}
                      render={({ field }) => (
                        <>
                          <SelectInput
                            selectList={selectList}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={loading}
                          />
                          {errors.category && (
                            <small className="text-danger">
                              {errors.category.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Pricing">
                    <Controller
                      control={control}
                      name="pricing"
                      rules={validationRules.pricing}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="number"
                            placeholder="Enter a product price..."
                            disabled={loading}
                          />
                          {errors.pricing && (
                            <small className="text-danger">
                              {errors.pricing.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Rating">
                    <Controller
                      control={control}
                      name="rating"
                      rules={validationRules.rating}
                      render={({ field }) => (
                        <>
                          <SimpleInput
                            {...field}
                            type="number"
                            step="0.1"
                            max="5"
                            min="1"
                            placeholder="Enter a product rating (1-5)..."
                            disabled={loading}
                          />
                          {errors.rating && (
                            <small className="text-danger">
                              {errors.rating.message}
                            </small>
                          )}
                        </>
                      )}
                    />
                  </InputWithLabel>
                </div>
              </div>

              {/* right div */}
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Product images
                </h3>

                <Controller
                  control={control}
                  name="productImage"
                  rules={validationRules.productImage}
                  render={({ field }) => (
                    <div>
                      <ImageUpload />
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control mt-4"
                        placeholder="Or enter image URL..."
                        disabled={loading}
                      />
                      {errors.productImage && (
                        <small className="text-danger block mt-1">
                          {errors.productImage.message}
                        </small>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-8">
              <button
                type="submit"
                disabled={loading}
                className="mt-5 border-round text-white bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateProduct;
