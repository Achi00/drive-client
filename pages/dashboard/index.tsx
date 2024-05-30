// pages/dashboard/index.tsx
import React from "react";
import { getSession } from "../api/auth/auth";
import { Button } from "@/components/ui/button";
import api from "../api/axios";
import { fileTypes, userTypes, folderTypes } from "@/types";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCheck,
  Download,
  FileIcon,
  FolderIcon,
  FolderOpen,
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
import { formatBytes } from "@/utils/formatBytes";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProtectedRoute from "@/utils/ProtectedRoute";
import router from "next/router";
import {
  getIconByFileType,
  getPreviewByFileType,
} from "@/utils/getIconsByFileType";
import useFilePreview from "@/hooks/useFilePreview";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "postcss";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { NextApiRequest, NextApiResponse } from "next";
import { formatDate } from "@/utils/formatDate";
import Empty from "@/components/Empty";
import FileCard from "@/components/FileCard";
import FilePreviewModal from "@/components/FilePreviewModal";

interface DashboardProps {
  user: userTypes;
  initialFiles: fileTypes[];
  initialFolders: folderTypes[];
  imageUrls: { [key: string]: string };
}

const Dashboard = ({
  user,
  initialFiles,
  initialFolders,
  imageUrls,
}: DashboardProps) => {
  const [files, setFiles] = React.useState<fileTypes[]>(initialFiles);
  const [folders, setFolders] = React.useState<folderTypes[]>(initialFolders);
  const [loading, setLoading] = React.useState(false);

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

  if (!user || loading) {
    return <Loading />;
  }
  if (previewLoading) {
    return <Loading content="Loading Content" />;
  }

  return (
    <div>
      <Toaster />
      <div className="flex h-screen w-full">
        <Sidebar user={user} />
        <div className="flex-1 p-6">
          <Header />
          <h1 className="scroll-m-20 text-2xl font-bold  pl-5">Folders</h1>

          {folders.length > 0 ? (
            <div
              className="grid gap-3 p-5 w-full"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
              {folders.map((folder) => (
                <div
                  key={folder._id}
                  onClick={() => router.push(`/folder/${folder._id}`)}
                  className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex h-15 items-center justify-start gap-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors max-h-52 aspect-w-1 aspect-h-1 capitalize"
                >
                  <FolderOpen size={28} />
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                    {folder.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No folder found</p>
          )}
          <h1 className="scroll-m-20 text-2xl font-bold  pl-5">Files</h1>
          <div>
            {files.length > 0 ? (
              <div
                className="grid gap-3 p-5 w-full" // Reduce gap size
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                }}
              >
                {files.map((file) => (
                  // <>
                  //   <div
                  //     key={file._id}
                  //     onClick={() => handleFileClick(file)}
                  //     className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col h-60 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors aspect-w-1 aspect-h-1 relative"
                  //   >
                  //     <div className="flex items-center justify-between w-full gap-1 mb-2">
                  //       <div className="flex items-center gap-1">
                  //         <div>{getIconByFileType(file.fileType)}</div>
                  //         <h3 className="scroll-m-20 text-xl tracking-tight">
                  //           {file.name}
                  //         </h3>
                  //       </div>
                  //       {file.isPublic === false && (
                  //         // <div className="text-xs">Private</div>
                  //         <Lock size={16} />
                  //       )}
                  //     </div>
                  //     <div className="flex-grow border rounded-md p-2 w-full flex items-center justify-center">
                  //       {getPreviewByFileType(
                  //         file.fileType,
                  //         file.content || "",
                  //         imageUrls[file._id] || null
                  //       )}
                  //     </div>
                  //     <div className="text-sm text-gray-500 dark:text-gray-100 truncate mt-2">
                  //       Created: {formatDate(file.createdAt)}
                  //     </div>
                  //   </div>
                  // </>
                  <FileCard
                    key={file._id}
                    file={file}
                    imageUrls={imageUrls}
                    handleFileClick={handleFileClick}
                  />
                ))}
              </div>
            ) : (
              <Empty message="There are no files" />
            )}
          </div>
        </div>
      </div>
      <FilePreviewModal
        selectedFile={selectedFile}
        handleCloseModal={handleCloseModal}
        isPending={isPending}
        updateContentLoad={updateContentLoad}
        sanitizedContent={sanitizedContent}
        handleEditInDocs={handleEditInDocs}
      />
    </div>
  );
};

export async function getServerSideProps(
  context: NextApiRequest & NextApiResponse
) {
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
  let initialFolders = [];
  let imageUrls = {};

  try {
    const [filesResponse, foldersResponse] = await Promise.all([
      api.get("/v1/files/getfiles", {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }),
      api.get("/v1/files/folders", {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }),
    ]);

    initialFiles = filesResponse.data;
    initialFolders = foldersResponse.data;

    // Fetch signed URLs for image files
    const imageFiles = initialFiles.filter(
      (file: fileTypes) =>
        file.fileType === "image/png" ||
        file.fileType === "image/jpeg" ||
        file.fileType === "image/gif" ||
        file.fileType === "image/webp"
    );

    const urls = await Promise.all(
      imageFiles.map(async (file: fileTypes) => {
        try {
          const response = await api.get(`/v1/files/download/${file._id}`, {
            headers: context.req
              ? { cookie: context.req.headers.cookie }
              : undefined,
          });
          return { id: file._id, url: response.data.url };
        } catch (error) {
          console.error(
            `Error fetching signed URL for file ${file._id}:`,
            error
          );
          return { id: file._id, url: null }; // Return null for URL if there's an error
        }
      })
    );

    imageUrls = urls.reduce((acc, { id, url }) => {
      if (url) {
        acc[id] = url;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      props: {
        user,
        initialFiles: [],
        initialFolders: [],
        imageUrls: {},
      },
    };
  }

  return {
    props: {
      user,
      initialFiles,
      initialFolders,
      imageUrls,
    },
  };
}

export default Dashboard;
