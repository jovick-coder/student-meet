// context/ProfileContext.js
import { createContext, useContext, useEffect, useState } from "react";
import supabase, {
  acceptFriendRequestFunction,
  getAllUserFunction,
  getUserFriendRequestFunction,
  getUserFriendsFunction,
  getUserPostFunction,
  getUserProfileFunction,
  rejectFriendRequestFunction,
  sendFriendRequestFunction,
} from "@/lib/supabase";
import Cookies from "js-cookie";
const ProfileContext = createContext();
import toast from "react-hot-toast";

export const ProfileProvider = ({ children }) => {
  const id = Cookies.get("social-id");
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState({
    loading: true,
    already_friends: [],
    friend_requests: [],
    new_friends: [],
  });

  useEffect(() => {
    fetchPostFunction();
    fetchProfileFunction();
    fetchProfileFriendsFunction();
  }, [id]);

  async function fetchProfileFriendsFunction() {
    const userFriends = await getUserFriendsFunction(id);
    // setUserFriends(userFriends);
    const userFriendRequest = await getUserFriendRequestFunction(id);
    // setUserFriends(userFriends);
    const allUserRequest = await getAllUserFunction(id);

    console.log({ userFriends });
    let friendsIdArray = [];
    console.log(userFriends);
    userFriends?.forEach((friend) => {
      friendsIdArray.push(friend.sender.id);
      friendsIdArray.push(friend.receiver.id);
    });

    friendsIdArray = Array.from(new Set(friendsIdArray));

    // Filter out objects whose id is not present in friendsIdArray
    let filteredUsers = allUserRequest.filter(
      (userObj) => !friendsIdArray.includes(userObj.id)
    );

    // console.log({ friendsIdArray });
    setFriends({
      loading: false,
      already_friends: userFriends,
      friend_requests: userFriendRequest,
      new_friends: filteredUsers,
    });
  }

  async function fetchPostFunction() {
    // Read the 'userId' cookie

    const profile = await getUserProfileFunction(id);
    setUserProfile(profile);
    const userPosts = await getUserPostFunction(id);

    console.log("fetchPostFunction", userPosts);
    setUserPosts(userPosts);
  }

  async function fetchProfileFunction() {
    // Read the 'userId' cookie

    const profile = await getUserProfileFunction(id);
    setUserProfile(profile);
    const userPosts = await getUserPostFunction(id);
    setUserPosts(userPosts);
  }

  async function handleSendFriendRequest(friend) {
    await sendFriendRequestFunction(friend);
    await fetchProfileFriendsFunction();
    toast.error("error");
  }
  async function handleAcceptFriendRequest(request, userID) {
    await acceptFriendRequestFunction(request, userID);
    await fetchProfileFriendsFunction();
  }
  async function handleRejectFriendRequest(request, userID) {
    await rejectFriendRequestFunction(request, userID);
    await fetchProfileFriendsFunction();
  }

  return (
    <ProfileContext.Provider
      value={{
        id,
        userProfile,
        friends,
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleRejectFriendRequest,
        userPosts,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
