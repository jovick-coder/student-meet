import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import {
  FriendInfo,
  FriendRequestInfo,
  NewFriendInfo,
} from "@/components/FriendInfo";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import { useProfileContext } from "@/context/ProfileContext";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [friendsTab, setFriendsTab] = useState(1);
  const { id, userProfile, friends, userPosts } = useProfileContext();
  const { loggedIn } = useAuth();

  const router = useRouter();
  const { asPath: pathname } = router;
  const isPosts = pathname.includes("posts") || pathname === "/profile";
  const isAbout = pathname.includes("about");
  const isFriends = pathname.includes("friends");
  const isPhotos = pathname.includes("photo");
  const tabClasses = "flex gap-1 px-5 py-1 items-center";
  const activeTabClasses =
    "flex gap-1 px-5 py-1 items-center bg-socialBlue text-white rounded-md";

  useEffect(() => {
    console.log({ userPosts });
  }, [userPosts]);
  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          <div className="h-40 overflow-hidden flex justify-center items-center">
            <Image
              src="/images/santorini.jpg"
              height={800}
              width={800}
              alt="profile"
              className="rounded-md"
            />
          </div>
          <div className="absolute top-24 left-7 rounded-full border border-gray-400 shadow-lg hover:scale-105">
            <Avatar size={"lg"} />
          </div>

          <div className="p-4">
            <div className="ml-36">
              <h1 className="uppercase font-semibold text-2xl">
                {userProfile?.full_name} ({userProfile?.username})
              </h1>
              <div className="text-gray-500 leading-4">
                {userProfile?.school}, {userProfile?.department}
              </div>
            </div>
            <div className="mt-10 flex gap-0">
              <Link
                href={"/profile/posts"}
                className={isPosts ? activeTabClasses : tabClasses}
              >
                Posts
              </Link>
              <Link
                href={"/profile/about"}
                className={isAbout ? activeTabClasses : tabClasses}
              >
                About
              </Link>
              <Link
                href={"/profile/friends"}
                className={isFriends ? activeTabClasses : tabClasses}
              >
                Friends
              </Link>
              <Link
                href={"/profile/photos"}
                className={isPhotos ? activeTabClasses : tabClasses}
              >
                Photos
              </Link>
            </div>
          </div>
        </div>
      </Card>
      {isPosts && (
        <>
          {userPosts?.map((post) => (
            <React.Fragment key={post.id}>
              <PostCard post={post} loggedIn={loggedIn} />
            </React.Fragment>
          ))}
        </>
      )}
      {isAbout && (
        <Card>
          <h2 className="text-3xl mb-2">About me</h2>
          {userProfile?.about}
        </Card>
      )}
      {isFriends && (
        <>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setFriendsTab(1)}
              className={`border rounded w-[100%] py-1 ${
                friendsTab == 1 && " bg-socialBlue text-white"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setFriendsTab(2)}
              className={`border rounded w-[100%] py-1 ${
                friendsTab == 2 && " bg-socialBlue text-white"
              }`}
            >
              Friend Request
            </button>
            <button
              onClick={() => setFriendsTab(3)}
              className={`border rounded w-[100%] py-1 ${
                friendsTab == 3 && " bg-socialBlue text-white"
              }`}
            >
              Get New Friends
            </button>
          </div>

          <Card>
            {friendsTab === 1 && (
              <>
                <h2 className="text-3xl mb-2">Friends</h2>
                <div className="">
                  {friends.already_friends.map((friend, i) => (
                    <div
                      className="border-b border-b-gray-100 p-4 -mx-4"
                      key={`userFriends${i}`}
                    >
                      <FriendInfo friend={friend} userId={id} />
                    </div>
                  ))}
                </div>
              </>
            )}
            {friendsTab === 2 && (
              <>
                <h2 className="text-3xl mb-2">Friends Request</h2>
                <div className="">
                  {friends.friend_requests.map((request, i) => (
                    <div
                      className="border-b border-b-gray-100 p-4 -mx-4"
                      key={`userFriends${i}`}
                    >
                      <FriendRequestInfo request={request} userId={id} />
                    </div>
                  ))}
                </div>
              </>
            )}
            {friendsTab === 3 && (
              <>
                <h2 className="text-3xl mb-2">New Friends</h2>
                <div className="">
                  {friends.new_friends.map((friend, i) => (
                    <div
                      className="border-b border-b-gray-100 p-4 -mx-4"
                      key={`userFriends${i}`}
                    >
                      <NewFriendInfo friend={friend} userId={id} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </>
      )}
      {isPhotos && (
        <div>
          <Card>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md overflow-hidden h-50 shadow-md flex item-center hover:scale-105 transition-all cursor-pointer">
                <Image
                  src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt=""
                  width={1260}
                  height={750}
                />
              </div>
              <div className="rounded-md overflow-hidden h-50 shadow-md flex item-center hover:scale-105 transition-all cursor-pointer">
                <Image
                  src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt=""
                  width={1260}
                  height={750}
                />
              </div>
              <div className="rounded-md overflow-hidden h-50 shadow-md flex item-center hover:scale-105 transition-all cursor-pointer">
                <Image
                  src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt=""
                  width={1260}
                  height={750}
                />
              </div>
              <div className="rounded-md overflow-hidden h-50 shadow-md flex item-center hover:scale-105 transition-all cursor-pointer">
                <Image
                  src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt=""
                  width={1260}
                  height={750}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}
