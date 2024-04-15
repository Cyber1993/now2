import { SetStateAction, useEffect, useState } from "react";
import { IUser } from "../../../../../entities/User.ts";
import http_common from "../../../../../http_common.ts";
import ModalDelete from "../../../../../common/admin/ModalDelete.tsx";
import { useNavigate } from "react-router-dom";
import SearchGroup from "../../../../../common/admin/SearchGroup.tsx";
import PaginationGroup from "../../../../../common/admin/PaginationGroup.tsx";
import SortGroup from "../../../../../common/admin/SortGroup.tsx";
import { IFilter, IPaginatedList } from "../../../../../entities/Filter.ts";
import useSort from "../../../../../hooks/useSort.ts";
import useSearch from "../../../../../hooks/useSearch.ts";
import usePage from "../../../../../hooks/usePage.ts";

function UsersListPage() {
  const sortOptions = [
    { id: 0, name: "Name", label: "Name" },
    { id: 1, name: "Email", label: "Email" },
    { id: 2, name: "Id", label: "Id" },
    { id: 3, name: "DateCreated", label: "Date created" },
    { id: 4, name: "PhoneNumber", label: "Phone number" },
  ];

  const [usersPaginatedList, setUsersPaginatedList] = useState<
    IPaginatedList<IUser>
  >({ totalPages: 0, items: [] });

  const navigate = useNavigate();

  const convertFilterToQueryString = (filter: IFilter): string => {
    const queryParams = Object.entries(filter)
      .filter(
        ([_, value]) => value !== null && value !== undefined && value !== "",
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(
            key.charAt(0).toUpperCase() + key.slice(1),
          )}=${encodeURIComponent(value)}`,
      )
      .join("&");
    return queryParams;
  };

  useEffect(() => {
    fetchData(initialFilterValues);
  }, []);

  const queryParams = new URLSearchParams(location.search);

  const [initialFilterValues, setInitialFilterValues] = useState<IFilter>({
    pageNumber: parseInt(queryParams.get("page") ?? "1"),
    pageSize: 10,
    searchTerm: queryParams.get("search") ?? "",
    sortBy: queryParams.get("sort") ?? "",
    sortDirection: queryParams.get("direction") ?? "",
    sorting: queryParams.get("sorting") ?? "",
  });

  const fetchData = async (values: IFilter) => {
    try {
      const resp = await http_common.get<IPaginatedList<IUser>>(
        `api/Accounts/getByFilter?${convertFilterToQueryString(values)}`,
      );
      setUsersPaginatedList(resp.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await http_common.delete(`api/Accounts/${id}`).then(() => {
        http_common
          .get(
            `api/Accounts/getByFilter?${convertFilterToQueryString(
              initialFilterValues,
            )}`,
          )
          .then((resp: { data: SetStateAction<IPaginatedList<IUser>> }) => {
            setUsersPaginatedList(resp.data);
          });
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const { handleSearchChange } = useSearch({
    setInitialFilterValues,
    fetchData,
  });

  const { handlePageChange } = usePage({
    setInitialFilterValues,
    fetchData,
  });

  const { handleSortChange } = useSort({
    setInitialFilterValues,
    fetchData,
    sortOptions,
  });

  return (
    <>
      <div className="p-5 sm:ml-64">
        <div className="flex gap-5">
          <SearchGroup
            onSearch={handleSearchChange}
            label="Search Users"
            value={initialFilterValues.searchTerm}
          ></SearchGroup>
          <SortGroup
            onSelect={handleSortChange}
            optionKey="id"
            optionLabel="label"
            label="Sort by"
            options={sortOptions}
            value={initialFilterValues.sortBy}
          ></SortGroup>
        </div>
        <div className="flex-grow overflow-hidden rounded-lg border border-gray-200 shadow-md mt-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  {sortOptions.map((option) => (
                    <th
                      key={option.id}
                      className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortChange(option.id)}
                    >
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        {initialFilterValues.sortBy === option.name &&
                          initialFilterValues.sortDirection && (
                            <span>
                              {initialFilterValues.sortDirection === "asc" ? (
                                <i className="bi bi-caret-up-fill"></i>
                              ) : (
                                <i className="bi bi-caret-down-fill"></i>
                              )}
                            </span>
                          )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Roles
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {usersPaginatedList.items.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <th className="px-6 py-4 font-normal text-gray-900 ali">
                      <div className="flex gap-3">
                        <div className="relative h-10 w-10">
                          <img
                            className="h-full w-full rounded-full object-cover object-center"
                            src={`${http_common.getUri()}/images/300_${
                              user.image
                            }`}
                            alt=""
                          />
                        </div>
                        <div className="font-medium text-gray-700 flex items-center">
                          {user.firstName + " " + user.lastName}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">
                      {user.dateCreated
                        ? new Date(user.dateCreated).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">{user.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="flex justify-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span>No roles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <ModalDelete
                          id={user.id}
                          text={user.lastName}
                          deleteFunc={handleDelete}
                        ></ModalDelete>
                        <button
                          type="button"
                          x-data="{ tooltip: 'Edit' }"
                          onClick={() => navigate(`edit/${user.id}`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                            x-tooltip="tooltip"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PaginationGroup
          onPageChange={handlePageChange}
          totalPages={usersPaginatedList.totalPages}
          currentPage={initialFilterValues.pageNumber}
        ></PaginationGroup>
      </div>
    </>
  );
}

export default UsersListPage;
