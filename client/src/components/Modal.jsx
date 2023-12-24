import React from "react";

const Modal = ({ sourceName, setShowModal }) => {
  const downloadImage = async () => {
    // const response = await fetch(
    //   `http://127.0.0.9:8080/steganographer/image?name=${sourceName}`
    // );
    const response = await fetch(
      `https://steganographer-flask-server.onrender.com/steganographer/image?name=${sourceName}`
    );

    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement("a");
    anchorElement.href = href;
    anchorElement.download = "Downloaded new-" + sourceName;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  };

  return (
    <div
      onClick={() => {
        setShowModal(false);
      }}
      className="z-[9] w-full h-full flex items-center justify-center fixed top-0 left-0 backdrop-blur-[3px] bg-[#000000b0] overflow-y-scroll"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col lg:flex-row justify-between bg-gray-700 w-[80vw] min-h-[80vh] p-4"
      >
        <img
          className="flex-4"
        //   src={`http://127.0.0.9:8080/steganographer/image?name=${sourceName}`}
          src={`https://steganographer-flask-server.onrender.com/steganographer/image?name=${sourceName}`}
          alt="Steganographed Image"
        />
        <div className="flex-1 flex flex-col sm:max-lg:flex-row lg:flex-col gap-4 sm:gap-16 items-center justify-center p-4">
          <button
            onClick={downloadImage}
            className="bg-green-500 px-6 py-2 rounded-md w-full sm:w-[15rem] hover:ring-4 text-lg font-semibold text-white"
          >
            Download
          </button>
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className="bg-red-500 px-6 py-2 rounded-md w-full sm:w-[15rem] hover:bg-red-400 text-lg font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
