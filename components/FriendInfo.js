import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function FriendInfo({ friend, userId }) {
  const [friendDetail, setFriendDetail] = useState(null);

  useEffect(() => {
    if (friend.sender !== userId) {
      return setFriendDetail(friend.sender);
    }
    if (friend.receiver !== userId) {
      return setFriendDetail(friend.receiver);
    }
  }, [friend, userId]);
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div>
        <h3 className=" text-xl">{friendDetail?.username}</h3>
        {/* <div className='text-sm leading-3'>5 mutual friends</div> */}
      </div>
      {!friend.accepted && (
        <button className="ms-auto bg-blue-500 w-24 h-10 text-white px-1 rounded-md">
          Accept
        </button>
      )}
    </div>
  );
}
