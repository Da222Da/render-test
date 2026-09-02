// src/controllers/statsController.ts
import { Request, Response } from 'express';
import User  from '../models/User';
import Permission from '../models/Permission';

import { sendSuccessResponse, sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from "../utils/constants/HttpStatus";
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userCount = await User.count(); // 获取用户总数
    const activeUserCount = await User.count() // 获取活跃用户数
    const permissionCount = await Permission.count(); // 获取权限总数

    sendSuccessResponse(res, HttpStatusCode.OK, { userCount, activeUserCount, permissionCount }, '获取统计数据成功');
  } catch (error) {
    console.log(error)
    sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
  }
};