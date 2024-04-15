import { ChangeEvent, FC, InputHTMLAttributes } from "react";

interface CheckboxGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  touched?: boolean | undefined;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  label,
  field,
  handleChange,
  error,
  touched,
  handleBlur,
  checked,
}) => {
  return (
    <>
      <div className="relative mb-5">
        {label && (
          <label
            htmlFor="checkbox-group-1"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        <input
          onBlur={handleBlur}
          className={`block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            error && touched
              ? "block bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 dark:bg-red-100 dark:border-red-400"
              : ""
          }`}
          type="checkbox"
          checked={checked}
          name={field}
          aria-label={label}
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
        {error && touched && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default CheckboxGroup;
