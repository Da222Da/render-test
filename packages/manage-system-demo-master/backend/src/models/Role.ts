// src/models/Role.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Permission from './Permission';

interface RoleAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联属性
  public readonly permissions?: Permission[];

  // 关联方法
  public setPermissions!: (permissions: Permission[]) => Promise<void>;
  public getPermissions!: () => Promise<Permission[]>;
}

Role.init(
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
    tableName: 'roles',
    sequelize, // passing the `sequelize` instance is required
    timestamps: true,
  }
);

export default Role;
