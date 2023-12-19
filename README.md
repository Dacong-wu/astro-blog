# 🐙spanBlog
## 项目简介
这个博客是基于 [AstroWind](https://github.com/onwidget/astrowind) 模板创建而来，在此感谢模板作者 [onWidget](https://onwidget.com/) 创作出如此优秀的产品
服务部署在 [Microsoft Azure](https://portal.azure.com/#home) 上，在此感谢 [Microsoft](https://www.microsoft.com/zh-cn) 提供的支持
## 使用方式
具体信息可以参考 [AstroWind](https://github.com/onwidget/astrowind) 教程，本博客仅在 **AstroWind** 基础上添加了一些常用功能
1. 添加代码复制公告
2. 自定义明暗主题切换开关
3. 为图片添加预览功能
4. 修复一些我个人觉得有问题的细节

## 常见问题

1. Azure 会覆盖 404 页面

   在项目根目录下添加 `staticwebapp.config.json` 文件，并添加一下内容

   ```json
   {
     "responseOverrides": {
       "404": {
         "rewrite": "/404",
         "statusCode": 404
       }
     }
   }
   ```

2. 执行 `npm install` 安装依赖操作会失败

   推荐使用 [pnpm](https://pnpm.io/) 执行安装操作

3. 执行部署操作出错，错误内容包含 `generating optimized images`

   这个大概率是因为 `sharp` 的问题，[官方文档](https://docs.astro.build/zh-cn/guides/images/#%E9%BB%98%E8%AE%A4%E5%9B%BE%E5%83%8F%E6%9C%8D%E5%8A%A1) 中也有部分介绍，推荐使用 [squoosh](https://github.com/GoogleChromeLabs/squoosh) ，在 AstroWind 中的 [Issues](https://github.com/onwidget/astrowind/issues/314) 中也有提到，按我提供的方式，解决了很多人的问题

