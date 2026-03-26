# Email Signature Builder

一个零依赖的静态签名生成器，用来生成 Juyu 风格的高级商务版邮箱签名。

## 使用方式

1. 最方便的本地启动方式：双击 `start.command`
2. 也可以在项目根目录双击 `start_signature_tool.command`
3. 启动后浏览器会自动打开，同时终端会显示一个 `Share` 地址
4. 在左侧填写姓名、职位、联系方式、公司信息
5. Logo 可使用远程链接，也可直接上传本地图片并实时预览
6. 可选填写 LinkedIn、Facebook、Instagram、YouTube、Telegram、WhatsApp
7. 在右侧预览最终效果
8. 点击 `复制 HTML` 或 `下载 HTML`

## 注意事项

- 上传的本地 Logo 会被转成嵌入式数据地址，方便直接复制预览结果
- 如果目标邮箱客户端对嵌入式图片支持有限，可优先使用稳定的远程 Logo 链接
- 使用 `start.command` 启动后，同一 Wi-Fi 下的手机、平板、电脑都可以打开终端里显示的 `Share` 地址

## 分享方式

- 同一局域网分享：把 `Share` 地址直接发到微信、Telegram、WhatsApp 等聊天工具
- 公网分享：把整个 `signature-tool` 文件夹上传到 Netlify、Vercel、GitHub Pages 或公司静态服务器，部署后的 HTTPS 链接可在任何设备打开
- 页面内已经支持 `系统分享` 和 `复制页面链接`，部署到公网后可直接使用

## GitHub Pages 部署

1. 把 `signature-tool` 目录单独作为一个 GitHub 仓库
2. 推送到 GitHub 的 `main` 分支
3. GitHub Actions 会自动执行 `.github/workflows/deploy-pages.yml`
4. 在 GitHub 仓库的 `Settings > Pages` 中确认 Source 为 `GitHub Actions`
5. 部署完成后，站点地址通常是 `https://<github-username>.github.io/<repo-name>/`

## 本地初始化仓库

```bash
cd '/Users/eric/Desktop/JUYU-Eric/ai 内容/signature-tool'
git init -b main
git add .
git commit -m "Initial GitHub Pages site"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 其他部署方式

- 可直接上传整个 `signature-tool` 文件夹到任意静态站点
- 适合部署到 Netlify、Vercel 或公司内部静态服务器

## 文件说明

- `index.html`: 页面结构
- `styles.css`: 在线工具界面样式
- `app.js`: 表单联动、HTML 生成、复制和下载逻辑
