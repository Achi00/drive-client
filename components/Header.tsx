import { UploadIcon, FolderIcon, SearchIcon } from "lucide-react";
import React, { use } from "react";
import { Button } from "./ui/button";
import Upload from "./Upload";
import CreateFolder from "./CreateFolder";

interface HeaderProps {
  user: any;
  storageLimit: number;
  parentFolder: string | null;
}

const Header = () => {
  return (
    <div className="flex p-4 items-center border-b-2 justify-between mb-6">
      <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-sm font-bold text-gray-900 dark:text-gray-100 hidden xl:block lg:block md:block">
        My Drive
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Upload />
          <CreateFolder />
        </div>
        <Button size="icon" variant="ghost">
          <SearchIcon className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
