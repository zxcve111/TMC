import fetch from '@/config/fetch'
/**
 * 登陆
 */

export const login = data => fetch('/api/user/login', data, 'POST');
export const token = data => fetch('/token', data, 'POST');
export const getlanguage = data => fetch('/api/language/getlanguage', data, 'GET');


/**
 *  语言管理 获取语言资源包 Json类型集合
 */
export const getJsonResource = data => fetch('/api/language/getJsonResource', data, 'POST');

/**
 *  语言管理 获取语言资源包 
 */
export const getResuouceList = data => fetch('/api/language/getResourceList', data, 'POST');

/**
 *  语言管理  新增/编辑语言信息
 */
export const editLanguage = data => fetch('/api/language/editResource', data, 'POST');

/**
 *  语言管理  获取详细信息
 */
export const getLanguageInfo = data => fetch('/api/language/getResourceInfo', data, 'GET');

/**
 *  菜单权限
 */
export const getPageByUser = data => fetch('/api/user/getPageByUser', data, 'GET');


/**
 * 退出
 */

export const signout = () => fetch('/admin/singout');

/**
 * 公司列表
 */
export const getCompanys = data => fetch('/api/company/getList', data, 'POST');
/**
 * 新增/修改公司
 */
export const companyEdit = data => fetch('/api/company/edit', data, 'POST');

/**
 * 删除公司
 */
export const deleteCompany = data => fetch('/api/company/deleteCompany', data, 'GET');

/**
 * 查询公司详细
 */
export const getCompanyInfo = data => fetch('/api/company/getCompanyInfo', data, 'GET');

/**
 * 新增/修改 系统人员
 */
export const userEdit = data => fetch('/api/user/edit', data, 'POST');

/**
 *  系统人员列表
 */
export const getUsers = data => fetch('/api/user/getList', data, 'POST');

/**
 *  人员详细
 */
export const getUserInfo = data => fetch('/api/user/getInfo', data, 'GET');

//配置列表
export const getConfigInfo = data => fetch('/api/System/GetConfigInfo', data, 'POST');
/**
 *  预入职人员详细
 */
export const getEmloyeeInfo = data => fetch('/api/employee/getEmployeeInfo', data, 'GET');


/**
 *  预入职人员列表
 */
export const getEmployees = data => fetch('/api/employee/getEmployeeList', data, 'POST');

/**
 *  新增/修改 预入职人员
 */
export const editEmployee = data => fetch('/api/employee/editEmployee', data, 'POST');



/**
 *  Offer 模板列表
 */
export const getOfferTemplates = data => fetch('/api/offerTemplate/getOfferTempeList', data, 'POST');

/**
 *  Offer 模板字段列表
 */
export const getOfferTemplateFields = data => fetch('/api/offerTemplate/getOfferTempFields', data, 'GET');

/**
 *  Offer 详细内容
 */
export const getEmployeeOfferInfo = data => fetch('/api/employeeOffer/getEmployeeOfferInfo', data, 'GET');

/**
 *  新增/编辑 Offer 详细内容
 */
export const editEmployeeOfferInfo = data => fetch('/api/employeeOffer/editEmployeeOfferInfo', data, 'POST');

/**
 * Offer 列表
 */
export const getEmployeeOfferList = data => fetch('/api/employeeOffer/getEmployeeOfferList', data, 'POST');

/**
 *  新增/编辑 Offer 详细内容
 */
export const preViewPDF = data => fetch('/api/employeeOffer/preViewPDF', data, 'GET');

/**
 *  邮件发送内容
 */
export const sendEmail = data => fetch('/api/employeeOffer/sendEmail', data, 'GET');

/**
 *  邮件发送内容
 */
export const downLoad = data => fetch('/api/employeeOffer/downLoad', data, 'GET');


/**
 *  新增/编辑 部门
 */
export const editDepartment = data => fetch('/api/informDepartment/editDepartment', data, 'POST');

/**
 *  删除部门
 */
export const deleteDepartment = data => fetch('/api/informDepartment/deleteDepartment', data, 'GET');

/**
 *  获取部门列表
 */
export const getDepartmentList = data => fetch('/api/informDepartment/getDepartmentList', data, 'POST');


/**
 *  获取部门详细
 */
export const getDepartmentInfo = data => fetch('/api/informDepartment/getDepartmentInfo', data, 'GET');


/**
 * 添加/修改 预入职人员详细资料
 */
export const editEmployeeDetail = data => fetch('/api/employee/editEmployeeDetail', data, 'POST');

/**
 * 查看预入职人员详细资料
 */
export const getEmployeeDetail = data => fetch('/api/employee/getEmployeeDetail', data, 'GET');
/**
 * 确认入职
 */
export const confirmEntry = data => fetch('/api/employee/confirmEntry', data, 'GET');
/**
 * 取消入职
 */
export const cancelEntry = data => fetch('/api/employee/CancelEntry', data, 'GET');
/**
 * 删除系统人员
 */
export const deleteUser = data => fetch('/api/user/deleteUser', data, 'GET');
/**
 * 删除欲入职人员
 */
export const deleteEmployeeInfo = data => fetch('/api/employee/deleteEmployeeInfo', data, 'GET');

/**
 * 获取角色列表
 */
export const getRoleList = data => fetch('/api/System/GetRolesList', data, 'POST');

/**
 * 新增角色
 */
export const editRole = data => fetch('/api/roles/editRole', data, 'POST');

/**
 * 删除角色
 */
export const deleteRole = data => fetch('/api/roles/deleteRole', data, 'GET');

/**
 * 获取角色权限
 */
export const permissions = data => fetch('/api/roles/permissions', data, 'GET');

/**
 * 获取角色详情
 */
export const getRoleInfo = data => fetch('/api/roles/getRoleInfo', data, 'GET');


/**
 * 获取入职人员状态
 */
export const statusList = data => fetch('/api/employee/statusList', data, 'GET');
/**
 * 预览
 */
export const preview = data => fetch('/api/employee/PrViewPDF',data,'GET');

export const ModPassword = data => fetch('/api/user/ModPassword',data,'GET');

export const getOfferTempeList = data => fetch('/api/offerTemplate/getOfferTempeList',data,'POST');

export const addOfferTemplate = data => fetch('/api/offerTemplate/addOfferTemplate',data,'POST');

export const deleteOfferTemplate = data => fetch('/api/offerTemplate/deleteOfferTemplate',data,'GET');

export const editofferState = data => fetch('/api/employee/editofferState',data,'GET');

export const empLogList = data => fetch('/api/employee/EmpLogList',data,'GET');

export const editFinaldate = data => fetch('/api/employee/EditFinaldate',data,'GET');


/**
 * 获取AD操作记录信息
 */
export const getADLogInfo = data => fetch('/api/ADlog/getADLogInfo', data, 'GET');

/**
 * AD 操作记录列表
 */
export const getADLogList = data => fetch('/api/ADlog/getADLogList', data, 'POST');

/**
 *  获取邮件发送记录信息
 */
export const getEmailInfo = data => fetch('/api/Emaillog/getEmailInfo', data, 'GET');

/**
 * 获取取邮件发送记录列表
 */
export const getEmailList = data => fetch('/api/Emaillog/getEmailList', data, 'POST');

/**
 * 获取OFFER模板中列的信息
 */
export const getOfferTempFields = data => fetch('/api/offerTemplate/getOfferTempFields', data, 'POST');

/**
 * 修改OFFER模板中列
 */
export const editOfferTempFields = data => fetch('/api/offerTemplate/editOfferTempFields', data, 'POST');

/**
 * 获取OFFER模板中列的信息
 */
export const getOfferTemplateFieldById = data => fetch('/api/offerTemplate/getOfferTempFields', data, 'GET');

export const getEmailListLog = data => fetch('/api/EmailHistory/getEmailList', data, 'POST');

export const getEmailLogInfo = data => fetch('/api/EmailHistory/getEmailInfo', data, 'GET');

export const getAllCompany = data => fetch('/api/company/allCompany', data, 'GET');

/**
 *  新增/编辑 部门
 */
export const editSysDepartment = data => fetch('/api/sysDepartment/editDepartment', data, 'POST');

/**
 *  删除部门
 */
export const deleteSysDepartment = data => fetch('/api/sysDepartment/deleteDepartment', data, 'GET');

/**
 *  获取部门列表
 */
export const getSysDepartmentList = data => fetch('/api/sysDepartment/getDepartmentList?companyCode='+data.CompanyCode, data, 'POST');


/**
 *  获取部门详细
 */
export const getSysDepartmentInfo = data => fetch('/api/sysDepartment/getDepartmentInfo', data, 'GET');


/**
 *  获取部门详细
 */
export const getDepartmentPageList = data => fetch('/api/sysDepartment/getDepartmentPageList', data, 'POST');

/**
 *  获取部门详细
 */
export const getDepartmentUserList = data => fetch('/api/sysDepartment/getDepartmentUserList', data, 'POST');

export const getusertemplate = data => fetch('/api/user/Getusertemplate', data, 'GET');

export const enableUser = data => fetch('/api/user/EnableUser', data, 'GET');

/**
 *  设置管理员
 */
export const AddAdmin = data => fetch('/api/company/addAdmin', data, 'POST');

/**
 *  获取管理员
 */
export const getCompanyAdmin = data => fetch('/api/company/getCompanyAdmin', data, 'GET');

export const insertsysuser = data => fetch('/api/user/Insertsysuser', data, 'POST');

export const delDepartmentUser = data => fetch('/api/sysDepartment/delDepartmentUser', data, 'POST');

export const addDepartmentUser = data => fetch('/api/sysDepartment/addDepartmentUser', data, 'POST');

export const setUserRoles = data => fetch('/api/user/setUserRoles', data, 'POST');

export const getDepartmentFullName = data => fetch('/api/sysDepartment/getDepartmentFullName', data, 'POST');

export const modDepartmentUser = data => fetch('/api/sysDepartment/ModDepartmentUser', data, 'POST');


