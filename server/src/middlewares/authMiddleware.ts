// src/middlewares/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { sendErrorResponse } from "../utils/response.ts";
import { HttpStatusCode } from "../utils/constants/HttpStatus.ts";
import dotenv from "dotenv";

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: number;
  role_id: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. 从请求头中获取 token
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "未提供令牌，请先登录");
  }

  // 2. 提取 token 字符串（去掉 'Bearer ' 前缀）
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  try {
    // 3. 验证并解码 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // 4. 将用户信息挂载到 req.user 上，供后续路由使用
    if (!req.body) req.body = {}; // 如果没有 req.body，则初始化为空对象
    req.body.user = decoded; // 包含 userId, username 等

    next(); // 验证通过，放行
  } catch (error) {
    return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "无效的 token");
  }
};
