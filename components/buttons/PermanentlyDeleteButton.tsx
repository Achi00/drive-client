// components/PermanentlyDeleteButton.tsx

import React from "react";
import axios from "axios";

const PermanentlyDeleteButton: React.FC<{ fileId: string }> = ({ fileId }) => {
  const deleteFilePermanently = async () => {
    try {
      await axios.delete(`/api/files/${fileId}/permanent`);
      alert("File permanently deleted successfully");
    } catch (error) {
      console.error("Error permanently deleting file:", error);
      alert("Error permanently deleting file");
    }
  };

  return (
    <button onClick={deleteFilePermanently} className="btn btn-danger">
      Delete Permanently
    </button>
  );
};

export default PermanentlyDeleteButton;
