// components/RestoreButton.tsx

import React from "react";
import axios from "axios";
import { Undo2 } from "lucide-react";

const RestoreButton: React.FC<{ fileId: string }> = ({ fileId }) => {
  const restoreFile = async () => {
    try {
      await axios.post(`/v1/files/files/${fileId}/restore`);
      alert("File restored from trash successfully");
    } catch (error) {
      console.error("Error restoring file from trash:", error);
      alert("Error restoring file from trash");
    }
  };

  return (
    <button onClick={restoreFile} className="btn btn-success">
      <Undo2 size={40} />
      Restore
    </button>
  );
};

export default RestoreButton;
