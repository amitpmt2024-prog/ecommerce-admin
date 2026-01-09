import { Pagination, RowsPerPage, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";
import { HiOutlineSearch } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getModulesApi } from "../api/modulesApi";
import { setModules, setLoading, setError } from "../features/modules/modulesSlice";
import { Module } from "../api/modulesApi";

const Modules = () => {
  const dispatch = useAppDispatch();
  const { modules, loading, error } = useAppSelector((state) => state.modules);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      dispatch(setLoading(true));
      const response = await getModulesApi();
      
      if (response.status && response.data) {
        dispatch(setModules(response.data));
      } else {
        dispatch(setError(response.message));
      }
      dispatch(setLoading(false));
    };

    fetchModules();
  }, [dispatch]);

  // Filter modules based on search term
  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All Modules
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All Modules</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <WhiteButton link="/modules/create-module" text="Add a Module" textSize="lg" py="2" width="48"><HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" /></WhiteButton>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-6 text-center">
              <p className="dark:text-whiteSecondary text-blackPrimary">Loading modules...</p>
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
                  <col className="lg:w-4/12" />
                  <col className="lg:w-2/12" />
                </colgroup>
                <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Role IDs
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                    >
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredModules.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center">
                        <div className="text-sm dark:text-whiteSecondary text-blackPrimary">
                          {searchTerm ? "No modules found matching your search." : "No modules found. Create your first module!"}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredModules.map((module) => (
                      <tr key={module.id}>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                              {module.name}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                              {module.roleIds && module.roleIds.length > 0
                                ? module.roleIds.join(", ")
                                : "No roles"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                          <div className="flex items-center gap-x-4">
                            <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                              {module.createdAt
                                ? new Date(module.createdAt).toLocaleDateString()
                                : "—"}
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
export default Modules;
