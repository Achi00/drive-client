// pages/file/[id].tsx

import React from "react";
import { GetServerSideProps } from "next";
import api from "../api/axios";
import { fileTypes } from "@/types";
import Loading from "@/components/Loading";
import FileDetails from "@/components/FileDetails";
import AccessDenied from "@/components/AccessDenied";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

interface FilePageProps {
  file: fileTypes | null;
  sanitizedContent: string;
  error: string | null;
  errorCode: number | null;
}

const FilePage: React.FC<FilePageProps> = ({
  file,
  sanitizedContent,
  error,
  errorCode,
}) => {
  if (errorCode === 403) {
    return <AccessDenied />;
  }
  //  else if (errorCode === 404) {
  //   return <NotFound />;
  // } else if (error) {
  //   return <ErrorPage message={error} />;
  // }

  if (!file) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <FileDetails file={file} sanitizedContent={sanitizedContent} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<FilePageProps> = async (
  context
) => {
  const id = context.params?.id as string;
  const cookie = context.req.headers.cookie;

  console.log("Fetching file with ID:", id);
  console.log("Cookie:", cookie);

  let file = null;
  let sanitizedContent = "";
  let error = null;
  let errorCode = null;

  try {
    const response = await api.get(`/v1/files/files/${id}`, {
      headers: cookie ? { cookie } : undefined,
    });
    file = response.data;

    console.log("File data:", file);

    // Sanitize content if it's plain text
    if (file && file.fileType === "text/plain" && file.content) {
      sanitizedContent = sanitizeHtml(file.content);
    }
  } catch (err: any) {
    console.error("Error fetching file:", err);
    errorCode = err.response ? err.response.status : 500;
    if (err.response && err.response.status === 403) {
      error = "Access denied. This file is private.";
    } else if (err.response && err.response.status === 404) {
      error = "File not found.";
    } else {
      error = "An unexpected error occurred.";
    }
  }

  return {
    props: {
      file,
      sanitizedContent,
      error,
      errorCode,
    },
  };
};

export default FilePage;
