import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RemoveFriend from "./RemoveFriend";
import ToggleMenu from "./ToggleMenu";
import "../assets/page/friendList.css";

export default function FriendList() {
  const { user } = useContext(AuthContext); // Access user and logout from context
  const [friends, setFriends] = useState("");
  const [frDetail, setFrDetail] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
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

        // Fetch details for each friend
        if (result.friends.length > 0) {
          const friendDetails = await Promise.all(
            result.friends.map(async (friendId) => {
              const res = await fetch(
                "https://swep.hnd1.zeabur.app/user/api/user-get",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: friendId }),
                }
              );
              return res.json();
            })
          );
          setFrDetail(friendDetails);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFriends();
  }, [user.id]);

  const handleRemove = (friendId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend !== friendId)
    );
    setFrDetail((prevDetails) =>
      prevDetails.filter((detail) => detail.id !== friendId)
    );
  };

  // Display friends in the list
  return (
    <div>
      <ToggleMenu />
      <div className="Friendlist-container">
        <h1 className="title">好友列表</h1>
        <hr />
        {friends.length <= 0 ? (
          <div className="friendName">No friend</div>
        ) : (
          <div>
            {console.log(frDetail)}
            {frDetail.map((friend, index) => {
              const friendDetail = frDetail.find((detail) => detail.id === friend) || {};
              console.log(friend);
              return (
                <React.Fragment key={index}>
                  <div className="friendlist">
                    <img src={friend.profile} alt={friend.name} />
                    <div className="friendName">
                      {friend.name || "Loading..."}
                    </div>
                    <RemoveFriend friendId={friend} onFriendRemoved={handleRemove} />
                  </div>
                  <hr className="Line" />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
