import React from "react";

const Loading2 = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default Loading2;
