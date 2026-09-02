// src/models/User.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Role from './Role';

interface UserAttributes {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  password: string;
  role_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPayload {
  userId: number;
  role_id: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'phone' | 'avatar' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email?: string;
  public phone?: string;
  public avatar?: string;
  public password!: string;
  public role_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联方法
  public readonly role?: Role;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: new DataTypes.STRING(20),
      allowNull: true,
    },
    avatar: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance is required
    timestamps: true,
  }
);

export default User;
