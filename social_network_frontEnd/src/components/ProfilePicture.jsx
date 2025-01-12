import React, { useState, useContext } from "react";
import "../assets/components/ProfilePicture.css";
import { AuthContext } from "../context/AuthContext";

const ProfilePicture = ({ currentProfile, onSelectImage, onClose }) => {
  
	const { picture } = useContext(AuthContext);

	const images = [
    picture,
    "/images/senpai.png",
    "/images/rick.jpg",
    "/images/mope.jpg",
  ];

  return (
    <div className="profilePictureModal">
      <div className="profilePictureContent">
        <h2>選擇圖片</h2>
        <div className="imageGrid">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`選項 ${index + 1}`}
              className="profileImageOption"
              onClick={() => {
                onSelectImage(src);
                onClose();
              }}
            />
          ))}
        </div>
        <button className="closeButton" onClick={onClose}>
          關閉視窗
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;
