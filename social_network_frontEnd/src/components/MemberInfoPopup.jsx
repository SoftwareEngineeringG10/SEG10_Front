import React from "react";
import "../assets/components/memberInfoPopup.css";

const MemberInfoPopup = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={member.profile || "default-profile.png"}
          alt={member.name || "Unknown"}
          className="popup-image"
        />
        {/* 文字區域 */}
        <div className="popup-name">
          <span>{member.name || "Unknown"}</span>
        </div>
				<div className="popup-ID">
					<h4>用戶 ID</h4>
          <span>{member.id || "Unknown"}</span>
        </div>
				<div className="popup-txt">
					<h4>個人簡介</h4>
          <span>{member.settings[5] || "無"}</span>
        </div>
        <button className="popup-close-button" onClick={onClose}>關閉視窗</button>
      </div>
    </div>
  );
};

export default MemberInfoPopup;
