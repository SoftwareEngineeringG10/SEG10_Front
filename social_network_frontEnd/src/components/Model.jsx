import React, { useEffect,useRef } from "react";
import "../assets/components/modal.css";
import AddChat from "./AddChat";
import JoinChat from "./JoinChat";
const Modal = ({ isOpen, onClose, children , onAddChat, onJoinChat}) => {
  if (!isOpen) return null;
  const modalCloseRef = useRef(null)
  const closeFloatPlus = (event) => {
    if(modalCloseRef.current && !modalCloseRef.current.contains(event.target)){
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeFloatPlus);

    return () => {
      document.removeEventListener("mousedown", closeFloatPlus);
    };
  }, []);
  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalCloseRef}>
        <AddChat onAddChat={onAddChat}/>
        <hr className="hrline"/>
        <JoinChat onJoinChat={onJoinChat}/>
      </div>
    </div>
  );
};

export default Modal;
