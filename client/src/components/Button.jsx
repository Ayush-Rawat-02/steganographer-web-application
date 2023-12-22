import React from "react";

function Button({ children, padding, full, setter }) {
  if (full)
    return (
      <button
        onClick={setter}
        className={`transition ease-in-out flex items-center justify-center gap-2 border-[1px] border-gray-300 hover:border-gray-500 bg-white px-6 py-2 rounded-2xl text-xl font-semibold duration-500 my-4 w-[85vw] phablet:w-fit px-[${padding}rem]`}
      >
        {children}
      </button>
    );
  else
    return (
      <button
        onClick={setter}
        className={`transition ease-in-out flex items-center justify-center gap-2 border-[1px] border-gray-300 hover:border-gray-500 bg-white px-6 py-2 rounded-2xl text-xl font-semibold duration-500 my-4 w-fit px-[${padding}rem]`}
      >
        {children}
      </button>
    );
}

export default Button;
