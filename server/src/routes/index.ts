// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./authRoutes.ts";
// import userRoutes from "./userRoutes.ts";
// import roleRoutes from "./roleRoutes";
// import permissionRoutes from "./permissionRoutes";
// import statsRoutes from "./statsRoutes";

const router = Router();

router.use("/auth/", authRoutes);
// router.use("/", userRoutes);
// router.use("/", roleRoutes);
// router.use("/", permissionRoutes);
// router.use("/", statsRoutes);

export default router;
