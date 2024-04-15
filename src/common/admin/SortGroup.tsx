import { FC, useEffect, useState } from "react";

interface SortOption {
  id: number;
  name: string;
  label: string;
}

interface SortGroupProps<T extends SortOption> {
  onSelect: (selectedItem: number) => void;
  options: T[];
  label: string;
  optionKey: keyof T;
  optionLabel: keyof T;
  value: string;
}

const SortGroup: FC<SortGroupProps<SortOption>> = ({
  onSelect,
  options,
  label,
  optionKey,
  optionLabel,
  value,
}) => {
  const [selectedItem, setSelectedItem] = useState<number>();

  useEffect(() => {
    setSelectedItem(options.find((option) => option.name === value)?.id ?? -1);
  }, [location.search]);

  const handleSelectChange = (item: number) => {
    if (item >= 0) {
      setSelectedItem(item);
      onSelect(item);
    }
  };

  return (
    <>
      <div className="w-[300px]">
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => handleSelectChange(parseInt(e.target.value))}
          value={selectedItem}
        >
          <option value={-1}>{label}</option>
          {options.map((item) => (
            <option key={item[optionKey]} value={item[optionKey]}>
              {item[optionLabel]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SortGroup;
