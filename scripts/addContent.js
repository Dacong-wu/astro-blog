import inquirer from 'inquirer';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessKey = process.env.ACCESS_KEY;
const targetDir = path.join(__dirname, '../src/content/blog');
const assetsDir = path.join(__dirname, '../src/assets/images/blog');

// 平台
const platform = os.platform();

// 获取当天日期 YYYY-MM-DD
function getToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 主分类列表
const categories = ['client', 'server', 'ops', 'notes', 'tools'];

// 下载图片到本地
async function fetchUnsplashImage(url) {
  return new Promise((resolve, reject) => {
    // 1. 校验并提取 photoId
    const regex = /^https?:\/\/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)(?:\/.*)?$/;
    const match = url.match(regex);
    if (!match) {
      reject(new Error('URL 格式不正确，必须是 https://unsplash.com/photos/{id}'));
      return;
    }
    const photoId = match[1];

    // 2. 调用 Unsplash API 获取信息
    const apiUrl = `https://api.unsplash.com/photos/${photoId}`;
    https
      .get(apiUrl, { headers: { Authorization: `Client-ID ${accessKey}` } }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`API 请求失败: ${res.statusCode}, ${data}`));
            return;
          }

          let photoInfo;
          try {
            photoInfo = JSON.parse(data);
          } catch (err) {
            reject(new Error('解析 JSON 失败'));
            return;
          }

          const imageUrl = photoInfo.urls.full;
          const author = photoInfo.user.username;
          const imgName = `${photoId}.jpg`;
          const imgPath = path.join(assetsDir, imgName);

          // 3. 下载图片
          const file = fs.createWriteStream(imgPath);
          https
            .get(imageUrl, (imgRes) => {
              if (imgRes.statusCode !== 200) {
                reject(new Error(`图片下载失败，状态码 ${imgRes.statusCode}`));
                return;
              }
              imgRes.pipe(file);
              file.on('finish', () =>
                file.close(() => {
                  resolve({
                    imgName,
                    imgPath,
                    imgAuthorName: author,
                  });
                })
              );
              file.on('error', reject);
            })
            .on('error', reject);
        });
      })
      .on('error', reject);
  });
}

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: '请输入文件名，以 .mdx 结尾',
        validate: (value) => {
          if (!value) return '请输入文件名';
          if (!value.endsWith('.mdx')) return '文件名必须以 .mdx结尾';
          if (value.lastIndexOf('.') === 0) return '文件名不能只有扩展名';
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: '请选择文章分类',
        choices: categories,
        default: 'ops',
      },
      {
        type: 'input',
        name: 'imageUrl',
        message: '请输入图片 Unsplash 分享链接',
        validate: (value) => (value ? true : '请输入图片 URL'),
      },
    ]);

    const targetPath = path.join(targetDir, answers.fileName);

    // 确保目录存在
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

    const baseName = path.basename(answers.fileName, '.mdx');
    const today = getToday();

    // 下载图片
    const { imgName, imgPath, imgAuthorName } = await fetchUnsplashImage(answers.imageUrl, imgPath);

    // 写模板
    const template = `---
publishDate: ${today}
title: ${baseName}
excerpt: 
image: '~/assets/images/blog/${imgName}'
category: ${answers.category}
tags: []
metadata:
  image_author:
    link: https://unsplash.com/@${imgAuthorName}
    name: ${imgAuthorName}
---

## ${baseName}
`;

    // 如果文件已存在，提示覆盖
    if (fs.existsSync(targetPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `文件 ${answers.fileName} 已存在，是否覆盖？`,
          default: false,
        },
      ]);
      if (!overwrite) {
        console.log('操作已取消。');
        return;
      }
    }

    fs.writeFileSync(targetPath, template, 'utf8');
    console.log(`✅ 已创建文件：${targetPath}`);
    console.log(`✅ 图片已保存：${imgPath}`);

    // 打开文件
    if (platform === 'win32') {
      exec(`start "" "${targetPath}"`);
    } else if (platform === 'darwin') {
      exec(`open -a Typora "${targetPath}" || open "${targetPath}"`);
    } else {
      exec(`xdg-open "${targetPath}"`);
    }
  } catch (err) {
    console.error('❌ 出错了:', err);
  }
}

main();
