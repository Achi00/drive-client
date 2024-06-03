// components/FileCard.tsx

import React from "react";
import {
  getIconByFileType,
  getPreviewByFileType,
} from "../utils/getIconsByFileType";
import { formatDate } from "../utils/formatDate";
import { Lock } from "lucide-react";
import MoveToTrashButton from "./buttons/MoveToTrashButton";
import { fileTypes } from "@/types";
import { usePathname } from "next/navigation";
import RestoreButton from "./buttons/RestoreButton";

interface FileCardProps {
  file: Partial<fileTypes>;
  imageUrls: { [key: string]: string | null };
  handleFileClick?: (file: any) => void;
  onMoveToTrash?: (fileId: string) => void;
  onRestore?: (fileId: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  imageUrls,
  handleFileClick,
  onMoveToTrash,
  onRestore,
}) => {
  const pathname = usePathname();
  return (
    <div
      key={file._id}
      onClick={() => handleFileClick && handleFileClick(file)}
      className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col h-72 xl:w-60 lg:w-56 md:w-52 sm:w-52 xs:w-36 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors aspect-w-1 aspect-h-1 relative"
    >
      <div className="flex items-center justify-between w-full gap-1 mb-2">
        <div className="flex items-center gap-1">
          <div>{getIconByFileType(file.fileType)}</div>
          <h3 className="scroll-m-20 text-xl tracking-tight">{file.name}</h3>
        </div>
        {!file.isPublic && <Lock size={16} />}
        {pathname === "/trash" && (
          <RestoreButton fileId={file._id!} onRestore={onRestore!} />
        )}
      </div>
      <div className="flex-grow border rounded-md p-2 w-full flex items-center justify-center">
        {getPreviewByFileType(
          file.fileType!,
          file.content || "",
          imageUrls[file._id!] || null
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-2">
        <div className="text-sm text-gray-500 dark:text-gray-100 truncate">
          {file.deletedAt
            ? `Deleted at: ${new Date(file.deletedAt).toLocaleString()}`
            : `Created: ${
                file.createdAt ? formatDate(file.createdAt) : "Unknown"
              }`}
        </div>
        <MoveToTrashButton fileId={file._id!} onMoveToTrash={onMoveToTrash} />
      </div>
    </div>
  );
};

export default FileCard;
