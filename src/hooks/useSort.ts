import { useNavigate } from "react-router-dom";
import { IFilter, ISortOption } from "../entities/Filter.ts";

interface UseSortProps {
  setInitialFilterValues: React.Dispatch<React.SetStateAction<IFilter>>;
  fetchData: (values: IFilter) => Promise<void>;
  sortOptions: Array<ISortOption>;
}

const useSort = ({
  setInitialFilterValues,
  fetchData,
  sortOptions,
}: UseSortProps) => {
  const navigate = useNavigate();

  const handleSortChange = (selectedItem: number) => {
    const existingParams = new URLSearchParams(window.location.search);
    const currentSort = existingParams.get("sort");
    const currentDirection = existingParams.get("direction");

    const newSort = sortOptions[selectedItem].name;
    const newDirection =
      currentSort === newSort && currentDirection === "asc" ? "desc" : "asc";

    existingParams.set("sort", encodeURIComponent(newSort));
    existingParams.set("direction", newDirection);
    const newParams = existingParams.toString();
    navigate(`?${newParams}`);

    setInitialFilterValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        sortBy: newSort,
        sortDirection: newDirection,
      };
      fetchData(updatedValues);
      return updatedValues;
    });
  };

  return { handleSortChange };
};

export default useSort;
