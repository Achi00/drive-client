import React from "react";
import api from "../api/axios";
import { fileTypes, folderTypes } from "@/types";

import useFilePreview from "@/hooks/useFilePreview";
import { getSession } from "../api/auth/auth";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Empty from "@/components/Empty";
import FileCard from "@/components/FileCard";
import FilePreviewModal from "@/components/FilePreviewModal";
import { FolderOpen } from "lucide-react";

const FolderPage = ({
  user,
  initialFiles,
  imageUrls: initialImageUrls,
  folderDetails,
  folderName,
}: any) => {
  const [files, setFiles] = React.useState<fileTypes[]>(initialFiles);
  const [imageUrls, setImageUrls] = React.useState<{
    [key: string]: string | null;
  }>(initialImageUrls);

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
    return;
  };

  if (previewLoading) {
    return <Loading content="Loading Content" />;
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 p-6">
        <Header
          onUploadSuccess={handleUploadSuccess}
          onFolderCreate={handleFolderCreate}
        />
        <div className="flex p-4 items-center justify-between mb-6">
          <h1 className="items-center gap-3 xl:text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-sm font-bold text-gray-900 dark:text-gray-100 hidden xl:flex lg:flex md:flex">
            <FolderOpen className="h-7 w-7" />
            {folderName}
          </h1>
        </div>
        {files.length > 0 ? (
          <div
            className="grid gap-8 p-5 w-full" // Reduce gap size
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
          <Empty message="There is nothing here, try upload new files" />
        )}
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
  let folderName;

  try {
    // Fetch files inside the folder
    const response = await api.get(
      `/v1/files/folders/${context.params.slug}/files`,
      {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }
    );
    // Separate folderName and files from the response
    folderName = response.data.folderName;
    initialFiles = response.data.files;

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
      folderName,
    },
  };
}

export default FolderPage;
