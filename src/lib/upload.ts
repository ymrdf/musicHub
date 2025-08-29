import multer from "multer";
import path from "path";
import fs from "fs";
import { validateFile } from "@/utils/validation";

// 确保上传目录存在
const ensureUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 生成唯一文件名
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${timestamp}_${randomStr}${ext}`;
};

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    switch (file.fieldname) {
      case "audio":
        uploadPath = path.join(process.cwd(), "uploads/audio");
        break;
      case "pdf":
        uploadPath = path.join(process.cwd(), "uploads/pdf");
        break;
      case "midi":
        uploadPath = path.join(process.cwd(), "uploads/midi");
        break;
      case "avatar":
        uploadPath = path.join(process.cwd(), "uploads/avatars");
        break;
      default:
        uploadPath = path.join(process.cwd(), "uploads/misc");
    }

    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// 文件过滤器
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  let fileType: "audio" | "pdf" | "midi" | "image" = "image";

  switch (file.fieldname) {
    case "audio":
      fileType = "audio";
      break;
    case "pdf":
      fileType = "pdf";
      break;
    case "midi":
      fileType = "midi";
      break;
    case "avatar":
      fileType = "image";
      break;
  }

  const validation = validateFile(file, fileType);
  if (!validation.valid) {
    cb(new Error(validation.message || "文件验证失败"));
    return;
  }

  cb(null, true);
};

// 创建 multer 实例
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// 单文件上传中间件
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// 多文件上传中间件
export const uploadMultiple = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);

// 删除文件
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("删除文件失败:", error);
    return false;
  }
};

// 获取文件信息
export const getFileInfo = (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    console.error("获取文件信息失败:", error);
    return null;
  }
};

// 生成文件访问 URL
export const getFileUrl = (filePath: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const relativePath = filePath.replace(process.cwd(), "").replace(/\\/g, "/");
  return `${baseUrl}${relativePath}`;
};
