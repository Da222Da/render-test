"use strict";
import { Model, DataTypes } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "./connection.ts";
export interface UsersAttributes {
  id: number;
  username: string;
  email: string;
  avatar: string;
  password: string;
  role_id: number;
}

// 创建 Users 时，不需要 id 字段
interface UserCreationAttributes extends Optional<UsersAttributes, "id"> {}
class Users extends Model<UsersAttributes, UserCreationAttributes> implements UsersAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare avatar: string;
  declare password: string;
  declare role_id: number;
}
Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Users",
  },
);

export default Users;
