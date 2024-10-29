// components/Header.tsx
import React from "react";
import { Button } from "./ui/button";
import Upload from "./Upload";
import CreateFolder from "./CreateFolder";
import Link from "next/link";
import { folderTypes, fileTypes } from "@/types";
import { usePathname } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onUploadSuccess: (
    newFiles: fileTypes[],
    newImageUrls: { [key: string]: string | null }
  ) => void;
  onFolderCreate: (newFolder: folderTypes) => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadSuccess, onFolderCreate }) => {
  const pathName = usePathname();
  const router = useRouter();
  const basePath = pathName.split("/")[1] ? `/${pathName.split("/")[1]}` : "";

  const handleRefresh = () => {
    router.refresh();
  };
  return (
    <div className="flex p-4 items-center border-b-2 justify-between mb-6">
      <h1 className="xl:text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-sm font-bold text-gray-900 dark:text-gray-100 hidden xl:block lg:block md:block">
        <Link href="/dashboard">My Drive</Link>
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
          <Upload onUploadSuccess={onUploadSuccess} />
          {basePath != "/folder" && (
            <CreateFolder onFolderCreate={onFolderCreate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
