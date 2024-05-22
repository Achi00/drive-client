import { useState } from "react";
import api from "../pages/api/axios";
import { fileTypes } from "../types";

const useFileHandler = () => {
  const [selectedFile, setSelectedFile] = useState<fileTypes | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleFileClick = async (file: fileTypes) => {
    try {
      setPreviewLoading(true);

      if (file.type === "file") {
        if (file.fileType === "text/plain") {
          // Fetch the content for text/plain files
          const response = await api.get(
            `/v1/files/files/${file._id}/content`,
            {
              withCredentials: true,
            }
          );
          const fileContent = response.data;
          setSelectedFile({ ...file, content: fileContent });
        } else if (
          file.fileType === "image/png" ||
          file.fileType === "image/jpeg" ||
          file.fileType === "image/gif"
        ) {
          // Fetch the signed URL for image files
          const response = await api.get(`/v1/files/download/${file._id}`, {
            withCredentials: true,
          });
          const fileUrl = response.data.url;
          setSelectedFile({ ...file, path: fileUrl });
        } else {
          // Handle other file types if needed
          setSelectedFile(file);
        }
      } else {
        // Handle folder clicks or other cases
        setSelectedFile(file);
      }

      setPreviewLoading(false);
    } catch (error) {
      console.error("Error fetching file:", error);
      setSelectedFile(file);
      setPreviewLoading(false);
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    previewLoading,
    setPreviewLoading,
    handleFileClick,
  };
};

export default useFileHandler;
