"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "./connection.ts";
export interface UsersAttributes {
  username: string;
  email: string;
  avatar: string;
  password: string;
  role_id: number;
}
class Users extends Model<UsersAttributes> implements UsersAttributes {
  username!: string;
  email!: string;
  avatar!: string;
  password!: string;
  role_id!: number;
}
Users.init(
  {
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
