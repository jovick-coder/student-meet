// context/AuthContext.js
import supabase, {
  getChatForAUserFunction,
  sendChatForAUserFunction,
} from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useProfileContext } from "./ProfileContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [friend, setFriend] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeMassage, setActiveMessage] = useState({
    loading: true,
    chats: [],
  });
  const [message, setMessage] = useState("");
  const { id } = useProfileContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeChat === null) return;

        console.log(activeChat);
        // Await the result of the asynchronous function call
        let chats = await getChatForAUserFunction(activeChat.id);
        console.log({ chats });

        setActiveMessage({
          loading: false,
          chats,
        });
      } catch (error) {
        console.log({ error });
      }
    };

    fetchData(); // Call the async function immediately
  }, [activeChat]);

  async function handelSendMessage(message) {
    try {
      if (message === "") return;
      await sendChatForAUserFunction(activeChat.id, id, message);
      setMessage("");
    } catch (error) {
      console.log({ error });
    }
  }

  const login = (userData) => {
    // Your login logic here
    setUser(userData);
  };

  const logout = () => {
    // Your logout logic here
    setUser(null);
  };

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        setActiveChat,
        activeMassage,
        setActiveMessage,
        friend,
        setFriend,
        handelSendMessage,
        message,
        setMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
