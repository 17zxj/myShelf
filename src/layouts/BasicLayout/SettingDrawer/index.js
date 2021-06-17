import React, { PureComponent } from 'react';
import { Drawer, List, Switch, Divider, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import ThemeColor from './ThemeColor';
import BlockChecbox from './BlockChecbox';

const Body = ({ children, title, style }) => (
  <div style={{ ...style, marginBottom: 24 }}>
    <h3 className={styles.title}>{title}</h3>
    {children}
  </div>
);

@connect(({ setting }) => ({ setting }))
class SettingDrawer extends PureComponent {
  state = {
    collapse: false,
  };

  changeSetting = (key, value) => {
    const { setting } = this.props;
    const nextState = { ...setting };
    nextState[key] = value;
    this.setState(nextState, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'setting/changeSetting',
        payload: this.state,
      });
    });
  };

  togglerContent = () => {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  };

  render() {
    const { setting } = this.props;
    const { navTheme, theme, layout, colorWeak, cockpitDark } = setting;
    const { collapse } = this.state;
    return (
      <Drawer
        visible={collapse}
        width={300}
        onClose={this.togglerContent}
        placement="right"
        handler={
          <div className={styles.handle}>
            <Icon
              type={collapse ? 'close' : 'setting'}
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          </div>
        }
        onHandleClick={this.togglerContent}
        style={{
          zIndex: 999,
        }}
      >
        <div className={styles.content}>
          <Body title={'整体风格设置'}>
          <BlockChecbox
            list={[
              {
                key: 'dark',
                url: 'https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg',
                title: '暗色菜单风格',
              },
              {
                key: 'light',
                url: 'https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg',
                title: '亮色菜单风格',
              },
            ]}
            value={navTheme}
            onChange={value => this.changeSetting('navTheme', value)}
          />
          </Body>

          <ThemeColor
            title={'主题色'}
            value={theme}
            onChange={color => this.changeSetting('theme', color)}
          />

          <Divider/>

          <Body title={'导航模式'}>
          <BlockChecbox
            list={[
              {
                key: 'sideMenu',
                url: 'https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg',
                title: '侧边菜单布局',
              },
              {
                key: 'topMenu',
                url: 'https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg',
                title: '顶部菜单布局',
              },
            ]}
            value={layout}
            onChange={value => this.changeSetting('layout', value)}
          />
          </Body>

          <Divider/>

          <Body title={'其他配置'}>
          <List.Item
            actions={[
              <Switch
                size="small"
                checked={!!colorWeak}
                onChange={checked => this.changeSetting('colorWeak', checked)}
              />,
            ]}
          >
            色弱模式
          </List.Item>
          <List.Item
            actions={[
              <Switch
                size="small"
                checked={!!cockpitDark}
                onChange={checked => this.changeSetting('cockpitDark', checked)}
              />,
            ]}
          >
            暗色模式
          </List.Item>
          </Body>
          <Divider/>
        </div>
      </Drawer>
    );
  }
}

export default SettingDrawer;
