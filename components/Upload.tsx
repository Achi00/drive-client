import React, { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleAlert, Eye, Loader2, Siren, UploadIcon } from "lucide-react";
import { formatBytes } from "@/utils/formatBytes";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { fileTypes } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface UploadProps {
  onUploadSuccess: (
    newFiles: fileTypes[],
    newImageUrls: { [key: string]: string | null }
  ) => void;
}

interface UploadResults {
  uploaded: string[];
  rejected: string[];
  duplicates: string[];
  totalStorageUsed: string;
  availableStorage: string;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResults | null>(
    null
  );

  const params = useParams<{ tag: string; item: string; slug: string }>();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const supportedTypes = ["image/jpeg", "image/png", "text/plain"];
      const newAcceptedFiles: File[] = [];
      const newRejectedFiles: string[] = [];

      acceptedFiles.forEach((file) => {
        if (supportedTypes.includes(file.type)) {
          newAcceptedFiles.push(file);
        } else {
          newRejectedFiles.push(file.name + " (unsupported file type)");
        }
      });

      fileRejections.forEach(({ file, errors }) => {
        newRejectedFiles.push(file.name + " (unsupported file type)");
      });

      setFiles((prevFiles) => [...prevFiles, ...newAcceptedFiles]);
      setRejectedFiles((prevRejectedFiles) => [
        ...prevRejectedFiles,
        ...newRejectedFiles,
      ]);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
  });

  const handlePublicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPublic(event.target.value === "true");
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("isPublic", isPublic.toString());

    if (params.slug) {
      formData.append("parent", params.slug as string);
    }

    try {
      setUploadResults(null);
      setUploading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              setProgress(Math.floor((loaded * 100) / total));
            }
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const result = response.data;
      setUploadResults(result); // Set the upload results to display them
      toast.success("Files uploaded successfully!");

      const uploadedFiles = result.uploadedFiles;
      const imageFiles = uploadedFiles.filter(
        (file: any) =>
          file.fileType === "image/png" ||
          file.fileType === "image/jpeg" ||
          file.fileType === "image/gif" ||
          file.fileType === "image/webp"
      );

      const urls = await Promise.all(
        imageFiles.map(async (file: any) => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/download/${file._id}`
            );
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

      const imageUrls = urls.reduce<{ [key: string]: string | null }>(
        (acc, { id, url }) => {
          if (url) {
            acc[id] = url;
          }
          return acc;
        },
        {}
      );

      onUploadSuccess(uploadedFiles, imageUrls);
    } catch (error: any) {
      if (error.response && error.response.status === 413) {
        setMessage(
          "Failed to upload files. Body exceeded size limit." +
            (error.response.data.message || "")
        );
      }
      console.error(error);
    } finally {
      setUploading(false);
      setFiles([]);
      setProgress(0);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Upload to Google Drive</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Drag and drop a file to upload to your Google Drive storage.
            </p>
          </div>
          <Alert>
            <Siren className="h-4 w-4 " color="#ff0000" />
            <AlertTitle>File Upload Limitations</AlertTitle>
            <AlertDescription>
              We currently only support image and text file uploads. Please
              ensure your files are text or image formats. Limit is 5 files
            </AlertDescription>
          </Alert>
          {isPublic && (
            <Alert>
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>
                You are making this file publicly available
              </AlertTitle>
              <AlertDescription>
                Anyone with the link will see this file
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div
              {...getRootProps({
                className:
                  "group relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-colors hover:border-primary hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary dark:hover:bg-gray-700",
              })}
            >
              <input
                {...getInputProps()}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="z-20 flex flex-col items-center justify-center space-y-2 text-gray-500 transition-colors group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary">
                <CloudUploadIcon className="h-8 w-8" />
                <p>Drag and drop a file or click to select</p>
              </div>
            </div>
            <div className="flex gap-3">
              <label
                htmlFor="isPublic"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Eye size={20} />
                Visibility
              </label>
              <select
                id="isPublic"
                name="isPublic"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-500 border sm:text-sm rounded-md"
                value={isPublic.toString()}
                onChange={handlePublicChange}
              >
                <option value="false">Private</option>
                <option value="true">Public</option>
              </select>
            </div>
            <Progress value={progress} />
            <Button
              className="w-full"
              type="button"
              disabled={uploading || !files}
              onClick={uploadFiles}
            >
              {uploading ? (
                <p className="flex items-center gap-2">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Uploading
                </p>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
          {message && (
            <h2 className="text-center border-b-2 border-gray-400 pb-2 text-xl font-semibold tracking-tight first:mt-0">
              {message}
            </h2>
          )}
          <div className="file-list">
            {files.map((file) => (
              <div key={file.name} className="text-sm font-bold">
                {file.name} - {formatBytes(file.size)}
              </div>
            ))}
            {rejectedFiles.map((fileName, index) => (
              <div key={index} className="text-sm font-bold text-red-500">
                {fileName}
              </div>
            ))}
            {uploadResults && (
              <div className="upload-results mt-4">
                <div className="flex gap-4 flex-col">
                  <h2 className="text-2xl font-bold">Upload Results</h2>
                  <div className=" border-t border-black">
                    {uploadResults.uploaded.join(", ")}
                  </div>
                  {/* <p>Total Storage Used: {uploadResults.totalStorageUsed}</p> */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Storage Used</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <div className="text-4xl font-bold">
                        {uploadResults.totalStorageUsed}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {uploadResults.availableStorage} available
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

export default Upload;
