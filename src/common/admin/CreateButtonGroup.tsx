import { FC, InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

interface CreateButtonGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CreateButtonGroup: FC<CreateButtonGroupProps> = ({ label }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-end">
        <button
          type="button"
          className="w-[150px] flex items-center justify-between text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => navigate(`create`)}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            />
          </svg>
          {label}
        </button>
      </div>
    </>
  );
};

export default CreateButtonGroup;
