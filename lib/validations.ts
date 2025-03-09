import { z } from "zod";

// ✅ Validate image/video uploads
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Must be a valid file" })
    .refine((file) => file.size < 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/png", "image/jpeg", "video/mp4"].includes(file.type),
      "Only PNG, JPEG images & MP4 videos are allowed"
    ),
});
