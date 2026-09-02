// src/constants/HttpStatus.ts

export enum HttpStatusCode {
  // 成功响应
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 重定向
  MOVED_PERMANENTLY = 301,
  FOUND = 302,

  // 客户端错误
  BAD_REQUEST = 400, // 客户端发送给服务器的请求格式错误或者无法被服务器理解。
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  // 服务器错误
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  OTHER_ERROR = 520,
}

export enum HttpStatusMessage {
  // 成功响应
  OK = "OK",
  CREATED = "Created",
  ACCEPTED = "Accepted",
  NO_CONTENT = "No Content",

  // 重定向
  MOVED_PERMANENTLY = "Moved Permanently",
  FOUND = "Found",

  // 客户端错误
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  METHOD_NOT_ALLOWED = "Method Not Allowed",
  CONFLICT = "Conflict",
  UNPROCESSABLE_ENTITY = "Unprocessable Entity",

  // 服务器错误
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  NOT_IMPLEMENTED = "Not Implemented",
  BAD_GATEWAY = "Bad Gateway",
  SERVICE_UNAVAILABLE = "Service Unavailable",
  GATEWAY_TIMEOUT = "Gateway Timeout",
  OTHER_ERROR = "Other Error",
}
