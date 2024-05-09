import { NextApiRequest, NextApiResponse } from "next";
import api from "../api/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const response = await api.get("/v1/files/getfiles", {
        withCredentials: true,
      });
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || "Failed to fetch files",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
