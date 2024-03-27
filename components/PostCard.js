import Image from "next/image";
import Avatar from "./Avatar";
import Card from "./Card";
import { AiOutlineHeart, AiFillBell } from 'react-icons/ai'
import { FaRegComment, FaTimes } from 'react-icons/fa'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { BsShare, BsThreeDotsVertical, BsFillBookmarksFill } from 'react-icons/bs'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { IoImageOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoIosClose, IoIosPaperPlane } from "react-icons/io";
import supabase, {
  commentOnPostFunction,
  likePostFunction,
} from "@/lib/supabase";
import { FcLike } from "react-icons/fc";
import Cookies from "js-cookie";
import moment from "moment";

export default function PostCard({ post, loggedIn }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [like, setLike] = useState(false);
  const [writeComment, setWriteComment] = useState(false);
  const [sendCommentLoading, setSendCommentLoading] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const id = Cookies.get("social-id");
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    if (post?.likes.includes(id)) {
      setLike(true);
    }
  }, [id, post]);

  function openDropdown() {
    if (!loggedIn) {
      return toast.error("Login to use post option");
    }
    // e.stopPropagation();
    setDropdownOpen(true);
  }

  function closeDropdown(e) {
    // e.stopPropagation();
    setDropdownOpen(false);
  }

  const handelLikePostFunction = async (post) => {
    try {
      if (!loggedIn) {
        return toast.error("Login to like post");
      }

      const data = await likePostFunction(post);
      // console.log({ data });
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };
  const shearPostFunction = async () => {
    if (!loggedIn) {
      return toast.error("Login to shear post");
    }
  };
  const handelCommentOnPostFunction = async () => {
    if (!loggedIn) {
      return toast.error("Login to shear post");
    }
    setSendCommentLoading(true);

    const data = await commentOnPostFunction(post, commentMessage);
    setSendCommentLoading(false);
    setCommentMessage("");
  };

  //   console.log({ post });
  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={"/profile"}>
            <span className="cursor-pointer">
              <Avatar />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={"/profile"}>
              <span className=" mr-1 font-semibold cursor-pointer hover:underline">
                {post?.user?.username || "Username"}
              </span>
            </Link>
            shared a <a className="text-socialBlue font-semibold">post</a>
          </p>
          <p className="text-gray-500 text-sm">
            Posted {moment(post?.created_at).fromNow()}
          </p>
        </div>
        <div className="">
          {!dropdownOpen && (
            <button
              // onClick={openDropdown}
              className="text-gray-500 hover:text-gray-800"
            >
              <BsThreeDotsVertical onClick={() => openDropdown()} />
            </button>
          )}
          {dropdownOpen && (
            <button className="text-gray-500 hover:text-gray-800">
              <BsThreeDotsVertical onClick={() => closeDropdown()} />
            </button>
          )}
          <div className="relative">
            {dropdownOpen && (
              <div className="absolute -right-6 bg-white shadow-lg shadow-gray-700 p-3 rounded-md border-gray-100 w-52">
                <span
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center"
                  onClick={() => closeDropdown()}
                >
                  <IoIosClose />
                  Close
                </span>
                <a
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center"
                >
                  <BsFillBookmarksFill />
                  Save post{" "}
                </a>
                <a
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center"
                >
                  <AiFillBell />
                  Turn notifications
                </a>
                <a
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center"
                >
                  <FaTimes />
                  Hide
                </a>
                <a
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-red-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center hover:text-red-600"
                >
                  <RiDeleteBin6Fill />
                  Delete
                </a>
                <a
                  href=""
                  className="text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-red-500 hover:bg-opacity-20 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center hover:text-red-600"
                >
                  <GoAlert />
                  Report
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="my-4 text-sm cursor-pointer">
          {post?.text.length >= 30 ? (
            <>
              {showFullText ? (
                <span onClick={() => setShowFullText(false)}>{post?.text}</span>
              ) : (
                <span onClick={() => setShowFullText(true)}>
                  {`${post?.text?.slice(0, 300)}`}
                  <i className="text-blue-500"> ...Read more</i>
                </span>
              )}
            </>
          ) : (
            post?.text
          )}
        </p>

        {post?.image_url && (
          <div className="rounded-md overflow-hidden">
            <Image
              src="/images/santorini.jpg"
              width="900"
              height="900"
              alt="santorini"
            />
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-8">
        <button
          className="flex gap-2 items-center"
          onClick={() => handelLikePostFunction(post)}
        >
          {post?.likes.includes(id) ? (
            <FcLike
              className="text-[25px]"
              onClick={() => setLike((prev) => !prev)}
            />
          ) : (
            <AiOutlineHeart
              className="text-[25px]"
              onClick={() => setLike((prev) => !prev)}
            />
          )}
          {/* {!post?.likes.includes(id) && like == true
            ? post?.likes?.length + 1
            : post?.likes?.length} */}
          {post?.likes?.length || 0}
        </button>
        <button
          className="flex gap-2 items-center"
          onClick={() => {
            if (!loggedIn) {
              return toast.error("Login to shear post");
            }
            setWriteComment(true);
          }}
        >
          <FaRegComment className="text-[20px]" />
          {post?.comments?.length || 0}
        </button>
        <button className="flex gap-2 items-center" onClick={shearPostFunction}>
          <BsShare className="text-[20px]" /> {post?.sheared || 0}
        </button>
        {writeComment && (
          <button
            className="flex gap-2 items-center ms-auto"
            onClick={() => setWriteComment(false)}
          >
            <IoIosClose className="text-[25px] border rounded" />
          </button>
        )}
      </div>
      {writeComment && (
        <div className=" relative">
          <div className="flex mt-4 gap-3 mb-2">
            <div>
              <Avatar />
            </div>
            <div className="border grow rounded-md ">
              <textarea
                className=" w-full overflow-hidden p-3 px-4 h-12 "
                placeholder="Leave a comment"
                value={commentMessage}
                onChange={(e) => setCommentMessage(e.target.value)}
              />
              <button className="absolute top-3 right-3 text-gray-400 border">
                {sendCommentLoading ? (
                  <BiDotsHorizontalRounded className="w-7 h-7 border rounded" />
                ) : (
                  <IoIosPaperPlane
                    className="w-7 h-7 border rounded"
                    onClick={() => {
                      handelCommentOnPostFunction(false);
                    }}
                  />
                )}
              </button>
            </div>
          </div>
          <hr />
          {post?.comments?.map((comment, i) => (
            <div className="text-sm ms-12 my-3" key={i}>
              <b>{comment?.username}</b>
              <p>{comment?.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}