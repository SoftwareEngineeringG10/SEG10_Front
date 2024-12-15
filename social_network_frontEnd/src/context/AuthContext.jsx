import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  useEffect(() => {
    console.log('User state updated:', user);
    // Synchronize all existing chats during login
    const syncChats = async () => {
      if (user?.chats) {
        for (const chatId of user.chats) {
          await synchronizeChatMembership(chatId);
        }
      }
    };
    //syncChats();
  }, [user]);
  
  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log(user);
    

  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (newChatId) => {
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        chats: [...prevUser.chats, newChatId],
      };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist changes
      return updatedUser;
    });
  };

  const synchronizeChatMembership = async (chatId) => {
    if (!user) return;
    console.log(user.chats);
    //if chat service members attribute has the user, not add
    try {
      const response = await fetch(`https://swep.hnd1.zeabur.app/chat/api/member-add`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, member_id: user.id }),
      });

      if (!response.ok) {
        console.error('Failed to synchronize chat membership');
      }
    } catch (error) {
      console.error('Error synchronizing chat membership:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
