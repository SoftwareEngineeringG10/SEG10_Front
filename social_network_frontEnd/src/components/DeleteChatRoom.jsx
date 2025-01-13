import React, { useState, useContext } from "react";
import "../assets/components/DeleteChatRoom.css";
import { AuthContext } from "../context/AuthContext";

const adminstr = "__admin__";

const DeleteChatRoom = ({chat, onCloseChatInfo, chatfunc, membersID, DeleteCt}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useContext(AuthContext);
  const CheckDeleteChatRoom = async () => {
    console.log(chat);
    console.log(membersID);
    if (membersID.some(str => str.includes(user.id) && str.includes(adminstr))) {
      setShowDeleteConfirm(true);
    } else {
      console.log(`${user.id} 沒有權限`);
      alert("您沒有刪除聊天室的權限");
      onCloseChatInfo(true);
    }
  }
  const ExecuteDeleteChatRoom = async () => {
    try {
      const response = await fetch("https://swep.hnd1.zeabur.app/chat/api/chat-del", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: chat.ID }),
      });
      if (response.ok) {
        const delchat = {...chat, IsDeleted: true};
        await DeleteCt();
        console.log(`${user.id} 刪除了 ${chat.ID}`);
        chatfunc(delchat);
        console.log('chatroom delete successfully!');
      } else {
        console.error(`Failed to delete chat ${chat.ID}`);
        return null;
      }
    } catch (error) {
      console.error(`Error delete chat ${chat.ID}:`, error);
      return null;
    }
  }

  return (
    <div>
      <button
        style={{ cursor: "pointer" }}
        className="deleteChatRoomBtn"
        onClick={() => {
          CheckDeleteChatRoom();
        }}
      >
        刪除聊天室
      </button>

      {showDeleteConfirm && (
        <div className="deleteChatRoomOverlay">
          <div className="deleteChatRoomContent">
            <h2>刪除聊天室</h2>
            <p className="redText">是否確定要刪除聊天室 <span>{chat.Name}</span> ? </p>
            <p className="redText">此步驟不可返回</p>
            <div className="deleteButtons">
              <button 
                onClick={() => {
                    onCloseChatInfo();
                  }
                }
                className="editCancel"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  ExecuteDeleteChatRoom();
                }}
                className="confirmDelete"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteChatRoom;
