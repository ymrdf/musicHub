import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";
import type {
  User as UserType,
  Work as WorkType,
  Performance as PerformanceType,
  Lyrics as LyricsType,
  Comment as CommentType,
  Category as CategoryType,
  Tag as TagType,
  WorkVersion as WorkVersionType,
  PullRequest as PullRequestType,
  UserFollow as UserFollowType,
  WorkStar as WorkStarType,
  PerformanceLike as PerformanceLikeType,
  CommentLike as CommentLikeType,
  TrendingCache as TrendingCacheType,
} from "../../types";

// User 模型
interface UserCreationAttributes
  extends Optional<UserType, "id" | "createdAt" | "updatedAt"> {}

export class User
  extends Model<UserType, UserCreationAttributes>
  implements UserType
{
  public id!: number;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public avatarUrl?: string;
  public bio?: string;
  public website?: string;
  public isVerified!: boolean;
  public isActive!: boolean;
  public followersCount!: number;
  public followingCount!: number;
  public worksCount!: number;
  public performancesCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      field: "avatar_url",
    },
    bio: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING(200),
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_verified",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "followers_count",
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "following_count",
    },
    worksCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "works_count",
    },
    performancesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "performances_count",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Category 模型
interface CategoryCreationAttributes
  extends Optional<CategoryType, "id" | "createdAt"> {}

export class Category
  extends Model<CategoryType, CategoryCreationAttributes>
  implements CategoryType
{
  public id!: number;
  public name!: string;
  public type!: "genre" | "instrument" | "purpose";
  public description?: string;
  public sortOrder!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("genre", "instrument", "purpose"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: false,
  }
);

// Tag 模型
interface TagCreationAttributes extends Optional<TagType, "id" | "createdAt"> {}

export class Tag
  extends Model<TagType, TagCreationAttributes>
  implements TagType
{
  public id!: number;
  public name!: string;
  public usageCount!: number;
  public color!: string;
  public readonly createdAt!: Date;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "usage_count",
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: "#007bff",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "tags",
    timestamps: false,
  }
);

// Work 模型
interface WorkCreationAttributes
  extends Optional<WorkType, "id" | "createdAt" | "updatedAt"> {}

export class Work
  extends Model<WorkType, WorkCreationAttributes>
  implements WorkType
{
  public id!: number;
  public title!: string;
  public description?: string;
  public userId!: number;
  public pdfFilePath?: string;
  public midiFilePath?: string;
  public pdfFileSize?: number;
  public midiFileSize?: number;
  public genreId?: number;
  public instrumentId?: number;
  public purposeId?: number;
  public starsCount!: number;
  public performancesCount!: number;
  public commentsCount!: number;
  public viewsCount!: number;
  public isPublic!: boolean;
  public allowCollaboration!: boolean;
  public license!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Work.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    pdfFilePath: {
      type: DataTypes.STRING(500),
      field: "pdf_file_path",
    },
    midiFilePath: {
      type: DataTypes.STRING(500),
      field: "midi_file_path",
    },
    pdfFileSize: {
      type: DataTypes.BIGINT,
      field: "pdf_file_size",
    },
    midiFileSize: {
      type: DataTypes.BIGINT,
      field: "midi_file_size",
    },
    genreId: {
      type: DataTypes.INTEGER,
      field: "genre_id",
    },
    instrumentId: {
      type: DataTypes.INTEGER,
      field: "instrument_id",
    },
    purposeId: {
      type: DataTypes.INTEGER,
      field: "purpose_id",
    },
    starsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "stars_count",
    },
    performancesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "performances_count",
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "comments_count",
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "views_count",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_public",
    },
    allowCollaboration: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "allow_collaboration",
    },
    license: {
      type: DataTypes.STRING(50),
      defaultValue: "CC BY-SA 4.0",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "works",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Performance 模型
interface PerformanceCreationAttributes
  extends Optional<PerformanceType, "id" | "createdAt" | "updatedAt"> {}

export class Performance
  extends Model<PerformanceType, PerformanceCreationAttributes>
  implements PerformanceType
{
  public id!: number;
  public workId!: number;
  public userId!: number;
  public lyricsId?: number;
  public title!: string;
  public description?: string;
  public audioFilePath!: string;
  public audioFileSize?: number;
  public duration?: number;
  public fileFormat?: string;
  public type!: "instrumental" | "vocal";
  public instrument?: string;
  public likesCount!: number;
  public commentsCount!: number;
  public playsCount!: number;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Performance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "work_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    lyricsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "lyrics_id",
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    audioFilePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "audio_file_path",
    },
    audioFileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "audio_file_size",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fileFormat: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "file_format",
    },
    type: {
      type: DataTypes.ENUM("instrumental", "vocal"),
      allowNull: false,
    },
    instrument: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "likes_count",
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "comments_count",
    },
    playsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "plays_count",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_public",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "performances",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// PerformanceLike 模型
interface PerformanceLikeCreationAttributes
  extends Optional<PerformanceLikeType, "id" | "createdAt"> {}

export class PerformanceLike
  extends Model<PerformanceLikeType, PerformanceLikeCreationAttributes>
  implements PerformanceLikeType
{
  public id!: number;
  public performanceId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
}

PerformanceLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    performanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "performance_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "performance_likes",
    timestamps: false,
  }
);

// Comment 模型
interface CommentCreationAttributes
  extends Optional<CommentType, "id" | "createdAt" | "updatedAt"> {}

export class Comment
  extends Model<CommentType, CommentCreationAttributes>
  implements CommentType
{
  public id!: number;
  public userId!: number;
  public commentableType!: "work" | "performance" | "lyrics";
  public commentableId!: number;
  public content!: string;
  public parentId?: number;
  public likesCount!: number;
  public repliesCount!: number;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    commentableType: {
      type: DataTypes.ENUM("work", "performance", "lyrics"),
      allowNull: false,
      field: "commentable_type",
    },
    commentableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "commentable_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "parent_id",
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "likes_count",
    },
    repliesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "replies_count",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_public",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// CommentLike 模型
interface CommentLikeCreationAttributes
  extends Optional<CommentLikeType, "id" | "createdAt"> {}

export class CommentLike
  extends Model<CommentLikeType, CommentLikeCreationAttributes>
  implements CommentLikeType
{
  public id!: number;
  public commentId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
}

CommentLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "comment_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "comment_likes",
    timestamps: false,
  }
);

// 导出所有模型以便在其他文件中使用
export { sequelize };

// 设置模型关联关系
export const setupAssociations = () => {
  // User 关联
  User.hasMany(Work, { foreignKey: "userId", as: "works" });
  Work.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Performance 关联
  User.hasMany(Performance, { foreignKey: "userId", as: "performances" });
  Performance.belongsTo(User, { foreignKey: "userId", as: "user" });

  Work.hasMany(Performance, { foreignKey: "workId", as: "performances" });
  Performance.belongsTo(Work, { foreignKey: "workId", as: "work" });

  // PerformanceLike 关联
  User.hasMany(PerformanceLike, {
    foreignKey: "userId",
    as: "performanceLikes",
  });
  PerformanceLike.belongsTo(User, { foreignKey: "userId", as: "user" });

  Performance.hasMany(PerformanceLike, {
    foreignKey: "performanceId",
    as: "likes",
  });
  PerformanceLike.belongsTo(Performance, {
    foreignKey: "performanceId",
    as: "performance",
  });

  // Category 关联
  Work.belongsTo(Category, { foreignKey: "genreId", as: "genre" });
  Work.belongsTo(Category, { foreignKey: "instrumentId", as: "instrument" });
  Work.belongsTo(Category, { foreignKey: "purposeId", as: "purpose" });

  // Comment 关联
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
  Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

  // 评论回复关联
  Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
  Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

  // CommentLike 关联
  User.hasMany(CommentLike, { foreignKey: "userId", as: "commentLikes" });
  CommentLike.belongsTo(User, { foreignKey: "userId", as: "user" });

  Comment.hasMany(CommentLike, { foreignKey: "commentId", as: "likes" });
  CommentLike.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });

  // 其他关联会在各自的模型文件中定义
};

// 自动设置关联关系
setupAssociations();
