import { FriendChatInfo, FriendInfo } from "@/components/FriendInfo";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { useChatContext } from "@/context/ChatContext";
import { useProfileContext } from "@/context/ProfileContext";
import supabase from "@/lib/supabase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaPaperPlane, FaPlane } from "react-icons/fa";

export default function Chat() {
  const { id, friends } = useProfileContext();
  const {
    setFriend,
    activeChat,
    setActiveChat,
    activeMassage,
    setActiveMessage,
  } = useChatContext();
  const [friendDetail, setFriendDetail] = useState(null);

  useEffect(() => {
    if (!activeChat) {
      setFriendDetail(null);
      return;
    }
    if (activeChat.sender.id !== id) {
      return setFriendDetail(activeChat.sender);
    }
    if (activeChat.receiver.id !== id) {
      return setFriendDetail(activeChat.receiver);
    }
  }, [activeChat, id]);
  useEffect(() => {
    console.log({ friendDetail });
  }, [friendDetail, activeChat, id]);

  useEffect(() => {
    if (!activeChat?.id) return;
    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          // filter: `friend_tag.eq.${activeChat?.id}`, // replace 123 with the user's ID
        },
        (payload) => {
          // console.log("Change received!", payload.new);
          if (payload.new.friend_tag === activeChat?.id)
            setActiveMessage((prev) => ({
              loading: false,
              chats: [...prev.chats, payload.new],
            }));
        }
      )
      .subscribe();
  }, [activeChat]);

  return (
    <Layout>
      {/* <h1 className="text-6xl mb-4 text-gray-400">Chats</h1> */}
      <div className="h-full flex flex-col md:flex-row">
        <div className="friends-list w-full md:w-2/5 p-2 border-b-2 md:border-r-2">
          {friends.already_friends.map((friend, i) => (
            <div
              className="border-b border-b-gray-100 px-4 md:p-4 -mx-4"
              key={`userFriends${i}`}
              onClick={() => setActiveChat(friend)}
            >
              <FriendChatInfo friend={friend} userId={id} />
            </div>
          ))}
        </div>
        <div className="chat w-full ">
          <div className="h-full">
            {activeChat === null && (
              <div className="flex justify-center items-center h-full text-xs">
                Select a Friend
              </div>
            )}
            {activeChat !== null && (
              <>
                {activeMassage.loading ? (
                  <div className="flex justify-center items-center h-full text-xs">
                    Loading...
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="top-info-card flex gap-3 ps-3 h-10 items-center border-b-2">
                      <button
                        onClick={() => {
                          setActiveChat(null);
                          setFriend(null);
                        }}
                      >
                        <FaArrowAltCircleLeft />
                      </button>{" "}
                      {friendDetail?.username || "Friend"}
                    </div>

                    <div className="h-[80vh] overflow-y-scroll p-3">
                      {activeMassage.chats.map((chat) => {
                        return (
                          <React.Fragment key={chat.id}>
                            <ChatCardComponent chat={chat} />
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <>
                      <ChatFormComponent />
                    </>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ChatCardComponent({ chat }) {
  const { id } = useProfileContext();
  const [showFullText, setShowFullText] = useState(false);
  return (
    <div key={chat.id} className={`mb-2 flex `}>
      <div
        className={`${
          chat.sender === id ? "ms-auto text-end float-right" : ""
        } text-sm rounded-lg py-1 px-3 inline-flex flex-col text-gray-500 bg-red-200 cursor-pointer`}
        style={{
          maxWidth: "350px",
          overflowWrap: "break-word",
        }}
      >
        {chat.message >= 300 ? (
          <>
            {showFullText ? (
              <span onClick={() => setShowFullText(false)}>{chat.message}</span>
            ) : (
              <span onClick={() => setShowFullText(true)}>
                {`${chat.message?.slice(0, 300)}`}
                <i className="text-blue-500 text-xs"> ...Read more</i>
              </span>
            )}
          </>
        ) : (
          chat.message
        )}
        <i
          className={`${
            chat.sender === id ? "ms-auto" : ""
          } text-[10px] text-socialBlue`}
        >
          {moment(chat?.created_at).format("dddd h:mm")}
        </i>
      </div>
    </div>
  );
}

function ChatFormComponent() {
  const { handelSendMessage, message, setMessage } = useChatContext();
  return (
    <div className="chat-section flex gap-2 w-full bottom-0 p-3">
      <input
        type="text"
        className="w-full h-8 rounded-lg px-2"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />{" "}
      <button
        className="w-16 text-center rounded-md bg-socialBlue text-white flex justify-center items-center"
        onClick={() => handelSendMessage(message)}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}