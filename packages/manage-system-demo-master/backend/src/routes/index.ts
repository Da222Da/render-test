// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import roleRoutes from './roleRoutes';
import permissionRoutes from './permissionRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', roleRoutes);
router.use('/', permissionRoutes);
router.use('/', statsRoutes);

export default router;
