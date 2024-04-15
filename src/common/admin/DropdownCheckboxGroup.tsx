import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { IRole } from "../../entities/Role.ts";

interface DropdownCheckboxGroupProps {
  label: string;
  items: IRole[];
  selectedItems: string[];
  error?: string | string[] | undefined;
  touched?: boolean | undefined;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  setFieldValue: (field: string, value: string[]) => void;
}

const DropdownCheckboxGroup: FC<DropdownCheckboxGroupProps> = ({
  label,
  items,
  selectedItems,
  error,
  touched,
  handleBlur,
  setFieldValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (name: string) => {
    const updatedSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];

    setFieldValue("roles", updatedSelectedItems);
  };

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

  return (
    <>
      <div className="relative mb-6" ref={dropdownRef}>
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className={`relative z-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            error && touched
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              : ""
          }`}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {label + " "}
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
            className="p-3 pt-0 space-y-1 text-sm text-gray-700 dark:text-gray-200 mt-3"
            aria-labelledby="dropdownBgHoverButton"
          >
            {items.map((item) => {
              return (
                <li key={item.id}>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      onBlur={handleBlur}
                      id={`checkbox-item-${item.id}`}
                      type="checkbox"
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleCheckboxChange(item.name)}
                      key={item.id}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-item-${item.id}`}
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {item.name}
                    </label>
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

export default DropdownCheckboxGroup;
