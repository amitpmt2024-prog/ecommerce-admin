import { Pagination, RowsPerPage, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { useState, useEffect } from "react";
import { getRolesApi } from "../api/rolesApi";
import { Role } from "../api/rolesApi";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getRolesApi({
          search: searchTerm,
          page: 1,
          limit: 10,
        });
        
        if (response.status && response.data) {
          setRoles(response.data);
        } else {
          setError(response.message || "Failed to load roles");
        }
      } catch (err) {
        console.error("Error fetching roles: ", err);
        setError("An error occurred while fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [searchTerm]);

  // Filter roles based on search term (client-side filtering as backup)
  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All Roles
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All Roles</span>
              </p>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-6 text-center">
              <p className="dark:text-whiteSecondary text-blackPrimary">Loading roles...</p>
            </div>
          ) : error ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 mt-6">
              <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
                <colgroup>
                  <col className="w-full sm:w-4/12" />
                  <col className="lg:w-2/12" />
                </colgroup>
                <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Role Name
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-8 text-center">
                        <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                          {searchTerm ? "No roles found matching your search." : "No roles found."}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => (
                      <tr key={role.id}>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                              {role.name || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                              {role.id}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
export default Roles;
