/**
 * Created by gyl on 2020/12/06.
 */
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import Link from 'umi/link';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import MyIcon from '../../../components/common/MyIcon';

const SubMenu = Menu.SubMenu;

@connect(({system}) => ({...system}))
class LeftNav extends Component {
  state = {
    selectedKeys: null,
    openKeys: [],
    setNavTop: '', // 导航样式
  };

  componentDidMount() {
    let {menuData} = this.props;
    this.setCurrentKey(menuData);
    this.getrootSubmenuKeys(menuData);
  }

  componentWillReceiveProps(nextProp) {
    let {menuData} = this.props;
    if (JSON.stringify(menuData) !== JSON.stringify(nextProp.menuData)) {
      this.setState({
        selectedKeys: null,
        openKeys: [],
      }, () => {
        this.setCurrentKey(nextProp.menuData);
      });
    }
  }

  setCurrentKey = (menuData) => {
    if (menuData) {
      const pathname = window.location.hash;
      let start = this.find(pathname, '/', 0);
      let end = this.find(pathname, '?', 0);
      const indexNav = pathname.substring(start, end > -1 ? end : pathname.length);
      if (indexNav && menuData && (indexNav.indexOf('#') > -1) === false) {
        this.queryKey(menuData, indexNav);
      }
    }
  };

  getrootSubmenuKeys = (menuData) => {
    if(menuData){
      let rootSubmenuKeys = []
      menuData.map((v,i)=>{
        rootSubmenuKeys.push(v.key)
      })
      this.setState({
        rootSubmenuKeys
      })
    }
  }

  find = (str, cha, num) => {
    let x = str.indexOf(cha);
    for (let i = 0; i < num; i += 1) {
      x = str.indexOf(cha, x + 1);
    }
    return x;
  };

  // 控制左边导航栏只展示一个父节点
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    // this.setState({ openKeys });
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  handleClick = ({key}) => {
    this.setState({
      selectedKeys: [key],
    });
  };

  queryKey = (menuItems, url) => {
    for (let i = 0; i < menuItems.length; i += 1) {
      if (menuItems[i].children && menuItems[i].url !== url) {
        this.queryKey(menuItems[i].children, url);
      } else {
        if (menuItems[i].url === url) {
          let {parentKey} = menuItems[i];
          let openKeys = parentKey.split("/");
          openKeys.pop();
          this.setState({
            selectedKeys: [menuItems[i].key],
            openKeys
          });
          break;
        }
      }
    }
  };

  // 菜单渲染
  setMenu = (data,level = 1) => {
    if (data !== null) {
      return data.map(item => {
        if (item.children && item.children.length) {
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  {
                  item.icon?<MyIcon type={item.icon} className={styles.menuItemIcon}/>
                  :<Icon className={styles.navItem} type="double-right"/>
                  }
                  <span className={styles['wp-nav-font']}>{item.name}</span>
                </span>
              }>
              {this.setMenu(item.children,level+1)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={item.key} title={item.name}>
              <Link to={item.url}>
                {level<3?<Icon className={styles.navItem} type="double-right"/>:null}
                <span className={styles['wp-nav-font']}>{item.name}</span>
              </Link>
            </Menu.Item>
          );
        }
      });
    }
  };

  render() {
    let t = this;
    const {selectedKeys, openKeys} = t.state;
    let {theme, mode, className, menuData,collapsed} = this.props;
    let myOpenKeys = openKeys
    if(collapsed){
      myOpenKeys = []
    }
    return (
      <div className={`${styles.nav} ${collapsed?styles.collapsedNav:null} ${className}`}>
        <Menu
          theme={theme}
          mode={mode || 'inline'}
          selectedKeys={selectedKeys}
          onClick={t.handleClick}
          onOpenChange={t.onOpenChange}
          openKeys={myOpenKeys}
          defaultOpenKeys={openKeys}
          inlineCollapsed={collapsed}
        >
          {menuData && this.setMenu(menuData)}
        </Menu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps)(LeftNav));
