import { File, FileImage, FileText } from "lucide-react";

export const getIconByFileType = (fileType: any, imageUrl: string | null) => {
  if (
    imageUrl &&
    (fileType === "image/png" ||
      fileType === "image/jpeg" ||
      fileType === "image/gif")
  ) {
    return (
      <img
        src={imageUrl}
        alt="File"
        className="mb-2"
        style={{ width: "48px", height: "48px", objectFit: "cover" }}
      />
    );
  }

  switch (fileType) {
    case "text/plain":
      return <File className="mb-2" size={48} />;
    case "image/png":
    case "image/jpeg":
    case "image/gif":
      return <FileImage className="mb-2" size={48} />;
    case "application/pdf":
      return <FileText className="mb-2" size={48} />;
    default:
      return <File className="mb-2" size={48} />; // Default icon
  }
};
