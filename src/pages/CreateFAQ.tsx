import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import { Sidebar } from "../components";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "admin_faqs";

type FormValues = {
  question: string;
  answer: string;
};

const defaultValues: FormValues = {
  question: "",
  answer: "",
};

interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper functions for localStorage
const getFAQsFromStorage = (): FAQ[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading FAQs from localStorage:", error);
    return [];
  }
};

const saveFAQsToStorage = (faqs: FAQ[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
  } catch (error) {
    console.error("Error saving FAQs to localStorage:", error);
  }
};

// Validation rules
const validationRules = {
  question: {
    required: "Question is required",
  },
  answer: {
    required: "Answer is required",
  },
};

const CreateFAQ = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({ defaultValues });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch FAQ data if in edit mode
  useEffect(() => {
    const fetchFAQ = () => {
      if (!isEditMode) return;

      setFetching(true);
      try {
        const faqs = getFAQsFromStorage();
        const faq = faqs.find((f) => f.id === id);

        if (faq) {
          setValue("question", faq.question || "");
          setValue("answer", faq.answer || "");
        } else {
          setError("FAQ not found");
        }
      } catch (err) {
        console.error("Error fetching FAQ: ", err);
        setError("Failed to load FAQ. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    fetchFAQ();
  }, [id, isEditMode, setValue]);

  const submitForm = async (data: FormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const faqs = getFAQsFromStorage();

      if (isEditMode && id) {
        // Update existing FAQ
        const updatedFAQs = faqs.map((faq) =>
          faq.id === id
            ? {
                ...faq,
                question: data.question,
                answer: data.answer,
                updatedAt: new Date().toISOString(),
              }
            : faq
        );
        saveFAQsToStorage(updatedFAQs);
        console.log("FAQ updated with ID: ", id);
        setSuccess("FAQ updated successfully!");
        navigate("/faqs");
      } else {
        // Add new FAQ
        const newFAQ: FAQ = {
          id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          question: data.question,
          answer: data.answer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedFAQs = [...faqs, newFAQ];
        saveFAQsToStorage(updatedFAQs);
        console.log("FAQ created with ID: ", newFAQ.id);
        setSuccess("FAQ created successfully!");
        reset();
        navigate("/faqs");
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} FAQ: `, err);
      setError(
        `Failed to ${isEditMode ? "update" : "create"} FAQ. Please try again.`
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
                {isEditMode ? "Edit FAQ" : "Add new FAQ"}
              </h2>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <form onSubmit={handleSubmit(submitForm)}>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                FAQ Information
              </h3>
              <div className="mt-4 flex flex-col gap-5">
                {fetching && (
                  <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                    Loading FAQ...
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
                <label className="form-label">Question</label>
                <Controller
                  control={control}
                  name="question"
                  rules={validationRules.question}
                  render={({ field }) => (
                    <>
                      <SimpleInput
                        {...field}
                        type="text"
                        className="form-control"
                        placeholder="Enter a question..."
                        disabled={loading || fetching}
                      />
                      {errors.question && (
                        <small className="text-danger">
                          {errors.question.message}
                        </small>
                      )}
                    </>
                  )}
                />
                <label className="form-label">Answer</label>
                <Controller
                  control={control}
                  name="answer"
                  rules={validationRules.answer}
                  render={({ field }) => (
                    <>
                      <TextAreaInput
                        {...field}
                        rows={6}
                        placeholder="Enter an answer..."
                        disabled={loading || fetching}
                      />
                      {errors.answer && (
                        <small className="text-danger">
                          {errors.answer.message}
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
export default CreateFAQ;
