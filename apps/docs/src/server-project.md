# 后端项目

## 项目结构

```bash
├── src
│   ├── config # 配置文件夹
│   │   ├── config.json # Sequelize-CLI 配置文件
│   │   └── swagger.ts # Swagger 配置文件
│   ├── routes # 路由文件夹
│   │   ├── Authroutes.json # 权限路由
│   │   └── index.ts # 路由入口文件
│   ├── controllers # 控制器文件夹
│   │   └── autoController.ts # 权限控制器
│   ├── models # 模型文件夹
│   │   ├── users.json # 用户模型
│   │   └── connection.ts # 连接数据库
│   └── app.ts # 项目入口文件
├── .env # 本地环境变量文件
├── .sequelizerc # Sequelize 配置文件
├── package.json # 项目依赖
└── tsconfig.json # TypeScript 配置文件
```

## FAQ

### 1. 如何创建 TS Express 项目？

1. 安装依赖

```bash
npm i express
npm i -D typescript @types/node @types/express
```

2. 创建 `tsconfig.json` TS 配置文件

```json
{
  "compilerOptions": {
    // 指定编译后的 JavaScript 目标版本为 ES2020
    "target": "ES2020",
    // 指定模块解析策略为 Node.js 的下一版本规范（支持 ES Modules 的原生解析）
    "module": "nodenext",
    // 指定编译时引入的 API 声明库，包含 ES2020 的所有特性
    "lib": ["ES2020"],
    // 指定编译后的输出目录
    "outDir": "./dist",
    // 指定 TypeScript 源代码的根目录
    "rootDir": "./src",
    // 关闭所有严格类型检查选项的总开关（因为下方单独开启了部分严格检查）
    "strict": false,
    // 指定要包含的全局类型声明包，此处包含了 Node.js 的类型定义
    "types": ["node"],
    // 允许在默认导出的模块中，以 CommonJS 的 require 方式导入（通过合成默认导出）
    "esModuleInterop": true,
    // 跳过对第三方库（node_modules）的类型声明文件（.d.ts）的类型检查，以提升编译速度
    "skipLibCheck": true,
    // 强制在文件路径中使用与实际文件系统一致的大小写，避免在大小写不敏感的系统上出现错误
    "forceConsistentCasingInFileNames": true,
    // 允许在 TypeScript 模块中导入 JSON 文件作为模块
    "resolveJsonModule": true,
    // 允许从没有默认导出的模块中进行默认导入（与 esModuleInterop 配合使用）
    "allowSyntheticDefaultImports": true,
    // 禁止隐式的 any 类型，当类型推断为 any 时会报错
    "noImplicitAny": true,
    // 开启严格的 null 检查，使得 null 和 undefined 不能赋值给其他类型，防止空指针异常
    "strictNullChecks": true,
    // 不生成编译后的 JavaScript 输出文件，通常在仅需要类型检查或配合其他构建工具（如 tsc-alias, ts-node）时使用
    "noEmit": true,
    // 允许在 import 语句中导入带有 .ts 扩展名的文件（需配合 noEmit: true 使用）
    "allowImportingTsExtensions": true
  },

  // 指定编译器包含的文件范围：src 目录下的所有文件，以及显式包含 src/app.ts
  "include": ["src/**/*", "src/app.ts"],
  // 指定编译器排除的文件范围：不包含第三方依赖和编译输出目录
  "exclude": ["node_modules", "dist"]
}
```

3. 创建项目入口文件 `app.ts`

```ts
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
});
```

4. 创建 `package.json` 项目配置文件

```json
{
  "name": "server",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon --watch src --exec node --experimental-transform-types src/app.ts",
    "build": "npx tsc"
  }
}
```

### 2. 如何创建全局错误处理中间件？—— `errorHandler`

1. 创建 `middlewares/errorMiddleware.ts` 文件

```ts
import type { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "../utils/response.ts";
import { HttpStatusCode } from "../utils/constants/HttpStatus.ts";

// 错误处理中间件
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // 打印错误栈信息到控制台
  sendErrorResponse(res, HttpStatusCode.OTHER_ERROR, err.message || "Internal Server Error");
};
```

2. 在 `app.ts` 中使用错误处理中间件

```ts
import express from "express";
import { errorHandler } from "./middlewares/errorMiddleware.ts";

const app = express();
const PORT = process.env.PORT || 3000;

// 集成路由
app.get("/", (req, res, next) => {
  throw new Error("这是一个同步异常！"); // 会直接触发 errorHandler
});

app.use("/api", routes);

// ========== 统一错误处理（放在最后） ==========
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
});
```

### 3. 如何创建 API 文档？—— `swagger`

1. 安装依赖

   ```bash
   npm i swagger-jsdoc swagger-ui-express
   npm i -D @types/swagger-jsdoc @types/swagger-ui-express
   ```

2. 创建 `config/swagger.ts` 配置文件

   ```ts
   import swaggerJsDoc from "swagger-jsdoc";
   import swaggerUi from "swagger-ui-express";

   const swaggerOptions = {
     swaggerDefinition: {
       openapi: "3.0.0",
       info: {
         title: "API 文档",
         version: "1.0.0",
       },
       servers: [
         {
           url: "http://localhost:3000",
         },
       ],
     },
     // 指定需要解析的文件路径
     apis: ["./src/routes/*.ts"],
   };

   const swaggerDocs = swaggerJsDoc(swaggerOptions);

   export const setupSwagger = (app: any) => {
     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   };
   ```

3. 在 `app.ts` 中集成 swagger

   ```ts
   import express from "express";
   import { setupSwagger } from "./config/swagger.ts"; // 引入 swagger 配置

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Swagger 设置
   setupSwagger(app);

   app.listen(PORT, () => {
     console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
   });
   ```

4. 在接口中，使用 swagger

   ```ts
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
   ```
