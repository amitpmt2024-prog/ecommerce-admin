// *********************
// Role of the component: Rows per page component that displays the number of rows per page
// Name of the component: RowsPerPage.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <RowsPerPage rowsPerPage={10} onRowsPerPageChange={(rows) => {}} />
// Input parameters: rowsPerPage, onRowsPerPageChange
// Output: RowsPerPage component that displays the number of rows per page
// *********************

interface RowsPerPageProps {
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

const RowsPerPage = ({ rowsPerPage, onRowsPerPageChange }: RowsPerPageProps) => {
  return (
    <div className="flex gap-2 items-center">
      <p className="dark:text-whiteSecondary text-blackPrimary text-lg font-normal">Rows per page:</p>
      <select
        className="w-24 h-8 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer hover:border-gray-500"
        name="rows"
        id="rows"
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
};
export default RowsPerPage;
