import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  alias: {
    '@rc-component/tree$': path.resolve('src'),
    '@rc-component/tree/es': path.resolve('src'),
    '@rc-component/tree/assets/index.css': path.resolve('assets/index.less'),
    '@rc-component/tree/assets': path.resolve('assets'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Tree',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
