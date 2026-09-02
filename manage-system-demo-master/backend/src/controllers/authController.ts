// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { HttpStatusCode } from "../utils/constants/HttpStatus";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // 确保你的 JWT_SECRET 已在环境变量中配置
const JWT_EXPIRES_IN = "1h"; // Access Token 过期时间
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // Refresh Token 过期时间

export const register = async (req: Request, res: Response) => {
  try {
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
      password: hashedPassword,
      role_id: 2,
    });

    return sendSuccessResponse(
      res,
      HttpStatusCode.CREATED,
      user,
      "用户注册成功"
    );
  } catch (error) {
    console.error("注册错误:", error);
    return sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return sendErrorResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "无效的用户名或密码"
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "无效的用户名或密码"
      );
    }

    // 生成 JWT
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 生成 Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, role_id: user.role_id },
      JWT_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    return sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      { token, refreshToken },
      "登录成功"
    );
  } catch (error) {
    console.error("登录错误:", error);
    return sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 获取当前用户信息
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // 认证中间件已经将用户信息附加到 req.body.user,根据用户id获取用户信息
    const { id } = req.body.user;
    const user = await User.findByPk(id);
    if (!user) {
      return sendErrorResponse(res, HttpStatusCode.NOT_FOUND, "用户不存在");
    }

    // 使用解构赋值去除 password 字段
    const { password, ...userWithoutPassword } = user.toJSON();

    return sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      userWithoutPassword,
      "获取用户信息成功"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "服务器内部错误"
    );
  }
};

// 刷新 Token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendErrorResponse(
      res,
      HttpStatusCode.BAD_REQUEST,
      "Refresh Token 必须提供"
    );
  }

  try {
    // 验证 Refresh Token
    const decoded: any = jwt.verify(refreshToken, JWT_SECRET);

    // 查找用户
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return sendErrorResponse(
        res,
        HttpStatusCode.UNAUTHORIZED,
        "用户不存在或已注销"
      );
    }

    // 生成 JWT
    const newAccessToken = jwt.sign(
      { id: user.id, role_id: user.role_id },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // 生成 Refresh Token
    const newRefreshToken = jwt.sign(
      { id: user.id, role_id: user.role_id },
      JWT_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    return sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      { token: newAccessToken, refreshToken: newRefreshToken },
      "Token 刷新成功"
    );
  } catch (error) {
    console.log(error);
    return sendErrorResponse(
      res,
      HttpStatusCode.UNAUTHORIZED,
      "无效的 Refresh Token"
    );
  }
};

// 退出登录
export const logout = async (req: Request, res: Response) => {
  // 如果有实现黑名单机制，可以在这里处理
  // 例如，将当前用户的 JWT 添加到黑名单中
  // 发送成功响应
  return sendSuccessResponse(res, HttpStatusCode.OK, null);
};
