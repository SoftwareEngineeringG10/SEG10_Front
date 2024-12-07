import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RemoveFriend from "./RemoveFriend";
import ToggleMenu from "./ToggleMenu";
import "../assets/page/friendList.css";

export default function FriendList() {
  const { user } = useContext(AuthContext); // Access user and logout from context
  const [friends, setFriends] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://swep.hnd1.zeabur.app/user/api/user-get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.id }),
          }
        );
        const result = await response.json();
        setFriends(result.friends);
      } catch (error) {
        console.error("Error fetching child data:", error);
      }
    };

    fetchData();
  }, []);
  const handleRemove = (friendId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend !== friendId)
    );
  };
  //display friend in list
  return (
    <div>
      <>
        <ToggleMenu />
        <div className="Friendlist-container">
          <h1 className="title">好友列表</h1>
          <hr />
          {friends.length <= 0 ? (
            <>
              <div className="friendName">No friend</div>
            </>
          ) : (
            <div>
              {friends.map((friend, index) => (
                <>
                <div key={index} className="friendlist">
                  <img src="images/penguin-png.png" alt="Penguin" />
                  <div className="friendName">{friend}...</div>
                  <RemoveFriend friendId={friend} onFriendRemoved={handleRemove}/>
                </div>
                <hr className="Line" />
                </>
              ))}
            </div>
          )}
        </div>
      </>
    </div>
  );
}
