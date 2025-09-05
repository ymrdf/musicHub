import Joi from "joi";

// Configure Joi to resolve TLD list issues
Joi.defaults((schema) =>
  schema.options({
    allowUnknown: true,
    stripUnknown: true,
  })
);

// Custom email validation function to avoid TLD list issues
const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// Check if running in browser environment
const isBrowser = typeof window !== "undefined";

// User registration validation
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username can only contain letters and numbers",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot exceed 30 characters",
    "any.required": "Username is required",
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
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
  }),
});

// User login validation
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
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Work creation validation
export const workSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Work title cannot be empty",
    "string.max": "Work title cannot exceed 200 characters",
    "any.required": "Work title is required",
  }),
  description: Joi.string().max(2000).optional().messages({
    "string.max": "Work description cannot exceed 2000 characters",
  }),
  pdfFilePath: Joi.string()
    .pattern(/^\/uploads\/[^\/]+\/[^\/]+$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid PDF file path format",
    }),
  midiFilePath: Joi.string()
    .pattern(/^\/uploads\/[^\/]+\/[^\/]+$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid MIDI file path format",
    }),
  genreId: Joi.number().integer().positive().optional(),
  instrumentId: Joi.number().integer().positive().optional(),
  purposeId: Joi.number().integer().positive().optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional().messages({
    "array.max": "Maximum 10 tags allowed",
  }),
  isPublic: Joi.boolean().default(true),
  allowCollaboration: Joi.boolean().default(true),
  license: Joi.string().max(50).default("CC BY-SA 4.0"),
});

// Performance form validation (frontend use)
export const performanceFormSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Performance title cannot be empty",
    "string.max": "Performance title cannot exceed 200 characters",
    "any.required": "Performance title is required",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "Performance description cannot exceed 2000 characters",
  }),
  type: Joi.string().valid("instrumental", "vocal").required().messages({
    "any.only": "Performance type must be instrumental or vocal",
    "any.required": "Performance type is required",
  }),
  instrument: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Instrument name cannot exceed 50 characters",
  }),
  lyricsId: Joi.number().integer().positive().optional().allow(null),
  isPublic: Joi.boolean().default(true),
});

// Performance creation validation (API use)
export const performanceSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Performance title cannot be empty",
    "string.max": "Performance title cannot exceed 200 characters",
    "any.required": "Performance title is required",
  }),
  description: Joi.string().max(2000).optional().allow("").messages({
    "string.max": "Performance description cannot exceed 2000 characters",
  }),
  type: Joi.string().valid("instrumental", "vocal").required().messages({
    "any.only": "Performance type must be instrumental or vocal",
    "any.required": "Performance type is required",
  }),
  instrument: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Instrument name cannot exceed 50 characters",
  }),
  lyricsId: Joi.number().integer().positive().optional().allow(null),
  isPublic: Joi.boolean().default(true),
  // API specific fields
  workId: Joi.number().integer().positive().required().messages({
    "any.required": "Work ID is required",
  }),
  audioFilePath: Joi.string().required().messages({
    "any.required": "Audio file path is required",
  }),
  audioFileSize: Joi.number().integer().positive().optional(),
  fileFormat: Joi.string().max(10).optional(),
});

// Lyrics creation validation
export const lyricsSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Lyrics title cannot be empty",
    "string.max": "Lyrics title cannot exceed 200 characters",
    "any.required": "Lyrics title is required",
  }),
  content: Joi.string().min(1).max(10000).required().messages({
    "string.min": "Lyrics content cannot be empty",
    "string.max": "Lyrics content cannot exceed 10000 characters",
    "any.required": "Lyrics content is required",
  }),
  language: Joi.string().valid("zh", "en", "ja", "ko").default("zh").messages({
    "any.only": "Unsupported language type",
  }),
  isPublic: Joi.boolean().default(true),
});

// Comment creation validation
export const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    "string.min": "Comment content cannot be empty",
    "string.max": "Comment content cannot exceed 1000 characters",
    "any.required": "Comment content is required",
  }),
  parentId: Joi.number().integer().positive().optional(),
});

// User profile update validation
export const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
    "string.alphanum": "Username can only contain letters and numbers",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username cannot exceed 30 characters",
  }),
  bio: Joi.string().max(500).optional().messages({
    "string.max": "Bio cannot exceed 500 characters",
  }),
  website: Joi.string().uri().max(200).optional().messages({
    "string.uri": "Please enter a valid URL",
    "string.max": "URL cannot exceed 200 characters",
  }),
});

// Pagination parameters validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

// Search parameters validation
export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).required().messages({
    "string.min": "Search keyword cannot be empty",
    "string.max": "Search keyword cannot exceed 100 characters",
    "any.required": "Search keyword is required",
  }),
  type: Joi.string().valid("work", "performance", "user", "all").default("all"),
  genreId: Joi.number().integer().positive().optional(),
  instrumentId: Joi.number().integer().positive().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

// File validation
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
      message: `File size cannot exceed ${maxSizes[type] / 1024 / 1024}MB`,
    };
  }

  if (!allowedTypes[type].includes(file.mimetype)) {
    return { valid: false, message: `Unsupported file type: ${file.mimetype}` };
  }

  return { valid: true };
};
