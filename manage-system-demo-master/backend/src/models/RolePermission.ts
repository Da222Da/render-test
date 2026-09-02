// src/models/RolePermission.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Role from './Role';
import Permission from './Permission';

class RolePermission extends Model {
  public role_id!: number;
  public permissionId!: number;
}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Permission,
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    tableName: 'role_permissions',
    sequelize,
    timestamps: true,
  }
);

export default RolePermission;
