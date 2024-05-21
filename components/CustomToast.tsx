import { CircleX, FileScan } from "lucide-react";
import React, { useEffect } from "react";
import { toast, Toast } from "react-hot-toast";

interface CustomToastProps {
  message: string;
  t: Toast;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, t }) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     toast.dismiss(t.id);
  //   }, 5000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [t.id]);

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 px-3`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <FileScan />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
              Something went wrong <CircleX className="text-red-700 w-4 h-4" />
            </p>
            <p className="mt-1 text-sm font-medium text-gray-500">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomToast;
