import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import Spinner from "@/components/spinner";
import supabase, { getPostFunction, getUserPostFunction } from "@/lib/supabase";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);
  // // Function to read the cookie when the component mounts
  // useEffect(() => {
  //   const channels = supabase
  //     .channel("user-make-post")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "posts" },
  //       (payload) => {
  //         console.log("Change received!", payload);
  //       }
  //     )
  //     .subscribe();
  // }, []);
  useEffect(() => {
    // const subscription = supabase
    //   .channel("realtime")
    //   .subscribe("public.posts", {
    //     onInsert: (payload) => {
    //       console.log("New post created:", payload);
    //       // Handle new post creation
    //     },
    //   });

    // return () => {
    //   // Unsubscribe from Realtime updates when component unmounts
    //   if (subscription) {
    //     subscription.unsubscribe();
    //   }
    // };

    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          // console.log("Change received!", payload.new);
          setPosts((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // return () => {
    //   // Unsubscribe from Realtime updates when component unmounts
    //   if (channels) {
    //     channels.unsubscribe();
    //   }
    // };
  }, []);
  useEffect(() => {
    // Read the 'userId' cookie
    const id = Cookies.get("social-id");

    // Update state if the cookie exists
    if (id) {
      setLoggedIn(true);
    }
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    async function fetchData() {
      try {
        const userPosts = await getPostFunction();
        setPosts(userPosts);
        setPostLoading(false);
      } catch (error) {
        // Handle errors
        console.log({ error });
      }
    }
    fetchData(); // Call the async function immediately
  }, []);
  return (
    <Layout>
      <PostFormCard loggedIn={loggedIn} />
      {postLoading ? (
        // "Loading..."
        // <Image
        //   src={
        //     "https://discuss.wxpython.org/uploads/default/original/2X/6/6d0ec30d8b8f77ab999f765edd8866e8a97d59a3.gif"
        //   }
        //   width={25}
        //   height={25}
        // />
        <div className="flex items-center justify-center my-4">
          <Spinner />
        </div>
      ) : (
        <div className="mb-[120px] md:mb-10">
          {" "}
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              <PostCard post={post} loggedIn={loggedIn} />
            </React.Fragment>
          ))}
        </div>
      )}
      {/* <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} />
      <PostCard loggedIn={loggedIn} /> */}
    </Layout>
  );
}
