// components/FileDetails.tsx

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Download, FileIcon } from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/utils/formatBytes";
import { fileTypes } from "@/types";
import Docs from "../assets/images/google-docs.png";
import { Button } from "@/components/ui/button";

interface FileDetailsProps {
  file: fileTypes;
  sanitizedContent: string;
  imageUrl: string | null;
  handleEditInDocs?: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({
  file,
  sanitizedContent,
  imageUrl,
}) => {
  return (
    <div className="w-1/2 mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Content Preview</h1>
        <p>
          {file.name} -{" "}
          <span className="font-bold">{formatBytes(file.size)}</span>
        </p>
      </div>
      <div className="grid gap-4 py-4">
        {file.fileType === "text/plain" && (
          <pre className="border rounded-md p-2">
            <ScrollArea className="h-full w-full p-2 rounded-md border">
              {sanitizedContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  className="max-w-full overflow-auto break-words whitespace-pre-wrap"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[20vh]">
                  <div className="bg-gray-100 rounded-full p-4 dark:bg-gray-800">
                    <FileIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
                    No content available
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    There is currently no content to display.
                  </p>
                </div>
              )}
            </ScrollArea>
          </pre>
        )}
        {(file.fileType === "image/png" ||
          file.fileType === "image/jpeg" ||
          file.fileType === "image/gif" ||
          file.fileType === "image/webp") && (
          <Image
            className="rounded-lg"
            src={imageUrl || file.path}
            alt={file.name}
            objectFit="cover"
            loading="lazy"
            width={1280}
            height={720}
          />
        )}
        {file.fileType === "application/pdf" && (
          <iframe src={file.path} width="100%" height="400px" />
        )}
      </div>
      <div className="flex justify-between">
        {file.isPublic === false && (
          <div className="flex items-center gap-1">
            <Lock /> Private File
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <Button type="submit">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
