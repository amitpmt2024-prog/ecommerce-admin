// *********************
// Role of the component: The component that displays FAQs table on the admin FAQ page
// Name of the component: FAQTable.tsx
// Developer: Auto
// Version: 1.0
// Component call: <FAQTable faqs={faqs} onDelete={handleDelete} />
// Input parameters: faqs array from localStorage
// Output: table with FAQs
// *********************

import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FAQTableProps {
  faqs: FAQ[];
  onDelete: (id: string) => void;
}

const FAQTable = ({ faqs, onDelete }: FAQTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (faqId: string, question: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${question}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(faqId);
    setDeleteError(null);

    try {
      onDelete(faqId);
      console.log("FAQ deleted successfully");
    } catch (err) {
      console.error("Error deleting FAQ: ", err);
      setDeleteError("Failed to delete FAQ. Please try again.");
      // Clear error after 3 seconds
      setTimeout(() => {
        setDeleteError(null);
      }, 3000);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-6/12" />
        <col className="lg:w-2/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Question
          </th>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Answer
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {faqs.length === 0 ? (
          <tr>
            <td colSpan={3} className="py-8 text-center">
              <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                No FAQs found. Create your first FAQ!
              </div>
            </td>
          </tr>
        ) : (
          faqs.map((faq) => (
            <tr key={faq.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary max-w-md">
                    {faq.question}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary max-w-md">
                    {faq.answer.substring(0, 100)}{faq.answer.length > 100 ? '...' : ''}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/faqs/${faq.id}`}
                    className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(faq.id, faq.question)}
                    disabled={deletingId === faq.id}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete FAQ"
                  >
                    {deletingId === faq.id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <HiOutlineTrash className="text-lg" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
      {deleteError && (
        <tfoot>
          <tr>
            <td colSpan={3} className="px-4 sm:px-6 lg:px-8 py-2">
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                {deleteError}
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};
export default FAQTable;
