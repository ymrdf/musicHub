// 基础类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  isVerified: boolean;
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  worksCount: number;
  performancesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  type: "genre" | "instrument" | "purpose";
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  usageCount: number;
  color: string;
  createdAt: Date;
}

export interface Work {
  id: number;
  title: string;
  description?: string;
  userId: number;
  pdfFilePath?: string;
  midiFilePath?: string;
  pdfFileSize?: number;
  midiFileSize?: number;
  genreId?: number;
  instrumentId?: number;
  purposeId?: number;
  starsCount: number;
  performancesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublic: boolean;
  allowCollaboration: boolean;
  license: string;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  user?: User;
  genre?: Category;
  instrument?: Category;
  purpose?: Category;
  tags?: Tag[];
  isStarred?: boolean;
}

export interface WorkVersion {
  id: number;
  workId: number;
  versionNumber: string;
  userId: number;
  commitMessage?: string;
  midiFilePath?: string;
  midiFileSize?: number;
  changesSummary?: string;
  isMerged: boolean;
  mergedAt?: Date;
  mergedBy?: number;
  createdAt: Date;
  // 关联数据
  user?: User;
  work?: Work;
}

export interface PullRequest {
  id: number;
  workId: number;
  versionId: number;
  requesterId: number;
  title: string;
  description?: string;
  status: "pending" | "approved" | "rejected" | "merged";
  reviewedBy?: number;
  reviewedAt?: Date;
  reviewComment?: string;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  work?: Work;
  version?: WorkVersion;
  requester?: User;
  reviewer?: User;
}

export interface Lyrics {
  id: number;
  workId: number;
  userId: number;
  title: string;
  content: string;
  language: string;
  likesCount: number;
  performancesCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  work?: Work;
  user?: User;
}

export interface Performance {
  id: number;
  workId: number;
  userId: number;
  lyricsId?: number;
  title: string;
  description?: string;
  audioFilePath: string;
  audioFileSize?: number;
  duration?: number;
  fileFormat?: string;
  type: "instrumental" | "vocal";
  instrument?: string;
  likesCount: number;
  commentsCount: number;
  playsCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  work?: Work;
  user?: User;
  lyrics?: Lyrics;
  isLiked?: boolean;
}

export interface Comment {
  id: number;
  userId: number;
  commentableType: "work" | "performance" | "lyrics";
  commentableId: number;
  content: string;
  parentId?: number;
  likesCount: number;
  repliesCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  user?: User;
  parent?: Comment;
  replies?: Comment[];
  isLiked?: boolean;
}

export interface UserFollow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: Date;
  // 关联数据
  follower?: User;
  following?: User;
}

export interface WorkStar {
  id: number;
  workId: number;
  userId: number;
  createdAt: Date;
  // 关联数据
  work?: Work;
  user?: User;
}

export interface PerformanceLike {
  id: number;
  performanceId: number;
  userId: number;
  createdAt: Date;
  // 关联数据
  performance?: Performance;
  user?: User;
}

export interface CommentLike {
  id: number;
  commentId: number;
  userId: number;
  createdAt: Date;
  // 关联数据
  comment?: Comment;
  user?: User;
}

export interface TrendingCache {
  id: number;
  type: "work" | "performance";
  itemId: number;
  score: number;
  rankPosition: number;
  timePeriod: "daily" | "weekly" | "monthly";
  createdAt: Date;
  updatedAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 文件上传类型
export interface FileUploadResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}

// 音频播放器状态
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  currentPerformance?: Performance;
  playlist: Performance[];
  currentIndex: number;
  isRepeat: boolean;
  isRandom: boolean;
}

// 表单数据类型
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface WorkFormData {
  title: string;
  description?: string;
  genreId?: number;
  instrumentId?: number;
  purposeId?: number;
  tags: string[];
  isPublic: boolean;
  allowCollaboration: boolean;
  license: string;
}

export interface PerformanceFormData {
  title: string;
  description?: string;
  type: "instrumental" | "vocal";
  instrument?: string;
  lyricsId?: number;
  isPublic: boolean;
}

export interface LyricsFormData {
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
}

export interface CommentFormData {
  content: string;
  parentId?: number;
}
