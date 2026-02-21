import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");
const uploadPathPrefix = "/uploads/";

function makeFilename(prefix: string) {
  const stamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${stamp}-${random}.webp`;
}

export async function saveImageAsWebp(file: File, prefix: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const sourceBuffer = Buffer.from(await file.arrayBuffer());
  const filename = makeFilename(prefix);
  const targetPath = path.join(uploadDirectory, filename);

  await mkdir(uploadDirectory, { recursive: true });

  await sharp(sourceBuffer)
    .rotate()
    .resize({
      width: 1800,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({
      quality: 82
    })
    .toFile(targetPath);

  return `/uploads/${filename}`;
}

export async function removeUploadedFile(filePath?: string | null) {
  if (!filePath) {
    return;
  }

  const normalized = filePath.replace(/\\/g, "/");
  if (!normalized.startsWith(uploadPathPrefix)) {
    return;
  }

  const relativeName = normalized.slice(uploadPathPrefix.length);
  if (
    !relativeName ||
    relativeName.includes("/") ||
    relativeName.includes("..") ||
    path.extname(relativeName).toLowerCase() !== ".webp"
  ) {
    return;
  }

  const absolutePath = path.join(uploadDirectory, relativeName);
  try {
    await unlink(absolutePath);
  } catch {
    // Ignore missing files to keep destructive operations resilient.
  }
}
