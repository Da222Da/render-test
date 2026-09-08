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

## FAQ 常见问题

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

### 2. 如何创建全局错误处理中间件 errorHandler？

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

### 3. swagger 如何创建 API 文档？

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

### 4. bcrypt 如何对明文密码“加密”？

`bcrypt` 是一个用于**密码哈希加密**的 Node.js/TypeScript 模块。它的核心作用是。

在开发中，我们绝不能将用户的明文密码直接存入数据库（一旦数据库泄露，所有用户密码就会曝光）。所以，需要`bcrypt` 来安全地存储和验证用户密码。

1. **哈希加密**：将明文密码转换成一串不可逆的随机字符串（哈希值）存入数据库。
2. **验证密码**：将用户登录时输入的明文密码与数据库中存储的哈希值进行比对，判断密码是否正确。

```typescript
import * as bcrypt from "bcrypt";

// 1. 加密密码
async function hashPassword(plainPassword: string): Promise<string> {
  // saltRounds 代表加盐的轮数（也叫成本因子），推荐 10-12
  // 轮数越高，加密越安全，但耗时也越长
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log("加密后的密码:", hashedPassword);
  // 输出类似: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
  return hashedPassword;
}

// 2. 验证密码
async function checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // 将用户输入的明文密码和数据库里存的哈希值进行比对
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  if (isMatch) {
    console.log("密码正确，登录成功！");
  } else {
    console.log("密码错误！");
  }

  return isMatch;
}

// 使用示例
(async () => {
  const pwd = "mySecret123";
  // 注册时：加密并存储
  const hashed = await hashPassword(pwd);

  // 登录时：验证
  await checkPassword("mySecret123", hashed); // true
  await checkPassword("wrongPassword", hashed); // false
})();
```

### 5. jsonwebtoken 如何实现登录认证功能？

`jsonwebtoken` 是一个用于生成和验证 JSON Web Tokens (JWT) 的 Node.js/TypeScript 模块。JWT 是一种用于在客户端和服务器之间安全传输信息的机制。

1. **用户登录并签发 Token**：在用户登录成功后，生成一个 JWT 并返回给客户端。

```js
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; // 密钥，务必保存在环境变量中

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 1. 验证用户名和密码（伪代码，通常需查询数据库）
  const user = await User.findOne({ where: { username } });

  if (!user?.username || !user?.password) {
    return sendErrorResponse(res, HttpStatusCode.BAD_REQUEST, "无效的用户名或密码");
  }

  if (user) {
    // 2. 验证成功，使用 jwt.sign 生成 Token
    // payload 通常存放用户的唯一标识，不要存放敏感信息如密码
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload
      secretKey, // 密钥
      { expiresIn: "1h" }, // 配置项，如过期时间
    );

    // 3. 将 Token 返回给客户端
    res.json({ message: "登录成功", token });
  } else {
    res.status(401).json({ message: "账号或密码错误" });
  }
});
```

2. **验证 token**：在每次请求时，客户端将 JWT 附加到请求头中，服务器验证 JWT 的有效性。
   1. 客户端将 JWT 放在请求头的 `Authorization` 字段中，格式为 `Bearer <token>`。

   2. **token 验证中间件`authMiddleware`**：从请求头中提取 `Authorization`，并使用 `jwt.verify` 方法验证其有效性，最后，将用户信息存储到 `req.body.user` 中。

      ```ts
      // src/middlewares/authMiddleware.ts
      import type { Request, Response, NextFunction } from "express";
      import jwt from "jsonwebtoken";
      import type { JwtPayload } from "jsonwebtoken";
      import { sendErrorResponse } from "../utils/response.ts";
      import { HttpStatusCode } from "../utils/constants/HttpStatus.ts";
      import dotenv from "dotenv";

      dotenv.config();

      interface DecodedToken extends JwtPayload {
        userId: number;
        role_id: number;
      }

      export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
        // 1. 从请求头中获取 token
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "未提供令牌，请先登录");
        }

        // 2. 提取 token 字符串（去掉 'Bearer ' 前缀）
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

        try {
          // 3. 验证并解码 token
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

          // 4. 将用户信息挂载到 req.user 上，供后续路由使用
          if (!req.body) req.body = {}; // 如果没有 req.body，则初始化为空对象
          req.body.user = decoded; // 包含 userId, username 等

          next(); // 验证通过，放行
        } catch (error) {
          return sendErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "无效的 token");
        }
      };
      ```

   3. **使用示例**：在路由中使用 `authMiddleware` 验证用户身份。

      ```ts
      import express from "express";
      import { getUserInfo } from "../controllers/authController.ts";
      import { authMiddleware } from "../middlewares/authMiddleware.ts";

      const router = express.Router();

      router.get("/getUserInfo", authMiddleware, getUserInfo);

      export default router;
      ```
