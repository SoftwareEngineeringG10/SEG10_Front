import React, { useContext, useState } from "react";
import "../assets/components/deleteChatRoom.css"
const DeleteChatRoom = () => {

  return (
    <div>
      <button
        style={{ cursor: "pointer" }}
        className="deleteChatRoom"
      >刪除聊天室</button>
    </div>
  );
};

export default DeleteChatRoom;
