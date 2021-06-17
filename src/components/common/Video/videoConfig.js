export default {
  RTMP: {
    // file: "rtmp://218.108.105.18:10935/hls/stream_4", // <—rtmp直播地址
    reconnecttime: 5, // rtmp直播的重连次数
    bufferlength: 1 // 缓冲多少秒之后开始播放 默认1秒
  },
  MP4: {
    file: "http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.mp4", // 播放地址
    image: "http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.jpg", // 预览图
    starttime: 0, // 视频开始播放时间点(单位s)，如果不设置，则可以从上次播放时间点续播
    playlist: [ // 播放列表设置
      {
        sources: [{file: "http://content.bitsontherun.com/videos/bkaovAYt-52qL9xLP.mp4"}],
        title: "视频1"
      },
      {
        sources: [{file: "http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.mp4"}],
        title: "视频2"
      }
    ],
  },
  HLS: {
    isLive: true, // 必须设置，表明是直播视频
    // file: "http://cyberplayer.bcelive.com/videoworks/mda-kbuhu4wqdi08dwix/cyberplayer/hls/cyberplayer-demo.m3u8", // hls播放地址（×一定要支持跨域访问，否则要设置primary参数）
    // image: "http://cyberplayer.bcelive.com/thumbnail.jpg", // 视频截图
    hls: {
      reconnecttime: 5 // hls直播重连间隔秒数
    },
    // primary: "flash", // 强制使用flash来播放，不设置的话则默认高优使用H5进行播放
  },
}
