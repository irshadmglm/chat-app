import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import {useAuthStore} from './store/useAuthStore'

const App = () => {
  const {authUser, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({authUser});
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App