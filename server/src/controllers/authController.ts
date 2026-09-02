// import { Request, Response } from "express";
import type { Response, Request } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.ts";
import { HttpStatusCode } from "../utils/constants/HttpStatus.ts";
import User from "../models/users.ts";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

/**
 * 用户注册处理函数
 * @param {Request} req - 请求对象，包含用户注册信息
 * @param {Response} res - 响应对象，用于返回处理结果
 */
export const register = async (req: Request, res: Response) => {
  try {
    // 从请求体中解构出用户名、邮箱和密码
    const { username, email, password } = req.body;
    // 检查用户是否已存在;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "用户已存在");
    }
    // 检查是否存在
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "该邮箱已注册");
    }
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword + "",
      role_id: 2,
      avatar: "",
    });
    return sendSuccessResponse(res, HttpStatusCode.CREATED, user, "用户注册成功");
  } catch (error) {
    console.error("注册错误:", error);
    return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "服务器内部错误");
  }
};
