import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import supabase, { getPostFunction } from "@/lib/supabase";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const { loggedIn } = useAuth();

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
  }, []);

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
    </Layout>
  );
}
