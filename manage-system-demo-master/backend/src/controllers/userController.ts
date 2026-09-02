// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, Role, Permission } from '../models';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from '../utils/constants/HttpStatus';

enum UserRoleType {
  super = 1,
  admin = 2,
  user = 3,
}
// 获取所有用户
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { username, phone, email, pageNo = 1, pageSize = 10 } = req.query;

    const whereClause: any = {};
    if (username) {
      // whereClause.username = { [User?.sequelize?.Op.like]: `%${username}%` };
      whereClause.username = { [Op.like]: `%${username}%` }; // 模糊查询
    }
    if (email) {
      // whereClause.username = { [User?.sequelize?.Op.like]: `%${username}%` };
      whereClause.email = { [Op.like]: `%${email}%` }; // 模糊查询
    }
    if (phone) {
      // whereClause.phone = phone;
      whereClause.username = { [Op.like]: `%${phone}%` }; // 模糊查询
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      include: [{ model: Role, as: 'role' }],
      limit: Number(pageSize),
      offset: (Number(pageNo) - 1) * Number(pageSize),
    });

    sendSuccessResponse(res, HttpStatusCode.OK, {
      rows: users.rows,
      total: users.count,
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 根据ID获取用户详情
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, { include: [{ model: Role, as: 'role' }] });

    if (!user) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '用户不存在');
    }

    sendSuccessResponse(res, HttpStatusCode.OK, user);
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 创建用户
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone, avatar } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '用户已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: UserRoleType.user,
      phone,
      avatar,
    });

    sendSuccessResponse(res, HttpStatusCode.CREATED, user, '用户创建成功');
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 更新用户
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, email, password, role_id, phone, avatar } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '用户不存在');
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '用户名已存在');
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '电子邮件已被占用');
      }
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    await user.update(req.body);

    sendSuccessResponse(res, HttpStatusCode.OK, user, '用户更新成功');
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 删除用户
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '用户不存在');
    }

    await user.destroy();

    res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};

// 批量删除用户
export const deleteUserBatch = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, '无效的用户ID数组');
    }

    const result = await User.destroy({
      where: {
        id: ids,
      },
    });

    if (result === 0) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, '没有找到要删除的用户');
    }

    res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};
