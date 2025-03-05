# E-invitation

基于 Next.js 的现代电子邀请函项目。这是一个优雅的婚礼电子请柬网站，具有精美的动画效果和交互体验。

## 特色功能

- 🌸 优雅的视觉设计

  - 精心选择的字体组合（手写体、衬线体、无衬线体）
  - 柔和的玫瑰色调主题
  - 响应式布局设计

- 🎨 丰富的动画效果

  - 3D 球形照片画廊
  - 漂浮的爱心动画
  - 平滑的页面过渡
  - 精美的装饰分隔线

- ⚡ 现代化交互体验

  - 照片查看器
  - 倒计时组件
  - RSVP 表单
  - 地图导航功能

- 📱 完整的移动端适配
  - 触摸友好的界面
  - 自适应布局
  - 优化的移动端性能

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**:
  - Tailwind CSS
  - CSS Modules
  - Framer Motion
- **3D 渲染**: Three.js
- **UI 组件**: Shadcn UI
- **数据库**: Firebase Realtime Database
- **字体**:
  - Great Vibes (手写体)
  - Cormorant Garamond (衬线体)
  - Montserrat (无衬线体)

## 项目结构

e-invitation/
├── app/ # Next.js 应用目录
│ ├── layout.tsx # 全局布局
│ ├── page.tsx # 主页面
│ └── globals.css # 全局样式
├── components/ # React 组件
│ ├── decorative/ # 装饰性组件
│ ├── ui/ # UI 组件
│ └── enhanced-globe-gallery.tsx # 3D 照片画廊
├── lib/ # 工具函数和配置
│ ├── firebase.ts # Firebase 配置
│ └── utils.ts # 通用工具函数
└── public/ # 静态资源

## 主要功能模块

1. **封面部分**

   - 优雅的标题展示
   - 婚礼倒计时
   - 动态背景效果

2. **详情部分**

   - 婚礼时间地点
   - 联系方式
   - 精美的分隔线装饰

3. **照片画廊**

   - 3D 球形照片展示
   - 点击查看大图
   - 优雅的粒子效果

4. **RSVP 表单**

   - 实时表单验证
   - Firebase 数据存储
   - 优雅的提交反馈

5. **地图导航**
   - 集成地图显示
   - 一键导航功能
   - 优化的移动端体验

## 开发环境设置

```bash
安装依赖
npm install
启动开发服务器
npm run dev
构建生产版本
npm run build
启动生产服务器
npm run start
```

## 环境变量配置

创建 `.env.local` 文件并配置以下环境变量：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 部署

项目可以部署到 Vercel、Netlify 等平台，推荐使用 Vercel 进行部署：
bash
vercel

## 自定义配置

1. 修改 `app/layout.tsx` 中的字体配置
2. 在 `globals.css` 中调整主题颜色
3. 更新 `app/page.tsx` 中的婚礼信息
4. 在 Firebase 控制台配置数据库规则

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。
