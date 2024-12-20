import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/AddChat.css"
const AddChat = ({ onAddChat, onClose}) => {
  const [showModal, setShowModal] = useState(false);
  const [chatName, setChatName] = useState("");
  const { user } = useContext(AuthContext);

  const handleAddChat = async () => {
    try {
      // Example API call to save chat room in the backend
      const response = await fetch(
        "https://swep.hnd1.zeabur.app/chat/api/chat-add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: chatName,
            members: [user.id],
          }),
        }
      );

      if (response.ok) {
        const newChat = await response.json();
        onAddChat(newChat); // Notify parent of new chat (object from chat service)
        setShowModal(false); // Close modal
        setChatName(""); // Reset input
      } else {
        alert("create chat failed");
        console.error("Failed to create chat room.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
        className="createChatroom"
      >創建聊天室...</button>

      {showModal && (
        <div className="modal">
          <div className="createChatcontent">
            <h2>創建聊天室</h2>
            <p>聊天室名稱:</p>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter chat name"
            />
            <button onClick={() => {
                  setShowModal(false);
                  onClose();
                }
              } 
              className="createCancel"
            >
            取消
            </button>
            <button onClick={() => {
                  onClose();
                  handleAddChat();
                }
              } 
              className="createAccept"
            >
            創建聊天室
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddChat;
