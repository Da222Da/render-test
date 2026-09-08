// src/models/Permission.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Role from './Role';

interface PermissionAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联方法
  public readonly roles?: Role[];
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    description: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'permissions',
    sequelize, // passing the `sequelize` instance is required
    timestamps: true,
  }
);

export default Permission;
