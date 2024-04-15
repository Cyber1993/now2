import { useNavigate } from "react-router-dom";
import { IFilter } from "../entities/Filter.ts";

interface UsePageProps {
  setInitialFilterValues: React.Dispatch<React.SetStateAction<IFilter>>;
  fetchData: (values: IFilter) => Promise<void>;
}

const usePage = ({ setInitialFilterValues, fetchData }: UsePageProps) => {
  const navigate = useNavigate();

  const handlePageChange = (pageNumber: number) => {
    const existingParams = new URLSearchParams(window.location.search);
    existingParams.set("page", encodeURIComponent(pageNumber));
    const newParams = existingParams.toString();
    navigate(`?${newParams}`);

    setInitialFilterValues((prevValues) => {
      const updatedValues = { ...prevValues, pageNumber: pageNumber };
      fetchData(updatedValues);
      return updatedValues;
    });
  };

  return { handlePageChange };
};

export default usePage;
