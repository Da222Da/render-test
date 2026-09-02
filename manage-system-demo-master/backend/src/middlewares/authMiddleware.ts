// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from '../utils/constants/HttpStatus';
import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: number;
  role_id: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, '未提供 token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    req.body.user = decoded; // 将解码后的用户信息保存到 req 对象中
    next();
  } catch (error) {
    return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, '无效的 token');
  }
};
