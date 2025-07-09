import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// 检查是否有MySQL连接字符串
let mysqlUrl = process.env.MYSQL_DATABASE_URL;

// 修复常见的连接字符串格式错误
if (mysqlUrl && mysqlUrl.includes('mysql://') && !mysqlUrl.match(/mysql:\/\/[^:]+:[^@]*@/)) {
  console.log("检测到MySQL连接字符串格式错误，正在自动修复...");
  // 修复格式：mysql://user:pass:host:port/db -> mysql://user:pass@host:port/db
  mysqlUrl = mysqlUrl.replace(/mysql:\/\/([^:]+):([^:]+):([^:]+):(\d+)\/(.+)/, 'mysql://$1:$2@$3:$4/$5');
  console.log("修复后的连接字符串格式正确");
}

let db: any = null;

if (mysqlUrl) {
  console.log("正在连接MySQL数据库...");
  try {
    // 验证URL格式
    new URL(mysqlUrl);
    // 创建异步连接
    mysql.createConnection(mysqlUrl).then(connection => {
      db = drizzle(connection, { schema, mode: "default" });
      console.log("✅ MySQL数据库连接成功！");
    }).catch(error => {
      console.warn("❌ MySQL连接失败，使用内存存储:", error.message);
      db = null;
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("❌ MySQL连接字符串格式错误:", errorMessage);
    console.log("请使用正确格式：mysql://用户名:密码@主机地址:端口/数据库名");
    console.log("示例：mysql://root:password@localhost:3306/mydatabase");
    db = null;
  }
} else {
  console.log("未设置MYSQL_DATABASE_URL，使用内存存储");
}

export { db };