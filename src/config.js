// console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
export default {
  baseUrl:'',
  pageSize: 20,
  size: "small",
  reg: {
    required: {
      required: true,
      message: '必填',
    },
    phone: {
      pattern: /^1((3[\d])|(4[5,6,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[1-3,5-8])|(9[1,8,9]))\d{8}$/,
      message: '请填写正确的手机号码',
    },
    phone2: {
      pattern: /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))|([1-9]\d{4}\b)$/,
      message: '请填写正确的手机或座机号码',
    },
    positiveInteger: {
      pattern: /^[1-9]\d*$/,
      message: '请填写正整数',
    },
    integer: {
      pattern: /^[0-9]\d*$/,
      message: '请填写非负整数',
    },
    price: {
      pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
      message: '请填写正确的钱数',
    },
    long: {
      pattern: /^(-?\d+)(\.\d+)?$/,
      message: '请填写正确的数值',
    },
    space: {
      pattern: /^\S*$/,
      message: '请勿输入空格',
    },
    lengthMax: {
      max: 200,
      message: '超出最大字数限制',
    },
    absLong: {
      pattern: /^(\d+)(\.\d+)?$/,
      message: '请填写大于等于的0的数字',
    },
    long1: {
      pattern: /(^[1-9]\d*(\.\d{0,1})?$)|(^0(\.\d{0,1})?$)/,
      message: '保留一位小数',
    },
    long2: {
      pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
      message: '保留两位小数',
    },
    long3: {
      pattern: /(^[1-9]\d*(\.\d{1,3})?$)|(^0(\.\d{1,3})?$)/,
      message: '保留三位小数',
    },
    long5: {
      pattern: /(^[1-9]\d*(\.\d{1,5})?$)|(^0(\.\d{1,5})?$)/,
      message: '保留五位小数',
    },
    long6: {
      pattern: /(^[1-9]\d*(\.\d{1,6})?$)|(^0(\.\d{1,6})?$)/,
      message: '保留六位小数',
    },
    date: {
      pattern: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
      message: '日期格式应为：2018-01-01',
    },
    coordinates: {
      pattern: /^(\-|\+)?\d+(\.\d+)?(,(\-|\+)?\d+(\.\d+)?)$/,
      message: '格式错误,例:‘经度’,‘纬度’',
    },
    three: {
      pattern: /^(\-|\+)?\d+(\.\d+)?(,(\-|\+)?\d+(\.\d+)?)(,(\-|\+)?\d+(\.\d+)?)(,(\-|\+)?\d+(\.\d+)?)$/,
      message: '格式错误,例:‘x’,‘y’,‘z’,‘fov’',
    },
    isURL: {
      pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
      message: '网址格式不正确',
    },
    zipCode: {
      pattern: /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/,
      message: '邮编格式不正确',
    },
    email: {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '邮箱格式不正确',
    },
    idCard: {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '身份证格式不正确',
    },
    ip: {
      pattern: /\d+\.\d+\.\d+\.\d+/,
      message: 'ip地址格式不正确',
    },
    chinese: {
      pattern: /^[\u4e00-\u9fa5]*$/,
      message: '中文',
    },
    numAndEn: {
      pattern: /^[0-9a-zA-Z]*$/,
      message: '只支持字母和数字'
    },
    numAndEnAndsy: {
      pattern: /^[0-9a-zA-Z_%&',;=!@#?$\x22]*$/,
      message: '只支持字母、数字和字符'
    }
  },
  // 编号非中文校验
  codeValidator:(rule, value, callback) =>{
    var reg = new RegExp('^[\u4E00-\u9FFF]+$')
    if (reg.test(value)) {
        callback("非中文")
    }else{
        callback()
    }
  },
  // 将数组分为n个一组 且上一个的最后一个作为下一个的第一个[[1,2],[2,3]]
  spArray: (n,arr) => {
    let newArr = [],i;
    for (i = 0;i < arr.length;) {
            if(i!==0){
                i=i-1
                newArr.push(arr.slice(i,i += n))
            }else{
                newArr.push(arr.slice(i,i += n))
            }
    }
    return newArr
  },
  arcGisOption: {
    url: 'https://js.arcgis.com/4.18/init.js', // 这里的API地址可以是官网提供的CDN，也可在此配置离线部署的地址
    css: 'https://js.arcgis.com/4.18/esri/css/main.css'
  },
  // 天地图key
  TDMapKey:'1ea900c5eb72fddfcb6d33312daa871d'
};
