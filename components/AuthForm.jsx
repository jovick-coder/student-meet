import React from "react";
import Card from "@/components/Card";
import Layout from "@/components/Layout";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
export function AuthFormLogin() {
  const router = useRouter();
  const [error, setError] = useState({
    okay: true,
    message: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("email,password")
          .is();

        // console.log({ users, error });
      } catch (error) {
        // Handle errors
        console.log({ error });
      }
    }
    // fetchData(); // Call the async function immediately
  }, []);

  const handelChange = (e) => {
    // console.log(e.target.value)
    setLoading(true);
    setError({
      okay: true,
      message: "",
    });
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const submitLoginRequest = async (e) => {
    e.preventDefault();
    if (formData.email === "") {
      setLoading(false);
      return setError({
        okay: false,
        message: "Please ender a valid email",
      });
    }
    if (formData.password === "") {
      setLoading(false);
      return setError({
        okay: false,
        message: "Please ender a valid password",
      });
    }
    try {
      let { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .eq("password", formData.password);
      if (users.length === 0) {
        return setError({
          okay: false,
          message: "Invalid email/password",
        });
      }

      // Save the ID to a cookie
      Cookies.set("social-id", users[0].id);
      Cookies.set("social-profile", JSON.stringify(users[0]));

      router.push("/"); // Replace '/another-page' with the path of the page you want to redirect to

      setLoading(false);
      // console.log({ users, error });
    } catch (error) {
      setLoading(false);
      // Handle errors
      console.log({ error });
    }
  };
  return (
    <div className="w-full max-w-xs mx-auto">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={submitLoginRequest}
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Emails
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            value={formData?.email}
            onChange={handelChange}
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            name="password"
            value={formData?.password}
            onChange={handelChange}
          />
          {error?.okay === false && (
            <p className="text-red-500 text-xs italic">{error.message}</p>
          )}
        </div>
        <div className="flex items-center flex-col justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 w-full rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <a
            className="inline-block align-baseline  text-xs my-2 text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
          <div className="text-xs">
            Don{"`"}t have an account with us?
            <a
              className="inline-block align-baseline text-xs text-blue-500 hover:text-blue-800 ms-1"
              href="#"
            >
              Sign up
            </a>
          </div>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs ">
        &copy;2024 Student Meet All rights reserved.
      </p>
    </div>
  );
}

export function AuthFormRegister({ setActiveAuth }) {
  const router = useRouter();
  const [error, setError] = useState({
    okay: true,
    message: "",
  });
  const [currentScreen, setCurrentScreen] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("email,password")
          .is();

        // console.log({ users, error });
      } catch (error) {
        // Handle errors
        console.log({ error });
      }
    }
    // fetchData(); // Call the async function immediately
  }, []);

  const handelChange = (e) => {
    // console.log(e.target.value)
    setLoading(true);
    setError({
      okay: true,
      message: "",
    });
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const submitLoginRequest = async (e) => {
    e.preventDefault();

    // return console.log({ formData });
    if (formData.email === "") {
      setLoading(false);
      return setError({
        okay: false,
        message: "Please ender a valid email",
      });
    }
    if (formData.password === "") {
      setLoading(false);
      return setError({
        okay: false,
        message: "Please ender a valid password",
      });
    }
    if (formData.username === "") {
      setLoading(false);
      return setError({
        okay: false,
        message: "Please ender a valid password",
      });
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([formData])
        .select();
      router.push("/"); // Replace '/another-page' with the path of the page you want to redirect to

      if (error) {
        console.log({ error });
        return toast.error("Error registering");
      }
      toast.success("Successfully registered");
      setLoading(false);
      setActiveAuth(0);
      // console.log({ data, error });
    } catch (error) {
      setLoading(false);
      // Handle errors
      console.log({ error });
    }
  };

  //   let formInputRender = [{
  //     username
  // email
  // password
  // about
  // school
  // department
  // full_name
  //   }]
  return (
    <div className="w-full max-w-xs mx-auto">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={submitLoginRequest}
      >
        {currentScreen == 1 && (
          <>
            {" "}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Fullname
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="full_name"
                name="full_name"
                value={formData?.full_name || ""}
                onChange={handelChange}
                type="text"
                placeholder="Fullname"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Emails
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                value={formData?.email}
                onChange={handelChange}
                type="email"
                placeholder="Email"
              />
            </div>
          </>
        )}
        {currentScreen == 2 && (
          <>
            {" "}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Schools
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="school"
                name="school"
                value={formData?.school || ""}
                onChange={handelChange}
                type="text"
                placeholder="School"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Department
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                name="department"
                value={formData?.department}
                onChange={handelChange}
                type="text"
                placeholder="Department"
              />
            </div>
          </>
        )}
        {currentScreen == 3 && (
          <>
            {" "}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                value={formData?.username || ""}
                onChange={handelChange}
                type="text"
                placeholder="What will we call you?"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                About you
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="about"
                name="about"
                value={formData?.about || ""}
                onChange={handelChange}
                type="text"
                placeholder="What should we know about you?"
              />
            </div>
          </>
        )}
        {currentScreen == 4 && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                name="password"
                value={formData?.password}
                onChange={handelChange}
              />
              {error?.okay === false && (
                <p className="text-red-500 text-xs italic">{error.message}</p>
              )}
            </div>
          </>
        )}
        <div className="flex items-center flex-col justify-between">
          {currentScreen <= 3 ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 w-full rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                if (currentScreen === 1) {
                  if (
                    !formData.full_name ||
                    formData.full_name === "" ||
                    !formData.email ||
                    formData.email === ""
                  ) {
                    return toast.error("Fill the form completely");
                  }
                }
                if (currentScreen === 2) {
                  if (
                    !formData.school ||
                    formData.school === "" ||
                    !formData.department ||
                    formData.department === ""
                  ) {
                    return toast.error("Fill the form completely");
                  }
                }
                if (currentScreen === 3) {
                  if (
                    !formData.username ||
                    formData.username === "" ||
                    !formData.about ||
                    formData.about === ""
                  ) {
                    return toast.error("Fill the form completely");
                  }
                }

                if (currentScreen <= 3) {
                  // check form value
                  setCurrentScreen(currentScreen + 1);
                }
              }}
            >
              Next
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 w-full rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          )}

          <div className="text-xs mt-3">
            Have an account?
            <a
              className="inline-block align-baseline text-xs text-blue-500 hover:text-blue-800 ms-1"
              href="#"
            >
              Sign in
            </a>
          </div>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs ">
        &copy;2024 Student Meet. All rights reserved.
      </p>
    </div>
  );
}
