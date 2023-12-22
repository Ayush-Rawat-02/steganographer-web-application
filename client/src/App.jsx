import React, { useEffect, useRef, useState } from 'react'
import MainPage from './components/MainPage'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Loader from './components/Loader'
import axios from 'axios'

const App = () => {
  const steganoRef = useRef(null)
  const [initializing, setInitializing] = useState(true)

  const initialize = async()=>{
    try{
      // const res = await axios.get("http://127.0.0.9:8080/")
      const res = await axios.get("https://steganographer-flask-server.onrender.com/")
      if(res){
        // alert(res.data)
        setInitializing(false)
      }
    }
    catch(err){
      console.log(err)
      return
    }
  }

  useEffect(()=>{
    initialize()
  },[])

  return (
    <div>
      <Navbar/>
      <Hero steganoRef={steganoRef}/>
      <MainPage steganoRef={steganoRef}/>
      <Footer/>
      {initializing&&<Loader/>}
    </div>
  )
}

export default App