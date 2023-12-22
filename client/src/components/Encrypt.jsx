import axios from 'axios';
import React, { useRef, useState } from 'react'
import Image from './Image';
import Modal from './Modal';
import { IoArrowBack } from "react-icons/io5";
import Button from './Button';

const Encrypt = ({setTab}) => {
    const [coverImage, setCoverImage] = useState(null);
    const [secretImage, setSecretImage] = useState(null);
    const [converting, setConverting] = useState(false);
    const [steganographed, setSteganographed] = useState(null);
    const [showModal, setShowModal] = useState(false)

    const selectRef1 = useRef(null)
    const selectRef2 = useRef(null)

    const submitHandler = async (e) => {
        e.preventDefault();
        setConverting(true);
        try{
        const data = new FormData();
        data.append("cover", coverImage, coverImage.name);
        data.append("secret", secretImage, secretImage.name);
        const response = await axios.post(
            // "http://127.0.0.9:8080/steganographer/cipher",
            "https://steganographer-flask-server.onrender.com/steganographer/cipher",
            data
        );
        setSteganographed(response.data);
        selectRef1.current.value=null
        selectRef2.current.value=null
        console.log(response);
        setConverting(false);
        }
        catch(err){
        console.log(err)
        setConverting(true);
        return
        }
    };

  return (
    <div className='h-full w-full flex flex-col min-h-[65vh]'>
        <div className="flex gap-[8rem] items-center">
            <IoArrowBack 
            onClick={()=>setTab(0)}
            className='text-white transition ease-in-out scale-[1.75] cursor-pointer hover:scale-[2.2] duration-300'
            />
            {(steganographed!=null)&&
            <Button setter={()=>{
                setSteganographed(null)
            }}>
                <h1>Reset</h1>
            </Button>
            }
        </div>
        <div className="flex flex-col w-full h-full justify-center items-center min-h-[65vh]">
        {steganographed?
        <div className="flex flex-col gap-12 items-center">
            <h1 className='text-lg font-semibold'>Encrypted Image (click to view )</h1>
            <Image sourceName={steganographed} setShowModal={setShowModal}/>
        </div>
        :
        <form 
        className='flex flex-col items-center gap-5 w-full'
        onSubmit={submitHandler}
        >
        <div className='flex flex-col md:flex-row justify-around w-full md:min-w-[31rem] max-w-[31rem] md:gap-[1.25rem]'>
            <label className='text-white'>Carrier Image : </label>
            <input
            ref={selectRef1}
            type="file"
            name="image"
            onChange={(e) => {
                setCoverImage(e.target.files[0])
                if(e.target.files&&e.target.files[0])
                setFile1(URL.createObjectURL(e.target.files[0]))
            }}
            className='text-white font-bold'
            />
        </div>
        <div className='flex flex-col md:flex-row justify-around w-full md:min-w-[30rem] max-w-[30rem]'>
            <label className='text-white'>Secret Message : </label>
            <input
            ref={selectRef2}
            type="file"
            name="image"
            onChange={(e) => {
                setSecretImage(e.target.files[0])
                if(e.target.files&&e.target.files[0])
                setFile2(URL.createObjectURL(e.target.files[0]))
            }}
            className='text-white font-bold'
            />
        </div>
        {!steganographed&&
          <button 
          type="submit"
          disabled={converting||coverImage==null||secretImage==null}
          className='bg-blue-300 rounded-md px-4 py-2 w-[8rem] disabled:bg-gray-800 disabled:ring-0 hover:bg-gray-400 hover:ring-4'
          >
            <h1 className='font-bold text-md text-white'>{converting?"Encrypting...":"Encrypt"}</h1>
            </button>  
        }
        </form>
        }
        {showModal&&<Modal sourceName={steganographed} setShowModal={setShowModal} />}
      </div>
    </div>
  )
}

export default Encrypt