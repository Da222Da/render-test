// src/config/swagger.ts
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { getDashboardStats } from '../controllers/statsController';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '用户管理 API',
      version: '1.0.0',
      description: '用于管理用户、角色和权限的 API 文档',
    },
    servers: [
      {
        url: 'http://localhost:3000', // 根据实际情况调整
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // 定义 bearerAuth
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'johndoe@example.com' },
            phone: { type: 'string', example: '1234567890' },
            avatar: { type: 'string', example: 'http://example.com/avatar.jpg' },
            role_id: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'admin' },
            description: { type: 'string', example: '管理员角色' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
            permissions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Permission' },
            },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'create_user' },
            description: { type: 'string', example: '创建用户权限' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-10-08T00:00:00.000Z' },
          },
        },
        dashboardStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer', example: 100 },
            totalActiveUserCount: { type: 'integer', example: 5 },
            totalPermissions: { type: 'integer', example: 20 },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }, // 根据具体情况调整
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: '未授权访问',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        NotFoundError: {
          description: '资源未找到',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        BadRequestError: {
          description: '请求无效',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },@
        InternalServerError: {
          description: '服务器内部错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // 指定需要解析的文件路径
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
