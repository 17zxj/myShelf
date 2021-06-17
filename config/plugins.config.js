let plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      dynamicImport: { // 路由动态引入配置
        webpackChunkName: true,
        loadingComponent: './components/common/PageLoading/index',
      },
      dll: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
      metas: [
        { charset: 'utf-8' },
      ],


      title: '嘉禾', // 浏览器标题
      links: [ // html的link标签用于引入样式文件
        { rel: 'icon', href: './favicon.png', type: 'image/x-icon' },
        { rel: 'stylesheet', href: '//at.alicdn.com/t/font_2349021_rlxshfgddsf.css' }, // 公共图标库
        { rel: 'stylesheet', href: '//at.alicdn.com/t/font_2394155_tux0gqmbq8c.css' }, // 嘉禾公共组件图标

      ],
      scripts: [ // scripts标签用于引入脚本文件
        { type: 'text/javascript', src: './cyberplayer.js' },
        { type: 'text/javascript', src: './videojs/video.js' },
        { type: 'text/javascript', src: './videojs/videojs-contrib-hls.js' },
        { type: 'text/javascript', src: './videojs/videojs-contrib-quality-levels.js' },
      ],
    },
  ],
];

// 在本地开发时不开启主题切换，避免编译过慢影响开发效率
// if (process.env.NODE_ENV !== 'development') {
//   plugins.push(['umi-plugin-antd-theme', {
//     theme: [
//       { key: 'sunset', fileName: 'sunset.css', modifyVars: { '@primary-color': '#fe7e27' } },
//       { key: 'cyan', fileName: 'cyan.css', modifyVars: { '@primary-color': '#14c2d1' } },
//       { key: 'green', fileName: 'green.css', modifyVars: { '@primary-color': '#00b73c' } },
//       { key: 'daybreak', fileName: 'daybreak.css', modifyVars: { '@primary-color': '#1890ff' } },
//       { key: 'purple', fileName: 'purple.css', modifyVars: { '@primary-color': '#665eff' } },
//     ],
//     min: true, // 是否压缩css
//     isModule: true, // css module
//     ignoreAntd: false, // 忽略 antd 的依赖
//     ignoreProLayout: true, // 忽略 pro-layout
//     cache: false, // 不使用缓存
//   }]);
// }

export default plugins;
