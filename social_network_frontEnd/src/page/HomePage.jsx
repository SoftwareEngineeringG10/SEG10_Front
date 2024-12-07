import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import ChatAvatar from "../components/ChatAvatar";
import "../assets/page/home.css";
function HomePage() {
  const { user, logout } = useContext(AuthContext); // Access user and logout from context
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  console.log(user);
  // Handle logout functionality
  const handleLogout = () => {
    logout(); // Clear user from context and localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!user) {
    return <p>Loading user data...</p>; // Show a loading state if user data isn't ready
  }
  return (
    <> 
        <div className="container">
          <ChatAvatar onSelectChat={setSelectedChat} /> {/* Pass function to select chat */}
          {selectedChat ? (
            <ChatMessage chat={selectedChat} /> 
          ) : (
            <div>Please select a chat room.</div>
          )}
      </div>
      
    </>
  );
}

export default HomePage;
