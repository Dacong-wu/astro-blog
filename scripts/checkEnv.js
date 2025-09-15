import fs from 'fs';
import path from 'path';

// 解析 .env 文件
const envPath = path.resolve('./.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env 文件不存在，请在项目根目录创建 .env 文件');
  process.exit(1);
}

// 检查 ACCESS_KEY
if (!process.env.ACCESS_KEY) {
  console.error('❌ ACCESS_KEY 未设置，请在 .env 文件中添加 ACCESS_KEY=你的UnsplashAccessKey');
  process.exit(1);
}

console.log('✅ 检查通过，.env 文件和 ACCESS_KEY 已就绪');
