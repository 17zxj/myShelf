import PublicService from "../services/PublicService";
import "isomorphic-fetch";
import Util from "./Util";
import router from 'umi/router';

require("es6-promise").polyfill();

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  // token超期
  if (response.status === 401) {
    return router.push({
      pathname: "/Login",
      state: {
        loginOut: true,
        message: "登录过期，请重新登录",
        messageType: "error"
      }
    });
  }

  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function transformRequestData(data) {
  let obj = deleteUndefindeProps(data);
  return Util.isObject(obj) ? JSON.stringify(obj) : obj;
}

function deleteUndefindeProps(Obj) {
  let newObj;
  if (Obj instanceof Array) {
    newObj = []; // 创建一个空的数组
    let i = Obj.length;
    while (i--) {
      newObj[i] = deleteUndefindeProps(Obj[i]);
    }
    return newObj;
  } else if (Obj instanceof Object) {
    newObj = {}; // 创建一个空对象
    for (let k in Obj) {
      // 为这个对象添加新的属性
      newObj[k] = deleteUndefindeProps(Obj[k]);
    }
    return newObj;
  } else {
    return Util.isUndefined(Obj) ? null : Obj;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {object} [controller] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(options) {
  if (!Util.isObject(options)) {
    throw new Error("Http request configuration must be an object");
  }
  if (!Util.isString(options.url)) {
    throw new Error("Http request configuration url must be a string");
  }
  options.method = options.method || "GET";
  let params = PublicService.paramSerializer(options.params);
  if (params) options.url = `${options.url}?${params}`;
  if (options.method && options.method.toLowerCase() === "export") {
    window.location = options.url;
    return {};
  }
  let opt = {};
  for (let k in options) {
    if (k !== "params") {
      opt[k] = options[k];
    }
  }

  let headers;
  if (!opt.headers) {
    let token = PublicService.getCookie("token");
    opt.headers = opt.headers || {};
    headers = new Headers({
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=UTF-8",
      token: token,
      ...opt.headers
    });
  }

  opt.headers = headers;
  opt.credentials = "include"; // 发送请求时带cookie
  opt.body = opt.data ? transformRequestData(opt.data) : opt.form;
  if (options.signal) {
    /**
     * 中断请求示例:
     *  let controller = new AbortController(); // AbortController()存在兼容性问题IE不支持
     *  opt.signal = options.signal
     *  controller.abort(); // 取消请求
     */

    opt.signal = options.signal;
  }

  // 请求地址加入公共路径
  return fetch(options.url, opt)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      return data;
    })
    .catch(err => {
      return {rc: 0, err: '接口请求失败！失败原因：' + err};
    });
}
