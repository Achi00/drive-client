import { UploadIcon, FolderIcon, SearchIcon } from "lucide-react";
import React, { use } from "react";
import { Button } from "./ui/button";
import Upload from "./Upload";
import CreateFolder from "./CreateFolder";
import Link from "next/link";

interface HeaderProps {
  user: any;
  storageLimit: number;
  parentFolder: string | null;
}

const Header = () => {
  return (
    <div className="flex p-4 items-center border-b-2 justify-between mb-6">
      <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-sm font-bold text-gray-900 dark:text-gray-100 hidden xl:block lg:block md:block">
        <Link href="/dashboard">My Drive</Link>
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Upload />
          <CreateFolder />
        </div>
      </div>
    </div>
  );
};

export default Header;
