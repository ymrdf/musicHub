import Joi from "joi";

// 配置 Joi 以解决 TLD 列表问题
Joi.defaults((schema) =>
  schema.options({
    allowUnknown: true,
    stripUnknown: true,
  })
);

// 自定义邮箱验证函数，避免 TLD 列表问题
const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// 检查是否在浏览器环境中
const isBrowser = typeof window !== "undefined";

// 用户注册验证
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "用户名只能包含字母和数字",
    "string.min": "用户名至少 3 个字符",
    "string.max": "用户名最多 30 个字符",
    "any.required": "用户名不能为空",
  }),
  email: Joi.string()
    .custom((value, helpers) => {
      if (!validateEmail(value)) {
        return helpers.error("string.email");
      }
      return value;
    }, "email-validation")
    .required()
    .messages({
      "string.email": "请输入有效的邮箱地址",
      "any.required": "邮箱不能为空",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "密码至少 8 个字符",
    "any.required": "密码不能为空",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "两次密码输入不一致",
    "any.required": "请确认密码",
  }),
});

// 用户登录验证
export const loginSchema = Joi.object({
  email: Joi.string()
    .custom((value, helpers) => {
      if (!validateEmail(value)) {
        return helpers.error("string.email");
      }
      return value;
    }, "email-validation")
    .required()
    .messages({
      "string.email": "请输入有效的邮箱地址",
      "any.required": "邮箱不能为空",
    }),
  password: Joi.string().required().messages({
    "any.required": "密码不能为空",
  }),
});

// 作品创建验证
export const workSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "作品标题不能为空",
    "string.max": "作品标题最多 200 个字符",
    "any.required": "作品标题不能为空",
  }),
  description: Joi.string().max(2000).optional().messages({
    "string.max": "作品描述最多 2000 个字符",
  }),
  pdfFilePath: Joi.string()
    .pattern(/^\/uploads\/[^\/]+\/[^\/]+$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "PDF文件路径格式不正确",
    }),
  midiFilePath: Joi.string()
    .pattern(/^\/uploads\/[^\/]+\/[^\/]+$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "MIDI文件路径格式不正确",
    }),
  genreId: Joi.number().integer().positive().optional(),
  instrumentId: Joi.number().integer().positive().optional(),
  purposeId: Joi.number().integer().positive().optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional().messages({
    "array.max": "最多只能添加 10 个标签",
  }),
  isPublic: Joi.boolean().default(true),
  allowCollaboration: Joi.boolean().default(true),
  license: Joi.string().max(50).default("CC BY-SA 4.0"),
});

// 演奏表单验证（前端使用）
export const performanceFormSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "演奏标题不能为空",
    "string.max": "演奏标题最多 200 个字符",
    "any.required": "演奏标题不能为空",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "演奏描述最多 2000 个字符",
  }),
  type: Joi.string().valid("instrumental", "vocal").required().messages({
    "any.only": "演奏类型必须是器乐或声乐",
    "any.required": "演奏类型不能为空",
  }),
  instrument: Joi.string().max(50).optional().allow("").messages({
    "string.max": "乐器名称最多 50 个字符",
  }),
  lyricsId: Joi.number().integer().positive().optional().allow(null),
  isPublic: Joi.boolean().default(true),
});

// 演奏创建验证（API 使用）
export const performanceSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "演奏标题不能为空",
    "string.max": "演奏标题最多 200 个字符",
    "any.required": "演奏标题不能为空",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "演奏描述最多 2000 个字符",
  }),
  type: Joi.string().valid("instrumental", "vocal").required().messages({
    "any.only": "演奏类型必须是器乐或声乐",
    "any.required": "演奏类型不能为空",
  }),
  instrument: Joi.string().max(50).optional().allow("").messages({
    "string.max": "乐器名称最多 50 个字符",
  }),
  lyricsId: Joi.number().integer().positive().optional().allow(null),
  isPublic: Joi.boolean().default(true),
  // API 专用字段
  workId: Joi.number().integer().positive().required().messages({
    "any.required": "作品ID不能为空",
  }),
  audioFilePath: Joi.string().required().messages({
    "any.required": "音频文件路径不能为空",
  }),
  audioFileSize: Joi.number().integer().positive().optional(),
  fileFormat: Joi.string().max(10).optional(),
});

// 歌词创建验证
export const lyricsSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "歌词标题不能为空",
    "string.max": "歌词标题最多 200 个字符",
    "any.required": "歌词标题不能为空",
  }),
  content: Joi.string().min(1).max(10000).required().messages({
    "string.min": "歌词内容不能为空",
    "string.max": "歌词内容最多 10000 个字符",
    "any.required": "歌词内容不能为空",
  }),
  language: Joi.string().valid("zh", "en", "ja", "ko").default("zh").messages({
    "any.only": "不支持的语言类型",
  }),
  isPublic: Joi.boolean().default(true),
});

// 评论创建验证
export const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    "string.min": "评论内容不能为空",
    "string.max": "评论内容最多 1000 个字符",
    "any.required": "评论内容不能为空",
  }),
  parentId: Joi.number().integer().positive().optional(),
});

// 用户资料更新验证
export const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
    "string.alphanum": "用户名只能包含字母和数字",
    "string.min": "用户名至少 3 个字符",
    "string.max": "用户名最多 30 个字符",
  }),
  bio: Joi.string().max(500).optional().messages({
    "string.max": "个人简介最多 500 个字符",
  }),
  website: Joi.string().uri().max(200).optional().messages({
    "string.uri": "请输入有效的网址",
    "string.max": "网址最多 200 个字符",
  }),
});

// 分页参数验证
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

// 搜索参数验证
export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).required().messages({
    "string.min": "搜索关键词不能为空",
    "string.max": "搜索关键词最多 100 个字符",
    "any.required": "搜索关键词不能为空",
  }),
  type: Joi.string().valid("work", "performance", "user", "all").default("all"),
  genreId: Joi.number().integer().positive().optional(),
  instrumentId: Joi.number().integer().positive().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

// 文件验证
export const validateFile = (
  file: Express.Multer.File,
  type: "audio" | "pdf" | "midi" | "image"
): { valid: boolean; message?: string } => {
  const maxSizes = {
    audio: 50 * 1024 * 1024, // 50MB
    pdf: 20 * 1024 * 1024, // 20MB
    midi: 5 * 1024 * 1024, // 5MB
    image: 5 * 1024 * 1024, // 5MB
  };

  const allowedTypes = {
    audio: ["audio/mp3", "audio/mpeg", "audio/wav"],
    pdf: ["application/pdf"],
    midi: ["audio/midi", "audio/x-midi"],
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  };

  if (file.size > maxSizes[type]) {
    return {
      valid: false,
      message: `文件大小不能超过 ${maxSizes[type] / 1024 / 1024}MB`,
    };
  }

  if (!allowedTypes[type].includes(file.mimetype)) {
    return { valid: false, message: `不支持的文件类型: ${file.mimetype}` };
  }

  return { valid: true };
};
