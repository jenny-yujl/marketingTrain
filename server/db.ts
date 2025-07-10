import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// 调试环境变量
console.log('🔍 环境变量调试信息:');
console.log('  MYSQL_DATABASE_URL:', process.env.MYSQL_DATABASE_URL || '未设置');
console.log('  DATABASE_URL:', process.env.DATABASE_URL || '未设置');

// 检查是否有MySQL连接字符串
let mysqlUrl = process.env.MYSQL_DATABASE_URL;

// 修复常见的连接字符串格式错误
if (mysqlUrl) {
  console.log('🔧 原始连接字符串:', mysqlUrl);
  
  // 格式1: mysql://user:pass:host:port/db -> mysql://user:pass@host:port/db
  if (mysqlUrl.match(/mysql:\/\/[^:]+:[^:@]+:[^:]+:\d+\//)) {
    console.log("检测到格式错误 (缺少@符号)，正在修复...");
    mysqlUrl = mysqlUrl.replace(/mysql:\/\/([^:]+):([^:]+):([^:]+):(\d+)\/(.+)/, 'mysql://$1:$2@$3:$4/$5');
    console.log("修复后:", mysqlUrl);
  }
  
  // 格式2: mysql://host:port/db -> mysql://root:@host:port/db (无用户名密码)
  if (mysqlUrl.match(/^mysql:\/\/[^@]*:\d+\//)) {
    console.log("检测到缺少用户认证信息，添加默认用户...");
    mysqlUrl = mysqlUrl.replace(/mysql:\/\/([^:]+):(\d+)\/(.+)/, 'mysql://root:@$1:$2/$3');
    console.log("修复后:", mysqlUrl);
  }
}

let db: any = null;

// 初始化数据库连接的异步函数
async function initializeDatabase() {
  if (mysqlUrl) {
    console.log("正在连接MySQL数据库...");
    try {
      // 验证URL格式
      new URL(mysqlUrl);
      // 创建连接
      const connection = await mysql.createConnection(mysqlUrl);
      db = drizzle(connection, { schema, mode: "default" });
      console.log("✅ MySQL数据库连接成功！");
      return db;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn("❌ MySQL连接失败，使用内存存储:", errorMessage);
      if (errorMessage.includes('Invalid URL')) {
        console.log("请使用正确格式：mysql://用户名:密码@主机地址:端口/数据库名");
        console.log("示例：mysql://root:password@localhost:3306/mydatabase");
      }
      db = null;
      return null;
    }
  } else {
    console.log("📝 当前使用内存存储 - 数据在重启后会丢失");
    console.log("💡 要使用MySQL持久存储，请设置MYSQL_DATABASE_URL环境变量");
    return null;
  }
}

// 立即执行初始化
initializeDatabase();

export { db };