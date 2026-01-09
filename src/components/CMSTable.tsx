// *********************
// Role of the component: The component that displays CMS content table on the admin CMS page
// Name of the component: CMSTable.tsx
// Developer: Auto
// Version: 1.0
// Component call: <CMSTable cmsItems={cmsItems} onDelete={handleDelete} />
// Input parameters: cmsItems array from localStorage
// Output: table with CMS content
// *********************

import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";

interface CMS {
  id: string;
  title: string;
  content: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CMSTableProps {
  cmsItems: CMS[];
  onDelete: (id: string) => void;
}

const CMSTable = ({ cmsItems, onDelete }: CMSTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (cmsId: string, title: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(cmsId);
    setDeleteError(null);

    try {
      onDelete(cmsId);
      console.log("CMS content deleted successfully");
    } catch (err) {
      console.error("Error deleting CMS content: ", err);
      setDeleteError("Failed to delete CMS content. Please try again.");
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
        <col className="w-full sm:w-3/12" />
        <col className="lg:w-5/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-2/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Title
          </th>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Content
          </th>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Slug
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
        {cmsItems.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-8 text-center">
              <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                No CMS content found. Create your first CMS content!
              </div>
            </td>
          </tr>
        ) : (
          cmsItems.map((item) => (
            <tr key={item.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary max-w-md">
                    {item.title}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary max-w-md">
                    {item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary max-w-md">
                    {item.slug || "—"}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/cms/${item.id}`}
                    className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deletingId === item.id}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete CMS content"
                  >
                    {deletingId === item.id ? (
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
            <td colSpan={4} className="px-4 sm:px-6 lg:px-8 py-2">
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
export default CMSTable;
