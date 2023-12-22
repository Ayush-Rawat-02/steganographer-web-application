import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Image = ({sourceName, setShowModal}) => {
  return (
    <div className=''>
        <img 
        className='transition ease-in-out delay-50 cursor-zoom-in hover:scale-[1.05] md:hover:scale-[1.2] transition duration-300'
        onClick={()=>{setShowModal(true)}}
        // src={`http://127.0.0.9:8080/steganographer/image?name=${sourceName}`} 
        src={`https://steganographer-flask-server.onrender.com/steganographer/image?name=${sourceName}`} 
        alt="Steganographed Image" 
        />
    </div>
  )
}

export default Image