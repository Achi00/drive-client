export interface userTypes {
  displayName: string;
  photoUrl: string;
  email: string;
  totalStorageUsed: number;
  storageLimit: number;
  error?: string;
}

export interface UserProps {
  user: userTypes;
}

export interface fileTypes {
  _id: string;
  googleDocId: string;
  user: string;
  name: string;
  size: number;
  fileType: string;
  path: string;
  parent: string;
  type: string;
  uniqueName: string;
  content?: string;
  isPublic: boolean;
  createdAt: string;
  deletedAt?: string;
  folderName?: string;
  __v: number;
}
export interface folderTypes {
  isPublic: boolean;
  _id: string;
  user: string;
  name: string;
  type: string;
  createdAt: string;
  __v: number;
}

export interface FileResponse {
  folderName: string;
  files: fileTypes[];
}

export interface TrashProps {
  files: Array<{
    _id: string;
    name: string;
    fileType: string;
    deletedAt: string;
    isPublic?: boolean;
    content?: string;
    createdAt?: string;
  }>;
  imageUrls: { [key: string]: string | null };
}

export interface FileCardProps {
  file: {
    _id: string;
    name: string;
    fileType: string;
    isPublic: boolean;
    content?: string;
    createdAt?: string;
    deletedAt?: string;
  };
  imageUrls: { [key: string]: string | null };
  handleFileClick?: (file: any) => void;
  onMoveToTrash?: (fileId: string) => void;
}
