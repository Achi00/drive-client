// utils/getIconsByFileType.tsx
import { File, FileImage, FileText } from "lucide-react";
import Image from "next/image";
import { sanitizeHtml } from "./sanitizeHtml";

const hasHtmlTags = (content: string) => {
  const regex = /<\/?[a-z][\s\S]*>/i;
  return regex.test(content);
};

export const getIconByFileType = (fileType: any) => {
  let icon;
  switch (fileType) {
    case "text/plain":
      icon = <FileText size={20} />;
      break;
    case "image/png":
    case "image/jpeg":
    case "image/gif":
    case "image/webp":
      icon = <FileImage size={20} />;
      break;
    case "application/pdf":
      icon = <FileText size={20} />;
      break;
    default:
      icon = <File size={20} />; // Default icon
      break;
  }
  return icon;
};

export const getPreviewByFileType = (
  fileType: any,
  content: string,
  imageUrl: string | null
) => {
  let preview;

  if (
    imageUrl &&
    (fileType === "image/png" ||
      fileType === "image/jpeg" ||
      fileType === "image/gif" ||
      fileType === "image/webp")
  ) {
    preview = (
      <Image
        src={imageUrl}
        alt="File"
        className="mb-2 rounded-md"
        width={148}
        height={148}
        objectFit="cover"
        loading="lazy"
      />
    );
  } else if (content && fileType === "text/plain") {
    const sanitizedContent = sanitizeHtml(content);
    const containsHtml = hasHtmlTags(sanitizedContent);

    preview = (
      <div
        className={`text-xs max-w-full max-h-full overflow-hidden ${
          containsHtml &&
          "flex justify-center items-center relative h-32 w-full"
        }`}
      >
        <div
          className={`${
            containsHtml ? "max-w-full max-h-full overflow-hidden" : ""
          }`}
          style={{
            whiteSpace: containsHtml ? "normal" : "nowrap",
            transform: containsHtml ? "scale(0.5)" : "none",
            transformOrigin: containsHtml ? "center" : "initial",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    );
  } else {
    preview = <File className="mb-2" size={60} />; // Default preview
  }

  return preview;
};
