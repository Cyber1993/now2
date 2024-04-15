import { useNavigate } from "react-router-dom";
import { IFilter } from "../entities/Filter.ts";
import { useState } from "react";

interface UseSearchProps {
  setInitialFilterValues: React.Dispatch<React.SetStateAction<IFilter>>;
  fetchData: (values: IFilter) => Promise<void>;
}

const useSearch = ({ setInitialFilterValues, fetchData }: UseSearchProps) => {
  const [searchTimer, setSearchTimer] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearchChange = (searchTerm: string) => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const newTimer = setTimeout(() => {
      const existingParams = new URLSearchParams(window.location.search);
      if (searchTerm.trim() !== "") {
        existingParams.set("search", encodeURIComponent(searchTerm));
      } else {
        existingParams.delete("search");
      }
      existingParams.set("page", "1");
      const newParams = existingParams.toString();
      navigate(`?${newParams}`);

      setInitialFilterValues((prevValues) => {
        const updatedValues = {
          ...prevValues,
          searchTerm: searchTerm,
          pageNumber: 1,
        };
        fetchData(updatedValues);
        return updatedValues;
      });
    }, 500);

    setSearchTimer(newTimer);
  };

  return { handleSearchChange };
};

export default useSearch;
