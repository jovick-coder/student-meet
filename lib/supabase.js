import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import moment from "moment";
import toast from "react-hot-toast";

const supabaseUrl = "https://lwdenyyamdfiwbzdzzhj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZGVueXlhbWRmaXdiemR6emhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxNTU1NDQsImV4cCI6MjAyNTczMTU0NH0.CpRXfOfQ-_m3khFvidaC_wLe_e6UbFGHrXK0yby6Gis";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export async function getPostFunction() {
  try {
    let { data: posts, error } = await supabase.from("posts").select(`*, user (
      username,
      id
    )`);
    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    return posts.reverse();
  } catch (error) {
    throw error;
  }
}
export async function getNotificationsFunction() {
  const id = Cookies.get("social-id");
  try {
    let { data: notifications, error } = await supabase
      .from("notification")
      .select("*")
      .eq("user", id);
    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    return notifications.reverse();
  } catch (error) {
    throw error;
  }
}

export async function getAllUserFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let { data: users, error } = await supabase
      .from(`users`)
      .select(`id,username, school, department`)
      .neq("id", id);
    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }

    return users;
  } catch (error) {
    throw error;
  }
}
export async function getUserFriendsFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let { data: friends, error } = await supabase
      .from(`friends`)
      .select(
        `*,  sender (
      username, id, school, department
    ),  receiver (
      username, id, school, department
    )`
      )
      .or(`sender.eq.${id},receiver.eq.${id}`)
      .eq("accepted", true);
    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    // console.log({ friends });
    return friends;
  } catch (error) {
    throw error;
  }
}
export async function getUserFriendRequestFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let userFriendRequest = [];

    let { data: friends, error } = await supabase
      .from("friends")
      .select(
        `*,  sender (
      username, id, school, department
    ),  receiver (
      username, id, school, department
    )`
      )
      .eq("accepted", false);

    friends.forEach((friend) => {
      if (friend.sender.id === id || friend.receiver.id === id)
        userFriendRequest.push(friend);
    });
    // console.log({ userFriendRequest });

    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }

    // console.log("getUserFriendRequestFunction", { friends }, id);

    return userFriendRequest;
  } catch (error) {
    throw error;
  }
}

export async function getUsersFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }

    return users;
  } catch (error) {
    throw error;
  }
}

export async function getUserProfileFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);

    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    if (users.length < 1) {
      return toast.error("Profile not found");
    }
    return users[0];
  } catch (error) {
    throw error;
  }
}
export async function getUserPostFunction(id) {
  try {
    if (!id) {
      return toast.error("User Id Undefined");
    }

    let { data: posts, error } = await supabase
      .from("posts")
      .select(
        `*, user (
      username,
      id
    )`
      )
      .eq("user", id);

    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    if (posts.length < 1) {
      return toast.error("Profile not found");
    }
    return posts;
  } catch (error) {
    throw error;
  }
}

export async function userCreatePost(postMessage, image_url) {
  const id = Cookies.get("social-id");

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          user: id,
          likes: [],
          comments: [],
          sheared: 0,
          text: postMessage,
          image_url,
        },
      ])
      .select();
    if (error) {
      console.log({ error });
      return toast.error("Error creating post");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function likePostFunction(post) {
  try {
    const id = Cookies.get("social-id");
    const profile = JSON.parse(Cookies.get("social-profile"));

    const { likes } = post;
    let like_array = likes;

    const idIndex = like_array.indexOf(id);
    if (idIndex !== -1) {
      // console.log("unlike post");
      like_array.splice(idIndex, 1); // Remove id from like_array
    } else {
      // console.log("like post");
      like_array.push(id);

      let notification_Message = `${profile.username} Like your post`;
      await sendNotificationFunction(post.user.id, notification_Message);
    }

    const { data, error } = await supabase
      .from("posts")
      .update({ likes: like_array })
      .eq("id", post.id)
      .select();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
export async function commentOnPostFunction(post, commentMessage) {
  try {
    const id = Cookies.get("social-id");
    const profile_cookies = Cookies.get("social-profile");
    const profile = JSON.parse(profile_cookies);

    const { comments } = post;
    let comments_array = comments;

    comments_array.push({
      user: id,
      username: profile?.username || "No Name",
      user_image_url: profile?.image_url || null,
      message: commentMessage,
      created_at: moment().format("DD-MM-YYYY hh:mm:ss"),
    });
    // console.log(profile);
    // return console.log({ comments_array });
    const { data, error } = await supabase
      .from("posts")
      .update({ comments: comments_array })
      .eq("id", post.id)
      .select();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function sendFriendRequestFunction(user) {
  try {
    // console.log({ user });
    // console.log("sendFriendRequestFunction");

    const id = Cookies.get("social-id");
    const profile = JSON.parse(Cookies.get("social-profile"));
    // Usage example:
    const senderId = id; // ID of the current user sending the request
    const receiverId = user.id; // ID of the user receiving the request

    const isDuplicateRequest = await checkDuplicateFriendRequest(
      senderId,
      receiverId
    );

    // console.log({ isDuplicateRequest });
    if (isDuplicateRequest) {
      // A duplicate friend request already exists, handle accordingly
      console.log("A duplicate friend request already exists.");
    } else {
      // Send the friend request
      let notification_message = `${profile.username} sends a friend request`;
      // console.log("Sending friend request...", notification_message);

      const { data, error } = await supabase
        .from("friends")
        .insert([{ sender: senderId, receiver: receiverId }])
        .select();

      if (error) {
        return console.log(error);
      }
      if (data) {
        return console.log(data);
      }
      sendNotificationFunction(receiverId, notification_message);
    }
  } catch (error) {
    console.log({ error });
  }
}

export async function acceptFriendRequestFunction(request, userID) {
  const profile = JSON.parse(Cookies.get("social-profile"));

  const { data, error } = await supabase
    .from("friends")
    .update({ accepted: true })
    .eq("id", request.id)
    .select();
  if (error) {
    throw error;
  }
  let notification_message = `${profile.username} accepted your friend request`;
  sendNotificationFunction(userID, notification_message);
  return data;
}

export async function rejectFriendRequestFunction(request, userID) {
  const profile = JSON.parse(Cookies.get("social-profile"));
  const { data, error } = await supabase
    .from("friends")
    .delete()
    .eq("id", request.id);
  if (error) {
    throw error;
  }
  let notification_message = `${profile.username} rejects your friend request`;
  sendNotificationFunction(userID, notification_message);
  return data;
}

export async function sendNotificationFunction(to, message) {
  const { data, error } = await supabase
    .from("notification")
    .insert([{ user: to, message: message }])
    .select();
}

async function checkDuplicateFriendRequest(senderId, receiverId) {
  try {
    // Query existing friend requests where the sender is the current receiver or sender
    const { data: existingRequests, error2 } = await supabase
      .from("friends")
      .select(
        `*, sender(username, id, school, department), receiver(username, id, school, department)`
      );

    // Check if any existing requests match the current sender and receiver IDs
    const duplicateRequestExists = existingRequests.some(
      (request) =>
        (request.sender.id === senderId &&
          request.receiver.id === receiverId) ||
        (request.sender.id === receiverId && request.receiver.id === senderId)
    );

    if (duplicateRequestExists) {
      // console.log("Duplicate friend request found!");
      return true;
    } else {
      // console.log("No duplicate friend requests found.");
      return false;
    }
  } catch (error) {
    console.error("Error checking duplicate friend request:", error.message);
    return false;
  }
}



export async function getChatForAUserFunction(tag_id) {
  let { data: chats, error } = await supabase
    .from("chats")
    // .select("*, friend_tag(*, sender(*), receiver(*))")
    .select("*, friend_tag(*, sender( username, id), receiver (username, id))")

    // Filters
    .eq("friend_tag", tag_id);
  if (error) throw error;

  return chats;
}

export async function sendChatForAUserFunction(friend_tag, sender, message) {
  const { data, error } = await supabase
    .from("chats")
    .insert([{ sender: sender, message: message, friend_tag: friend_tag }])
    .select();

  if (error) throw error;

  return data;
}