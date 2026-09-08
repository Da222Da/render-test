// src/utils/response.ts
import { HttpStatusCode, HttpStatusMessage } from "./constants/HttpStatus.ts";
import { ErrorCode } from "./constants/ErrorInfo.ts";
import type { Response } from "express";

/**
 * 发送成功响应
 * @param res Express 响应对象
 * @param statusCode 状态码
 * @param data 响应数据
 * @param message 可选的自定义消息
 */
export const sendSuccessResponse = (res: Response, statusCode: HttpStatusCode, data: any, message?: string) => {
  res.status(statusCode).json({
    statusCode,
    message: message || HttpStatusMessage[HttpStatusCode[statusCode] as keyof typeof HttpStatusMessage],
    data,
  });
};

/**
 * 发送错误响应
 * @param res Express 响应对象
 * @param statusCode 状态码
 * @param message 可选的自定义消息
 * @param errorCode 可选的自定义错误码
 */
export const sendErrorResponse = (res: Response, statusCode: HttpStatusCode, message?: string, errorCode?: ErrorCode) => {
  res.status(statusCode).json({
    statusCode,
    message: message || HttpStatusMessage[HttpStatusCode[statusCode] as keyof typeof HttpStatusMessage],
    errorCode: errorCode || null,
  });
};
