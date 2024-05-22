// hooks/useFilePreview.ts
import { useState, useEffect } from "react";
import api from "../pages/api/axios";
import { fileTypes } from "@/types";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import { handleFileClick as handleClick } from "@/utils/fileHandlers";
import CustomToast from "@/components/CustomToast";

const useFilePreview = () => {
  const [selectedFile, setSelectedFile] = useState<fileTypes | null>(null);
  const [docsTab, setDocsTab] = useState<Window | null>(null);
  const [updateContentLoad, setUpdateContentLoad] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const sanitizedContent =
    selectedFile && selectedFile.content
      ? DOMPurify.sanitize(selectedFile.content)
      : "";

  const handleFileClick = async (file: fileTypes) => {
    await handleClick(file, setSelectedFile, setPreviewLoading);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
  };

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
        setIsPending(false);
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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (docsTab && docsTab.closed) {
        try {
          setUpdateContentLoad(true);
          await api.put(`/v1/files/files/${selectedFile?._id}/content`);
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

  return {
    selectedFile,
    previewLoading,
    isPending,
    updateContentLoad,
    sanitizedContent,
    handleFileClick,
    handleCloseModal,
    handleEditInDocs,
  };
};

export default useFilePreview;
