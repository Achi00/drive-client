"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "../api/auth/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import api from "../api/axios";
import { fileTypes, userTypes } from "@/types";
import Loading from "@/components/Loading";
import Link from "next/link";
import { Download, FolderIcon, SearchIcon, UploadIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import FilePreviewModal from "@/components/FilePreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [user, setUser] = useState<userTypes>({
    displayName: "",
    photoUrl: "",
    email: "",
  });
  const [files, setFiles] = useState<fileTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<fileTypes | null>(null);

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
        console.log(response.data);
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
        console.log(response);
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

  if (!user) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>{selectedFile?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedFile && (
              <>
                {selectedFile.fileType === "text/plain" && (
                  <pre>{selectedFile.content || "Loading..."}</pre>
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
          <DialogFooter>
            <Button type="submit">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
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
