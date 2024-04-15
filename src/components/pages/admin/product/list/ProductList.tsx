import { SetStateAction, useEffect, useState } from "react";
import http_common from "../../../../../http_common.ts";
import ModalDelete from "../../../../../common/admin/ModalDelete.tsx";
import { useNavigate } from "react-router-dom";
import SearchGroupProducts from "../../../../../common/admin/SearchGroup.tsx";
import PaginationGroup from "../../../../../common/admin/PaginationGroup.tsx";
import SortGroup from "../../../../../common/admin/SortGroup.tsx";
import { IFilter, IPaginatedList } from "../../../../../entities/Filter.ts";
import { IProduct } from "../../../../../entities/Product.ts";
import CreateButton from "../../../../../common/admin/CreateButtonGroup.tsx";
import { ICategory } from "../../../../../entities/Category.ts";
import useSort from "../../../../../hooks/useSort.ts";
import useSearch from "../../../../../hooks/useSearch.ts";
import usePage from "../../../../../hooks/usePage.ts";
interface SortOption {
  id: number;
  name: string;
  label: string;
}
function ProductsList() {
  const [ProductsPaginatedList, setProductsPaginatedList] = useState<
    IPaginatedList<IProduct>
  >({ totalPages: 0, items: [] });
  const [categories, setCategories] = useState<SortOption[]>([]);

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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await http_common.get<ICategory[]>("api/Categories");
      const options: SortOption[] = response.data.map((category: any) => ({
        id: category.id - 1,
        name: category.name,
        label: category.name,
      }));
      setCategories(options);
    } catch (error) {
      console.error("Error fetching sort categories:", error);
    }
  };
  const queryParams = new URLSearchParams(location.search);

  const [initialFilterValues, setInitialFilterValues] = useState<IFilter>({
    pageNumber: parseInt(queryParams.get("page") ?? "1"),
    pageSize: 10,
    searchTerm: queryParams.get("search") ?? "",
    sortBy: queryParams.get("sort") ?? "",
    sortDirection: "asc",
    sorting: queryParams.get("sorting") ?? "",
  });

  const sortOptions = [
    { id: 0, name: "Name", label: "Name" },
    { id: 1, name: "Description", label: "Description" },
  ];

  const fetchData = async (values: IFilter) => {
    try {
      const resp = await http_common.get<IPaginatedList<IProduct>>(
        `api/Products/getByFilter?${convertFilterToQueryString(values)}`,
      );
      setProductsPaginatedList(resp.data);
    } catch (error) {
      console.error("Error fetching Product data:", error);
    }
  };

  const { handleSortChange } = useSort({
    setInitialFilterValues,
    fetchData,
    sortOptions,
  });

  const handleCategoryChange = (selectedItem: number) => {
    setInitialFilterValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        sorting: (categories[selectedItem].id + 1).toString(),
      };
      fetchData(updatedValues);
      return updatedValues;
    });
  };

  const handleDelete = async (id: number | string) => {
    try {
      await http_common.delete(`api/Products/${id}`).then(() => {
        http_common
          .get(
            `api/Products/getByFilter?${convertFilterToQueryString(
              initialFilterValues,
            )}`,
          )
          .then((resp: { data: SetStateAction<IPaginatedList<IProduct>> }) => {
            setProductsPaginatedList(resp.data);
          });
      });
    } catch (error) {
      console.error("Error deleting category:", error);
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

  return (
    <>
      <div className="p-5 sm:ml-64">
        <div className="flex gap-5">
          <SearchGroupProducts
            onSearch={handleSearchChange}
            name="Search Products"
            value={initialFilterValues.searchTerm}
            label="Search products"
          ></SearchGroupProducts>
          <CreateButton label={"Add Product"}></CreateButton>
          <SortGroup
            onSelect={handleSortChange}
            optionKey="id"
            optionLabel="label"
            label="Sort by"
            options={sortOptions}
            value={initialFilterValues.sortBy}
          ></SortGroup>
          <SortGroup
            onSelect={handleCategoryChange}
            optionKey="id"
            optionLabel="label"
            label="Choose category"
            options={categories}
            value={initialFilterValues.sorting}
          ></SortGroup>
        </div>
        <div className="flex-grow overflow-hidden rounded-lg border border-gray-200 shadow-md mt-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Id
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Description
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Rating
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    Discount
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {ProductsPaginatedList.items.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={`${http_common.getUri()}/images/300_${
                            product.images[0].image
                          }`}
                          alt=""
                        />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-400">{product.title}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{product.id}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4">{product.rating}</td>
                    <td className="px-6 py-4">{product.discount}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <ModalDelete
                          id={product.id}
                          text={product.description}
                          deleteFunc={handleDelete}
                        ></ModalDelete>
                        <button
                          type="button"
                          x-data="{ tooltip: 'Edit' }"
                          onClick={() => navigate(`edit/${product.id}`)}
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
          totalPages={ProductsPaginatedList.totalPages}
          onPageChange={handlePageChange}
          currentPage={initialFilterValues.pageNumber}
        ></PaginationGroup>
      </div>
    </>
  );
}

export default ProductsList;
