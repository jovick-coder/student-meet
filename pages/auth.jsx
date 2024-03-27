import { AuthFormLogin, AuthFormRegister } from "@/components/AuthForm";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [activeAuth, setActiveAuth] = useState(0);
  let activeButtonClassName =
    "border  py-2 px-5  rounded bg-blue-500 text-white ";
  let inActiveButtonClassName = "border  py-2 px-5  rounded";
  return (
    <div className="h-full min-h-screen py-5 gap-4  justify-center flex flex-col items-center">
      <Toaster position="top-center" />
      <div className=" flex gap-2">
        <button
          className={
            activeAuth == 0 ? activeButtonClassName : inActiveButtonClassName
          }
          onClick={() => setActiveAuth(0)}
        >
          Login
        </button>
        <button
          className={
            activeAuth == 1 ? activeButtonClassName : inActiveButtonClassName
          }
          onClick={() => setActiveAuth(1)}
        >
          Register
        </button>
      </div>
      <div className="h-scr een flex items-center">
        {activeAuth == 1 && <AuthFormRegister setActiveAuth={setActiveAuth} />}
        {activeAuth == 0 && <AuthFormLogin />}
      </div>
    </div>
  );
}
