import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Coin from './pages/Coin/Coin';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if(currentUser && window.location.pathname === '/login') {
        navigate('/');
      }
      else if(!currentUser && window.location.pathname !== '/login') {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className='app'>
        <div className="spinner">
          <div className="spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='app'>
      {user && <Navbar/>}
      <Routes>
        {user ? (
          
          <>
            <Route path='/' element={<Home/>}/>
            <Route path='/coin/:coinId' element={<Coin/>}/>
            <Route path='/login' element={<Home/>}/> {/* Redirect authenticated users from login to home */}
          </>
        ) : (
         
          <>
            <Route path='/login' element={<Login/>} />
            <Route path='/*' element={<Login/>} /> {/* Redirect all other routes to login */}
          </>
        )}
      </Routes>
      {user && <Footer/>}
      <ToastContainer />
    </div>
  )
}

export default App
