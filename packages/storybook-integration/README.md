# @precomponents/storybook-integration

## English Documentation

### Introduction

`@precomponents/storybook-integration` is a Vite plugin designed to deeply integrate your Storybook component library with Astro-powered documentation sites (such as Starlight). It enables your documentation pages to automatically fetch and embed Storybook component demos, achieving seamless linkage between documentation and component library.

---

### Features
- Automatically sync Storybook stories index to the Astro documentation system
- Support embedding Storybook component demos (iframe) in documentation
- Provide a Storybook decorator for iframe auto-resize and related features
- Compatible with Vite build process, supporting both development and production

---

### Installation

```bash
pnpm add @precomponents/storybook-integration -D
# or
npm install @precomponents/storybook-integration --save-dev
```

---

### Usage Example

Integrate the plugin in your Storybook config file (e.g., `.storybook/main.ts`):

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { PreComponentsStorybookVitePlugin } from '@precomponents/storybook-integration/plugin';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  viteFinal: async (config, options) => {
    config.plugins?.push([PreComponentsStorybookVitePlugin(options)]);
    return { ...config };
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
};
export default config;
```

---

### Configuration
- `PreComponentsStorybookVitePlugin(options)`:
  - Pass Storybook's Vite config options (such as `host`, `port`, `outputDir`, etc.).
  - The plugin will automatically watch and sync the Storybook stories index.
- The documentation side should use the virtual module `virtual:storybook-index` to fetch the story list.
- Provides the decorator `PreComponentsStorybookDecorator` for iframe auto-resize, etc.

---

### Requirements
- Node.js >= 16
- Vite >= 4
- Storybook >= 7 (recommended 7.0+, must support Vite builder)
- Astro >= 3 (if integrating with Starlight docs)
- React (peerDependency)

---

### Contribution
Feel free to submit issues or PRs!

---

### License
MIT

---

## 中文文档

### 项目简介

`@precomponents/storybook-integration` 是一个用于将 Storybook 组件库与 Astro 驱动的文档站点（如 Starlight）深度集成的 Vite 插件。它可以让你的文档页面自动获取并嵌入 Storybook 的组件演示，实现文档与组件库的无缝联动。

---

### 主要功能
- 自动同步 Storybook 的 stories 索引到 Astro 文档系统
- 支持在文档中嵌入 Storybook 组件演示（iframe）
- 提供 Storybook 装饰器，支持 iframe 自适应等功能
- 适配 Vite 构建流程，支持开发与生产环境

---

### 安装方法

```bash
pnpm add @precomponents/storybook-integration -D
# 或者
npm install @precomponents/storybook-integration --save-dev
```

---

### 用法示例

在你的 Storybook 配置文件（如 `.storybook/main.ts`）中集成插件：

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { PreComponentsStorybookVitePlugin } from '@precomponents/storybook-integration/plugin';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  viteFinal: async (config, options) => {
    config.plugins?.push([PreComponentsStorybookVitePlugin(options)]);
    return { ...config };
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
};
export default config;
```

---

### 配置说明
- `PreComponentsStorybookVitePlugin(options)`：
  - 需传入 Storybook 的 Vite 配置参数（如 `host`, `port`, `outputDir` 等）。
  - 插件会自动监听并同步 Storybook 的 story 索引。
- 文档端需通过虚拟模块 `virtual:storybook-index` 获取 story 列表。
- 提供装饰器 `PreComponentsStorybookDecorator`，用于 iframe 高度自适应等。

---

### 依赖要求
- Node.js >= 16
- Vite >= 4
- Storybook >= 7（推荐 7.0+，需支持 Vite 构建）
- Astro >= 3（如需集成 Starlight 文档）
- React（peerDependency）

---

### 贡献
欢迎提 issue 或 PR 参与贡献！

---

### License
MIT
