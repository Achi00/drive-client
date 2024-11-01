// components/buttons/MoveToTrashButton.tsx

import React, { useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Siren, Trash2 } from "lucide-react";
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
import { usePathname } from "next/navigation";

const MoveToTrashButton: React.FC<{
  fileId: string;
  onMoveToTrash?: (fileId: string) => void;
}> = ({ fileId, onMoveToTrash }) => {
  const pathname = usePathname();
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const moveToTrash = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.post(`/v1/files/files/${fileId}/trash`);
      if (onMoveToTrash) {
        onMoveToTrash(fileId); // Update state locally
      }
      dialogCloseRef.current?.click(); // Close the dialog
      toast.success("File moved to trash successfully");
    } catch (error) {
      console.error("Error moving file to trash:", error);
      toast.error("Error moving file to trash");
    }
  };

  const deleteFilePermanently = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.delete(`/v1/files/files/${fileId}/permanent`);
      if (onMoveToTrash) {
        onMoveToTrash(fileId); // Update state locally
      }
      dialogCloseRef.current?.click(); // Close the dialog
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file");
    }
  };

  const openDialog = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the click on the card
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-1" variant="outline" onClick={openDialog}>
          <Trash2 size={15} />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
        <DialogContent
          className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {pathname !== "/trash" ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-bold text-xl">
                  Move to Trash
                </DialogTitle>
                <DialogDescription>
                  This will move the file to the trash. You can restore it
                  later.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={moveToTrash}>
                  <Trash2 size={15} className="mr-2" />
                  Move to Trash
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-bold text-xl">Delete</DialogTitle>
                <DialogDescription>
                  <Alert>
                    <Siren className="h-4 w-4 " color="#ff0000" />
                    <AlertTitle>Danger!</AlertTitle>
                    <AlertDescription>
                      This will permanently delete the file. You will not be
                      able to restore it later.
                    </AlertDescription>
                  </Alert>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={deleteFilePermanently}>
                  <Trash2 size={15} className="mr-2" color="#ff0000" />
                  Delete
                </Button>
              </div>
            </>
          )}

          <DialogClose asChild>
            <button
              ref={dialogCloseRef}
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

export default MoveToTrashButton;
