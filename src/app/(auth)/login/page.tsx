"use client"
import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Image from "next/image";
import Logo from "../../../../public/images/Logo.png";
import Lottie from "lottie-react";
import SideBG from "../../../../public/animated/Artificial Intelligence Chatbot.json";

const LoginSignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen font-sans bg-background">
      {/* Left Panel: Visible on large screens */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-8 bg-cover bg-center text-primary-foreground"
        style={{ backgroundImage: "url('/images/login.png')" }}
      >
        <div className="relative">
          <Image
            src={Logo}
            alt="Techsolace Logo"
            width={1920}
            height={1080}
            className="w-auto h-12"
          />
          <Lottie animationData={SideBG} loop autoplay className="absolute top-40 left-40 w-full max-w-[600px] mx-auto" />
        </div>
        <div>
          <h1 className="text-5xl text-white font-bold leading-tight mt-2">
            Techsolace CMS
          </h1>
          <p className="text-base text-neutral-300 max-w-lg mt-3">
            A powerful, user-friendly content management system designed to
            streamline website creation and management.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-foreground">
            Get Started Now
          </h2>
          <p className="text-muted-foreground mt-2">
            Please log in to your account to continue.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue="workmail@gmail.com"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm ring-1 ring-ring"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="••••••••••"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <IoEyeOutline className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label
                htmlFor="agree"
                className="ml-2 block text-sm text-foreground"
              >
                I agree to the Terms & Privacy
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              >
                Login
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Have an account?{" "}
              <a href="#" className="font-medium text-primary hover:underline">
                Signup
              </a>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Login with Google
              </button>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FaApple className="h-5 w-5 mr-2" />
                Login with Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
