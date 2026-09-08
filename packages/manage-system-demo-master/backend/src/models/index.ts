// src/models/index.ts
import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import Permission from './Permission';
import RolePermission from './RolePermission';

// 建立关联

// 用户和角色的关联 (多对一)
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

// 角色和权限的关联 (多对多)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', otherKey: 'permission_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', otherKey: 'role_id', as: 'roles' });

export { User, Role, Permission, RolePermission };
export default sequelize;
