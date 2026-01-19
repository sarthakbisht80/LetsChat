import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import Search from './pages/Search/Search'
import TVShows from './pages/TVShows/TVShows'
import Movies from './pages/Movies/Movies'
import NewPopular from './pages/NewPopular/NewPopular'
import MyList from './pages/MyList/MyList'
import Languages from './pages/Languages/Languages'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoreInfo from './pages/MoreInfo/MoreInfo'

const App = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    
    onAuthStateChanged(auth, async (user)=>{
      if(user){
        console.log("Logged In");
        navigate('/');
      }else{
        console.log("Logged Out");
        navigate('/login');
      }
    })
  },[])

  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/player/:id' element={<Player/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/tv-shows' element={<TVShows/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/new-popular' element={<NewPopular/>}/>
        <Route path='/my-list' element={<MyList/>}/>
        <Route path='/languages' element={<Languages/>}/>
        <Route path="/movie/:id" element={<MoreInfo/>} />
      </Routes>
      
    </div>
  )
}

export default App
