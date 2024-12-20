import React, {useState, useEffect} from 'react';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import UserProfile from './page/UserProfilePage';
import FriendListPage from './page/FriendListPage';
import FriendRequestPage from './page/FriendRequestPage';
import FriendSearchPage from './page/FriendSearchPage';
import {GoogleOAuthProvider} from '@react-oauth/google';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
//
function App() {
  const [loginData, setLoginData] = useState(null);
  const handleLogin = (data) => {
    setLoginData(data); 
    localStorage.setItem('loginData', JSON.stringify(data));
    console.log(data);
  };
  return (
    <GoogleOAuthProvider clientId='367618606560-nb7qi1pvcb8urbrlakaarptegisvs35d.apps.googleusercontent.com'>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage  />}  />
            <Route path="/home" element={<HomePage />}  />  
            <Route path="/userInfo" element={<UserProfile />} />  
            <Route path="/friendList" element={<FriendListPage/>} />   
            <Route path="/friendRequest" element={<FriendRequestPage />} />       
            <Route path="/friendSearch" element={<FriendSearchPage />} />  
            {/*for no defined page */}
            <Route path="*" element={<Navigate to="/login"/>} />
          </Routes>
        </HashRouter>
      </AuthProvider>
        
    </GoogleOAuthProvider>
  )
}

export default App
