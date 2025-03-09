import { useState } from "react";
import { useFileUploader } from "@/hooks/useFileUploader";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileUploadSchema } from "@/lib/validations";

const FileManager = ({ endpoint }: { endpoint: string }) => {
  const { uploadFile, status, fileUrl } = useFileUploader(endpoint);
  const [progress, setProgress] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fileUploadSchema),
  });

  const onSubmit = async (data: any) => {
    if (data.file) {
      uploadFile(data.file);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>File Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="file"
            accept="image/png, image/jpeg, video/mp4"
            {...register("file")}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValue("file", e.target.files[0]); // Set file for validation
              }
            }}
          />
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}

          <Button type="submit" disabled={status === "uploading"}>
            {status === "uploading" ? "Uploading..." : "Upload"}
          </Button>
        </form>

        {status === "uploading" && <Progress value={progress} />}
        {status === "done" && fileUrl && (
          <p className="text-green-600">
            ✅ Uploaded:{" "}
            <a href={fileUrl} target="_blank" className="underline">
              {fileUrl}
            </a>
          </p>
        )}
        {status === "error" && <p className="text-red-500">❌ Upload failed</p>}
      </CardContent>
    </Card>
  );
};

export default FileManager;
