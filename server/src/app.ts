import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.ts";
import { setupSwagger } from "./config/swagger.ts"; // 引入 swagger 配置
import { errorHandler } from "./middlewares/errorMiddleware.ts";

const app = express();
const PORT = process.env.PORT || 3000;

// 加载环境变量
dotenv.config();

app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码
app.use(express.static("public")); // 静态文件目录

// Swagger 设置
setupSwagger(app);

// 集成路由
app.use("/api", routes);

// ========== 统一错误处理（放在最后） ==========
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
});
