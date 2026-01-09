// *********************
// Role of the file: Reusable confirmation modal component
// Name of the file: ConfirmModal.tsx
// Developer: Auto
// Version: 1.0
// *********************

import { HiOutlineX } from "react-icons/hi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  confirmButtonClass?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div className="dark:bg-blackPrimary bg-whiteSecondary rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-600 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-600 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold dark:text-whiteSecondary text-blackPrimary">
            {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-base dark:text-whiteSecondary text-blackPrimary">
            {message}
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-600 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:border-gray-600 dark:text-whiteSecondary text-blackPrimary rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded ${confirmButtonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
