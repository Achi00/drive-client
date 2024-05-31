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

interface FileCardProps {
  file: Partial<fileTypes>;
  imageUrls: { [key: string]: string | null };
  handleFileClick?: (file: any) => void;
  onMoveToTrash?: (fileId: string) => void; // New prop
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  imageUrls,
  handleFileClick,
  onMoveToTrash,
}) => {
  return (
    <div
      key={file._id}
      onClick={() => handleFileClick && handleFileClick(file)}
      className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col h-60 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors aspect-w-1 aspect-h-1 relative"
    >
      <div className="flex items-center justify-between w-full gap-1 mb-2">
        <div className="flex items-center gap-1">
          <div>{getIconByFileType(file.fileType)}</div>
          <h3 className="scroll-m-20 text-xl tracking-tight">{file.name}</h3>
        </div>
        {!file.isPublic && <Lock size={16} />}
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
