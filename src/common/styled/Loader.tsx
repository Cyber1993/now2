import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";

const Loader = () => {
  const { isLoading } = useSelector((state: any) => state.loading);
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-25 flex justify-center items-center z-50">
          <div className="relative">
            <TailSpin
              visible={true}
              height={80}
              width={80}
              color="black"
              ariaLabel="tail-spin-loading"
              radius={1}
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
