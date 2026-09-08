// src/routes/permissionRoutes.ts
import { Router } from 'express';
import { getPermissions, getPermissionById, createPermission, updatePermission, deletePermission } from '../controllers/permissionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: 权限管理相关的接口
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: 获取所有权限
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取权限列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/permissions', authMiddleware, getPermissions);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: 根据ID获取权限详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 权限ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功获取权限详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/permissions/:id', authMiddleware, getPermissionById);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: 创建权限
 *     security:
 *       - bearerAuth: []
 *     description: 向系统添加一个新权限。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: create_user
 *               description:
 *                 type: string
 *                 example: 创建用户权限
 *     responses:
 *       201:
 *         description: 权限创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/permissions', authMiddleware, roleMiddleware(['super', 'admin']), createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     tags: [Permissions]
 *     summary: 更新权限信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 需要更新的权限ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: delete_user
 *               description:
 *                 type: string
 *                 example: 删除用户权限
 *     responses:
 *       200:
 *         description: 权限信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/permissions/:id', authMiddleware, roleMiddleware(['super', 'admin']), updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: 删除权限
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 需要删除的权限ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: 权限删除成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/permissions/:id', authMiddleware, roleMiddleware(['super', 'admin']), deletePermission);

export default router;
