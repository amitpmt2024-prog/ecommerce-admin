import { Pagination, RowsPerPage, Sidebar, WhiteButton, ConfirmModal } from "../components";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRolesApi, deleteRoleApi } from "../api/rolesApi";
import { Role } from "../api/rolesApi";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);

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

  const handleDeleteClick = (roleId: string, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    setDeletingId(roleToDelete.id);
    setDeleteError(null);
    setShowDeleteModal(false);

    try {
      const response = await deleteRoleApi(roleToDelete.id);
      
      if (response.status) {
        // Remove the deleted role from the list
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleToDelete.id));
      } else {
        setDeleteError(response.message || "Failed to delete role. Please try again.");
        // Clear error after 3 seconds
        setTimeout(() => {
          setDeleteError(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Error deleting role: ", err);
      setDeleteError("An error occurred while deleting the role. Please try again.");
      // Clear error after 3 seconds
      setTimeout(() => {
        setDeleteError(null);
      }, 3000);
    } finally {
      setDeletingId(null);
      setRoleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

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
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton link="/roles/create-role" text="Create Role" textSize="lg" py="2" width="48"><HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" /></WhiteButton>
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
                  <col className="w-full sm:w-3/12" />
                  <col className="lg:w-4/12" />
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
                      Modules
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
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                          {searchTerm ? "No roles found matching your search." : "No roles found."}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => {
                      // Extract module names from different possible structures
                      const getModuleNames = (): string => {
                        // Check for roleModules.module.name structure (nested)
                        if (role.roleModules && Array.isArray(role.roleModules) && role.roleModules.length > 0) {
                          const moduleNames = role.roleModules
                            .map((rm: any) => rm?.module?.name)
                            .filter((name: string) => name) // Filter out undefined/null values
                            .join(", ");
                          return moduleNames || "No modules";
                        }
                        
                        // Check for direct modules array structure
                        if (role.modules && Array.isArray(role.modules) && role.modules.length > 0) {
                          // If modules is an array of objects with name property
                          if (typeof role.modules[0] === 'object' && 'name' in role.modules[0]) {
                            return role.modules.map((m: any) => m.name).join(", ");
                          }
                          // If modules is an array of strings
                          if (typeof role.modules[0] === 'string') {
                            return role.modules.join(", ");
                          }
                        }
                        
                        return "No modules";
                      };

                      return (
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
                              <div className="text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                                {getModuleNames()}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                            <div className="flex gap-x-1 justify-end">
                              <Link
                                to={`/roles/${role.id}`}
                                className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                              >
                                <HiOutlinePencil className="text-lg" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(role.id, role.name)}
                                disabled={deletingId === role.id}
                                className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete role"
                              >
                                {deletingId === role.id ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <HiOutlineTrash className="text-lg" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
            </div>
          )}
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-sm:flex-col gap-4 max-sm:pt-6 max-sm:pb-0">
            <RowsPerPage />
            <Pagination />
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete "${roleToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId !== null}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};
export default Roles;
