import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { sendFriendRequestFunction } from "@/lib/supabase";
import { useProfileContext } from "@/context/ProfileContext";
import Image from "next/image";

export function FriendChatInfo({ friend, userId }) {
  const { id } = useProfileContext();
  const [friendDetail, setFriendDetail] = useState(null);
  const { handleAcceptFriendRequest, handleRejectFriendRequest } =
    useProfileContext();

  useEffect(() => {
    if (friend?.sender.id !== id) {
      return setFriendDetail(friend.sender);
    }
    if (friend.receiver.id !== id) {
      return setFriendDetail(friend.receiver);
    }
  }, [friend, id]);
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
      <div className={`  w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden`}>
        <Image
          src="/images/avatar.webp"
          alt="image"
          width={50}
          height={50}
          className="w-9 h-9 md:w-10 md:h-10"
        />
      </div>
      <div>
        <h3 className="text-xs md:text-sm">{friendDetail?.username}</h3>
      </div>
    </div>
  );
}

export function FriendInfo({ friend, userId }) {
  const { id } = useProfileContext();
  const [friendDetail, setFriendDetail] = useState(null);
  const { handleAcceptFriendRequest, handleRejectFriendRequest } =
    useProfileContext();

  useEffect(() => {
    if (friend?.sender.id !== id) {
      return setFriendDetail(friend.sender);
    }
    if (friend.receiver.id !== id) {
      return setFriendDetail(friend.receiver);
    }
  }, [friend, id]);
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div>
        <h3 className=" text-xl">{friendDetail?.username}</h3>
        <div className="text-sm leading-3">
          {friendDetail?.school}, {friendDetail?.department}
        </div>
      </div>
      {friend?.accepted && (
        <button className="ms-auto bg-blue-500 w-auto px-2 h-10 text-white px-1 rounded-md">
          Chat
        </button>
      )}
    </div>
  );
}
export function NewFriendInfo({ friend }) {
  const { handleSendFriendRequest } = useProfileContext();
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div>
        <h3 className=" text-xl">{friend?.username}</h3>
        <div className="text-sm leading-3">
          {friend?.school}, {friend?.department}
        </div>
      </div>
      {!friend.accepted && (
        <button
          className="ms-auto bg-blue-500 w-auto px-2 h-10 text-white px-1 rounded-md"
          onClick={() => handleSendFriendRequest(friend)}
        >
          Send Request
        </button>
      )}
    </div>
  );
}
export function FriendRequestInfo({ request, userId }) {
  const [friendDetail, setFriendDetail] = useState(null);
  const { handleAcceptFriendRequest, handleRejectFriendRequest } =
    useProfileContext();

  useEffect(() => {
    if (request.sender.id !== userId) {
      return setFriendDetail(request.sender);
    }
    if (request.receiver.id !== userId) {
      return setFriendDetail(request.receiver);
    }
  }, [request, userId]);
  return (
    <div className="flex items-center gap-3">
      <Avatar />
      <div>
        <h3 className=" text-xl">{friendDetail?.username}</h3>
        <div className="text-sm leading-3">
          {friendDetail?.school}, {friendDetail?.department}
        </div>
      </div>
      {!request.accepted && (
        <>
          {" "}
          <button
            className="ms-auto bg-blue-500 w-24 h-10 text-white px-1 rounded-md"
            onClick={() => handleAcceptFriendRequest(request, friendDetail.id)}
          >
            Accept
          </button>
          <button
            className="ms-auto bg-red-500 w-24 h-10 text-white px-1 rounded-md"
            onClick={() => handleRejectFriendRequest(request, friendDetail.id)}
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
}
