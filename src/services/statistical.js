/**
 * 全局统计
 */

import request from "../utils/request";
import config from '../config';

export default {
    // 管材统计
    getGC:(params)=>{
        return request({
            url:`${config.baseUrl}/jiahe/basicStatistic/textureStatistic`,method:'GET',params
        })
    },
    // 管径
    getGJ:(params)=>{
        return request({
            url:`${config.baseUrl}/jiahe/basicStatistic/dsStatistic`,method:'GET',params
        })
    },
    // 管龄
    getGL:(params)=>{
        return request({
            url:`${config.baseUrl}/jiahe/basicStatistic/ageStatistic`,method:'GET',params
        })
    }
}