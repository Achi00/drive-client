// pages/folder/[slug].tsx

import { useRouter } from "next/router";
import React from "react";
import api from "../api/axios";
import { fileTypes, userTypes } from "@/types";
import { getIconByFileType } from "@/utils/getIconsByFileType";
import useFilePreview from "@/hooks/useFilePreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatBytes } from "@/utils/formatBytes";
import {
  CheckCheck,
  Download,
  FileIcon,
  Loader2,
  RefreshCcw,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Docs from "../../public/google-docs.png";
import Sidebar from "@/components/Sidebar";
import { getSession } from "../api/auth/auth";
import Loading from "@/components/Loading";

const FolderPage = ({ user, initialFiles }: any) => {
  const router = useRouter();
  const { slug } = router.query;
  const [files, setFiles] = React.useState<fileTypes[]>(initialFiles);

  const {
    selectedFile,
    previewLoading,
    isPending,
    updateContentLoad,
    sanitizedContent,
    handleFileClick,
    handleCloseModal,
    handleEditInDocs,
  } = useFilePreview();

  if (previewLoading) {
    return <Loading content="Loading Content" />;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar user={user} />
      <h1>Folder: {slug}</h1>
      <div>
        {files.length > 0 ? (
          <div className="flex gap-5 items-center justify-center flex-wrap xl:p-5 lg:p-5 md:p-3 sm:p-1 xs:p-1 w-full min-h-screen">
            {files.map((file) => (
              <div
                key={file._id}
                onClick={() => handleFileClick(file)}
                className="bg-white w-1/6 dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {getIconByFileType(file.fileType)}
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No files found.</p>
        )}
      </div>
      <Dialog open={selectedFile !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <p>{selectedFile?._id}</p>
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
                    <ScrollArea className=" h-96 w-full p-2 rounded-md border">
                      {(
                        <div
                          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                          style={{ maxWidth: "100%", overflow: "auto" }}
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
                  selectedFile.fileType === "image/gif") && (
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
          <DialogFooter className="sm:justify-between  items-center">
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
            <div>
              {selectedFile?.isPublic === false && (
                <div className="flex items-center gap-1">
                  <Lock /> Private File
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Button type="submit">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
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
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const user = await getSession(context);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let initialFiles = [];

  try {
    const response = await api.get(
      `/v1/files/folders/${context.params.slug}/files`,
      {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }
    );
    initialFiles = response.data;
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return {
    props: {
      user,
      initialFiles,
    },
  };
}

export default FolderPage;
