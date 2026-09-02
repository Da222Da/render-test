import express from "express";
import { register } from "../controllers/authController.ts";

const router = express.Router();

/**
 * @swagger
 * /api/register:
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

export default router;
