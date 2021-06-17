import request from "../utils/request";
import config from '../config';
export default {
    /**
     * 组织架构管理
     */
    //获取组织架构机构树 
    treeWithAllChain: (params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/treeWithAllChain`, method: 'GET', params});
    },
    //获取机构树 
    getOrganizaTree: (params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/tree`, method: 'GET', params});
    },
    // 新增或修改组织架构
    updateOrganizaTree:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/addOrUpdate`, method: 'POST', data:params});
    },
    // 停用/启用组织架构
    operateOrganizaTree:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/operateStatus`, method: 'POST', data:params});
    },
    // 删除组织架构
    deleteOrganizaTree:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/${params.id}`, method: 'DELETE'});
    },
    // 获取组织架构详情
    detailOrganizaTree:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/${params.id}`, method: 'GET'});
    },
    // 获取机构第一层列表
    getOneOrganizationList:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/list`, method: 'GET',params});
    },
    //根据id获取机构树(带人员)  
    getTreeByIdUserList:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/treeById`, method: 'GET',params});
    },
    // 获取机构类型
    getOrganizationType:(params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/type`, method: 'GET',params});
    },

    /**
     * 人员管理
     */
    //用户列表 
    sysUserList: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/list`, method: 'GET', params});
    },
    //用户查询 
    sysUserPage: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/page`, method: 'GET', params});
    },
    // 新增或修改用户
    updateSysUser:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/addOrUpdate`, method: 'POST', data: params});
    },
    // 停用/启用用户
    operateSysUser:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/operateStatus`, method: 'POST', data: params});
    },
    // 删除用户
    deleteSysUser:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/delete/${params.id}`, method: 'DELETE'});
    },
    // 批量删除
    batchDeletSysUser:(params) => {
        return request({url:`${config.baseUrl}/jiahe/hsSysUser/deleteByIds`,method: 'DELETE',data: params})
    },
    // 修改密码
    fixUserPassword:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/password`, method: 'POST', data: params});
    },
    // 重置密码
    resetUserPassword:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/reset/${params.id}`, method: 'GET'});
    },
    // 获取用户信息详情
    detailSysUser:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysUser/${params.id}`, method: 'GET'});
    },

    /**
     * 角色权限管理
     */
    //获取角色树 
    sysRoleTree: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRole/groupRoleTree`, method: 'GET', params});
    },
    //获取带组的角色树
    sysRoleTreeList: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRole/tree`, method: 'GET', params});
    },
    // 新增或修改角色
    updateSysRole:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRole/addOrUpdate`, method: 'POST', data: params});
    },
    // 删除角色
    deleteSysRole:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRole/${params.id}`, method: 'DELETE'});
    },
    // 获取角色组
    sysRoleTreeGroup: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRole/groupRoleTree`, method: 'GET', params});
    },
    //权限资源
    sysResource:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysResource/tree/${params.type}/${params.roleId}`, method: 'GET'});
    },
    //角色资源对应关系管理
    sysRoleResource:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysRoleResource/addOrUpdate`, method: 'POST', data: params});
    },

    /**
     * 字典管理
     */
    //获取列表 
    // sysDictionaryList: (params) => {
    //     return request({url: '${config.baseUrl}/hsSysDictionary/list', method: 'GET', params});
    // },
    //获取分页列表
    sysDictionaryPage: (params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysDictionary/page`, method: 'GET', params});
    },
    // 新增或修改
    updatesysDictionary:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysDictionary/addOrUpdate`, method: 'POST', data: params});
    },
    // 删除
    deletesysDictionary:(params) => {
        return request({url: `${config.baseUrl}/jiahe/hsSysDictionary/${params.id}`, method: 'DELETE'});
    },
    
    // 获取机构树(带人员)  
    organizationPeople: (params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/tree`, method: 'GET', params});
    },
    // 获取机构树  
    organizationTreeById: (params) => {
        return request({url: `${config.baseUrl}/jiahe/HsSysOrganization/treeById`, method: 'GET', params});
    },
    
    //获取窑井预警关联人员
    levelConcatUsers: (params) => {
        return request({url: `${config.baseUrl}/jiahe/alarm/getManHoleConcatUsers`, method: 'GET', params})
    },

    //获取管段预警关联人员
    flowConcatUsers: (params) => {
        return request({url: `${config.baseUrl}/jiahe/alarm/getLineConcatUsers`, method: 'GET', params})
    },

}