import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import "../assets/components/ChatInfo.css";
const ChatInfo = ({ onAddChat }) => {
  const [showModal, setShowModal] = useState(false);
  const {user} = useContext(AuthContext);


  return (
    <div>
        <button onClick={() => setShowModal(true)} className='chatInfoButton'><box-icon type='solid' name='edit'></box-icon></button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>join Chat ID:</h2>
            <label>{user.chats[0]}</label>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInfo;
