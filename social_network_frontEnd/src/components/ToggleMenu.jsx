import React ,{useContext} from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import "../assets/components/ToggleMenu.css";
function ToggleMenu() {
  const { logout } = useContext(AuthContext); // Access user and logout from context
  const navigate = useNavigate();
  const toggleMenu = () => {
    const menu = document.getElementById("side-menu");
    if (menu.style.width === "320px") {
      menu.style.width = "0";
    } else {
      menu.style.width = "320px";
    }
  };

  const handleLogout = () => {
    logout(); // Clear user from context and localStorage
    navigate('/login'); // Redirect to login page
  };
  return (
    <div>
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>
      <div id="side-menu" className="side-menu">
        <a href="#home">聊天室</a>
        <a href="#userInfo">設定</a>
        <a href="#friendList">好友列表</a>
        <a href="#friendRequest">好友請求</a>
        <a href="#friendSearch">好友搜尋</a>
        <a href="#login" onClick={handleLogout}>登出</a>
      </div>
    </div>
  );
}

export default ToggleMenu;