import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response';
import { HttpStatusCode } from '../utils/constants/HttpStatus';

// 错误处理中间件
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // 打印错误栈信息到控制台
  sendErrorResponse(res, HttpStatusCode.OTHER_ERROR, err.message || 'Internal Server Error' );
};
