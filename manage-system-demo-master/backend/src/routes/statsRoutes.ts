// src/routes/statsRoutes.ts
import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * @swagger
 * /api/dashboard-stats:
 *   get:
 *     tags: [stats]
 *     summary: 获取首页统计数据
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取角色列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/dashboardStats'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(`/dashboard-stats`, authMiddleware, roleMiddleware(["super" , 'admin']), getDashboardStats);

export default router;