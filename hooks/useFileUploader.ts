import { useState } from "react";
import { api } from "@/core/apiHandler"; // Using our Axios API function

type FileUploadStatus = "idle" | "uploading" | "done" | "error";

export const useFileUploader = (endpoint: string) => {
  const [status, setStatus] = useState<FileUploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<{ fileUrl: string }>(endpoint, formData);
      setFileUrl(response.fileUrl);
      setStatus("done");
    } catch (error) {
      setStatus("error");
    }
  };

  return { uploadFile, status, progress, fileUrl };
};
