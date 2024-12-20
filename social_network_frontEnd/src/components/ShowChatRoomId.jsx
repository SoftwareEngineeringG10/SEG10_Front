import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/showChatRoomId.css";

const ShowChatRoomId = ({chat, onCloseChatInfo}) => {
  const { user } = useContext(AuthContext); // You can use `user` if needed elsewhere.
  const id = chat.ID;
  const [showRoomID, setShowRoomID] = useState(false);

  return (
    <div>
      <button
        style={{ cursor: "pointer" }}
        className="showChatId"
        onClick={() => setShowRoomID(true)}
      >
        顯示聊天室ID
      </button>

      {showRoomID && (
        <div className="showRoomID">
          <div className="showRoomIDcontent">
            <h2>顯示聊天室ID</h2>
            <p>聊天室ID:</p>
            <span>{id}</span>
            <button
              onClick={() => {
                setShowRoomID(false);
                onCloseChatInfo();
              }}
              className="closeID"
            >
              關閉視窗
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowChatRoomId;
