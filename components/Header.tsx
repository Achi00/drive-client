// components/Header.tsx
import React from "react";
import { Button } from "./ui/button";
import Upload from "./Upload";
import CreateFolder from "./CreateFolder";
import Link from "next/link";
import { folderTypes, fileTypes } from "@/types";

interface HeaderProps {
  onUploadSuccess: (
    newFiles: fileTypes[],
    newImageUrls: { [key: string]: string | null }
  ) => void;
  onFolderCreate: (newFolder: folderTypes) => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadSuccess, onFolderCreate }) => {
  return (
    <div className="flex p-4 items-center border-b-2 justify-between mb-6">
      <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-sm font-bold text-gray-900 dark:text-gray-100 hidden xl:block lg:block md:block">
        <Link href="/dashboard">My Drive</Link>
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Upload onUploadSuccess={onUploadSuccess} />
          <CreateFolder onFolderCreate={onFolderCreate} />
        </div>
      </div>
    </div>
  );
};

export default Header;
