import { CMSTable, Pagination, RowsPerPage, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { useState, useEffect } from "react";

interface CMS {
  id: string;
  title: string;
  content: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = "admin_cms";

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

const CMS = () => {
  const [cmsItems, setCMSItems] = useState<CMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load CMS from localStorage
    const loadCMS = () => {
      try {
        const storedCMS = getCMSFromStorage();
        setCMSItems(storedCMS);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error loading CMS: ", err);
        setError("Failed to load CMS content");
        setLoading(false);
      }
    };

    loadCMS();
    
    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadCMS();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (id: string) => {
    const updatedCMS = cmsItems.filter(item => item.id !== id);
    setCMSItems(updatedCMS);
    saveCMSToStorage(updatedCMS);
  };

  // Filter CMS based on search term
  const filteredCMS = cmsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.slug && item.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All CMS Content
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All CMS Content</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton link="/cms/create-cms" text="Add CMS Content" textSize="lg" py="2" width="48"><HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" /></WhiteButton>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search CMS content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-6 text-center">
              <p className="dark:text-whiteSecondary text-blackPrimary">Loading CMS content...</p>
            </div>
          ) : error ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <CMSTable cmsItems={filteredCMS} onDelete={handleDelete} />
          )}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <RowsPerPage />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CMS;
