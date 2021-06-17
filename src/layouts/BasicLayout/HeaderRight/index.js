import React from 'react';
import { Icon, Dropdown, Avatar, Menu, Badge, message } from 'antd';
import styles from './index.less';
import config from '@/config';
import FormModal from "../../../components/common/FormModal"
import request from "../../../utils/requestFormData";

const HeaderRight = ({ systemData = [], systemKey, onSelect, theme, onTheme, loginOut, editPassword, showEditModal, changeVisible }) => {

  // 渲染系统切换
  const renderSystem = () => {
    const menu = (
      <Menu className={styles.menu} selectedKeys={[systemKey]}>
        {
          systemData.map(item => (
            <Menu.Item key={item.key} children={item.children} onClick={onSelect.bind(this, item)}>
              <Icon type={item.icon} />
              {item.name}
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          切换系统
          <Icon type="caret-down" style={{ fontSize: 10, marginLeft: 6 }} />
        </span>
      </Dropdown>
    )
  };


  const renderEditModal = () => {
    let passwordForm = null;
    const validateToNextPassword = (rule, value, callback) => {
      if (value && passwordForm.props.form.getFieldValue("confirmPass")) {
        passwordForm.props.form.validateFields(['confirmPass'], { force: true });
        callback();
      }else{
        callback();
      }
    };
    const compareToFirstPassword = (rule, value, callback) => {
      if (value && value !== passwordForm.props.form.getFieldsValue()['newPass']) {
        callback('两次输入的密码不一致!');
      } else {
        callback();
      }
    };

    let modalItems = [
      {
        type: "password",
        label: "原始密码",
        paramName: "oldPass",
        rules: [config.reg.required],
        span: 24,
        labelCol: 6,
        wrapperCol: 18
      },
      {
        type: "password",
        label: "新密码",
        paramName: "newPass",
        rules: [config.reg.required,config.reg.numAndEnAndsy,
        {
          validator: validateToNextPassword,
        },],
        span: 24,
        labelCol: 6,
        wrapperCol: 18
      },
      {
        type: "password",
        label: "确认新密码",
        paramName: "confirmPass",
        rules: [config.reg.required,config.reg.numAndEnAndsy
          , {
          validator: compareToFirstPassword,
        }
        ],
        span: 24,
        labelCol: 6,
        wrapperCol: 18
      }
    ];

    // 关闭弹窗
    const modalCancel = () => {
      passwordForm.props.form.resetFields()
      changeVisible()
    };
    const onModalSave = () => {
      passwordForm.props.form.validateFields((err,values)=>{
        if(err){
          return
        }
        let data ={
          newPass: values['newPass'],
          oldPass: values['oldPass'],
          id: sessionStorage.getItem("userId")
        }
        const headers = new Headers({
          Accept: "*/*",
          "Content-Type": "application/json;charset=UTF-8",
          token: sessionStorage.getItem("token")
        });
        request({ url: `${config.baseUrl}/jiahe/hsSysUser/password`, method: "POST",data:{...data },headers }).then(res => {
          if (res.code == 0) {
            message.success("修改密码成功");
            modalCancel();
          }else{
            message.error(res.message || "修改失败，请稍后再试！",2)
          }
        });
      })
      
    }
    const formConfig = {
      footerShow: true,
      footerTitle: "确定",
      cancelBtn: true,
      visible: showEditModal,
      modalBtnLoading: false,
      title: `修改密码`,
      onCancel: modalCancel,
      onModalSave: onModalSave
    }
    return <FormModal
      width={420}
      formConfig={formConfig}
      items={modalItems}
      modalBtnLoading={false}
      wrappedComponentRef={ref => passwordForm = ref}
    />
  }

  // 渲染个人信息
  const renderInfo = () => {
    const realName = sessionStorage.getItem("realName")
    let colorList = [
      { key: 'sunset', text: '日暮', color: '#fe7e27' },
      { key: 'cyan', text: '明青', color: '#14c2d1' },
      { key: 'green', text: '极光绿', color: '#00b73c' },
      { key: 'daybreak', text: '拂晓蓝(默认)', color: '#1890ff' },
      { key: 'purple', text: '酱紫', color: '#665eff' },
    ];

    const onClick = ({ key }) => {
      if (key === "logout") {
        loginOut()
      } else if (key === "edit") {
        changeVisible();
      } else {
        onTheme(key)
      }
    };
    const menu = (
      <Menu className={styles.menu} selectedKeys={[theme]} onClick={onClick}>
        {/* <Menu.SubMenu
          key="sub1"
          title={<span><Icon type="skin" /><span>主题切换</span></span>}>
          {
            colorList.map(({ key, color, text }) => (
              <Menu.Item key={key}><Badge color={color} text={text} /></Menu.Item>
            ))
          }
        </Menu.SubMenu> */}
        <Menu.Divider />
        <Menu.Item key="edit">
          <Icon type="form" />
          修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar}
            src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
          {realName}
          <Icon type="caret-down" style={{ fontSize: 10, marginLeft: 6 }} />
        </span>
      </Dropdown>
    )
  };

  return (
    <div className={`${styles.right}`}>
      {/* {renderSystem()} */}
      {renderInfo()}
      {renderEditModal()}
    </div>
  );
};


export default HeaderRight;
