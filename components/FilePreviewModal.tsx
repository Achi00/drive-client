// components/FilePreviewModal.tsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Loader2,
  CheckCheck,
  RefreshCcw,
  Download,
  FileIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/utils/formatBytes";
import { fileTypes } from "@/types";
import Docs from "../assets/images/google-docs.png";
import {
  getIconByFileType,
  getPreviewByFileType,
} from "@/utils/getIconsByFileType";
import Link from "next/link";
import DownloadButton from "./buttons/DownloadButton";

interface FilePreviewModalProps {
  selectedFile: fileTypes | null;
  handleCloseModal: () => void;
  isPending: boolean;
  updateContentLoad: boolean;
  sanitizedContent: string;
  handleEditInDocs: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  selectedFile,
  handleCloseModal,
  isPending,
  updateContentLoad,
  sanitizedContent,
  handleEditInDocs,
}) => {
  return (
    <Dialog open={selectedFile !== null} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle>Content Preview</DialogTitle>
            <Link
              href={`/file/${selectedFile?._id}`}
              className="flex items-center gap-1 pr-10 hover:text-blue-700 hover:underline"
            >
              <SquareArrowOutUpRight size={15} className="mt-1" />
              Open File In New Tab
            </Link>
          </div>
          <div>
            {selectedFile?.isPublic === false && (
              <div className="flex items-center gap-1">
                <Lock size={15} /> Private File
              </div>
            )}
          </div>
          <DialogDescription>
            {selectedFile?.name} -{" "}
            <span className="font-bold">
              {selectedFile
                ? formatBytes(selectedFile.size)
                : "No file selected"}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedFile && (
            <>
              {selectedFile.fileType === "text/plain" && (
                <pre className="border rounded-md p-2">
                  <ScrollArea className="h-96 w-full p-2 rounded-md border">
                    {(
                      <div
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        className="max-w-full overflow-auto break-words whitespace-pre-wrap"
                      />
                    ) || (
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
              {(selectedFile.fileType === "image/png" ||
                selectedFile.fileType === "image/jpeg" ||
                selectedFile.fileType === "image/gif" ||
                selectedFile.fileType === "image/webp") && (
                <img
                  className="rounded-lg"
                  src={selectedFile.path}
                  alt={selectedFile.name}
                />
              )}
              {selectedFile.fileType === "application/pdf" && (
                <iframe src={selectedFile.path} width="100%" height="400px" />
              )}
            </>
          )}
        </div>
        <DialogFooter className="sm:justify-between items-center">
          {!isPending &&
            (updateContentLoad ? (
              <div className="text-gray-500 flex items-center text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating content...
              </div>
            ) : (
              <div className="text-gray-500 flex items-center gap-1 text-sm">
                <CheckCheck />
                <p>This file is up to date</p>
              </div>
            ))}

          {isPending && (
            <div className="text-gary-500 flex items-center gap-1 text-sm">
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin scale-[-1]" />
              <div className="flex flex-col">
                <p>Pending...</p>
                <p className="text-gray-400">
                  Content will be updated after you close google docs page
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 items-center">
            {selectedFile && (
              <DownloadButton
                fileId={selectedFile._id}
                fileName={selectedFile.name}
              />
            )}
            {selectedFile?.fileType === "text/plain" && (
              <Button
                onClick={handleEditInDocs}
                variant="outline"
                className="flex items-center gap-2 hover:bg-[#3367D6] text-black border-[#4285F4] hover:border-[#3367D6] transition-colors shadow-lg rounded-md"
              >
                <Image src={Docs} alt="Edit In Docs" width={24} height={24} />
                Edit In Docs
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
