/**
 * Created by GYL on 2019/1/22 Description: 百度视频插件
 */
import React, {Component} from "react";
import videoConfig from "./videoConfig";
import cyberplayer from "cyberplayer";

class Video extends Component {
  static defaultProps = {
    type: "HLS"
  };

  ID = this.props.ID || "video" + Math.floor(Math.random() * 1000);

  componentDidMount() {
    let {file, playlist} = this.props;
    if (file || playlist) {
      this.createVideo({file, playlist});
    }
  }

  createVideo = ({file, playlist}) => {
    let t = this;
    let {type} = t.props;
    this.player = cyberplayer(t.ID).setup({
      width: "100%", // 宽度
      height: "100%", // 高度
      controls: true, // 控制条
      autostart: true, // 自动播放
      starttime: 0, // 开始时间
      // stretching: "exactfit", // 铺满
      ...videoConfig[type], // 默认配置
      ...t.props,
      volume: 100, // 声音
      file, // 地址
      playlist, // 地址列表
      controlbar: { // logo
        barLogo: false
      },
      ak: "19cb66c2bc7748a281e0f4ef6788ebc2" // 公有云平台注册即可获得accessKey
    });
  };

  componentWillReceiveProps(nextProps, nextContent) {
    if (nextProps.file && nextProps.file !== this.props.file) {
      this.player && this.player.remove();
      this.createVideo({file: nextProps.file});
    }

    if (nextProps.playlist && nextProps.playlist !== this.props.playlist) {
      this.player && this.player.remove();
      this.createVideo({playlist: nextProps.playlist});
    }
  }

  componentWillUnmount() {
    this.player && this.player.remove();
  }

  render() {
    let {height = "100%"} = this.props;
    return (
      <div style={{width: "100%", height}}>
        <div id={this.ID}/>
      </div>
    );
  }
}

export default Video;
