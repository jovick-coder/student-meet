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

    let { data: friends, error } = await supabase
      .from(`friends`)
      .select(
        `*,  sender (
      username, id, school, department
    ),  receiver (
      username, id, school, department
    )`
      )
      .or(`receiver.eq.${id}`);
    // .or(`sender.eq.${id},receiver.eq.${id}`);
    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }

    return friends;
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
      .select("*")
      .eq("user", id);

    if (error) {
      console.log({ error });
      return toast.error("Error occurred");
    }
    if (posts.length < 1) {
      return toast.error("Profile not found");
    }
    return posts[0];
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
  // console.log({ user });

  const id = Cookies.get("social-id");
  const profile = JSON.parse(Cookies.get("social-profile"));
  // Usage example:
  const senderId = id; // ID of the current user sending the request
  const receiverId = user.id; // ID of the user receiving the request

  const isDuplicateRequest = await checkDuplicateFriendRequest(
    senderId,
    receiverId
  );
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

    sendNotificationFunction(receiverId, notification_message);
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

// Check if a friend request with the same sender and receiver IDs exists
async function checkDuplicateFriendRequest(senderId, receiverId) {
  try {
    const { data: existingRequests, error } = await supabase
      .from("friends")
      .select("*")
      .eq("sender", senderId)
      .eq("receiver", receiverId)
      .or()
      .eq("sender", receiverId)
      .eq("receiver", senderId)
      .eq("accepted", false);

    // let { data: existingRequests, error } = await supabase
    //   .from(`friends`)
    //   .select(
    //     `*,  sender (
    //   username, id, school, department
    // ),  receiver (
    //   username, id, school, department
    // )`
    //   )
    //   .or(`sender.eq.${senderId},receiver.eq.${receiverId}`)
    //   .or(`sender.eq.${receiverId},receiver.eq.${senderId}`);

    if (error) {
      throw error;
    }

    // If any existing requests are found, return true to indicate a duplicate request
    return existingRequests.length > 0;
  } catch (error) {
    // Handle any errors
    console.error("Error checking duplicate friend request:", error.message);
    return false;
  }
}
