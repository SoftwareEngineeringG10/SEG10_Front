import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatInfo from "./ChatInfo";
import "boxicons";
import "../assets/components/chatMessage.css";

function ChatMessage({ chat }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  //initial request
  useEffect(() => {
    setMessages([]);
    const getMsgs = async () => {
      try {
        if (chat.Contents && chat.Contents.length > 0) {
            const fetchedMessages = [];
            
            for (const msgId of chat.Contents) {
              try {
                const response = await fetch("https://swep.hnd1.zeabur.app/msg/api/msg-get", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: msgId }),
                });
          
                if (response.ok) {
                  const message = await response.json();
                  fetchedMessages.push(message);
                } else {
                  console.error(`Failed to fetch message with ID ${msgId}:`, await response.text());
                }
              } catch (error) {
                console.error(`Error fetching message with ID ${msgId}:`, error);
              }
            }
            setMessages(fetchedMessages);
          } else {
            console.log("No messages to fetch.");
          }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    getMsgs();
  }, [chat]);
  //long polling
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (chat.Contents && chat.Contents.length > 0) {
          const fetchedMessages = await Promise.all(
            chat.Contents.map(async (messageId) => {
              try {
                const response = await fetch(
                  "https://swep.hnd1.zeabur.app/msg/api/msg-get",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: messageId }),
                  }
                );
                if (response.ok) {
                  return response.json();
                } else {
                  console.error(`Failed to fetch message with ID: ${messageId}`, await response.text());
                  return null;
                }
              } catch (error) {
                console.error("Error fetching message ID:", messageId, error);
                return null;
              }
            })
          );
          setMessages(fetchedMessages.filter(Boolean)); // Remove null (failed fetches)
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat.Contents]);

  
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("https://swep.hnd1.zeabur.app/msg/api/msg-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, content: newMessage }),
      });
      if(response.ok){
        
        const data = await response.json();
        console.log(data);
        setMessages((prev) => [...prev, data]);
        try {
            const response2 = await fetch("https://swep.hnd1.zeabur.app/chat/api/msg-add", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: chat.ID, msg_id: data.id }),
            });
      
            if (!response2.ok) {
              console.error("Failed to store message to chatroom:", await response2.text());
              //delete msg from msg service(not done yet)
            }
          } catch (error) {
            console.error("Error sending message:", error);
          }
      }
      if (!response.ok) {
        console.error("Failed to send message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      {loading ? (
        <p>Loading messages...</p>
      ) :  (
        <>
          <div className="chat-header">
          <img src="images/penguin-png.png" alt="penguin" className="headerAvatar" />
            <span>{chat.Name}</span>
            <ChatInfo />
          </div>
          <hr className="headerLine"/>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className="chatMessages">
                <img src={user.picture} alt="you" className="you" />
                <span>
                  {message.content}....{message.sender}
                </span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="傳送訊息..."
            />
            <button className="send-button" onClick={sendMessage}>
              <box-icon type="solid" name="send"></box-icon>
            </button>
          </div>
        </>
      ) }
    </div>
  );
}

export default ChatMessage;
