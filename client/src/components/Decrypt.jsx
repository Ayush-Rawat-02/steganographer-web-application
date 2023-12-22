import axios from 'axios';
import React, { useRef, useState } from 'react'
import Image from './Image';
import Modal from './Modal';
import { IoArrowBack } from "react-icons/io5";
import Button from './Button';

const Decrypt = ({setTab}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [decrypted, setDecrypted] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const selectRef = useRef(null);


    const submitHandler = async (e) => {
        e.preventDefault();
        setConverting(true);
        try{
        const data = new FormData();
        data.append("file", selectedFile, selectedFile.name);
        const response = await axios.post(
            // "http://127.0.0.9:8080/steganographer/decipher",
            "https://steganographer-flask-server.onrender.com/steganographer/decipher",
            data
        );
        setDecrypted(response.data);
        selectRef.current.value=null
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
            {(decrypted!=null)&&
            <Button setter={()=>{
                setDecrypted(null)
            }}>
                <h1>Reset</h1>
            </Button>
            }
        </div>
        <div className="flex flex-col w-full h-full justify-center items-center min-h-[65vh]">
            {decrypted?
            <div className="flex flex-col gap-12 items-center">
                <h1 className='text-lg font-semibold'>Decrypted Image (click to view )</h1>
                <Image sourceName={decrypted} setShowModal={setShowModal}/>
            </div>
            :
            <form 
            className='flex flex-col gap-5 w-full items-center'
            onSubmit={submitHandler}
            >
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    <lable className='text-white'>Encrypted Image : </lable>
                    <input
                    ref={selectRef}
                    type="file"
                    name="image"
                    onChange={(e) => {
                        setSelectedFile(e.target.files[0])
                        // if(e.target.files&&e.target.files[0])
                        //   setFile(URL.createObjectURL(e.target.files[0]))
                    }}
                    className='text-white font-bold'
                    />
                </div>
                {!decrypted&&
                <button 
                type="submit"
                disabled={converting||(selectedFile==null)}
                className='bg-blue-300 rounded-md px-4 py-2 w-[8rem] disabled:bg-gray-800 disabled:ring-0 hover:bg-gray-400 hover:ring-4'
                >
                    <h1 className='font-bold text-md text-white'>{converting?"Decrypting...":"Decrypt"}</h1>
                    </button>  
                }
                </form>
            }
            {showModal&&<Modal sourceName={decrypted} setShowModal={setShowModal} />}
        </div>
    </div>
  )
}

export default Decrypt