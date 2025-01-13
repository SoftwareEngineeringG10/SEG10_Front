import React, { useContext, useState,useEffect,useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/ChatInfo.css";
import ShowChatRoomId from "./ShowChatRoomId";
import EditChatRoom from "./EditChatRoom";
import DeleteChatRoom from "./DeleteChatRoom";
import ViewChatMember from "./ViewChatMember";
const ChatInfo = ({ isChatInfoOpen, onCloseChatInfo, chat, chatfunc, members, membersID, DeleteCt }) => {
  if (!isChatInfoOpen) return null;
  const { user } = useContext(AuthContext);
  const ChatInfoCloseRef = useRef(null);
  const closeFloatChatInfo = (event) => {
    if(ChatInfoCloseRef.current && !ChatInfoCloseRef.current.contains(event.target)){
      onCloseChatInfo();
      console.log('onCloseChatInfo:', typeof onCloseChatInfo);
      //console.log(membersID);
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
        <ShowChatRoomId chat={chat} onCloseChatInfo={onCloseChatInfo}/>
        <hr className="hrline"/>
        <EditChatRoom chat={chat} onCloseChatInfo={onCloseChatInfo} chatfunc={chatfunc}/>
        <hr className="hrline"/>
        <DeleteChatRoom chat={chat} onCloseChatInfo={onCloseChatInfo} chatfunc={chatfunc} membersID={membersID} DeleteCt={DeleteCt}/>
        <hr className="hrline"/>
        <ViewChatMember chat={chat} onCloseChatInfo={onCloseChatInfo} chatfunc={chatfunc} members={members} membersID={membersID} />
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
