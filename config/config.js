// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from '../src/routers/index.js';
import proxys from './proxy';
const { REACT_APP_ENV,LAZY_ENV } = process.env;
let webpack5 = LAZY_ENV && LAZY_ENV=='LAZY' ? {lazyCompilation:{}} : {};
export default defineConfig({
  hash: true,
  base: '/',
  publicPath: '/',
  outputPath: '/dist',
  antd: {},
  copy: [
    {
      from:'/public',
      to:'/img'
    }
  ],
  // mfsu:{},
  webpack5:webpack5,
  devtool: 'eval',
  dva: {
    hmr: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  extraBabelPlugins: [REACT_APP_ENV == 'prod' ? 'transform-remove-console' : ''],
  targets: {
    ie: 11,
  },
  routes: routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxys,
  define: {
    'process.env.REACT_APP_ENV': process.env.REACT_APP_ENV,
    'process.env.DEP_ENV' : process.env.DEP_ENV,
  },
  headScripts: [
    `https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/carowner-config/carowner_admin_config.js?V=${new Date().getTime()}`
  ],
  manifest: {
    basePath: '/',
  },
  //node_modules下文件不走babel编译
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  chainWebpack(config, { env, webpack, createCSSRule }) {
    // 修改js，js chunk文件输出目录
    config.output
      .filename('js/[name].[contenthash:8].js')
      .chunkFilename('js/[name].[contenthash:8].chunk.js')

    // 修改css输出目录
    config.plugin("extract-css").tap(() => [
      {
        filename: `css/[name].[contenthash:8].css`,
        chunkFilename: `css/[name].[contenthash:8].chunk.css`,
        ignoreOrder: true,
      },
    ]);

    // 修改图片输出目录
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use("url-loader")
      .loader(require.resolve("url-loader"))
      .tap((options) => {
        const newOptions = {
          ...options,
          name: "img/[name].[contenthash:8].[ext]",
          fallback: {
            ...options.fallback,
            options: {
              name: "img/[name].[contenthash:8].[ext]",
              esModule: false,
            },
          },
        };
        return newOptions;
      });

    // 修改svg输出目录
    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .use("file-loader")
      .loader(require.resolve("file-loader"))
      .tap((options) => ({
        ...options,
        name: "img/[name].[contenthash:8].[ext]",
      }));
  },

  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
});
