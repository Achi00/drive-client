import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/router";
import { Eye, Loader2, UploadIcon } from "lucide-react";
import { formatBytes } from "@/utils/formatBytes";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const params = useParams<{ tag: string; item: string; slug: string }>();
  console.log(params.slug);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handlePublicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPublic(event.target.value === "true");
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("isPublic", isPublic.toString());

    // Only append parentFolderId if it's present in the URL
    if (params.slug) {
      formData.append("parent", params.slug as string);
      console.log("uploaded at:" + params.slug);
    }

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:8080/v1/files/upload",
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
      setMessage("Files uploaded successfully!");
      toast.success("Files uploaded successfully!");
      console.log(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 413) {
        setMessage(
          "Failed to upload files. Body exceeded size limit." +
            (error.response.data.message || "")
        );
      } else {
        setMessage("Failed to upload files. Please try again.");
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
