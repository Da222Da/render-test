// src/types/express/index.d.ts
import { User } from '../models/User'; // 根据你的 User 模型路径调整

declare global {
  namespace Express {
    interface UserPayload {
      userId: number;
      role_id: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
