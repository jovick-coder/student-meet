import toast from "react-hot-toast";
import Avatar from "./Avatar";
import Card from "./Card";
import { BsUniversalAccess, BsFillSunFill, BsImage } from "react-icons/bs";
import { GiPositionMarker } from "react-icons/gi";
import { useState } from "react";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
import supabase, { userCreatePost } from "@/lib/supabase";
import { useProfileContext } from "@/context/ProfileContext";

export default function PostFormCard({ loggedIn }) {
  const { userProfile } = useProfileContext();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [postMessage, setPostMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };
  const handleUpload = async () => {
    // event.preventDefault();

    if (!file) {
      return toast.error("Invalid image");
    }
    // console.log({ file: file.name, userProfile });
    // return;
    // // Upload the image file to Superbase storage
    // const { data, error } = await supabase.storage
    //   .from("post-image")
    //   .upload("path/to/upload", file);
    const { data, error } = await supabase.storage
      .from("post-image")
      .upload(`public/${userProfile.username}/${file.name}`, file);

    if (error) {
      console.error("Error uploading image:", error.message);
    } else {
      // console.log("Image uploaded successfully:", data);
      // console.log({ data });
      // Attach the uploaded image URL to a post in Superbase
      //   await attachImageUrlToPost();
      return `https://lwdenyyamdfiwbzdzzhj.supabase.co/storage/v1/object/public/post-image/${data.path}`;
    }
  };

  const sharePostFunction = async () => {
    setLoading(true);
    try {
      if (!loggedIn) {
        setLoading(false);
        return toast.error("Login to shear post");
      }
      let image_url = null;

      if (file) {
        image_url = await handleUpload();
        console.log(image_url);

        if (!image_url) {
          setLoading(false);
          return toast.error("Error image not uploaded");
        }
      }
      // return;

      if (!postMessage || postMessage === "") {
        setLoading(false);
        return toast.error("Write a post / post an image");
      }
      // return console.log(postMessage);
      const postData = await userCreatePost(postMessage, image_url);
      //   console.log({ postData });
      setPostMessage("");
      toast.success("Success");
      setLoading(false);
      setPreviewUrl(null);
      setFile(null);
    } catch (error) {
      setLoading(false);
      console.log({ error });
      toast.error("Error making post");
    }
  };
  return (
    <Card>
      <div className="flex gap-2">
        <div>
          <Avatar />
        </div>
        <textarea
          className="grow p-3 h-14 overflow-y-hidden"
          placeholder={"Whats's on your mind?"}
          value={postMessage}
          onChange={(e) => setPostMessage(e.target.value)}
        />
      </div>
      {/* <img
        src={previewUrl}
        alt="Preview"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
    /> */}
      {previewUrl ? (
        <div className="relative">
          <div
            className="absolute z-50 bg-red-500 m-1 text-white rounded-full"
            onClick={() => {
              setPreviewUrl(null);
              setFile(null);
            }}
          >
            <IoIosClose />
          </div>
          <Image src={previewUrl} width="100" height="200" alt="santorini" />
        </div>
      ) : (
        <input
          type="file"
          id="post-image-uploader"
          onChange={handleFileChange}
          accept="image/*"
          hidden
        />
      )}
      <div className="flex gap-5 items-center mt-2">
        <div>
          {!previewUrl && (
            <label
              htmlFor="post-image-uploader"
              className="flex gap-1  items-center"
            >
              <BsImage size={25} />
              <span className="hidden sm:block">Post Image</span>
            </label>
          )}
        </div>

        <div className="grow text-right ">
          <button
            className="bg-socialBlue text-white px-5 py-1 rounded-md"
            onClick={sharePostFunction}
            disabled={loading}
          >
            {loading ? "Loading..." : "   Share a post"}
          </button>
        </div>
      </div>
    </Card>
  );
}
