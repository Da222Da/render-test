// src/controllers/permissionController.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Permission, Role } from '../models';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from '../utils/constants/HttpStatus';

// 获取所有权限
export const getPermissions = async (req: Request, res: Response) => {
  try {
    const { name, pageNo = 1, pageSize = 10 } = req.query;

    const whereClause: any = {};
    if (name) {
      // whereClause.name = { [User?.sequelize?.Op.like]: `%${name}%` };
      whereClause.name = { [Op.like]: `%${name}%` }; // 模糊查询
    }

    const permissions = await Permission.findAndCountAll({
      where: whereClause,
      // include: [{ model: Role, as: 'role' }],
      limit: Number(pageSize),
      offset: (Number(pageNo) - 1) * Number(pageSize),
    });
    sendSuccessResponse(res, HttpStatusCode.OK, {
      rows: permissions.rows,
      total: permissions.count,
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 根据ID获取权限详情
export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '权限不存在');
    }

    sendSuccessResponse(res, HttpStatusCode.OK, permission);
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 创建权限
export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '权限名称已存在');
    }

    const permission = await Permission.create({ name, description });

    sendSuccessResponse(res, HttpStatusCode.CREATED, permission, '权限创建成功');
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 更新权限
export const updatePermission = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;
    const { name, description } = req.body;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '权限不存在');
    }

    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission) {
        return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '权限名称已存在');
      }
    }

    await permission.update({ name, description });

    sendSuccessResponse(res, HttpStatusCode.OK, permission, '权限更新成功');
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 删除权限
export const deletePermission = async (req: Request, res: Response) => {
  try {
    const permissionId = req.params.id;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '权限不存在');
    }

    await permission.destroy();

    res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};
