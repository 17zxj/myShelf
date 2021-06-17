let menu = [
  {
    code: "GisMap",
    icon: "appstore",
    name: "管网地理信息系统",
    children: [
      {
        name:'GIS一张图',
        code:'GisMap',
        icon: "icon-GISditu",
        children: [
          { name: 'GIS地图', code: 'gisMap', url:'/GisMap' },
        ]
      }
    ]
  }
];

// 获取默认显示的路由
const getDefaultMenu = (data, menu) => {
  let { type, url, children } = data;
  if (url && !defaultMenu) {
    defaultMenu = url;
  }
  if (children && children.length) {
    children.map(item => {
      getDefaultMenu(item, menu)
    })
  }
};

// 获取子系统的路由
const getSubMenu = (data, parentKey) => {
  let { name, code, children = [], icon } = data;
  data.title = name;
  data.key = code;
  if (!icon) {
    parentKey = parentKey ? parentKey + "/" + code : code;
  }
  data.parentKey = parentKey;
  children = children.filter(item => item.type != 3);
  if (children && children.length) {
    children.map(item => {
      getSubMenu(item, parentKey)
    })
  }
  return data;
};

let defaultMenu;
menu.map(item => {
  getDefaultMenu(item);
  getSubMenu(item);
});


// 若需要权限控制,将菜单保存在localStorage中再获取
let menuData = JSON.parse(localStorage.getItem('menuData'));

let systemConfig = {
  systemData: menu,
  menuData:menuData,
  systemKey: null,
  systemName: '管网地理信息系统',
};

if (localStorage.getItem('system-config')) {
  systemConfig = JSON.parse(localStorage.getItem('system-config'));
}

export default {
  namespace: 'system',
  state: systemConfig,
  effects: {
    *fetch({ payload }, { call, put }) { 
      yield put({ type: 'updateMenu' ,payload});
    },
  },
  reducers: {
    changeSystem(state, { payload }) {
      localStorage.setItem('system-config', JSON.stringify({ ...state, ...payload }));
      return {
        ...state,
        ...payload,
      };
    },
    updateMenu(state, { payload }) {
      state.menuData = payload
      return{
        ...state
      }
    }
  },
};
