export interface userTypes {
  displayName: string;
  photoUrl: string;
  email: string;
  totalStorageUsed: number;
  storageLimit: number;
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
