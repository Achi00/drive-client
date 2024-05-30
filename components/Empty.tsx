import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Upload from "./Upload";

interface emptyTypes {
  message: string;
}

const Empty = ({ message }: emptyTypes) => {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-6 px-4 text-center">
      <MicroscopeIcon className="h-24 w-24 text-gray-900" />
      <div className="flex flex-col gap-7">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          This page is empty
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          {message}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Upload />
        <h1>Or</h1>
        <Link
          className="flex gap-2 border border-gray-300 px-2 font-bold h-10 items-center justify-center rounded-md "
          href="/dashboard"
        >
          <LinkIcon size={20} />
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Empty;

function MicroscopeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}
