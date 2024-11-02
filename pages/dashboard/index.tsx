// pages/dashboard/index.tsx
import React from "react";
import { getSession } from "../api/auth/auth";
import api from "../api/axios";
import { fileTypes, userTypes, folderTypes } from "@/types";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import router from "next/router";
import Header from "@/components/Header";
import { NextApiRequest, NextApiResponse } from "next";
import Empty from "@/components/Empty";
import FileCard from "@/components/FileCard";
import FilePreviewModal from "@/components/FilePreviewModal";
import useFilePreview from "@/hooks/useFilePreview";
import { FolderOpen } from "lucide-react";

interface DashboardProps {
  user: userTypes;
  initialFiles: fileTypes[];
  initialFolders: folderTypes[];
  imageUrls: { [key: string]: string | null };
}

const Dashboard = ({
  user,
  initialFiles,
  initialFolders,
  imageUrls: initialImageUrls,
}: DashboardProps) => {
  const [files, setFiles] = React.useState<fileTypes[]>(initialFiles);
  const [folders, setFolders] = React.useState<folderTypes[]>(initialFolders);
  const [imageUrls, setImageUrls] = React.useState<{
    [key: string]: string | null;
  }>(initialImageUrls);
  const [loading, setLoading] = React.useState(false);

  const handleFileMoveToTrash = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  };

  const handleUploadSuccess = (
    newFiles: fileTypes[],
    newImageUrls: { [key: string]: string | null }
  ) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setImageUrls((prevImageUrls) => ({
      ...prevImageUrls,
      ...newImageUrls,
    }));
  };

  const handleFolderCreate = (newFolder: folderTypes) => {
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

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
        <div className="flex-1 p-6">
          <Header
            onUploadSuccess={handleUploadSuccess}
            onFolderCreate={handleFolderCreate}
          />
          <h1 className="scroll-m-20 text-2xl font-bold pl-5">
            {folders.length > 0 && "Folders"}
          </h1>

          {folders.length > 0 && (
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
          )}

          <h1 className="scroll-m-20 text-2xl font-bold pl-5">
            {files.length > 0 && "Files"}
          </h1>
          <div>
            {files.length > 0 ? (
              <div
                className="grid gap-8 p-5 w-full"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                }}
              >
                {files.map((file) => (
                  <FileCard
                    key={file._id}
                    file={file}
                    imageUrls={imageUrls}
                    handleFileClick={handleFileClick}
                    onMoveToTrash={handleFileMoveToTrash}
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
  console.log("Incoming cookies:", context.req.headers.cookie);
  const headers = {
    cookie: context.req.headers.cookie,
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Forwarded-Proto": "https",
    "X-Forwarded-Host": context.req.headers.host,
    Origin: "https://wordcrafter.io",
  };
  const authResponse = await api.get("/api/session", {
    headers,
    withCredentials: true,
  });

  console.log("Auth response:", authResponse.data);
  const user = await getSession(context);

  console.log("user from getSession " + JSON.stringify(user, null, 2));

  // if (!user) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

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
          return { id: file._id, url: null };
        }
      })
    );

    imageUrls = urls.reduce((acc, { id, url }) => {
      if (url) {
        acc[id] = url;
      }
      return acc;
    }, {});
  } catch (error: any) {
    console.error("Error fetching initial data:", error.message);
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
