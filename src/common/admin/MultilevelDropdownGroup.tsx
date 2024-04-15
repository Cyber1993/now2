import { FC, useEffect, useRef, useState } from "react";
import { ICategory } from "../../entities/Category.ts";
import http_common from "../../http_common.ts";

interface MultilevelDropdownGroupProps {
  label: string;
  items: ICategory[];
  error?: string | string[] | undefined;
  touched?: boolean | undefined;
  selectedItem: number | null;
  setFieldValue: (field: string, value: number | null) => void;
}

const MultilevelDropdownGroup: FC<MultilevelDropdownGroupProps> = ({
  label,
  items,
  error,
  touched,
  selectedItem,
  setFieldValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleScroll = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [hoveredCategories, setHoveredCategories] = useState<number[]>([]);

  const [subcategories, setSubcategories] = useState<{
    [parentId: number]: ICategory[];
  }>({});

  const fetchSubcategories = (id: number) => {
    setSubcategories((prevSubcategories) => ({
      ...prevSubcategories,
      [id]: items.filter((c) => c.parentCategoryId === id),
    }));
  };

  const handleSubcategoryMouseEnter = (id: number) => {
    setHoveredCategories((prevHoveredCategories) => [
      ...prevHoveredCategories,
      id,
    ]);
    if (!subcategories[id]) {
      fetchSubcategories(id);
    }
  };

  const handleSubcategoryMouseLeave = (id: number) => {
    setHoveredCategories((prevHoveredCategories) =>
      prevHoveredCategories.filter((categoryId) => categoryId !== id),
    );
  };

  const renderSubcategories = (id: number) => {
    if (hoveredCategories.includes(id) && subcategories[id]?.length) {
      return (
        <ul
          className="ml-48 -mt-3 absolute text-sm text-gray-700 dark:text-gray-200 pt-1 pb-1 w-48 bg-white rounded-lg shadow dark:bg-gray-700"
          aria-labelledby="dropdownBgHoverButton"
          style={{
            marginLeft: "11.5rem",
          }}
        >
          {subcategories[id].map((item: ICategory) => (
            <li
              key={item.id}
              onMouseEnter={() => handleSubcategoryMouseEnter(item.id)}
              onMouseLeave={() => handleSubcategoryMouseLeave(item.id)}
              onClick={(e) => {
                handleParentCategoryChange(item.id);
                setIsDropdownOpen(false);
                e.stopPropagation();
              }}
            >
              <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="relative h-5 w-6">
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={`${http_common.getUri()}/Images/150_${item.image}`}
                    alt=""
                  />
                </div>
                <label
                  htmlFor={`checkbox-item-${item.id}`}
                  className="flex justify-between w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                  {item.name}
                  {items.some((c) => c.parentCategoryId === item.id) ? (
                    <i className="bi bi-chevron-right"></i>
                  ) : null}
                </label>
                {renderSubcategories(item.id)}
              </div>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const handleParentCategoryChange = (id: number | null) => {
    setFieldValue("parentCategoryId", id);
  };

  return (
    <>
      <div className="relative mb-6" ref={dropdownRef}>
        <label
          htmlFor="input-group-1"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className={`w-[200px] justify-between relative z-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            error && touched
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              : ""
          }`}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedItem
            ? items.find((x) => x.id === selectedItem)?.name
            : "No parent category"}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          id="dropdownBgHover"
          className={`absolute top-full z-20 mt-3 ${
            isDropdownOpen ? "" : "hidden"
          } w-48 bg-white rounded-lg shadow dark:bg-gray-700`}
        >
          <ul
            className="text-sm text-gray-700 dark:text-gray-200 pt-1 pb-1"
            aria-labelledby="dropdownBgHoverButton"
          >
            <li
              onClick={(e) => {
                handleParentCategoryChange(null);
                setIsDropdownOpen(false);
                e.stopPropagation();
              }}
            >
              <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <label className="flex justify-between w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                  No parent category
                </label>
              </div>
            </li>
            {items
              .filter((item) => item.parentCategoryId === null)
              .map((item) => {
                return (
                  <li
                    key={item.id}
                    onMouseEnter={() => handleSubcategoryMouseEnter(item.id)}
                    onMouseLeave={() => handleSubcategoryMouseLeave(item.id)}
                    onClick={() => {
                      handleParentCategoryChange(item.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="relative h-5 w-6">
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={`${http_common.getUri()}/Images/150_${
                            item.image
                          }`}
                          alt=""
                        />
                      </div>
                      <label
                        htmlFor={`checkbox-item-${item.id}`}
                        className="flex justify-between w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        {item.name}
                        {items.some((c) => c.parentCategoryId === item.id) ? (
                          <i className="bi bi-chevron-right"></i>
                        ) : null}
                      </label>
                      {renderSubcategories(item.id)}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        {error && touched && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default MultilevelDropdownGroup;
