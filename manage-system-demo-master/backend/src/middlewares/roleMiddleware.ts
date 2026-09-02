// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from '../utils/constants/HttpStatus';
import { Role } from '../models';

export const roleMiddleware = (requiredRoleName: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.user.role_id;

    if (!userId) {
      return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, '用户未认证');
    }

    try {
      const user = await Role.findByPk(req.body.user.role_id);
      if (!user) {
        return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, '用户角色不存在');
      }

      if (!requiredRoleName.includes(user.name)) {
        return sendErrorResponse(res, HttpStatusCode.FORBIDDEN, '用户没有权限执行此操作');
      }

      next();
    } catch (error) {
      return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, '服务器内部错误');
    }
  };
};
