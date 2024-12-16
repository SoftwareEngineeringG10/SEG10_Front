import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/editChatRoom.css";
const EditChatRoom = (chat) => {
  const [editChatRoomName, seteditChatRoomName] = useState(false);
  const [editChatName, seteditChatName] = useState("");
  const id = chat.chat.ID;
  const handleEditChatName = async () => {
    try {
      // Example API call to save chat room in the backend
      const response = await fetch(
        "https://swep.hnd1.zeabur.app/chat/api/name-modify",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            new_name: editChatName,
          }),
        }
      );

      if (response.ok) {
        const newChatRoomName = await response.json();
        seteditChatName(""); // Reset input
        seteditChatRoomName(false); // Close modal
      } else {
        alert("rename chat failed");
        console.error("Failed to rename chat room.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <button
        style={{ cursor: "pointer" }}
        className="editChatRoom"
        onClick={() => seteditChatRoomName(true)}
      >
        變更聊天室名稱
      </button>

      {editChatRoomName && (
        <div className="editRoomName">
          <div className="editRoomNamecontent">
            <h2>變更聊天室名稱</h2>
            <p>聊天室名稱:</p>
            <input
              type="text"
              placeholder="Enter new name"
              value={editChatName}
              onChange={(e) => seteditChatName(e.target.value)}
            />
            <button onClick={() => seteditChatRoomName(false)} className="editCancel">取消</button>
            <button onClick={handleEditChatName} className="editAccept">儲存</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditChatRoom;
