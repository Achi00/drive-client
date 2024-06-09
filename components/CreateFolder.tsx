// components/CreateFolder.tsx

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { folderTypes } from "@/types";

interface CreateFolderProps {
  onFolderCreate: (newFolder: folderTypes) => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ onFolderCreate }) => {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFolderName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!folderName) {
      setMessage("Folder name is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://drive.wordcrafter.io/v1/files/folders",
        { name: folderName },
        { withCredentials: true }
      );

      setMessage("Folder created successfully!");
      setFolderName("");
      console.log("Folder created:", response.data);
      onFolderCreate(response.data); // Call the prop function to update state
    } catch (error: any) {
      setMessage(
        "Error creating folder: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error creating folder:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <div className="mx-auto max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">Create New Folder</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="folderName"
                className="block text-sm font-medium text-gray-700"
              >
                Folder Name
              </label>
              <Input
                type="text"
                id="folderName"
                name="folderName"
                value={folderName}
                onChange={handleFolderNameChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create Folder
            </Button>
            {message && (
              <h2 className="text-center border-b-2 border-gray-400 pb-2 text-xl font-semibold tracking-tight first:mt-0">
                {message}
              </h2>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolder;
