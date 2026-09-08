// src/controllers/roleController.ts
import { Request, Response } from "express";
import { Op } from "sequelize";
import { Role, Permission } from "../models";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response";
import { HttpStatusCode } from "../utils/constants/HttpStatus";

// 获取所有角色
export const getRoles = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const whereClause: any = {};
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` }; // 模糊查询
    }

    const roles = await Role.findAll({
      where: whereClause,
      include: [
        {
          model: Permission,
          as: 'permissions', // 使用别名
          attributes: ['name', 'id'], // 只选择需要的字段
          through: { attributes: [] },  // 不返回中间表的数据
        },
      ]
    });
    sendSuccessResponse(res, HttpStatusCode.OK, roles);
  } catch (error) {
    console.log(error);
    sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 根据ID获取角色详情
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findByPk(roleId, {
      include: [{ model: Permission, as: "permissions" }],
    });

    if (!role) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, "角色不存在");
    }
    sendSuccessResponse(res, HttpStatusCode.OK, role);
  } catch (error) {
    sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 创建角色
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionIds } = req.body;

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return sendErrorResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "角色名称已存在"
      );
    }

    const role = await Role.create({ name, description });

    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });
      await role.setPermissions(permissions);
    }

    const roleWithPermissions = await Role.findByPk(role.id, {
      include: [{ model: Permission, as: "permissions" }],
    });

    sendSuccessResponse(
      res,
      HttpStatusCode.CREATED,
      roleWithPermissions,
      "角色创建成功"
    );
  } catch (error) {
    console.log(error);
    sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 更新角色
export const updateRole = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    const { name, description, permissionIds } = req.body;

    const role = await Role.findByPk(roleId);
    if (!role) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, "角色不存在");
    }

    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          "角色名称已存在"
        );
      }
    }

    await role.update({ name, description });

    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });
      await role.setPermissions(permissions);
    }

    const updatedRole = await Role.findByPk(role.id, {
      include: [{ model: Permission, as: "permissions" }],
    });

    sendSuccessResponse(res, HttpStatusCode.OK, updatedRole, "角色更新成功");
  } catch (error) {
    console.log(error);
    sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 删除角色
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findByPk(roleId);

    if (!role) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, "角色不存在");
    }

    await role.destroy();

    res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};
