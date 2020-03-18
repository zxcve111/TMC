import request from './request';
//  获取多语言资源
export function GetLanguageResource(data) {
    return request({
        url: '/api/System/GetLanguageResource',
        method: 'post',
        data,
    })
};

//  获取当前登录人有权限的菜单
export function GetUserMenuJurisdiction(data) {
    return request({
        url: '/api/System/GetUserMenuJurisdiction',
        method: 'post',
        data,
    })
};


//  获取角色列表
export function GetRolesList(data) {
    return request({
        url: '/api/System/GetRolesList',
        method: 'post',
        data,
    })
};

//  新增角色
export function CreateUpdRoles(data) {
    return request({
        url: '/api/System/CreateUpdRoles',
        method: 'post',
        data,
    })
};
//  删除角色
export function DelRoleById(data) {
    return request({
        url: '/api/System/DelRoleById',
        method: 'post',
        data,
    })
};

// 获取菜单
export function GetAllPages(data) {
    return request({
        url: '/api/System/GetAllPages',
        method: 'post',
        data
    })
};

// 获取角色菜单权限
export function GetPagePression(data) {
    return request({
        url: '/api/System/GetPagePression',
        method: 'post',
        data
    })
};

// 设置角色菜单权限
export function SetPagePression(data) {
    return request({
        url: '/api/System/SetPagePression',
        method: 'post',
        data
    })
};

// 获取人员列表
export function GetUserList(data) {
    return request({
        url: '/api/System/GetUserList',
        method: 'post',
        data
    })
};

// 获取人员列表
export function GetAllOrganizationToTree(data) {
    return request({
        url: '/api/System/GetAllOrganizationToTree',
        method: 'post',
        data
    })
};


//设置用户角色
export function SetUserRoles(data) {
    return request({
        url: '/api/System/SetUserRoles',
        method: 'post',
        data
    })
};

//保存/编辑申请单
export function SaveApplyOrder(data) {
    return request({
        url: '/api/Apply/SaveApplyOrderNew',
        method: 'post',
        data
    })
};

//获取申请列表
export function GetApplyOrderList(data) {
    return request({
        url: '/api/Apply/GetApplyOrderList',
        method: 'post',
        data
    })
};


//获取申请列表
export function GetApplyOrderDetail(data) {
    return request({
        url: '/api/Apply/GetApplyOrderDetail',
        method: 'post',
        data
    })
};


//删除申请
export function DelApplyOrder(data) {
    return request({
        url: '/api/Apply/DelApplyOrder',
        method: 'post',
        data
    })
};


//根据fileId获取文件内容
export function GetFileInfoByFileId(data) {
    return request({
        url: '/api/Apply/GetFileInfoByFileId',
        method: 'post',
        data
    })
};

//JWT单点登录
export function JWTLogin(data) {
    return request({
        url: '/api/System/JWTLogin',
        method: 'post',
        data
    })
};

//JWT单点登录
export function Login2Amex(data) {
    return request({
        url: '/api/System/Login2Amex',
        method: 'post',
        data
    })
};
//获取人员角色
export function GetUserRoles(data) {
    return request({
        url: '/api/System/GetUserRoles',
        method: 'post',
        data
    })
};

//获取AMex预订单
export function GetAdvanceOrder(data) {
    return request({
        url: '/api/Apply/GetAdvanceOrder',
        method: 'post',
        data
    })
};

//获取费用类型和成本中心
export function GetCostCenter(data) {
    return request({
        url: '/api/Apply/GetCostCenter',
        method: 'post',
        data
    })
};

//AMex返回时刷新机酒的费用明细
export function JWTLoginRefresh(data) {
    return request({
        url: '/api/Apply/JWTLoginRefresh',
        method: 'post',
        data
    })
};


//保存机酒明细
export function SavePlaneHotelDetail(data) {
    return request({
        url: '/api/Apply/SavePlaneHotelDetail',
        method: 'post',
        data
    })
};

//获取酒店信息
export function GetHotelDetail(data) {
    return request({
        url: '/api/Apply/GetHotelDetail',
        method: 'post',
        data
    })
};

//获取酒店信息
export function GetAirDetail(data) {
    return request({
        url: '/api/Apply/GetAirDetail',
        method: 'post',
        data
    })
};


//获取酒店信息
export function GetApproveHistoryFromEM(data) {
    return request({
        url: '/api/Apply/GetApproveHistoryFromEM',
        method: 'post',
        data
    })
};


//新增/编辑 多语言词条
export function CreateUpdLanguageResource(data) {
    return request({
        url: '/api/System/CreateUpdLanguageResource',
        method: 'post',
        data
    })
};


//删除多语言词条
export function DelLanguageResourceById(data) {
    return request({
        url: '/api/System/DelLanguageResourceById',
        method: 'post',
        data
    })
};


//获取账单数据报表-提供给TMC
export function GetAirPlusBill(data) {
    return request({
        url: '/api/AirPlusInterface/GetAirPlusBill',
        method: 'post',
        data
    })
};


//获取账单数据报表-提供给TMC
export function GetAirPlusTransaction(data) {
    return request({
        url: '/api/AirPlusInterface/GetAirPlusTransaction',
        method: 'post',
        data
    })
};

//机票管理-提供给TMC的接口
export function GetAirPlusTicketInfo(data) {
    return request({
        url: '/api/AirPlusInterface/GetAirPlusTicketInfo',
        method: 'post',
        data
    })
};

//获取客户信息
export function GetCustomer(data) {
    return request({
        url: '/api/Apply/GetCustomer',
        method: 'post',
        data
    })
};
//获取公司人员信息
export function GetCompanylist(data) {
    return request({
        url: '/api/Apply/GetEmployee',
        method: 'post',
        data
    })
};
//删除多语言词条
export function GetGuid(data) {
    return request({
        url: '/api/System/GetGuid',
        method: 'post',
        data
    })
};


//获取币种
export function GetCurrencyType(data) {
    return request({
        url: '/api/Apply/GetCurrency',
        method: 'post',
        data
    })
};

//单据提交
export function SubmitApplyOrder(data) {
    return request({
        url: '/api/Apply/SubmitApplyOrder',
        method: 'post',
        data
    })
};

//提交
export function CheckSubmit(data) {
    return request({
        url: '/api/Apply/CheckSubmit',
        method: 'post',
        data
    })
};
//配置管理
export function SetConfig(data) {
    return request({
        url: '/api/System/SetConfig',
        method: 'post',
        data
    })
};
