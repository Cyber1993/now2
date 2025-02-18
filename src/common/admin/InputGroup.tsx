import { ChangeEvent, FC, InputHTMLAttributes } from "react";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  touched?: boolean | undefined;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  success?: string;
}

const InputGroup: FC<InputGroupProps> = ({
  label,
  type,
  field,
  handleChange,
  error,
  touched,
  handleBlur,
  value,
  placeholder,
  success,
}) => {
  return (
    <>
      <div className={`relative mb-5 ${success ? "mb-6" : ""}`}>
        {label && (
          <label
            htmlFor="input-group-1"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        <input
          onBlur={handleBlur}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            error && touched
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
              : success
              ? "bg-green-50 border border-green-500 text-green-900 placeholder-green-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              : ""
          }`}
          type={type}
          placeholder={placeholder}
          value={value}
          name={field}
          aria-label={label}
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
        {success && !error && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-500">
            {success}
          </div>
        )}
        {error && touched && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-500">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default InputGroup;
