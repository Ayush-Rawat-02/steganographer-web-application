import React from 'react'

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-[#0009] backdrop-blur-[2px] flex justify-center items-center z-[9]'>
      <h1 className='text-4xl text-white font-semibold'>Server initializing ...</h1>
    </div>
  )
}

export default Loader