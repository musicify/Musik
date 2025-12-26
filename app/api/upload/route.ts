import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/aac",
  "audio/flac",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for audio
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for images

// POST /api/upload - Upload a file
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "audio" | "image" | "document"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    let allowedTypes: string[];
    let maxSize: number;
    let uploadDir: string;

    if (type === "audio" || ALLOWED_AUDIO_TYPES.includes(file.type)) {
      allowedTypes = ALLOWED_AUDIO_TYPES;
      maxSize = MAX_FILE_SIZE;
      uploadDir = "audio";
    } else if (type === "image" || ALLOWED_IMAGE_TYPES.includes(file.type)) {
      allowedTypes = ALLOWED_IMAGE_TYPES;
      maxSize = MAX_IMAGE_SIZE;
      uploadDir = "images";
    } else {
      // Generic documents
      allowedTypes = [
        ...ALLOWED_AUDIO_TYPES,
        ...ALLOWED_IMAGE_TYPES,
        "application/pdf",
        "application/zip",
        "text/plain",
      ];
      maxSize = MAX_FILE_SIZE;
      uploadDir = "documents";
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;
    const relativePath = join("uploads", uploadDir, filename);
    const absolutePath = join(process.cwd(), "public", relativePath);

    // Create directory if it doesn't exist
    const dirPath = join(process.cwd(), "public", "uploads", uploadDir);
    await mkdir(dirPath, { recursive: true });

    // Convert to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(absolutePath, buffer);

    // Return the URL
    const url = `/${relativePath.replace(/\\/g, "/")}`;

    return NextResponse.json({
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
