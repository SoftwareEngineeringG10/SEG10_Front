import React, { useContext, useEffect, useState } from "react";
import ToggleMenu from "./ToggleMenu";
import AddChat from "./AddChat";
import Modal from "./Model";
import ChatMessage from "./ChatMessage"; // Import ChatMessage
import "../assets/components/ChatAvatar.css";
import { AuthContext } from "../context/AuthContext";

function ChatAvatar({SelectChat, onSelectChat }) {
  const { user, updateUser, picture } = useContext(AuthContext);
  const [chatRoomsID, setChatRoomsID] = useState(user?.chats || []);
  const [chatRooms, setChatRooms] = useState([]); // Array of chat details
  const [isModalOpen, setIsModalOpen] = useState(false); // For primary modal

  // Fetch chat details for all chat IDs in chatRoomsID
  const fetchChatDetails = async () => {
    try {
      const chatDetails = [];
      for (const chatID of chatRoomsID) {
        const response = await fetch(
          `https://swep.hnd1.zeabur.app/chat/api/chat-get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: chatID }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch chat info for ID: ${chatID}`);
          continue;
        }

        const chatDetail = await response.json(); // Chat detail object
        chatDetails.push(chatDetail);
      }

      setChatRooms(chatDetails); // Update chatRooms only after all data is fetched

    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const UpdateChatDetails = async (upadtechat) => {
    console.log('Update Chat Details')
    try {
      const response = await fetch(
        `https://swep.hnd1.zeabur.app/chat/api/chat-get`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: upadtechat.ID }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch chat info for ID: ${upadtechat.ID}`);
      }else{
        const chatDetail = await response.json(); // Chat detail object
        if(upadtechat != chatDetail) onSelectChat(chatDetail);
        console.log('Upadate Chat Contents');
        console.log(upadtechat);
      }
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  useEffect(() => {
    const fetchChatsOnMount = async () => {
      if (user?.chats?.length) {
        await fetchChatDetails(); // Fetch and update chatRooms state
      }
    };
    fetchChatsOnMount();
  }, [user]);

  useEffect(() => {
    if (!SelectChat?.ID) return;
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((chat) =>
        chat.ID === SelectChat.ID ? { ...chat, ...SelectChat } : chat
      )
    );
  }, [SelectChat?.Name]);

  useEffect(() => {
    if(!SelectChat?.IsDeleted) return;
    console.log('Close message');
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((chat) =>
        chat.ID === SelectChat.ID ? { ...chat, ...SelectChat } : chat
      )
    );
    onSelectChat(null);
  }, [SelectChat?.IsDeleted]);

  const handleAddChat = (newChat) => {
    if (chatRoomsID.includes(newChat.ID)) {
      console.log("Chat already exists");
      return;
    }

    setChatRoomsID((prev) => [...prev, newChat.ID]);
    updateUser(newChat.ID);

    const UserAddChat = async () => {
      try {
        const response = await fetch(
          "https://swep.hnd1.zeabur.app/user/api/chat-add",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id, chat_id: newChat.ID }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update backend");
        }

        // Fetch details of the new chat and update immediately
        const chatResponse = await fetch(
          `https://swep.hnd1.zeabur.app/chat/api/chat-get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: newChat.ID }),
          }
        );

        if (chatResponse.ok) {
          const newChatDetails = await chatResponse.json();
        }
      } catch (error) {
        alert("Failed to add chat to user");
        console.error(error);
      }
    };

    UserAddChat();
  };
  const handleJoinChat = (newChat) => {
    if (chatRoomsID.includes(newChat.ID)) {
      console.log("JoinChat already exists");
      return;
    }
    setChatRoomsID((prev) => [...prev, newChat.ID]);
    updateUser(newChat.ID);

    const UserJoinChat = async () => {
      try {
        const response = await fetch(
          "https://swep.hnd1.zeabur.app/user/api/chat-add",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id, chat_id: newChat.ID }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update backend");
        }

        // Fetch details of the new chat and update immediately
        const chatResponse = await fetch(
          `https://swep.hnd1.zeabur.app/chat/api/chat-get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: newChat.ID }),
          }
        );

        if (chatResponse.ok) {
          const newChatDetails = await chatResponse.json();
          console.log(newChatDetails);
        }
      } catch (error) {
        alert("Failed to add chat to user");
        console.error(error);
      }
    };

    UserJoinChat();
  };
  const handleLogout = () => {
    logout(); // Clear user from context and localStorage
    navigate('/login'); // Redirect to login page
  };
  const toggleMenu = () => {
    const menu = document.getElementById("sideMenu");
    if (menu.style.width === "320px") {
      menu.style.width = "0";
    } else {
      menu.style.width = "320px";

    }
  };
  return (
    <div className="sidebar">
      <div className="toggleChatRect">
        <div className="toggle" onClick={toggleMenu}>
          ☰
        </div>

        <h3 className="chatRoom">聊天室</h3>
        <button onClick={() => setIsModalOpen(true)} className="plusButton">
          +
        </button>
        <div id="sideMenu" className="sideMenu">
          <a href="#home">聊天室</a>
          <a href="#userInfo">設定</a>
          <a href="#friendList">好友列表</a>
          <a href="#friendRequest">好友請求</a>
          <a href="#friendSearch">好友搜尋</a>
          <a href="#login" onClick={handleLogout}>
            登出
          </a>
        </div>
      </div>
      <div className="displayChatName">
      {/* Display chat names */}
      {chatRooms
        .filter((chat) => !chat.IsDeleted)
        .map((chat) => ( 
        <div key={chat.id}>
          <button className="chat" onClick={() => UpdateChatDetails(chat)}>
            <img src="penguin-png.png" alt="avatar" />
            <span>{chat.Name} {/* Display chat name */}</span>
              <p>Hello world!</p>
          </button>
        </div>
      ))
      }
      </div>
      <div className="homePageBottom">
        <img src={user.profile} alt="Penguin" />
        <div className="myName">
          {user?.settings?.[0] && user.settings[0] !== "" ? user.settings[0] : user.name}
        </div>
      </div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddChat={handleAddChat}
        onJoinChat={handleJoinChat}
      >
      </Modal>
    </div>
  );
}

export default ChatAvatar;