// src/config/logger.ts
import winston, { Logger } from 'winston';

const logger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(), // 输出到控制台
    new winston.transports.File({ filename: 'combined.log' }), // 输出到文件
  ],
});

export default logger;
