import type { Response, Request } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.ts";
import { HttpStatusCode } from "../utils/constants/HttpStatus.ts";
import User from "../models/users.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // 确保你的 JWT_SECRET 已在环境变量中配置
const JWT_EXPIRES_IN = "1h"; // Access Token 过期时间
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // Refresh Token 过期时间

/**
 * 用户注册处理函数
 * @param {Request} req - 请求对象，包含用户注册信息
 * @param {Response} res - 响应对象，用于返回处理结果
 */
export const register = async (req: Request, res: Response) => {
  try {
    // 从请求体中解构出用户名、邮箱和密码
    const { username, email, password } = req.body;
    // 检查用户是否已存在
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

// 用户登录处理函数
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });

    if (!user?.username || !user?.password) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "无效的用户名或密码");
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "无效的用户名或密码");
    }

    // 生成 JWT
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 生成 Refresh Token
    const refreshToken = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return sendSuccessResponse(res, HttpStatusCode.OK, { token, refreshToken }, "登录成功");
  } catch (error) {
    console.error("登录错误:", error);
    return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "服务器内部错误");
  }
};

// 获取当前用户信息
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // 认证中间件已经将用户信息附加到 req.body.user,根据用户 id 获取用户信息
    const { id } = req.body.user;
    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, "用户不存在");
    }

    // 使用解构赋值去除 password 字段
    const { password, ...userWithoutPassword } = user.toJSON();

    return sendSuccessResponse(res, HttpStatusCode.OK, userWithoutPassword, "获取用户信息成功");
  } catch (error) {
    return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "服务器内部错误");
  }
};
