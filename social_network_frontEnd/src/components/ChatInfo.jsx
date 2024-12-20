import React, { useContext, useState,useEffect,useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/ChatInfo.css";
import ShowChatRoomId from "./ShowChatRoomId";
import EditChatRoom from "./EditChatRoom";
import DeleteChatRoom from "./DeleteChatRoom";
const ChatInfo = ({ isChatInfoOpen, onCloseChatInfo, chat }) => {
  if (!isChatInfoOpen) return null;
  const { user } = useContext(AuthContext);
  const ChatInfoCloseRef = useRef(null)
  const closeFloatChatInfo = (event) => {
    if(ChatInfoCloseRef.current && !ChatInfoCloseRef.current.contains(event.target)){
      onCloseChatInfo();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeFloatChatInfo);

    return () => {
      document.removeEventListener("mousedown", closeFloatChatInfo);
    };
  }, []);
  return (
    <div>
      <div className="chatInfo-overlay">
        <div className="chatInfo-content" ref={ChatInfoCloseRef}>
        <ShowChatRoomId chat={chat} />
        <hr className="hrline"/>
        <EditChatRoom chat={chat}/>
        <hr className="hrline"/>
        <DeleteChatRoom />
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
