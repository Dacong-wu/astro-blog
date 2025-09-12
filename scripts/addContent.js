import inquirer from 'inquirer';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// 解决 __dirname 在 ESM 中不可用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 可选的主分类列表（参考改进版）
const categories = ['client', 'server', 'ops', 'notes', 'tools'];

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'fileName',
        message: '请输入文件名，以 .mdx 结尾',
        validate: (value) => {
          if (value.length === 0) return '请输入文件名';
          if (!value.endsWith('.mdx')) return '文件名必须以 .mdx 结尾';
          if (value.lastIndexOf('.') === 0) return '文件名不能只有扩展名，请包含文件名部分';
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: '请选择文章分类',
        choices: categories,
        default: 'notes',
      },
    ]);

    const targetDir = path.join(__dirname, '../src/content/blog');
    const targetPath = path.join(targetDir, answers.fileName);

    // 确保目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const baseName = path.basename(answers.fileName, '.mdx');
    const today = getToday();

    const template = `---
publishDate: ${today}
title: ${baseName}
excerpt: 
image: '~/assets/images/blog/'
category: ${answers.category}
tags: []
metadata:
  image_author:
    link: https://unsplash.com/@myers2021
    name: myers2021
---

## ${baseName}
`;

    // 如果文件已存在，询问是否覆盖
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

    // 打开文件
    if (platform === 'win32') {
      exec(`start "" "${targetPath}"`);
    } else if (platform === 'darwin') {
      exec(`open -a Typora "${targetPath}" || open "${targetPath}"`);
    } else {
      exec(`xdg-open "${targetPath}"`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
