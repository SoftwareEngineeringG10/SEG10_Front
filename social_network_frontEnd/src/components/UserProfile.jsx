import React from "react";
import ToggleMenu from "../components/ToggleMenu";
import "../assets/page/userProfile.css";
function UserProfilePage() {
  return (
    <>
      <ToggleMenu />
      <div className="profile-container">
        <h1 className="title">Setting</h1>
        <div className="setting">
          <label for="name">姓名</label>
          <input type="text" id="name" name="name" placeholder="文字輸入區" />
        </div>
        <div className="setting">
          <label for="birthday">生日</label>
          <input type="date" id="birthday"></input>
        </div>
        <div className="sex-setting">
          <label className="sexlabel">性別</label>
          <div className="sex">
            <label for="man" className="radiobutton">
              <input type="radio" name="sex" id="man"></input>
              <span className="gender">男</span>
            </label>
            <label for="woman" className="radiobutton">
              <input type="radio" name="sex" id="woman"></input>
              <span className="gender">女</span>
            </label>
            <label for="lgbtq" className="radiobutton">
              <input type="radio" name="sex" id="lgbtq"></input>
              <span className="gender">非二元性別</span>
            </label>
            <label for="no" className="radiobutton">
              <input type="radio" name="sex" id="no"></input>
              <span className="gender">不願透漏</span>
            </label>
          </div>
        </div>
        <div className="setting">
          <label for="nickname">顯示使用者名稱</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            placeholder="文字輸入區"
          />
        </div>
        <div className="setting">
          <label for="phone">電話</label>
          <input type="tel" id="phone" name="phone" placeholder="文字輸入區" />
        </div>
        <div className="setting">
          <label for="address">地址</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="文字輸入區"
          />
        </div>
        <div className="setting">
          <label for="email">電子郵箱</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="文字輸入區"
          />
        </div>
        <div className="setting">
          <label for="selfIntro">個人簡介</label>
          <textarea
            id="selfIntro"
            name="selfIntro"
            rows="4"
            placeholder="文字輸入區"
          ></textarea>
        </div>
        <div className="save-container">
          <button className="save-button">儲存變更</button>
        </div>
      </div>
    </>
  );
}

export default UserProfilePage;
