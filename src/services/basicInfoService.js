import request from "../utils/request";
import config from '../config';

export default {
    // 获取安装窨井
    getManhole:(params)=>{
        return request({url:`${config.baseUrl}/jiahe/pullDown/getNotBindManhole`,method:"GET",params});
    },
    // 获取窨井关联安装管段
    getPipeline:(params)=>{
        return request({url:`${config.baseUrl}/jiahe/pullDown/getConcatLine`,method:"GET",params});
    },
    // 获取关联管段
    getConcatLine:(params)=>{
        return request({url:`${config.baseUrl}/jiahe/pullDown/getFlowNotConcatLine`,method:"GET",params});
    },
    
    // 液位站
    // 安装窨井
    getLevelManhole:(params)=>{
        return request({url:`${config.baseUrl}/jiahe/pullDown/getLevelNotBindManhole`,method:"GET",params});
    },
    // 关联窨井
    getLevelConcatManhole: (params) => {
        return request({url:`${config.baseUrl}/jiahe/pullDown/getLevelNotConcatPoint`,method:"GET",params});
    },

    // 检查井
    getPoint: (params)=>{
        return request({url:`${config.baseUrl}/jiahe/pullDown/getReceivePoint`,method:"GET",params});
    }
}