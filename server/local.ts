import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from 'url';

// 在 ES 模块中获取 __dirname 的替代方案
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`[${new Date().toLocaleTimeString()}] ${logLine}`);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // 在生产环境中提供静态文件
  if (process.env.NODE_ENV === "production") {
    const publicPath = path.resolve(__dirname, "..", "dist", "public");
    app.use(express.static(publicPath));
    
    // 前端路由的回退
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(publicPath, "index.html"));
    });
  }

  // 启动服务器
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 后端服务器启动成功 - http://localhost:${port}`);
    console.log(`📝 当前使用内存存储 - 数据在重启后会丢失`);
    console.log(`💡 要使用MySQL持久存储，请设置MYSQL_DATABASE_URL环境变量`);
  });
})();