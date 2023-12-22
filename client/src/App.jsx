import React, { useRef } from 'react'
import MainPage from './components/MainPage'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const App = () => {
  const steganoRef = useRef(null)
  return (
    <div>
      <Navbar/>
      <Hero steganoRef={steganoRef}/>
      <MainPage steganoRef={steganoRef}/>
      <Footer/>
    </div>
  )
}

export default App