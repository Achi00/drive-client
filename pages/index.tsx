import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  File,
  FolderOpen,
  ScanEye,
  ScreenShare,
  Server,
  Undo,
} from "lucide-react";
import Link from "next/link";
import { getSession } from "./api/auth/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { UserProps } from "@/types";
import User from "@/components/User";

export default function Home({ user }: UserProps) {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="container max-w-4xl px-4 py-12 space-y-12">
        <div className="flex justify-between items-center flex-row xs:flex-col">
          <div className="flex items-center gap-4">
            {!user && (
              <Button
                className="w-full hover:bg-black hover:text-white bg-white text-gray-700 border border-gray-300 flex gap-2 items-center shadow-sm"
                onClick={handleGoogleLogin}
              >
                <GoogleIcon className="h-4 w-4 mr-2" />
                Login With Google
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
              Experience the Future of File Management
            </h1>
            <p className="max-w-[600px] text-xl text-gray-500 text-center">
              Introducing our cutting-edge Google Drive Clone, a modern and
              intuitive file management solution built with the latest web
              technologies.
            </p>
            <div className="flex items-center gap-4">
              {user.error && user.error?.length > 0 ? (
                <Link
                  href="/login"
                  className="flex gap-3 items-center justify-center h-12 px-8 rounded-md bg-gray-900 text-gray-50 text-sm font-medium shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  <GoogleIcon className="h-5 w-5 mr-2" />
                  Continue With Google
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-gray-900 text-gray-50 text-sm font-medium shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Cloud className="h-5 w-5 mr-2" />
                  Go To Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <File className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Seamless File Management
              </h3>
              <p className="text-gray-500">
                Easily upload, download, and organize your files with our
                intuitive interface.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <ScreenShare className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Collaborative Sharing
              </h3>
              <p className="text-gray-500">
                Effortlessly upload your files and set privacy controls. Make
                files private to restrict access or public to share with anyone
                via a URL, even if they are not authenticated.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <GoogleDocsIcon className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Google Docs File Editing
              </h3>
              <p className="text-gray-500">
                Edit your uploaded text files with Google Docs. Open your text
                files directly in Google Docs with one button click.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <ScanEye className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Secure Authentication and Protected Pages
              </h3>
              <p className="text-gray-500">
                Benefit from secure authentication methods to ensure only
                authorized users can access protected pages
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <FolderOpen className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Folder Management
              </h3>
              <p className="text-gray-500">
                Create folders and organize your files with ease. Keep your
                digital workspace tidy and accessible
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Undo className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">File Recovery</h3>
              <p className="text-gray-500">
                Move unwanted files to the trash where they can be restored or
                permanently deleted after 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const GoogleIcon = (className: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="20"
    height="100"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);
const GoogleDocsIcon = (className: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="32"
    height="32"
    viewBox="0 0 48 48"
  >
    <linearGradient
      id="pg10I3OeSC0NOv22QZ6aWa_v0YYnU84T2c4_gr1"
      x1="-209.942"
      x2="-179.36"
      y1="-3.055"
      y2="27.526"
      gradientTransform="translate(208.979 6.006)"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#55adfd"></stop>
      <stop offset="1" stop-color="#438ffd"></stop>
    </linearGradient>
    <path
      fill="url(#pg10I3OeSC0NOv22QZ6aWa_v0YYnU84T2c4_gr1)"
      d="M39.001,13.999v27c0,1.105-0.896,2-2,2h-26	c-1.105,0-2-0.895-2-2v-34c0-1.104,0.895-2,2-2h19l2,7L39.001,13.999z"
    ></path>
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M15.999,18.001v2.999	h17.002v-2.999H15.999z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M16.001,24.001v2.999	h17.002v-2.999H16.001z"
      clip-rule="evenodd"
    ></path>
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M15.999,30.001v2.999	h12.001v-2.999H15.999z"
      clip-rule="evenodd"
    ></path>
    <linearGradient
      id="pg10I3OeSC0NOv22QZ6aWb_v0YYnU84T2c4_gr2"
      x1="-197.862"
      x2="-203.384"
      y1="-4.632"
      y2=".89"
      gradientTransform="translate(234.385 12.109)"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#427fdb"></stop>
      <stop offset="1" stop-color="#0c52bb"></stop>
    </linearGradient>
    <path
      fill="url(#pg10I3OeSC0NOv22QZ6aWb_v0YYnU84T2c4_gr2)"
      d="M30.001,13.999l0.001-9l8.999,8.999L30.001,13.999z"
    ></path>
  </svg>
);

export async function getServerSideProps(
  context: NextApiRequest & NextApiResponse
) {
  const user = await getSession(context);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
