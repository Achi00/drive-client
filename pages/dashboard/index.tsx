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
import { getIconByFileType } from "@/utils/getIconsByFileType";
import useFilePreview from "@/hooks/useFilePreview";

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
                  <div
                    key={file._id}
                    onClick={() => handleFileClick(file)}
                    className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col h-40 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors max-h-52 aspect-w-1 aspect-h-1"
                  >
                    {getIconByFileType(
                      file.fileType,
                      imageUrls[file._id] || null
                    )}
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No files found.</p>
            )}
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
                    className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex flex-col h-40 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors max-h-52 aspect-w-1 aspect-h-1"
                  >
                    <FolderOpen className="mb-2" size={48} />
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {folder.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No folder found</p>
            )}
          </div>
        </div>
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
        file.fileType === "image/gif"
    );

    const urls = await Promise.all(
      imageFiles.map(async (file: fileTypes) => {
        try {
          const response = await api.get(`/v1/files/download/${file._id}`, {
            headers: context.req
              ? { cookie: context.req.headers.cookie }
              : undefined,
          });
          console.log(file._id);
          console.log(response.data.url);
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
