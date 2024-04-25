import Link from "next/link";
import Card from "./Card";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsPeople, BsBookmarks, BsChat, BsChatDots } from "react-icons/bs";
import {
  IoMdNotificationsOutline,
  IoMdLogOut,
  IoMdLogIn,
} from "react-icons/io";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import Cookies
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function NavigationCard() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigationLink, setNavigationLink] = useState([
    {
      link: "/",
      name: "Home",
      icon: <AiOutlineHome className="text-[25px] md:text-[20px]" />,
      auth: false,
    },
    {
      link: "/profile",
      name: "Profile",
      icon: <CgProfile className="text-[25px] md:text-[20px]" />,
      auth: true,
    },
    {
      link: "/profile/friends",
      name: "Friends",
      icon: <BsPeople className="text-[25px] md:text-[20px]" />,
      auth: true,
    },
    {
      link: "/chat",
      name: "Chat",
      icon: <BsChatDots className="text-[25px] md:text-[20px]" />,
      auth: true,
    },
    {
      link: "/notifications",
      name: "Notifications",
      icon: <IoMdNotificationsOutline className="text-[25px] md:text-[20px]" />,
      auth: true,
    },
    // Add more navigation links here as needed
  ]);

  function logoutFunction() {
    Cookies.remove("social-id");
    Cookies.remove("social-profile");
    router.push("/auth");
  }

  // Function to read the cookie when the component mounts
  useEffect(() => {
    // Read the 'userId' cookie
    const id = Cookies.get("social-id");

    // Update state if the cookie exists
    if (id) {
      setLoggedIn(true);
    }
  }, []); // Empty dependency array to run the effect only once

  const { asPath: pathname } = router;

  const activeElementClasses =
    "hover:font-bold text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 bg-socialBlue text-white md:-mx-7 px-4 md:px-7 rounded-md shadow-md shadow-gray-300 items-center";
  const nonActiveElementClasses =
    "hover:font-bold text-sm md:text-md flex gap-1 md:gap-3 py-2  my-2 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-4 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center border";

  const handleButtonClick = () => {
    toast.success("You did it!"); // Displays a success message
  };
  return (
    <Card>
      <div className="md:px-4 py-2 gap-1 flex md:gap-4 justify-between md:block">
        <h2 className="text-gray-400 mb-3 hidden md:block">Navigation</h2>

        {/* Render navigation links based on auth status */}
        {navigationLink.map((link) => {
          // If the link requires authentication and the user is not logged in, skip rendering
          if (link.auth && !loggedIn) {
            return null;
          }

          return (
            <Link href={link.link} key={link.name}>
              <span
                className={
                  pathname === link.link
                    ? activeElementClasses
                    : nonActiveElementClasses
                }
              >
                {link.icon}
                <span className="hidden md:block">{link.name}</span>
              </span>
            </Link>
          );
        })}

        {/* Logout link */}
        {loggedIn && (
          <div onClick={() => logoutFunction()}>
            <span className={nonActiveElementClasses}>
              <IoMdLogOut className=" text-[25px] md:text-[20px]" />
              <span className="hidden md:block">Logout</span>
            </span>
          </div>
        )}
        {/* Logout link */}
        {!loggedIn && (
          <Link href="/auth">
            <span className=" flex gap-1 align-middle items-center m-2">
              <IoMdLogIn className=" text-[25px] md:text-[20px]" />
              <span className="text-[#11111]">Login</span>
            </span>
          </Link>
        )}
      </div>
    </Card>
  );
}
