// ref: https://umijs.org/config/
import routes from './router.config';
import plugins from './plugins.config.js';

export default {
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  treeShaking: true,
  routes, // 配置式路由,移除该配置为约定式路由
  plugins,
  history: 'hash',
  publicPath: './',
  hash: true,
  proxy: {
    "/jiahe":{
      // target: "http://192.168.17.81:5010/", //刘相文
      // target: "http://192.168.17.89:5010/", //蒋昊霖
      target: "http://192.168.16.36:8079/", //测试环境
      // target: "http://192.168.16.34:5010/", //测试
      changeOrigin: true //是否跨域
    }
  },
  "externals": {
    "SuperMap": "window.SuperMap",
    "cyberplayer": "window.cyberplayer",
  }
};

