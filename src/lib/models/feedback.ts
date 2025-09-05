import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

interface FeedbackAttributes {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "pending" | "reviewed" | "resolved";
  createdAt?: Date;
  updatedAt?: Date;
}

class Feedback extends Model<FeedbackAttributes> implements FeedbackAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;
  public status!: "pending" | "reviewed" | "resolved";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      defaultValue: "Anonymous User",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewed", "resolved"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Feedback",
    tableName: "feedback",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Feedback;
