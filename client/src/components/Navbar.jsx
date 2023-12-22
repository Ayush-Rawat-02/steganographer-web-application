import { useState } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="fixed top-0 w-screen bg-[#44444435] backdrop-blur-xl flex text-white justify-between items-center h-14 pl-8 mobile:pl-10 pr-6 mobile:pr-10 z-[99]">
      <div className="">
        <a href="#head" className="font-logo text-4xl cursor-pointer">
          StEganograpHer...
        </a>
      </div>
      <div className="hidden md:flex w-[18rem] justify-between">
        <a
          href="#about"
          className="font-head text-gray-300 hover:text-white cursor-pointer"
        >
          About
        </a>
        <a
          href="#steganographer"
          className="font-head text-gray-300 hover:text-white cursor-pointer"
        >
          Steganographer
        </a>
        <a
          href="https://portfolio-heavenly-01rawatayush.netlify.app/#contact"
          target="_blank"
          className="font-head text-gray-300 hover:text-white cursor-pointer"
        >
          Contact
        </a>
      </div>
      <div className="md:hidden">
        {toggle ? (
          <AiOutlineClose
            className="w-[1.8rem] h-[1.8rem] cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
        ) : (
          <BiMenuAltLeft
            className="w-[1.8rem] h-[1.8rem] cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
        )}
        <AnimatePresence initial={false} mode="wait">
          {toggle && (
            <motion.div
              initial={{ opacity: 0, y: "-100vw" }}
              animate={{
                opacity: 1,
                y: "0",
                transition: {
                  duration: 0.2,
                  damping: 25,
                },
              }}
              exit={{ opacity: 0, y: "-100%" }}
              className={`flex flex-col absolute top-[4rem] right-0 bg-black px-6 py-2 leading-10`}
            >
              <a
                onClick={() => setToggle(!toggle)}
                className={`text-[17px] font-head text-gray-300 hover:text-white`}
                href="#about"
              >
                About
              </a>
              <a
                onClick={() => setToggle(!toggle)}
                className={`text-[17px] font-head text-gray-300 hover:text-white`}
                href="#steganographer"
              >
                Steganographer
              </a>
              <a
                onClick={() => setToggle(!toggle)}
                className={`text-[17px] font-head text-gray-300 hover:text-white`}
                href="https://portfolio-heavenly-01rawatayush.netlify.app/#contact"
                target="_blank"
              >
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
