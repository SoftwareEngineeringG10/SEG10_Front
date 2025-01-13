import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/components/ViewChatMember.css";

const adminstr = "__admin__"
const ViewChatMember = ({chat, onCloseChatInfo, members, membersID}) => {
  const { user } = useContext(AuthContext); // You can use `user` if needed elsewhere.
  const id = chat.ID;
  const [showChatMember, setshowChatMember] = useState(false);

  return (
    <div>
      <button
        style={{ cursor: "pointer" }}
        className="showChatId"
        onClick={() => {
						setshowChatMember(true);
						console.log(members);
						console.log(membersID);
					}
				}
      >
        顯示成員
      </button>

      {showChatMember && (
				<div className="showRoomID">
					<div className="showRoomIDcontent">
						<h2>聊天室成員</h2>
						<hr />
						{/* 滾動容器 */}
						<div className="friendlist-container">
							{members.map((member, index) => (
								
								<React.Fragment key={index}>
									<div className="friendlist">
										<img src={member.profile} alt={member.name} />
										<div className="friendName">
											{member.name || "Loading..."}
											{
												member?.name && membersID.some(str => str.includes(member.id) && str.includes(adminstr))
												? (" (管理員) ") 
												: ("")
											}
										</div>
										
									</div>
									<hr className="Line" />
								</React.Fragment>
								
							))}
						</div>

						<button
							onClick={() => {
								setshowChatMember(false);
								onCloseChatInfo();
							}}
							className="closeID"
						>
							關閉視窗
						</button>
					</div>
				</div>
			)}
    </div>
  );
};

export default ViewChatMember;
