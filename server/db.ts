import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// 检查是否有MySQL连接字符串 
const mysqlUrl = process.env.MYSQL_DATABASE_URL || process.env.DATABASE_URL;

let db: any = null;

if (mysqlUrl) {
  console.log("正在连接MySQL数据库...");
  try {
    // 创建异步连接
    mysql.createConnection(mysqlUrl).then(connection => {
      db = drizzle(connection, { schema, mode: "default" });
      console.log("MySQL数据库连接成功！");
    }).catch(error => {
      console.warn("MySQL连接失败，使用内存存储:", error.message);
      db = null;
    });
  } catch (error) {
    console.warn("MySQL连接配置错误，使用内存存储:", error);
    db = null;
  }
} else {
  console.log("未设置MYSQL_DATABASE_URL，使用内存存储");
}

export { db };