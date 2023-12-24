import React from "react";
import { AiFillLinkedin } from "react-icons/ai";

function Footer() {
  return (
    <div id="about" className="flex flex-col phablet:px-[10rem] bg-[#fdf2ec]">
      <div className="flex flex-col phablet:flex-row border-b-[1px] border-gray-300 items-center justify-between pb-[8rem] gap-12 phablet:gap-0">
        <h1 className="font-logo text-black text-4xl md:text-6xl mt-[7rem]">
          StEganograpHer...
        </h1>
        <h2 className="text-center font-logo text-xl">
          Made with ❤ by <hr />
          <a
            href="https://portfolio-heavenly-01rawatayush.netlify.app/"
            target="_blank"
            className="font-logo text-xl text-blue-500 hover:text-blue-900"
          >
            _heavenLy
          </a>
        </h2>
        <div className="flex flex-col gap-2 items-center phablet:items-start">
          <a
            href="https://portfolio-heavenly-01rawatayush.netlify.app/#contact"
            target="_blank"
            className="font-head text-md sm:text-lg text-gray-600 hover:text-black"
          >
            Contact us
          </a>
          <a
            href="#"
            // target="_blank"
            className="font-head text-md sm:text-lg text-gray-600 hover:text-black"
          >
            Source Code
          </a>
        </div>
      </div>
      <div className="flex flex-col phablet:flex-row items-center justify-between py-[3rem] gap-4">
        <h1 className="text-[16px] font-[500] text-[#767575]">
          © _heavenly's steganographer...
        </h1>
        <div className="flex gap-4">
          <AiFillLinkedin
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/ayush-rawat-246129234/",
                "_blank"
              )
            }
            className="w-7 h-7 cursor-pointer text-blue-500 hover:text-black"
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
