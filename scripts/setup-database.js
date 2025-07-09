#!/usr/bin/env node

// 数据库配置检查和设置脚本
console.log("=== MySQL数据库配置检查 ===\n");

// 检查当前环境变量
const mysqlUrl = process.env.MYSQL_DATABASE_URL;
const dbUrl = process.env.DATABASE_URL;

console.log("当前环境变量状态：");
console.log(`MYSQL_DATABASE_URL: ${mysqlUrl ? '已设置' : '未设置'}`);
console.log(`DATABASE_URL: ${dbUrl ? '已设置 (PostgreSQL)' : '未设置'}\n`);

if (mysqlUrl) {
  console.log("检测到MYSQL_DATABASE_URL设置：");
  console.log(`值: ${mysqlUrl}\n`);
  
  // 验证格式
  try {
    const url = new URL(mysqlUrl);
    if (url.protocol === 'mysql:') {
      console.log("✅ 连接字符串格式正确");
      console.log(`协议: ${url.protocol}`);
      console.log(`主机: ${url.hostname}`);
      console.log(`端口: ${url.port || 3306}`);
      console.log(`数据库: ${url.pathname.slice(1)}`);
      console.log(`用户名: ${url.username}`);
    } else {
      console.log("❌ 错误：不是MySQL协议");
    }
  } catch (error) {
    console.log("❌ 连接字符串格式错误：", error.message);
    console.log("\n正确格式示例：");
    console.log("mysql://用户名:密码@主机地址:端口/数据库名");
    console.log("mysql://root:password@localhost:3306/mydatabase");
  }
} else {
  console.log("📝 MySQL数据库未配置");
  console.log("\n要设置MySQL数据库，请：");
  console.log("1. 在Replit Secrets中添加 MYSQL_DATABASE_URL");
  console.log("2. 格式：mysql://用户名:密码@主机地址:端口/数据库名");
  console.log("3. 示例：mysql://root:password@localhost:3306/qianchuan_db");
}

console.log("\n=== 推荐的MySQL云服务 ===");
console.log("• PlanetScale (免费层): https://planetscale.com/");
console.log("• Railway: https://railway.app/");
console.log("• DigitalOcean: https://www.digitalocean.com/products/managed-databases/");
console.log("• AWS RDS: https://aws.amazon.com/rds/");