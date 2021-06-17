/**
 * @description 登录页
 */


import React from "react";
import Vcode from "react-vcode";
import { Icon, message, Switch,Checkbox  } from "antd";
import { setCookie, getCookie, deleteCookie } from "./cookie";
import request from "../../utils/requestFormData";
import styles from './index.less'
import { connect } from "dva";
import md5 from "blueimp-md5";
import config from '../../config';
import router from 'umi/router';
import MyIcon from "../../components/common/MyIcon";



const codes = [
  // 所有可能出现的字符
  // 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  // 'o', 'p', 'q', 'r', 's', 't', 'x', 'u', 'v', 'y', 'z', 'w', 'n',
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
];
let positionX = 0;
let positionY = 0;
@connect(({system}) => ({...system}))
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "", // 用户名
      password: "", // 密码
      code: "", // 验证码
      VcodeValue: "", // 图形验证码默认值
      VCkey: "", //刷新验证码
      remberPass: false, // 默认不记住密码
      loading: false, // loding默认不显示
      isChange: false, // 无修改
      S: null,
      // 登录框显示状态
      isShowLogin:false,
      // 判断是否为大屏?
      isBigScreen:false
      // isBigScreen:true
    };
  }

  componentWillMount() {
    const user = getCookie("username");
    const pass = getCookie("password");
    const rember = getCookie("remberPass");
    localStorage.removeItem("menuData");
    // 假如cookie中存有用户信息，默认有用户名和密码
    if (user && pass) {
      this.setState({
        userName: user,
        password: pass,
        remberPass: rember
      });
    } else {
      this.setState({
        userName: "",
        password: "",
        remberPass: false
      });
    }
  }

  /*
   * 获取验证码
   */
  getVcode = v => {
    this.setState({
      VcodeValue: v
    });
  };

  /*
   * 切换记住密码状态
   */
  changeSwitch = checked => {
    this.setState({
      remberPass: checked
    });
  };

  /*
   * input失焦事件
   */
  changeInput = (e, name) => {
    if (e.target.type === "password") {
      this.setState({
        isChange: true
      });
    }
    this.setState({
      [name]: e.target.value
    });
  };

  /*
   * 登录
   */
  login = e => {
    e.preventDefault();
    // sessionStorage.setItem('token', '19477c98-1e13-476a-b984-97e0b2070ccb');
    const {
      userName,
      password,
      code,
      VcodeValue,
      remberPass,
    } = this.state;
    const {dispatch} = this.props;
    let pass = getCookie("password");
    if (code !== VcodeValue) {
      // 假如输入的验证码和图形验证数值不匹配，则返回错误提示
      this.setState({
        // 清空验证码
        code: "",
        VCkey: this.state.VcodeValue
      });
      message.error("验证码错误");
      return;
    }
    let p = "";
    /*
     * 判断cookie是否存有密码，没有md5加密传输
     * cookie要是有密码，再判断密码框是否修改isChange为true
     * 修改了的话md5加密，没有的话直接传输cookie里的密码
     */
    if (pass) {
      // if (isChange) {
      // p = md5(password);
      p = password;
      // } else {
      //   p = pass;
      // }
    } else {
      // p = md5(password);
      p = password;
    }
    const data = new FormData();
    data.append("username", userName);
    data.append("password", p);
    this.setState({
      loading: true // 显示loading
    });
    const headers = new Headers({
      Accept: "*/*"
      // "Content-Type": "multipart/form-data"
    });
    request({url: `${config.baseUrl}/jiahe/authentication/login`, method: "POST", form: data, headers}).then(res => {
      if (res.code === 0) {
        this.setState({
          loading: false // 隐藏loading
        });
        sessionStorage.setItem("isLogin", true);
        setCookie("isLogin", true);
        //保存权限
        // res.data.resourcesDTO.webDTOs[0].hasAuthority=false;
        // console.log(res.data)
        const stringMenus = JSON.stringify(res.data.resourcesDTO);
        sessionStorage.setItem("menu", stringMenus);
        // 保存姓名
        sessionStorage.setItem("realName",res.data.realName)
        sessionStorage.setItem("peopleName", res.data.username);
        // 保存角色
        const roles = JSON.stringify(res.data.roles)
        sessionStorage.setItem("role",roles)
        // 保存userId
        sessionStorage.setItem("userId",res.data.id);
        // 组织机构id
        const unitId = JSON.stringify(res.data.unitId)
        sessionStorage.setItem("unitId",unitId);

        if (remberPass) {
          // 选中记住密码，过期时间设置为14天
          setCookie("username", userName, 14);
          setCookie("password", password, 14);
          setCookie("remberPass", remberPass, 14);
        } else {
          // 没选中记住密码
          const user = getCookie("username");
          pass = getCookie("password");
          const rember = getCookie("remberPass");
          deleteCookie("username", user);
          deleteCookie("password", pass);
          deleteCookie("remberPass", rember);
          setCookie("username", userName, 14);
        }
        
        sessionStorage.setItem("token", res.data.token);
        setCookie("token", res.data.token);
        sessionStorage.setItem("loginId", res.data.id);
        const stringDept = res.data.dept ? JSON.stringify(res.data.dept) : "";
        sessionStorage.setItem("dept", stringDept);

        this.defaultRoute = "";

        let {resource} = res.data;
        if (resource) {
          let {webResource} = resource;
          if (webResource) {
            webResource.map((item)=>{
              this.getMenu(item);
              this.getDefaultMenu(item)
            })
            localStorage.setItem("menuData", JSON.stringify(webResource));
            dispatch({
              type:'system/fetch',
              payload:webResource
            })
          } else {
            // router.push({pathname: '/RolePermissions'});
            message.error("该用户角色未绑定菜单！")
          }
        } else {
          message.error("该用户角色未绑定菜单！")
        }
        // router.push({pathname: '/GisMap'});
        router.push({pathname: this.defaultRoute});
      } else {
        message.error(res.message);
        // 隐藏loading
        this.setState({ loading: false });
      }
      return false;
    });
  };

  // 获取默认显示的路由
  getDefaultMenu = (data) => {
    let {route, children} = data;
    if (route && !this.defaultRoute) {
      this.defaultRoute = route;
    }
    if (children && children.length) {
      children.map(item => {
        this.getDefaultMenu(item)
      })
    }
  };

  // 获取系统的路由
  getMenu = (data, parentKey) => {
    let { name, id, children, icon, route } = data;
    data.title = name;
    data.key = id;
    data.url = route;
    if (!icon) {
      parentKey = parentKey ? parentKey + "/" + id : id;
    }
    data.parentKey = parentKey;
    children = children.filter(item => item.type != 3);
    if (children && children.length) {
      children.map(item => {
        this.getMenu(item, parentKey)
      })
    }
    return data;
  }

  onMouseOver = e => {
    var x = e.clientX,
      y = e.clientY;
    if (positionX === 0 && positionY === 0) {
      positionX = x;
      positionY = y;
    }
    let S;
    if (x > positionX) {
      S = {
        transform: "route(15deg)"
      };
    } else if (x < positionX) {
      S = {
        transform: "route(-15deg)"
      };
    }
    this.setState({
      S
    });
  };
  clickLoginHandler = () =>{
    this.setState({
      isShowLogin:true
    })
  }
  render() {
    const { userName, password, remberPass, code, loading, S ,isShowLogin,isBigScreen} = this.state;
    return (
      <div style={isBigScreen?{width:5760,position:'relative'}:null}>
        <div className={styles.videoFixed}>
          {/* <video autoPlay="autoplay" src={require('../../assets/login/video.mp4')} style={{width:'100%',height:'100vh'}}/> */}
        </div>
      <div className={isBigScreen?styles.loginBoxBig:styles.loginBox} onMouseOver={this.onMouseOver}>
        {/* <video src={require('../../assets/login/video.mp4')} autoPlay loop style={{ position: 'fixed', width: '1920px', height:'1080px', left: 0, top: 0, bottom: 0, }} /> */}
        <div className={styles.loginMain}>
            <div className={styles.loginRight}>
              <div className={styles.loginForm}>
                <form autoComplete={styles.on}>
                  <span className={styles.loginLabel}>
                    <span>
                      <span className={styles.myIcon}>
                      <MyIcon type="icon-yonghu" style={{fontSize:'22px'}}/>
                      </span>
                      <input
                        type="text"
                        autoComplete="on"
                        autoFocus="autofocus"
                        placeholder="请输入用户名"
                        defaultValue={userName}
                        onBlur={e => {
                          this.changeInput(e, "userName");
                        }}
                      />
                    </span>
                  </span>
                  <span className={styles.loginLabel}>
                    <span>
                      <span className={styles.myIcon}>
                        <MyIcon type="icon-suo" style={{fontSize:'22px'}}/>
                      </span>
                      <input
                        type="password"
                        autoComplete="off"
                        placeholder="请输入密码"
                        defaultValue={password}
                        onBlur={e => {
                          this.changeInput(e, "password");
                        }}
                      />
                    </span>
                  </span>
                  <span className={`${styles.loginLabel} ${styles.disFlex}`}>
                    <span>
                      <input
                        type="text"
                        value={code}
                        placeholder="请输入验证码"
                        onChange={e => {
                          this.changeInput(e, "code");
                        }}
                        className={styles.vcodeInput}
                      />
                    </span>
                    <span className={styles.Vcode}>
                      <Vcode
                        length={4}
                        width={116}
                        height={52}
                        onChange={v => {
                          this.getVcode(v);
                        }}
                        options={{ codes }}
                        key={this.state.VCkey} 
                        style={{ background: "#F1F9FF", color: "#FFFFFF",border: "1px solid #D8D8D8"}}
                        ref={ref=>{this.code = ref}}
                      />
                      <div className={styles.codeCover}></div>
                      <span style={{display:'inline-block',height:'75%'}} onClick={()=>{this.code.onClick()}}>
                      <MyIcon type="icon-shuaxin" style={{width:'27px',height:'26px',color:'#9D9D9D',marginLeft:'20px',fontSize: '27px'}}/>
                      </span>
                    </span>
                  </span>
                  <div
                    className={styles.loginLodingBox}
                    style={{ display: loading ? "flex" : "none" }}
                  >
                    <div className={styles.lineScalePulseOut}></div>
                  </div>
                  <input
                    type="submit"
                    className={styles.loginButton}
                    style={{ display: loading ? "none" : "block" }}
                    onClick={this.login}
                    value="登录"
                  />
                </form>
              </div>
            </div>
        </div>
        <div className="loginBottom">
          {/* <span>技术支持: 苏州市伏泰信息科技有限公司</span> */}
        </div>
      </div>
      </div>
    );
  }
}

export default Login;
