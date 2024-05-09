export interface userTypes {
  displayName: string;
  photoUrl: string;
  email: string;
}

export interface UserProps {
  user: userTypes;
}

export interface fileTypes {
  _id: string;
  user: string;
  name: string;
  size: number;
  fileType: string;
  path: string;
  parent: string;
  type: string;
  uniqueName: string;
  isPublic: boolean;
  createdAt: string;
  __v: number;
}
