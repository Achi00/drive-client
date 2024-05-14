"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "../api/auth/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import api from "../api/axios";
import { fileTypes, userTypes } from "@/types";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCheck,
  Download,
  FileIcon,
  FolderIcon,
  Loader2,
  Lock,
  RefreshCcw,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Docs from "../../public/google-docs.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import CustomToast from "@/components/CustomToast";
import { formatBytes } from "@/utils/formatBytes";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const [user, setUser] = useState<userTypes>({
    displayName: "",
    photoUrl: "",
    email: "",
  });
  const [files, setFiles] = useState<fileTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<fileTypes | null>(null);
  const [docsTab, setDocsTab] = useState<Window | null>(null);
  const [updateContentLoad, setUpdateContentLoad] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setUser(userSession);
    };

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await api.get("/v1/files/getfiles");
        setFiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchSession();
    fetchFiles();
  }, []);

  const handleFileClick = async (file: fileTypes) => {
    if (file.type === "file" && file.fileType === "text/plain") {
      try {
        const response = await api.get(`/v1/files/files/${file._id}/content`, {
          withCredentials: true,
        });
        const fileContent = response.data;
        setSelectedFile({ ...file, content: fileContent });
      } catch (error) {
        console.error("Error fetching file content:", error);
        setSelectedFile(file);
      }
    } else {
      setSelectedFile(file);
    }
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
  };

  // google docs edit
  const handleEditInDocs = async () => {
    if (
      selectedFile &&
      selectedFile.type === "file" &&
      selectedFile.fileType === "text/plain"
    ) {
      try {
        setIsPending(true);
        toast.loading("Redirecting to Google Docs...");
        const response = await api.post(
          `/v1/files/files/${selectedFile._id}/edit`
        );
        const { editUrl } = response.data;
        const tab = window.open(editUrl, "_blank");
        setDocsTab(tab);
        toast.dismiss();
      } catch (error) {
        toast.dismiss();
        console.error("Error editing in Google Docs:", error);
        toast.custom((t) => (
          <CustomToast
            message="Unable to open the file in Google Docs. Please try again later."
            t={t}
          />
        ));
      }
    }
  };

  // periodically check if the Google Docs tab is still open
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (docsTab && docsTab.closed) {
        try {
          setUpdateContentLoad(true);
          console.log("making put request");
          await api.put(`/v1/files/files/${selectedFile?._id}/content`);
          console.log("getting content");
          const response = await api.get(
            `/v1/files/files/${selectedFile?._id}/content`
          );
          const updatedContent = response.data;
          setSelectedFile((prevFile) => {
            if (prevFile) {
              return {
                ...prevFile,
                content: updatedContent,
              };
            }
            return null;
          });
          console.log("done");
          setIsPending(false);
          setDocsTab(null);
          setUpdateContentLoad(false);
        } catch (error) {
          console.error("Error saving file content:", error);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [docsTab, selectedFile]);

  if (!user || loading) {
    return <Loading />;
  }

  return (
    <div>
      <Toaster />
      <div className="flex h-screen w-full">
        <Sidebar user={user} />
        <div className="flex-1 p-6">
          <div className="flex p-4 items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Drive
            </h1>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button size="sm" variant="outline">
                <FolderIcon className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button size="icon" variant="ghost">
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          {/* files and folders */}
          <div>
            {files.length > 0 ? (
              <div className="flex gap-5 items-center justify-cente flex-wrap xl:p-5 lg:p-5 md:p-3 sm:p-1 xs:p-1 w-full min-h-screen">
                {files.map((file) => (
                  <div
                    key={file._id}
                    onClick={() => handleFileClick(file)}
                    className="bg-white w-1/6 dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FolderIcon className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No files found.</p>
            )}
            {/* <FilePreviewModal file={selectedFile} onClose={handleCloseModal} /> */}
          </div>
        </div>
      </div>
      <Dialog open={selectedFile !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
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
                    <ScrollArea className="h-72 w-full p-2 rounded-md border">
                      {selectedFile.content || (
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
                  <img src={selectedFile.path} alt={selectedFile.name} />
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
              <Button
                onClick={handleEditInDocs}
                variant="outline"
                className="flex items-center gap-2  hover:bg-[#3367D6] text-black border-[#4285F4] hover:border-[#3367D6] transition-colors shadow-lg rounded-md"
              >
                <Image src={Docs} alt="Edit In Docs" width={24} height={24} />
                Edit In Docs
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProtectedDashboard = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default ProtectedDashboard;
