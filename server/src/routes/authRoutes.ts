import express from "express";
import { register, login, getUserInfo } from "../controllers/authController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 default: "exampleUser"
 *               email:
 *                 type: string
 *                 default: "exampleUser@gmail.com"
 *               password:
 *                 type: string,
 *                 default: "123456abc"
 *     responses:
 *       201:
 *         description: 注册用户成功
 *       500:
 *         description: 注册用户失败
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: 用户登录
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: exampleUser
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: 123456abc
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/getUserInfo:
 *   get:
 *     summary: 获取用户信息
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The user information.
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.get("/getUserInfo", authMiddleware, getUserInfo);

export default router;
