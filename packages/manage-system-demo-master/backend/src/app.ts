import express, { Application } from "express";
const cors = require("cors");
import dotenv from "dotenv";
import sequelize from "./config/database";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorMiddleware";
import logger from "./config/logger";

import routes from "./routes";
import { setupSwagger } from "./config/swagger"; // 引入 swagger 配置

dotenv.config(); // 加载环境变量

const app: Application = express();
// 服务启动端口
const PORT = process.env.PORT || 3000;

// 配置 CORS 选项
const corsOptions = {
  origin: "*", // 前端应用的域
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // credentials: true, // 是否允许发送凭证（Cookies）
};

// 使用 morgan 记录请求日志
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()), // 将请求日志写入 winston
    },
  }),
);

// 使用 CORS 中间件
app.use(cors(corsOptions));

// Swagger 设置
setupSwagger(app);

// 中间件设置
app.use(express.json()); // 解析请求体
app.use(errorHandler); // 错误处理中间件

// 集成路由
app.use("/api", routes);

sequelize
  .sync({ force: false }) // 设置为 true 将会删除并重建表，生产环境请设为 false
  .then(() => {
    console.log("数据库同步成功");
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("数据库同步失败:", err);
  });
