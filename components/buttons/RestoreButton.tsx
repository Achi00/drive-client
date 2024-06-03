// components/RestoreButton.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";
import api from "@/pages/api/axios";
import { toast } from "react-hot-toast";

const RestoreButton: React.FC<{
  fileId: string;
  onRestore: (fileId: string) => void;
}> = ({ fileId, onRestore }) => {
  const restoreFile = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.post(`/v1/files/files/${fileId}/restore`);
      toast.success("File restored from trash successfully");
      onRestore(fileId);
    } catch (error) {
      console.error("Error restoring file from trash:", error);
      toast.error("Error restoring file from trash");
    }
  };

  const openDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={openDialog}>
          <Undo2 size={15} />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
        <DialogContent
          className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Restore File
            </DialogTitle>
            <DialogDescription>
              This file will be returned to your drive.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={restoreFile}>
              <Undo2 size={15} className="mr-2" />
              Restore
            </Button>
          </div>
          <DialogClose asChild>
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              ×
            </button>
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default RestoreButton;
