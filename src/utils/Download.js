import {message} from "antd";
import PublicService from "../services/PublicService";

function Download(url, params, method) {
  let hide = message.loading('下载中...', 0);
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      resolve(xhr);
    };
    xhr.onerror = reject;

    let token = PublicService.getCookie('token');
    if (method === "POST") {
      xhr.open("post", url, true);
      xhr.setRequestHeader('token', token);
      xhr.setRequestHeader("Content-Type", "application/json");
      let data = JSON.stringify(params);
      xhr.send(data);
    } else {
      if (params) {
        xhr.open('GET', url + '?' + PublicService.paramSerializer({
          ...params,
        }));
      } else {
        xhr.open('GET', url);
      }

      xhr.setRequestHeader('token', token);
      xhr.setRequestHeader("Content-Type", "charset=UTF-8");
      xhr.send();
    }
  }).then(xhr => {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    let header = xhr.getResponseHeader('Content-Disposition');
    if (header) {
      let fileName = header.split("filename=")[1]; // 文件后缀
      let type = xhr.getResponseHeader('Content-Type');

      if (type && type.indexOf("UTF-8") !== -1) {
        a.download = decodeURIComponent(fileName);
      } else {
        let iconV = require('iconv-lite'); // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
        iconV.skipDecodeWarning = true; //忽略警告
        fileName = iconV.decode(fileName, 'UTF-8'); // '"xxx"'
        if (fileName[0] === '"') {
          fileName = fileName.split('"')[1];
        }
        a.download = fileName;
      }
    }
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    hide();
    return xhr;
  });
}

export default Download;
