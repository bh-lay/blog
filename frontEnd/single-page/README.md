# single-page

小剧客栈单页前端，基于 Vue 3 + TypeScript + Vite 构建。

## 技术栈

- Vue 3（全部组件使用 `<script setup lang="ts">` 单文件组件）
- Vue Router 4+
- TypeScript + vue-tsc
- Vite
- SCSS

## 目录结构

```
src/
├── main.ts              # 应用入口，创建 app、注册路由与 UI 库
├── App.vue
├── router/              # 路由配置
├── filters/             # 全局过滤器（已改为普通导出函数）
├── ui-library/          # 自建 UI 库（组件、指令、过滤器、样式）
├── components/          # 业务组件
├── common/              # 工具方法、样式、视图过渡等
└── view/                # 页面级视图
```

> 说明：Vue 3 已移除模板 filter 机制，原本的过滤器统一改为普通函数导出，
> 在组件内按需 `import` 后调用（例如 `import { imgHosting } from '@/filters'`）。

## Build Setup

```bash
# 安装依赖
npm install

# 启动开发服务器（Vite，默认 http://localhost:5173）
npm run dev

# 类型检查
npm run typecheck

# 开发/生产构建（构建后会把 index.html 拷贝到后端视图目录）
npm run build:dev
npm run build:prod
```

## 环境要求

- Node.js >= 18
- npm >= 8
