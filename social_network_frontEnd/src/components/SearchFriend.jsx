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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

function SearchFriend() {
  const { user } = useContext(AuthContext);
  const [isInviting, setIsInviting] = useState(false);
  const [searchMail, setSearchMail] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [frResponse, setFrResponse] = useState([]);
  useEffect(() => {
    console.log(searchList);
  }, [searchList]);
  useEffect(() => {
    requestsNotif();
  }, []);

  //request notif get
  const notifGet = async (n_id) => {
    const url = "https://swep.hnd1.zeabur.app/msg/api/notif-get";
    const body = { id: n_id };

    try {
      const data = await fetchAPI(url, "POST", body);
      return data;
    } catch (error) {
      console.error("Error with notif-get:", error);
      return null;
    }
  };

  const notifDelete = async (u_id, n_id) => {
    const urlUser = "https://swep.hnd1.zeabur.app/user/api/notif-remove";
    const urlMsg = "https://swep.hnd1.zeabur.app/msg/api/notif-del";
  
    const bodyUser = { user_id: u_id, notif_id: n_id };
    const bodyMsg = { id: n_id };
  
    try {
      // Call the user service
      await fetchAPI(urlUser, "PATCH", bodyUser);
  
      // Call the message service
      await fetchAPI(urlMsg, "DELETE", bodyMsg);
  
      console.log("Notification deleted successfully from both services");
    } catch (error) {
      console.error("Error during notification delete:", error);
    }
  };
  
  const notifAdd = async (id, title) => {
    const urlUser = "https://swep.hnd1.zeabur.app/user/api/notif-add";
    const urlMsg = "https://swep.hnd1.zeabur.app/msg/api/notif-create";
  
    try {
      // Create body for the message service
      const bodyMsg = {
        user_id: title === "request" ? user.id : id,
        title: title,
        content: title === "request" ? id : user.id,
      };
  
      // Call the message service to create a notification
      const data = await fetchAPI(urlMsg, "POST", bodyMsg);
  
      if (!data || !data.id) {
        throw new Error("Failed to retrieve notification ID from the message service");
      }
  
      const n_id = data.id;
  
      // Create body for the user service
      const bodyUser = {
        user_id: title === "request" ? user.id : id,
        notif_id: n_id,
      };
  
      // Call the user service to add the notification
      await fetchAPI(urlUser, "PATCH", bodyUser);
  
      console.log("Notification added successfully from both services");
    } catch (error) {
      console.error("Error during notification addition:", error.message || error);
    }
  };
  
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
  

  const responseNotif = async (data) => {
    setFrResponse([]); // Reset before fetching new responses
  
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
  

  const requestsNotif = async () => {
    setFriendRequest([]); // Reset before fetching new requests
    const requests = [];

    for (const notif of user.notifs) {
      const detail = await notifGet(notif);
      if (detail && detail.title === "request") {
        requests.push({ id: detail.description, notif_id: notif });
      }
    }

    setFriendRequest(requests);
  };

  const inviteClick = async (r_id) => {
    const n = friendRequest.filter((request) => request.id === r_id);
  
    if (isInviting) {
      if (n.length > 0) {
        await notifDelete(user.id ,n[0].notif_id);
        const data = await userGet(n[0].id);
        if (data) {
          console.log(data);
          await responseNotif(data);
        } else {
          console.error("inviteClick: userGet returned invalid data");
        }
      }
    }else{
      await notifAdd(r_id, "request"); //user request id
      await notifAdd(r_id, "response"); //id response user
    }
    setIsInviting((prev) => !prev);
  };
  
  const handleSearch = async() => {
    try {
      console.log(searchMail);
      const response = await fetch('https://swep.hnd1.zeabur.app/user/api/user-get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: searchMail}),
      })
      

      if (response.ok) {
        const result = await response.json();
        setSearchList((prev) => [result]);
        console.log(friendRequest);
        setIsInviting(false); //預設為不是
        // Check if friendRequest array contains the result.id
        const isRequestPending = friendRequest.some((request) => request.id === result.id);
        
        // Update state based on the result
        setIsInviting(isRequestPending);
        setSearchMail("");
      } else {
        alert("此人不存在");
        setSearchMail("");
      }
    } catch (error) {
      console.error('Error:', error);
      setSearchMail("");
    }                 
    
  }
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
          ></input>
          <button className="searchButton" onClick={handleSearch}></button>
        </div>
        <hr></hr>
        
        {searchList.map((info) => (
          <>
          <div className="friend">
          <div key={info.id} className="friendName"></div>
          <img src={info.profile} alt="you" className="you" />
          <div className="friendName">{info.id}</div>
          {(info.id !== user.id) ? 
            (<button className="sendInvite" onClick={() => inviteClick(info.id)}>
              {isInviting ? "等待中..." : "送出邀請"}
            </button>
            ):null}
          </div>
          </>
        ))}
        
        
        
      </div>
    </>
  );
}

export default SearchFriend;
