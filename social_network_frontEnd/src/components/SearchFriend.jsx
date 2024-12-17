import React, { useState, useEffect, useContext } from "react";
import "../assets/page/searchFriend.css";
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

function SearchFriend() {
  const { user, updateUserNotifs } = useContext(AuthContext);
  const [isInviting, setIsInviting] = useState(false);
  const [searchMail, setSearchMail] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);

  useEffect(() => {
    if (user) {
      requestsNotif();
    }
    console.log(user);
    console.log(isInviting);
    console.log(friendRequest);
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

  const notifAdd = async (id, title) => {
    const urlUser = "https://swep.hnd1.zeabur.app/user/api/notif-add";
    const urlMsg = "https://swep.hnd1.zeabur.app/msg/api/notif-create";

    try {
      const bodyMsg = {
        user_id: title === "request" ? user.id : id,
        title,
        content: title === "request" ? id : user.id,
      };
      const data = await fetchAPI(urlMsg, "POST", bodyMsg);

      if (!data?.id) throw new Error("Failed to retrieve notification ID");

      const bodyUser = {
        user_id: title === "request" ? user.id : id,
        notif_id: data.id,
      };
      await fetchAPI(urlUser, "PATCH", bodyUser);

      updateUserNotifs(data.id);
      console.log(user);
      console.log("Notification added successfully to both services");
    } catch (error) {
      console.error("Error during notification addition:", error);
    }
  };

  const requestsNotif = async () => {
    try {
      const notifications = await Promise.all(
        user.notifs.map(async (notif) => {
          const detail = await notifGet(notif);
          return detail?.title === "request" ? { id: detail.description, notif_id: notif } : null;
        })
      );
      setFriendRequest(notifications.filter(Boolean));
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  
  const responseNotif = async (data) => {
  
    if (!data || !data.notifs) {
      console.error("responseNotif: data or data.notifs is undefined");
      return; // Stop execution if data is invalid
    }
  
    for (const notif of data.notifs) {
      const detail = await notifGet(notif);
      if (detail && detail.title === "response" && detail.description === user.id) {
        notifDelete(detail.sender ,detail.id);
      }
    }
  };
  const inviteClick = async (r_id) => {
    try {
      const currentRequest = friendRequest.find((request) => request.id === r_id);
      console.log(currentRequest);
      if (currentRequest) {
        await notifDelete(user.id, currentRequest.notif_id);
        const data = await userGet(currentRequest.id);
        await responseNotif(data);
      } else {
        await notifAdd(r_id, "request");
        await notifAdd(r_id, "response");
        
      }
      
    } catch (error) {
      console.error("Error during inviteClick:", error);
    } finally {
      
      setIsInviting((prev) => !prev);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await fetchAPI("https://swep.hnd1.zeabur.app/user/api/user-get", "POST", { id: searchMail });
      setSearchList([data]);

      const isRequestPending = friendRequest.some((request) => request.id === data.id);
      setIsInviting(isRequestPending);
    } catch (error) {
      alert("此人不存在或請求失敗");
    } finally {
      setSearchMail("");
    }
  };

  return (
    <>
      <ToggleMenu />
      <div className="SearchFriend-container">
        <h1 className="title">好友搜尋</h1>
        <div className="field">
          <input
            placeholder="搜尋用戶..."
            type="text"
            value={searchMail}
            onChange={(e) => setSearchMail(e.target.value)}
          />
          <button className="searchButton" onClick={handleSearch}></button>
        </div>
        <hr />
        {searchList.map((info) => (
          <div key={info.id} className="friend">
            <img src={info.profile} alt="profile" className="you" />
            <div className="friendName">{info.id}</div>
            {info.id !== user.id && (
              <button className="sendInvite" onClick={() => inviteClick(info.id)}>
                {isInviting ? "等待中..." : "送出邀請"}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchFriend;
