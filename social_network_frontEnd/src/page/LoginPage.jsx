
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext }  from '../context/AuthContext';
import '../assets/page/login.css';

const API_BASE_URL = 'https://swep.hnd1.zeabur.app/user/api';

export default function Login() {
  const { login } = useContext(AuthContext); // Access context
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const sendAPIRequest = async (endpoint, method, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error during ${method} request to ${endpoint}:`, error);
      throw error;
    }
  };

  const handleUser = async (email, name, picture) => {
    try {
      const user = await sendAPIRequest('user-get', 'POST', { id: email });
      console.log(user.id);
      const withPic = await sendAPIRequest('profile-url-upd', 'PATCH', {user_id: user.id, profile: picture});
      console.log(withPic);
      login(user); // Update context
      navigate('/home'); // Navigate to home page
    } catch {
      console.log('User not found, adding user...');
      try {
        const newUser = await sendAPIRequest('user-add', 'POST', { id: email, name: name });
        const withPic = await sendAPIRequest('profile-url-upd', 'PATCH', {user_id: newUser.id, profile: picture});
        login(withPic); // Update context
        navigate('/home'); // Navigate to home page
      } catch (error) {
        console.error('Error during user addition:', error);
      }
    }
  };

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error(`Google API error! Status: ${response.status}`);
      }

      const data = await response.json();
      await handleUser(data.email, data.name, data.picture);
    } catch (error) {
      console.error('Error fetching Google user info:', error);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        await fetchGoogleUserInfo(response.access_token);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);

    },
  });

  return (
    <div className="Login">
      <div className="leftcover"></div>
      <div className="rightcover">
        <div className="loginBox">
          <h1 className="SignIN">Sign in</h1>

          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            style={{
              background: 'white',
              color: 'black',
              padding: 10,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google Logo"
              className='GoogleIcon'
            />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

        </div>
      </div>
    </div>
  );
}
