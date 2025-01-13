import React, { useState, useContext, useEffect, useRef } from "react";
import ToggleMenu from "./ToggleMenu";
import { AuthContext } from "../context/AuthContext";
import "../assets/page/userProfile.css";
import ProfilePicture from "./ProfilePicture";

function UserProfilePage() {
  const { user, updateUser, updateUserProfile} = useContext(AuthContext);
  const [alias, setAlias] = useState("");
  const [birth, setBirth] = useState("");
  const [gen, setGen] = useState("");
  const [tel, settel] = useState("");
  const [addr, setAddr] = useState("");
  const [txt, setTxt] = useState("");
  const [profile, setProFile] = useState(user?.profile || "");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const profileContainerRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSelectImage = (newProfile) => {
    updateUserProfile(newProfile);
    setProFile(newProfile); // 更新圖片
    handleSaveProfile(newProfile);
    console.log(user);
  };

  // 顯示網頁內通知的函式
  const showWebNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  // 隱藏通知的函式
  const hideWebNotification = () => {
    setShowNotification(false);
  };

  const handleSaveChanges = async () => {
    const userData = JSON.stringify({ 
      user_id: user.id, 
      alias: alias,
      birth: birth,
      gen: gen,
      tel: tel,
      addr: addr,
      txt: txt,
    });
    console.log("準備送出的資料：", userData);
    try {
      const response = await fetch(
        "https://swep.hnd1.zeabur.app/user/api/save-setting",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: userData,
        }
      );

      if(response.ok){
        const result = await response.json();
        console.log('save response:', result.settings);
        console.log(user);
        const newuser = user;
        newuser.settings = result.settings;
        updateUser(newuser);
        showWebNotification("儲存成功！");
        if (profileContainerRef.current) {
          profileContainerRef.current.scrollTop = 0;
        }
      }
      else {
        console.error("Error saving data:", response);
      }
    } catch (error) {
      console.error("Error fetching child data:", error);
    }finally {
      alert("更改個人資訊成功");
    }
  };
  const handleSaveProfile = async (newProfile) => {
    const userProfile = JSON.stringify({ 
      user_id: user.id, 
      profile: newProfile
    });
    console.log("準備送出的資料：", userProfile);
    try {
      const response = await fetch(
        "https://swep.hnd1.zeabur.app/user/api/profile-url-upd",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: userProfile,
        }
      );

      if(response.ok){
        const result = await response.json();
        console.log('profile response:', result.profile);
        const newuser = user;
        newuser.profile = result.profile;
        updateUser(newuser);
        showWebNotification("儲存成功！");
        
        if (profileContainerRef.current) {
          profileContainerRef.current.scrollTop = 0;
        }
      }
      else {
        console.error("Error saving data:", response);
      }
    } catch (error) {
      console.error("Error fetching child data:", error);
    } finally {
      alert("更改個人圖片成功");
    }
  };

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
        console.log(result.settings);
        setAlias(result.settings[0]);
        setBirth(result.settings[1]);
        setGen(result.settings[2]);
        settel(result.settings[3]);
        setAddr(result.settings[4]);
        setTxt(result.settings[5]);
      } catch (error) {
        console.error("Error fetching child data:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <ToggleMenu />
      <div className="profile-container" ref={profileContainerRef}>
        <h1 className="title">Setting</h1>
        <div className="profile-image-container">
          <img src={profile} alt="Penguin" className="profile-image"/>
          <p></p>
          <button
            className="save-button"
            onClick={() => setShowProfileModal(true)}
          >
            變更圖片...
          </button>
        </div>
        {showProfileModal && (
          <ProfilePicture
            currentProfile={profile}
            onSelectImage={handleSelectImage}
            onClose={() => setShowProfileModal(false)}
          />
        )}
        <div className="setting">
          <label htmlFor="alias">姓名</label>
          <input
            type="text"
            id="alias"
            name="alias"
            placeholder="文字輸入區"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </div>
        <div className="setting">
          <label htmlFor="birth">生日</label>
          <input
            type="date"
            id="birth"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
        </div>
        <div className="sex-setting">
          <label className="sexlabel">性別</label>
          <div className="sex">
            <label htmlFor="man" className="radiobutton">
              <input
                type="radio"
                name="gen"
                id="man"
                value="male"
                checked={gen === "male"}
                onChange={(e) => setGen(e.target.value)}
              />
              <span className="gender">男</span>
            </label>
            <label htmlFor="woman" className="radiobutton">
              <input
                type="radio"
                name="gen"
                id="woman"
                value="female"
                checked={gen === "female"}
                onChange={(e) => setGen(e.target.value)}
              />
              <span className="gender">女</span>
            </label>
            <label htmlFor="lgbtq" className="radiobutton">
              <input
                type="radio"
                name="gen"
                id="lgbtq"
                value="Non-binary gender"
                checked={gen === "Non-binary gender"}
                onChange={(e) => setGen(e.target.value)}
              />
              <span className="gender">非二元性別</span>
            </label>
            <label htmlFor="no" className="radiobutton">
              <input
                type="radio"
                name="gen"
                id="no"
                value="no"
                checked={gen === "no"}
                onChange={(e) => setGen(e.target.value)}
              />
              <span className="gender">不願透漏</span>
            </label>
          </div>
        </div>
        <div className="setting">
          <label htmlFor="tel">電話</label>
          <input
            type="tel"
            id="tel"
            name="tel"
            placeholder="文字輸入區"
            value={tel}
            onChange={(e) => settel(e.target.value)}
          />
        </div>
        <div className="setting">
          <label htmlFor="addr">地址</label>
          <input
            type="text"
            id="addr"
            name="addr"
            placeholder="文字輸入區"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
        </div>
        <div className="setting">
          <label htmlFor="email">電子郵箱</label>
          <div className="fixed-email">{user.id}</div>
        </div>
        <div className="setting">
          <label htmlFor="txt">個人簡介</label>
          <textarea
            id="txt"
            name="txt"
            rows="4"
            placeholder="文字輸入區"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
          ></textarea>
        </div>
        <div className="save-container">
          <button className="save-button" onClick={handleSaveChanges} >
            儲存變更
          </button>
        </div>
      </div>
    </>
  );
}

export default UserProfilePage;
