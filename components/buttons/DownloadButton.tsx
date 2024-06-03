import React from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/pages/api/axios";

interface DownloadButtonProps {
  fileId: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileId,
  fileName,
}) => {
  const handleDownload = async () => {
    try {
      toast.loading("Downloading File...");

      // Fetch the download URL
      const response = await api.get(`/v1/files/downloadfile/${fileId}`);
      const url = response.data.url;

      // Fetch the file from the signed URL
      const fileResponse = await fetch(url);
      if (!fileResponse.ok) {
        throw new Error("Failed to fetch the file.");
      }
      const blob = await fileResponse.blob();

      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading file.");
      console.error("Error downloading file:", error);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <Button type="button" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
};

export default DownloadButton;
