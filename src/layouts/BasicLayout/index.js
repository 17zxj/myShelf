import React, {Component} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import {Layout, Icon, message} from 'antd';
import styles from './index.less';
import LeftNav from './LeftNav';
import HeaderRight from './HeaderRight';
import Breadcrumbs from "./Breadcrumbs";
import App from "../index";
import request from "../../utils/requestFormData";
import config from '../../config';
import sysIcon from '../../assets/images/sysIcon.png';
import { getCookie } from '../../pages/Login/cookie';

const {Header, Sider, Content} = Layout;

class BasicLayout extends Component {

  state = {
    collapsed: false,
    showEditModal: false
  };

  componentWillMount() {
  }

  componentDidMount() {
    let width = document.body.clientWidth;
    if (width < 1500) {
      this.setState({
        collapsed: true,
      });
    }
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // 渲染标题
  renderLogo = () => {
    return (
      <div className={styles.logo}>
        <div className={styles.logoWrap}>
          {/* <Icon type="info"/> */}
        </div>
        <div className={styles.logoText}>管网地理信息系统</div>
      </div>
    );
  };

  // 渲染面包屑
  renderBreadcrumb = () => {
    const t = this;
    let {collapsed} = t.state;
    return (
      <div className={styles.breadcrumbWrap}>
        <div className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
        </div>
        <div className={styles.breadcrumb}>
          <Breadcrumbs/>
        </div>
      </div>
    )
  };

  // 选择
  onSelect = (item) => {
    let {key, name, children, href} = item;

    let nextState = {};
    if (name === "综合管控平台") {
      nextState = {cockpitKey: "/cockpit/overview"}
    }
    this.props.dispatch({
      type: 'system/changeSystem',
      payload: {systemKey: key, systemName: name, menuData: children, ...nextState},
    });
    router.push(href);
  };

  // 主题切换
  changeSetting = (key, value) => {
    const {setting, dispatch} = this.props;
    let nextSetting = {...setting};
    nextSetting[key] = value;
    dispatch({
      type: 'setting/changeSetting',
      payload: {...nextSetting},
    });
  };

  // 退出登录
  loginOut = () => {
    request({url: `${config.baseUrl}/jiahe/authentication/logout`, method: "POST"}).then(res => {
        if(res.code==0){
          message.success("退出登录")
          router.push({pathname: '/Login'});
          sessionStorage.clear();
          localStorage.clear();
        }
    });
  };
  // 展示修改密码弹框
  changeVisible =() => {
    let { showEditModal } = this.state;
    this.setState({showEditModal: !showEditModal})
  }
  editPassword = () =>{
    
  }

  render() {
    let t = this;
    const {collapsed, showEditModal} = t.state;
    const {setting, system, children} = this.props;
    const {systemData, systemKey} = system;
    const {theme, navTheme} = setting;
    return (
      <App>
        <Layout>
          <Header className={`${styles.header}`}>

            {t.renderLogo()}

            <HeaderRight
              systemData={systemData}
              systemKey={systemKey}
              onSelect={t.onSelect}
              theme={theme}
              onTheme={color => this.changeSetting('theme', color)}
              changeVisible={t.changeVisible}
              showEditModal={showEditModal}
              editPassword={t.editPassword}
              loginOut={t.loginOut}/>
          </Header>
          <Layout>
            <Sider
              width="240"
              className={styles.sidebar}
              trigger={null}
              collapsible
              theme={navTheme}
              collapsed={collapsed}>
              <LeftNav theme={navTheme} collapsed={collapsed}/>
            </Sider>
            <Layout>
              <Content className={styles.contentWrap}>
                {t.renderBreadcrumb()}
                <div className={styles.content}>
                  {children || <h1>此处为你的组件</h1>}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </App>
    );
  }
}

export default withRouter(connect(({setting, system}) => ({
  setting,
  system,
}))(BasicLayout));
