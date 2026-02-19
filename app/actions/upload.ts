"use server";
import assert from "node:assert";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

assert(
  process.env.AWS_ACCESS_KEY_ID,
  "AWS_ACCESS_KEY_ID environment variable is required",
);

assert(
  process.env.AWS_SECRET_ACCESS_KEY,
  "AWS_SECRET_ACCESS_KEY environment variable is required",
);

assert(process.env.AWS_REGION, "AWS_REGION environment variable is required");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
// Server action to handle uploads (stub)
// TODO: Replace placeholder logic with real Cloudinary (or other) upload

export type UploadedFile = {
  url: string;
  size: number;
  type: string;
  filename?: string;
};

const uploadFileToS3 = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME as string;
    const key = `uploads/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
};
export async function uploadFile(formData: FormData): Promise<UploadedFile> {
  // Basic validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const files = formData.getAll("files").filter(Boolean) as File[];
  const file = files[0];

  console.log(
    "📤 uploadFile called, received files:",
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  );

  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  const url = await uploadFileToS3(file);

  return {
    url,
    size: file.size,
    type: file.type,
    filename: file.name,
  };
}
