import React from "react";
import { fileTypes } from "../types/index";

interface FilePreviewProps {
  file: fileTypes | null;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  if (!file) {
    return null;
  }

  const renderPreview = () => {
    switch (file.fileType) {
      case "text/plain":
        return <pre>{file.content || "Loading..."}</pre>;
      case "image/png":
      case "image/jpeg":
      case "image/gif":
        return <img src={file.path} alt={file.name} />;
      case "application/pdf":
        return <iframe src={file.path} width="100%" height="600px" />;
      default:
        return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      {/* modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-2xl font-bold mb-4">{file.name}</h2>
        <div className="mb-4">{renderPreview()}</div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
