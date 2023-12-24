import React from "react";
import bg from "../assets/cyber.jpg";

const Hero = ({ steganoRef }) => {
  return (
    <div
      id="head"
      className="flex flex-col items-center justify-center min-h-screen p-[4rem] gap-8 overflow-hidden relative"
    >
      <img
        src={bg}
        className="z-[1] absolute top-0 md:right-0 h-screen w-[125rem] max-w-[125rem] md:w-screen md:h-screen"
      />
      <h1 className=" bg-[#000000b0] p-[1rem] font-sans md:text-center z-[9] text-violet-200 text-4xl sm:max-lg:text-5xl lg:text-6xl font-bold">
        Encrypt and Decrypt Images with ease!
      </h1>
      <h2
        onClick={() => {
          steganoRef.current.scrollIntoView({ behaviour: "smooth" });
        }}
        className="bg-[#00000090] p-[1rem] font-logo cursor-pointer md:text-center w-full z-[9] hover:text-blue-200 text-blue-400 text-4xl sm:max-lg:text-5xl lg:text-6xl font-bold"
      >
        Get Started
      </h2>
    </div>
  );
};

export default Hero;
