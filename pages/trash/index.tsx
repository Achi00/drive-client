// pages/trash.tsx

import React, { useState } from "react";
import axios from "axios";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { TrashProps, fileTypes } from "@/types";
import FileCard from "@/components/FileCard";
import { getSession } from "../api/auth/auth";
import Empty from "@/components/Empty";
import { Toaster } from "react-hot-toast";

const Trash: React.FC<TrashProps> = ({
  files: initialFiles = [],
  imageUrls: initialImageUrls = {},
}) => {
  const [files, setFiles] = useState<Partial<fileTypes>[]>(initialFiles);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string | null }>(
    initialImageUrls
  );

  const handleFileDelete = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  };

  return (
    <div className="p-6 px-12">
      <Toaster />
      <h1 className="text-4xl font-bold border-b border-black mb-4">Trash</h1>
      {files.length === 0 ? (
        <Empty message="You have no deleted files" />
      ) : (
        <div
          className="grid gap-3 p-5 w-full"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={{ ...file, isPublic: file.isPublic ?? false }}
              imageUrls={imageUrls}
              onMoveToTrash={handleFileDelete} // Pass the handler here
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: NextApiRequest & NextApiResponse
) => {
  const user = await getSession(context);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let files: Partial<fileTypes>[] = [];
  let imageUrls: { [key: string]: string | null } = {};

  try {
    const response = await axios.get("http://localhost:8080/v1/files/trash", {
      headers: { cookie: context.req.headers.cookie },
    });
    files = response.data;

    const imageFiles = files.filter(
      (file: Partial<fileTypes>) =>
        file.fileType === "image/png" ||
        file.fileType === "image/jpeg" ||
        file.fileType === "image/gif" ||
        file.fileType === "image/webp"
    );

    const urls = await Promise.all(
      imageFiles.map(async (file: Partial<fileTypes>) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/v1/files/download/${file._id}`,
            {
              headers: { cookie: context.req.headers.cookie },
            }
          );
          return { id: file._id!, url: response.data.url };
        } catch (error) {
          console.error(
            `Error fetching signed URL for file ${file._id}:`,
            error
          );
          return { id: file._id!, url: null };
        }
      })
    );

    imageUrls = urls.reduce<{ [key: string]: string | null }>(
      (acc, { id, url }) => {
        if (url) {
          acc[id] = url;
        }
        return acc;
      },
      {}
    );
  } catch (error) {
    console.error("Error fetching trash files:", error);
  }

  return {
    props: {
      user,
      files,
      imageUrls,
    },
  };
};

export default Trash;
