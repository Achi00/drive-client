import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 }); // 10 MB

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing the files." });
    }

    const formData = new FormData();
    const filesArray = Array.isArray(files.files) ? files.files : [files.files];

    for (const file of filesArray) {
      if (file && file.originalFilename && file.filepath) {
        const fileBuffer = fs.readFileSync(file.filepath);
        formData.append("files", fileBuffer, {
          filename: file.originalFilename,
          contentType: file.mimetype || "application/octet-stream",
        });
      }
    }

    formData.append("isPublic", fields.isPublic as unknown as string);

    try {
      const response = await axios.post(
        "https://drive.wordcrafter.io/v1/files/upload",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Cookie: req.headers.cookie || "", // Pass the cookies to the backend
          },
          withCredentials: true,
        }
      );

      res.status(response.status).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || "Error uploading files.",
      });
    }
  });
};

export default uploadHandler;
