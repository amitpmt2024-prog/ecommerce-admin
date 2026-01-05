// *********************
// Role of the component: The component that displays categories table on the admin category page
// Name of the component: CategoryTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryTable categories={categories} />
// Input parameters: categories array from Firebase
// Output: table with categories
// *********************

import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";

interface Category {
  id: string;
  categoryTitle: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable = ({ categories }: CategoryTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryTitle: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(categoryId);
    setDeleteError(null);

    try {
      // Delete the document from Firebase
      await deleteDoc(doc(db, "category", categoryId));
      console.log("Category deleted successfully");
    } catch (err) {
      console.error("Error deleting category: ", err);
      setDeleteError("Failed to delete category. Please try again.");
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
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Category
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
        {categories.length === 0 ? (
          <tr>
            <td colSpan={2} className="py-8 text-center">
              <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                No categories found. Create your first category!
              </div>
            </td>
          </tr>
        ) : (
          categories.map((category) => (
            <tr key={category.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {category.categoryTitle.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {category.categoryTitle}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/categories/${category.id}`}
                    className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.categoryTitle)}
                    disabled={deletingId === category.id}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete category"
                  >
                    {deletingId === category.id ? (
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
            <td colSpan={2} className="px-4 sm:px-6 lg:px-8 py-2">
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
export default CategoryTable;
