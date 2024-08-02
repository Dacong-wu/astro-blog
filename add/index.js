const inquirer = require('inquirer');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const platform = os.platform();
inquirer
  .prompt([
    {
      type: 'input',
      name: 'fileName',
      message: '请输入文件名，以.mdx结尾',
      validate: (value) => {
        if (value.length === 0) {
          return '请输入文件名';
        } else if (!value.endsWith('.mdx')) {
          return '文件名必须以.mdx结尾';
        } else if (value.lastIndexOf('.') === 0) {
          return '文件名不能只有扩展名，请包含文件名部分';
        }
        return true;
      },
    },
  ])
  .then((answer) => {
    const templatePath = path.join(__dirname, 'template.mdx');
    const targetDir = path.join(__dirname, '../src/content/blog');
    const targetPath = path.join(targetDir, answer.fileName);
    const data = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(targetPath, data, 'utf8');
    if (platform === 'win32') {
      exec(`start "" "${targetPath}"`);
    } else if (platform === 'darwin') {
      exec(`open -a Typora "${targetPath}"`);
    }
  })
  .catch((err) => {
    console.log(err);
  });
