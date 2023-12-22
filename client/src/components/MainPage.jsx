import React, { useRef, useState } from 'react'
import Image from './Image'
import axios from 'axios';
import Modal from './Modal';
import Button from './Button';
import Encrypt from './Encrypt';
import Decrypt from './Decrypt';

const MainPage = ({steganoRef}) => {
    const [tab, setTab] = useState(0);

  return (
    <div id='steganographer' ref={steganoRef} className='bg-gray-900 min-h-screen flex flex-col py-[4rem] px-4 md:px-[4rem] gap-8'>
        <h1 className='text-blue-400 text-2xl font-semibold'>Select your choice</h1>
        <div className="flex flex-col p-6 md:p-[4rem] pt-6 items-center justify-center bg-gray-700 w-full min-h-[80vh]">
          {
            tab==0&&
            <div className='flex flex-col items-center justify-center gap-[6rem]'>
              <Button setter={()=>setTab(1)} >
                <h1 className='text-black'>Encrypt an Image</h1>
              </Button>
              <Button setter={()=>setTab(2)} >
                <h1 className='text-black'>Decrypt an Image</h1>
              </Button>
            </div>
          }
          {tab==1&&<Encrypt setTab={setTab} />}
          {tab==2&&<Decrypt setTab={setTab} />}
        </div>
      {/* {cartoonifiedImage&&
        <button 
        className='bg-red-500 rounded-md px-4 py-2 w-[8rem] hover:ring-4 hover:bg-red-400'
        onClick={()=>{
          setCartoonifiedImage(null)
          setFile1("")
          setSelectedFile(null)
          selectRef.current.value=null
        }}
        >
          <h1 className='font-bold text-md text-white'>Reset</h1>
        </button>
      }
      <div className="flex justify-around gap-8 flex-col lg:flex-row lg:flex-wrap">
        {file1&&(
            <div className='flex flex-col items-center gap-8'>
            <h1 className='text-white text-lg font-semibold'>Original Image</h1>
            <img src={file1} alt="Original Image" />
            </div>
        )}
        {cartoonifiedImage && (
            <Image cartoonifiedImage={cartoonifiedImage} setShowModal={setShowModal}/>
        )}
        {showModal&&<Modal cartoonifiedImage={cartoonifiedImage} setShowModal={setShowModal} />}
      </div> */}
    </div>
  )
}

export default MainPage