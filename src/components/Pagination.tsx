// *********************
// Role of the component: Pagination component that displays the page numbers and navigation buttons
// Name of the component: Pagination.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <Pagination currentPage={1} totalPages={10} onPageChange={(page) => {}} />
// Input parameters: currentPage, totalPages, onPageChange
// Output: Pagination component that displays the page numbers and navigation buttons
// *********************

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    // Calculate the range of page numbers to display
    let startPage = currentPage - 1;
    if (startPage <= 0) startPage = 1;
    let endPage = startPage + 2;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - 2 > 0 ? totalPages - 2 : 1;
    }
  
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex gap-2 items-center">
        <button
          className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`border border-gray-600 py-1 px-3 hover:border-gray-500 ${currentPage === number ? 'dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary' : 'dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary'}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}
        <button
          className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    );
};
  
export default Pagination;