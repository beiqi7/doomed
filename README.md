# 🎨 FAL.AI 图像编辑工具

一个基于 FAL.AI 的 ByteDance SeedDream 4.0 图像编辑工具，提供直观的Web界面进行AI驱动的图像编辑。

## ✨ 功能特性

- 🖼️ **多图片上传**: 支持拖拽上传最多10张图片
- 🎯 **智能编辑**: 使用自然语言描述进行图像编辑
- ⚙️ **灵活配置**: 支持多种图片尺寸和生成参数
- 🔒 **安全存储**: API Key本地存储，保护用户隐私
- 📱 **响应式设计**: 完美适配桌面和移动设备
- ⚡ **实时预览**: 即时查看编辑结果

## 🚀 快速开始

### 1. 获取API Key

1. 访问 [FAL.AI](https://fal.ai) 注册账户
2. 在控制台中获取您的 API Key
3. 确保您有足够的积分使用 ByteDance SeedDream 4.0 模型

### 2. 运行项目

#### 方法一：Vercel部署 (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fal-ai-image-editor)

1. 点击上方按钮或访问 [Vercel](https://vercel.com)
2. 导入您的GitHub仓库
3. 部署完成后，在网页中输入您的FAL.AI API Key即可使用

#### 方法二：本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd fal-ai-image-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 方法三：使用Python

```bash
# 在项目目录中运行
python -m http.server 8080
```

#### 方法四：直接打开

直接双击 `index.html` 文件在浏览器中打开

### 3. 开始使用

1. 在网页中输入您的 FAL.AI API Key
2. 上传要编辑的图片（支持拖拽）
3. 输入编辑提示词，例如："给模特穿上这些衣服和鞋子"
4. 调整生成参数
5. 点击"开始编辑"按钮

## 📋 使用说明

### 支持的图片格式
- JPEG/JPG
- PNG
- WebP
- GIF

### 图片要求
- 最小尺寸：1024x1024像素
- 最大数量：10张图片
- 文件大小：建议不超过10MB

### 编辑提示词示例
- "给模特穿上这些衣服和鞋子"
- "将背景改为海滩场景"
- "添加夕阳效果"
- "改变图片的色调为暖色调"
- "将人物表情改为微笑"

### 图片尺寸选项
- 正方形高清 (1024x1024)
- 正方形 (1024x1024)
- 竖屏 4:3
- 竖屏 16:9
- 横屏 4:3
- 横屏 16:9

## 🚀 Vercel部署

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/fal-ai-image-editor)

### 手动部署步骤

1. **Fork或克隆仓库**
   ```bash
   git clone https://github.com/your-username/fal-ai-image-editor.git
   cd fal-ai-image-editor
   ```

2. **连接Vercel**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 导入您的GitHub仓库

3. **配置部署**
   - 框架预设：选择 "Other"
   - 构建命令：留空（静态网站）
   - 输出目录：留空（根目录）

4. **部署完成**
   - Vercel会自动部署您的网站
   - 获得一个 `your-project.vercel.app` 的域名
   - 支持自定义域名

### Vercel特性

- ✅ **全球CDN**: 快速访问，低延迟
- ✅ **自动HTTPS**: 免费SSL证书
- ✅ **Git集成**: 自动部署更新
- ✅ **环境变量**: 安全配置管理
- ✅ **预览部署**: 每个PR都有预览链接

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **AI服务**: FAL.AI ByteDance SeedDream 4.0
- **文件处理**: File API, Canvas API
- **样式**: 现代CSS Grid/Flexbox布局
- **图标**: Emoji图标
- **部署**: Vercel静态网站托管

## 📁 项目结构

```
fal-ai-image-editor/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── package.json        # 项目配置
├── vercel.json         # Vercel部署配置
├── env.example         # 环境变量示例
└── README.md          # 说明文档
```

## 🔧 配置选项

### 生成参数
- **生成数量**: 1-4张图片
- **随机种子**: 控制生成结果的随机性
- **安全检查**: 默认关闭，可手动启用内容安全过滤

### 图片尺寸
支持多种预设尺寸，也可以自定义宽高（1024-4096像素）

## 🚨 注意事项

1. **API Key安全**: 请勿在公共环境中暴露您的API Key
2. **图片隐私**: 上传的图片会发送到FAL.AI服务器进行处理
3. **使用限制**: 请遵守FAL.AI的使用条款和限制
4. **网络要求**: 需要稳定的网络连接访问FAL.AI服务

## 🐛 故障排除

### 常见问题

**Q: 上传图片后无法生成？**
A: 请检查：
- API Key是否正确
- 图片尺寸是否满足要求（≥1024x1024）
- 网络连接是否正常
- 账户是否有足够积分

**Q: 生成结果不理想？**
A: 尝试：
- 更详细和具体的提示词
- 调整随机种子
- 使用更高质量的输入图片

**Q: 页面无法加载？**
A: 请确保：
- 使用现代浏览器（Chrome, Firefox, Safari, Edge）
- 启用了JavaScript
- 网络连接正常

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如有问题，请：
1. 查看本文档的故障排除部分
2. 在GitHub上提交Issue
3. 联系FAL.AI官方支持

## 🔗 相关链接

- [FAL.AI官网](https://fal.ai)
- [ByteDance SeedDream 4.0文档](https://fal.ai/models/fal-ai/bytedance/seedream/v4/edit/api)
- [FAL.AI客户端文档](https://fal.ai/docs)

---

**享受AI图像编辑的乐趣！** 🎨✨
