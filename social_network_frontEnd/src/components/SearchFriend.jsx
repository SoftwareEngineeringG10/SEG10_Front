import React, { useState, useEffect, useContext } from "react";
import "../assets/page/searchFriend.css";
import ToggleMenu from "./ToggleMenu";
import { AuthContext } from "../context/AuthContext";
function SearchFriend() {
  const { user } = useContext(AuthContext);
  const [isInviting, setIsInviting] = useState(false);
  const [searchMail, setSearchMail] = useState("");
  const [searchList, setSearchList] = useState([]);
  useEffect(() => {
    console.log(searchList);
  }, [searchList]);
  
  const inviteClick = () => {
    setIsInviting((isInviting) => !isInviting);
  };
  const handleSearch = async() => {
    try {
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
      } else {
        alert("此人不存在");
      }
    } catch (error) {
      console.error('Error:', error);
    }                 
    setSearchMail("");
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
            (<button className="sendInvite" onClick={inviteClick}>
              {isInviting ? "等待中..." : "送出邀請"} {console.log(user.id + info.id)}
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
