// pages/folder/[slug].tsx
import { useRouter } from "next/router";
import React from "react";
import api from "../api/axios";
import { fileTypes, userTypes } from "@/types";
import {
  getIconByFileType,
  getPreviewByFileType,
} from "@/utils/getIconsByFileType";
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
import Header from "@/components/Header";
import Empty from "@/components/Empty";
import FileCard from "@/components/FileCard";

const FolderPage = ({ user, initialFiles, imageUrls }: any) => {
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
      <div className="flex-1 p-6">
        <Header />
        {files.length > 0 ? (
          <div
            className="grid gap-3 p-5 w-full" // Reduce gap size
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
              />
            ))}
          </div>
        ) : (
          <Empty message="There is nothing here, try upload new files" />
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
  let imageUrls = {};

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
        const response = await api.get(`/v1/files/download/${file._id}`, {
          headers: context.req
            ? { cookie: context.req.headers.cookie }
            : undefined,
        });
        return { id: file._id, url: response.data.url };
      })
    );

    imageUrls = urls.reduce((acc, { id, url }) => {
      acc[id] = url;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return {
    props: {
      user,
      initialFiles,
      imageUrls,
    },
  };
}

export default FolderPage;
