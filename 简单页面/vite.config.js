import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 注：源项目图标走 icon-plus 在线（octo.hdesign.huawei.com），外网不可达。
// 本工程 icon.jsx 改为离线 Lucide SVG（无网络依赖），因此无需 icon-api 代理与 transform 插件。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
