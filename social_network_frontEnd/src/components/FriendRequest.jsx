import React, { useContext, useEffect, useState } from "react";
import "../assets/page/friendRequest.css";
import ToggleMenu from "./ToggleMenu";
import { AuthContext } from "../context/AuthContext";

// Utility function for API calls
const fetchAPI = async (url, method = "GET", body = null, headers = {}) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

function FriendRequest() {
  const {user, updateUserNotifs} = useContext(AuthContext);

  const [fndRsps, setFndRsps] = useState([
    { name: "企鵝四號", id: 0 },
    { name: "企鵝五號", id: 1 },
    { name: "企鵝六號", id: 2 },
    { name: "企鵝七號", id: 3 },
    { name: "企鵝八號", id: 4 },
  ]);
  useEffect(() => {
    if (user) {
      responseNotif(user); // Fetch responses when the component loads
    }
  }, [user]);

  const userGet = async (email) => {
    const url = "https://swep.hnd1.zeabur.app/user/api/user-get";
    const bodyUser = { id: email };
  
    try {
      const data = await fetchAPI(url, "POST", bodyUser);
      if (!data || !data.notifs) {
        console.error("userGet: API response is missing 'notifs'");
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error during user get:", error);
      return null;
    }
  };

  const friendAdd = async (id) => {
    const url = "https://swep.hnd1.zeabur.app/user/api/friend-add";
    try {
      fetchAPI(url, "PATCH", { user_id: user.id , friend_id: id});
    } catch (error) {
      console.error("Error with friend-add:", error);
    }
  };

  const notifGet = async (n_id) => {
    const url = "https://swep.hnd1.zeabur.app/msg/api/notif-get";
    try {
      return await fetchAPI(url, "POST", { id: n_id });
    } catch (error) {
      console.error("Error with notif-get:", error);
      return null;
    }
  };

  const notifDelete = async (u_id, n_id) => {
    const urlUser = "https://swep.hnd1.zeabur.app/user/api/notif-remove";
    const urlMsg = "https://swep.hnd1.zeabur.app/msg/api/notif-del";

    try {
      await fetchAPI(urlUser, "PATCH", { user_id: u_id, notif_id: n_id });
      await fetchAPI(urlMsg, "DELETE", { id: n_id });
      console.log("Notification deleted successfully from both services");

      // Update user state to reflect notification removal
      const updatedNotifs = user.notifs.filter((notif) => notif !== n_id);
      updateUserNotifs(updatedNotifs[0]);
    } catch (error) {
      console.error("Error during notification delete:", error);
    }
  };

  const handleResponse = async (notifId, friendEmail, isAccept) => {
    try {
      console.log(
        isAccept
          ? `Friend request accepted for email: ${friendEmail}`
          : `Friend request ignored for notification ID: ${notifId}`
      );
  
      // Delete the main notification
      await notifDelete(user.id, notifId);
  
      // Fetch the friend's notifications
      const friend = await userGet(friendEmail);
  
      if (!friend?.notifs) {
        console.error("Friend's notifications could not be retrieved.");
        return;
      }
  
      // Remove the "request" notification sent by the current user
      const requestsToDelete = await Promise.all(
        friend.notifs.map(async (notif) => {
          const detail = await notifGet(notif);
          if (detail?.title === "request" && detail.description === user.id) {
            return notif;
          }
          return null;
        })
      );
  
      const validRequestsToDelete = requestsToDelete.filter(Boolean);
  
      for (const notif of validRequestsToDelete) {
        await notifDelete(friend.id, notif);
      }
  
      // If the request was accepted, add the friend (implement `friendAdd` logic)
      if (isAccept) {
        friendAdd(friendEmail); // Uncomment if friendAdd logic is defined
      }
  
      // Update the UI by removing the request from the list
      setFndRsps((prev) => prev.filter((fndRsp) => fndRsp.name !== friendEmail));
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const responseNotif = async (data) => {
    if (!data || !data.notifs) {
      console.error("responseNotif: data or data.notifs is undefined");
      return; // Stop execution if data is invalid
    }
  
    try {
      const friendResponses = await Promise.all(
        data.notifs.map(async (notif) => {
          const detail = await notifGet(notif);
          if (detail && detail.title === "response") {
            // Return the detailed response object to include in state
            return { name: detail.description, id: notif };
          }
          return null; // Exclude notifications that are not "response"
        })
      );
  
      // Filter out null values and update state
      const validResponses = friendResponses.filter(Boolean);
      setFndRsps(validResponses);
      console.log("Fetched friend responses:", validResponses);
    } catch (error) {
      console.error("Error fetching friend responses:", error);
    }
  };
  

  return (
    <>
      <ToggleMenu />
      <div className="FriendRequest-container">
        <h1 className="title">好友請求</h1>
        <hr />
        <div className="friend-requests">
          {fndRsps.map((fndRsp) => (
            <div>
            <div key={fndRsp.id} className="friendrequest">
              <img src="images/penguin-png.png" alt="Penguin" />
              <div className="friendName">{fndRsp.name}</div>
              <button
                className="agree"
                onClick={() => handleResponse(fndRsp.id, fndRsp.name, true)}
              >
              </button>
              <button
                className="disagree"
                onClick={() => handleResponse(fndRsp.id, fndRsp.name, false)}
              >
              </button>
            </div>
            <hr />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FriendRequest;
