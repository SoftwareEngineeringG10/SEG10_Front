import React ,{useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/RemoveFriend.css";
const RemoveFriend = ({ friendId , onFriendRemoved}) => {
    const { user} = useContext(AuthContext); // Access user and logout from context
    
  const handleRemoveFriend = async () => {
    console.log(friendId);
    try {
      const response = await fetch(`https://swep.hnd1.zeabur.app/user/api/friend-remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          friend_id: friendId,
        }),
      });

      if (response.ok) {
        alert("Friend removed successfully!");
        onFriendRemoved(friendId);
      } else {
        const error = await response.json();
        alert(`Failed to remove friend: ${error.message}`);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
      alert("An error occurred while trying to remove the friend.");
    }
  };

  return (
    <button onClick={handleRemoveFriend} className="remove-friend-btn">
      解除好友
    </button>
  );
};

export default RemoveFriend;
