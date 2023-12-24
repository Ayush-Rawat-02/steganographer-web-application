import axios from "axios";
import React, { useRef, useState } from "react";
import Image from "./Image";
import Modal from "./Modal";
import { IoArrowBack } from "react-icons/io5";
import Button from "./Button";

const Encrypt = ({ setTab }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [secretImage, setSecretImage] = useState(null);
  const [converting, setConverting] = useState(false);
  const [steganographed, setSteganographed] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cipherMode, setCipherMode] = useState(0);
  const [text, setText] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setConverting(true);
    try {
      const data = new FormData();
      data.append("cover", coverImage, coverImage.name);
      data.append("mode", cipherMode);
      if (cipherMode == 1) {
        data.append("secret", secretImage, secretImage.name);
      } else {
        data.append("text", text);
      }
      const response = await axios.post(
        // "http://127.0.0.9:8080/steganographer/cipher",
        "https://steganographer-flask-server.onrender.com/steganographer/cipher",
        data
      );
      setSteganographed(response.data);
      selectRef1.current.value = null;
      selectRef2.current.value = null;
      setText("");
      console.log(response);
      setConverting(false);
    } catch (err) {
      console.log(err);
      setConverting(false);
      return;
    }
  };

  return (
    <div className="h-full w-full flex flex-col min-h-[65vh]">
      <div className="flex gap-[8rem] items-center">
        <IoArrowBack
          onClick={() => setTab(0)}
          className="text-white transition ease-in-out scale-[1.75] cursor-pointer hover:scale-[2.2] duration-300"
        />
        {steganographed != null && (
          <Button
            setter={() => {
              setSteganographed(null);
              setFile1(null);
              setFile2(null);
              setText("");
            }}
          >
            <h1>Reset</h1>
          </Button>
        )}
      </div>
      <div className="flex flex-col w-full h-full justify-center items-center min-h-[65vh]">
        {steganographed ? (
          <div className="flex flex-col gap-12 items-center">
            <h1 className="text-lg font-semibold text-white">
              Encrypted Image (click to view )
            </h1>
            <Image sourceName={steganographed} setShowModal={setShowModal} />
          </div>
        ) : (
          <form
            className="flex flex-col items-center gap-5 w-full"
            onSubmit={submitHandler}
          >
            <div className="flex flex-col md:flex-row justify-around w-full md:min-w-[31rem] max-w-[31rem] md:gap-[1.25rem]">
              <label className="text-white">Carrier Image : </label>
              <input
                ref={selectRef1}
                type="file"
                name="image"
                onChange={(e) => {
                  setCoverImage(e.target.files[0]);
                  if (e.target.files && e.target.files[0])
                    setFile1(URL.createObjectURL(e.target.files[0]));
                }}
                className="text-white font-bold rounded-md bg-[#0006] hover:ring-1"
              />
            </div>
            {cipherMode == 1 && (
              <div className="flex flex-col md:flex-row justify-around w-full md:min-w-[30rem] max-w-[30rem]">
                <label className="text-white">Secret Message : </label>
                <input
                  ref={selectRef2}
                  type="file"
                  name="image"
                  onChange={(e) => {
                    setSecretImage(e.target.files[0]);
                    if (e.target.files && e.target.files[0])
                      setFile2(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="text-white font-bold rounded-md bg-[#0006] hover:ring-1"
                />
              </div>
            )}
            {cipherMode == 2 && (
              <div className="flex flex-col md:flex-row justify-around w-full md:min-w-[30rem] max-w-[30rem]">
                <textarea
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your secret message"
                  className="text-black font-bold px-2 py-1 w-full rounded-md resize-none"
                  rows={4}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-around w-full md:min-w-[30rem] max-w-[30rem]">
              <select
                className="px-2 py-1 rounded-md hover:ring-2 w-full"
                name="cipherMode"
                value={cipherMode}
                onChange={(e) => setCipherMode(e.target.value)}
              >
                <option className="bg-gray-700 text-white" value="0" disabled>
                  Select Secret Type
                </option>
                <option className="bg-gray-600 text-white" value="1">
                  Image
                </option>
                <option className="bg-gray-600 text-white" value="2">
                  Text
                </option>
              </select>
            </div>
            {!steganographed && (
              <>
                <div className="flex flex-wrap items-center justify-around gap-12">
                  {file1 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="max-h-[20rem] overflow-hidden">
                        <img className="h-[20rem]" src={file1} />
                      </div>
                      <h1 className="text-white text-[18px]">Carrier Image</h1>
                    </div>
                  )}
                  {file2 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="max-h-[20rem] overflow-hidden">
                        <img className="h-[20rem]" src={file2} />
                      </div>
                      <h1 className="text-white text-[18px]">Secret Image</h1>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={
                    converting ||
                    coverImage == null ||
                    cipherMode == 0 ||
                    (cipherMode == 1 && secretImage == null) ||
                    (cipherMode == 2 && text == "")
                  }
                  className="bg-blue-300 rounded-md px-4 py-2 w-[8rem] disabled:bg-gray-800 disabled:ring-0 hover:bg-gray-400 hover:ring-4"
                >
                  <h1 className="font-bold text-md text-white">
                    {converting ? "Encrypting..." : "Encrypt"}
                  </h1>
                </button>
              </>
            )}
          </form>
        )}
        {showModal && (
          <Modal sourceName={steganographed} setShowModal={setShowModal} />
        )}
      </div>
    </div>
  );
};

export default Encrypt;
