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
import FilePreviewModal from "@/components/FilePreviewModal";

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
