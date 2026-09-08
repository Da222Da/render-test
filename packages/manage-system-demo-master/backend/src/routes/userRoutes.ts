// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, deleteUserBatch } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 用户管理相关的接口
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: 获取所有用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: query
 *         description: 按用户名过滤（支持部分匹配）。
 *         required: false
 *         schema:
 *           type: string
 *           example: johndoe
 *       - name: phone
 *         in: query
 *         description: 按手机号精确过滤。
 *         required: false
 *         schema:
 *           type: string
 *           example: 1234567890
 *       - name: pageNo
 *         in: query
 *         description: 页码
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         description: 每页用户数量
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/users', authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 根据ID获取用户详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 用户ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功获取用户详情
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
router.get('/users/:id', authMiddleware, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: 创建用户
 *     security:
 *       - bearerAuth: []
 *     description: 向系统添加一个新用户。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: 15066666666
 *               avatar:
 *                 type: string
 *                 example: http://example.com/avatar.jpg
 *     responses:
 *       201:
 *         description: 用户创建成功
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
router.post('/users', authMiddleware, roleMiddleware(['super', 'admin']), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: 更新用户信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 需要更新的用户ID
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
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *               role_id:
 *                 type: integer
 *                 example: 1
 *                 description: 用户角色ID（例如1代表管理员，2代表普通用户）。
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               avatar:
 *                 type: string
 *                 example: http://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: 用户信息更新成功
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
router.put('/users/:id', authMiddleware, roleMiddleware(['super', 'admin']), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: 删除用户
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 需要删除的用户ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: 用户删除成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/users/:id', authMiddleware, roleMiddleware(['super', 'admin']), deleteUser);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     tags: [Users]
 *     summary: 批量删除用户
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: 需要删除的用户ID数组。
 *     responses:
 *       204:
 *         description: 用户批量删除成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: 一个或多个用户未找到
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/', authMiddleware, roleMiddleware(['super', 'admin']), deleteUserBatch);

export default router;
