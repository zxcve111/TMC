<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-collapse v-model="activeNames" @change="topSearch">
                <el-collapse-item :title="$t('message.Search')" name="1">
            <el-form :model="ruleForm" ref="ruleForm"  @submit.native.prevent>
                <el-form-item :label="$t('message.QueryInformation')" prop="LoginName" :label-width="lnameW">
                    <el-input clearable v-model="ruleForm.LoginName"  :maxlength=50 clearable></el-input>
                </el-form-item>
                <div class="button-line">
                    <el-form-item>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button type="primary" @click="submitForm('ruleForm')"  icon="iconfont icon-sousuo"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                            <el-button type="info" @click="resetForm('ruleForm')" icon="iconfont icon-zhongzhi"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </div>
            </el-form>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="table_container" v-loading="isloading" style="padding-top: 20px">
            <!--<el-button-group>-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">-->
                <!--<el-button class="addBtn" type="primary" @click="handleAdd()" icon="iconfont icon-xinzeng-wubiankuang" :disabled="true"></el-button>-->
            <!--</el-tooltip>-->
            <!--&lt;!&ndash;<el-tooltip class="item" effect="dark" :content="$t('message.ImportEXCEL')" placement="top">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-button class="addBtn ml" type="primary" @click="dialogdownload=true" icon="iconfont icon-Icon-daoru"  :disabled="true"></el-button>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
            <!--</el-button-group>-->
            <!-- <el-button type="primary" @click="handleDelete()" icon="el-icon-delete" ></el-button> -->
            <el-table ref="multipleTable" :data="tableData" :row-key="row => row.index" style="width: 100%;" class="tableStyle" :max-height="tableHeight" :height="tableHeight" :header-cell-style="{
                            'background-color': '#f8f8f9',}" >
                <el-table-column :label="$t('message.pm_UserAccount')" prop="ChineseName">
                </el-table-column>
                <el-table-column :label="$t('message.pm_LoginId')" prop="LoginID">
                </el-table-column>
                <el-table-column :label="$t('message.lang_CostCenterNo')" prop="CostCenterNo">
                </el-table-column>
                <el-table-column :label="$t('message.lang_PositionGrade')" prop="PositionGrade">
                </el-table-column>
                <el-table-column :label="$t('message.pm_CompanyEmail')" prop="CompanyEmail">
                </el-table-column>
                <el-table-column :label="$t('message.Operation')" width="120">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="$t('message.pm_AssignRoles')" placement="top">
                            <el-button icon="iconfont icon-jiaose" class="hoverBtn" @click="assignOpen(scope.row.UserId)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.lang_AMexLogin')" placement="top">
                            <el-button class="hoverBtn"  @click="amexLogin(scope.row.CompanyEmail)"
                                       icon="iconfont icon-booking"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="PageSize" layout="prev, pager, next, jumper" :total="count" background>
                </el-pagination>
            </div>
            <el-dialog :title="editTitle" :visible.sync="dialogAddVisible" width="550px" :close-on-click-modal='false' @close="Cancel">
                <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">
                    <el-form-item style="margin-left: -50px;">
                    <el-radio-group v-model="addForm.LoginType" style="margin-bottom:10px;">
                        <el-radio :label="2">{{$t('message.LocalLogin')}}</el-radio>
                        <el-radio :label="1">{{$t('message.DomainLogin')}}</el-radio>
                    </el-radio-group>
                    <el-input v-model="addForm.LoginName" style="float:right;width:200px" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.EmployeeCode')" prop="EmployeeCode">
                        <el-input v-model="addForm.EmployeeCode" clearable></el-input>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('message.LoginMode')" prop="LoginType">
                        <el-select clearable v-model="addForm.LoginType" filterable placeholder=" ">
                           <el-option :key="2" :label="$t('message.LocalLogin')" :value="2"></el-option>
                           <el-option :key="1" :label="$t('message.DomainLogin')" :value="1"></el-option>
                        </el-select> -->
                        <!-- <el-checkbox-group >
                            <el-checkbox v-model="addForm.ManageCompanys" v-for="company in companys" :label="company.CompanyName" :key="company.CompanyCode">{{company.CompanyName}}</el-checkbox>
                        </el-checkbox-group> -->
                    <!-- </el-form-item> -->
                    <el-form-item :label="$t('message.UserName')" prop="Name">
                        <el-input v-model="addForm.Name" auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('message.LoginName')" prop="LoginName">
                        <el-input v-model="addForm.LoginName"></el-input>
                    </el-form-item> -->
                    <el-form-item :label="$t('message.Telephone')" prop="Mobile">
                        <el-input v-model="addForm.Mobile" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.CompanyEmail')" prop="CompanyEmail">
                        <el-input v-model="addForm.CompanyEmail" type="mail" clearable></el-input>
                    </el-form-item>


                    <!-- <el-form-item :label="$t('message.ResponCompany')" prop="ManageCompanys" >
                        <el-select v-model="addForm.ManageCompanys" multiple collapse-tags placeholder=" " @change="getRoleList()">
                            <el-option v-for="item in companys"
                            :key="item.CompanyCode"
                            :label="item.CompanyName"
                            :value="item.CompanyCode">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item :label="$t('message.RoleName')" prop="Roles">
                        <el-select v-model="addForm.Roles " multiple collapse-tags placeholder=" ">
                            <el-option v-for="item in RoleList"
                            :key="item.Id"
                            :label="item.RoleName"
                            :value="item.Id.toString()">
                            </el-option>
                        </el-select>

                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="Cancel()" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="addInfo('addForm')" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="$t('message.importUser')" :visible.sync="dialogdownload" width="550px" :close-on-click-modal='false'>
                <div>
                    <div class="dowloadClass" @click="uploadTemplate()">{{$t('message.downTemplate')}}</div>
                    <div><el-upload class="upload-demo" drag :action="uploadUrl" :data="{CompanyCode:companyCode}" :on-success="handleAttachmentScucess" :on-error="uploadError">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">{{$t('message.uploadTemplate')}}</div>
                        </el-upload></div>
                </div>
            </el-dialog>
            <el-dialog :title="$t('message.pm_AssignRoles')" :modal-append-to-body="false"  :visible.sync="dialogAssignRoles" width="550px" :close-on-click-modal='false'>
                <el-table :data="roleList" ref="roleTable" style="width: 100%;" class="tableStyle" :max-height="500" :header-cell-style="{
                            'background-color': '#f8f8f9',}"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column :label="$t('message.rm_RoleName')" prop="RoleName"></el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="dialogAssignRoles=false" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="assignRoles" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<style>
.dowloadClass{
    width: 94%;
    border: 1px dashed #2d8cf0;
    text-align: center;
    padding: 6px 0;
    margin: 5px 3%;
    background-color: #f5f7f7;
    cursor: pointer;
    font-size: 15px;
    letter-spacing: 8px;
    color: #2d8cf0;
    -webkit-box-shadow: 5px 5px 5px #dedede;
    box-shadow: 5px 5px 5px #dedede;
    margin-bottom:10px;
}
.downloadClass:hover {
    background-color: #9cc5f0;
    color: #fff;
}
.el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 482px!important;
    height: 98px!important;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-left: 16px;
    margin-top: 20px;
}
.el-upload-dragger .el-icon-upload {
    font-size: 52px!important;
    color: #c0c4cc;
    margin: 9px 0 5px!important;
    line-height: 50px;
}
.upload-demo{
    width: 94%;
}
</style>

<script>
    import {GetUserList,GetRolesList,SetUserRoles,GetUserRoles} from '../../apiNew/api.js'
    import headTop from "../../components/headTop";
    import {
        baseUrl,
        baseImgPath
    } from "@/config/env";
    import {
        exportPDFfunGet
    } from "@/config/fetch";
    import {
        getCompanys,
        userEdit,
        getUsers,
        getUserInfo,
        deleteUser,
        getRoleList,
        enableUser,
        getusertemplate,
        insertsysuser,
        setUserRoles
    } from "@/api/getData";
    import {
        Login2Amex,
    } from '../../apiNew/api.js'
import { getLocal, getStore } from '../../config/mUtils';
    export default {
        data() {
            return {
                activeNames: ['1'],
                selectRole:{
                    roleName:''
                },
                selectUser:'',
                roleList:[],
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                city: {},
                PageIndex: 1,
                PageSize: 10,
                count: 0,
                tableData: [],
                isloading: true,
                currentPage: 1,
                currentId: 0,
                dialogAddVisible: false,
                companys: [],
                editTitle: this.$t('message.Add'),
                isIndeterminate:true,
                RoleList:[],
                tableHeight: 0,
                addForm: {
                    Name: "",
                    Mobile: "",
                    CompanyEmail: "",
                    Employee: "",
                    LoginName: "",
                    Password: "",
                    CreateTime: "",
                    UpdateTime: "",
                    CompanyCode: getStore('CompanyCode'),
                    CreatorId: 0,
                    UpdaterId: getStore('Id'),
                    ManageCompanys: null,
                    LoginType:"",
                    Roles:null
                },
                ruleForm: {
                    Name: "",
                    LoginName: "",
                    CompanyCode: ""
                },
                rules2:{
                    roleName:[{
                        required: true,
                        message: this.$t('message.Select')+this.$t('message.rm_RoleName'),
                        trigger: "blur"
                    }],
                    region: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ]
                },
                rules: {
                    Name: [{
                        required: true,
                        message: this.$t('message.Input')+this.$t('message.Name'),
                        trigger: "blur"
                    }],

                    LoginName: [{
                        required: true,
                        message: this.$t('message.Input')+this.$t('message.LoginName'),
                        trigger: "blur"
                    }],
                    Email: [{ type: 'email', message:this.$t('message.CorrectEmail'), trigger: ['blur', 'change'] }],
                    EmployeeCode:[{
                        required: true,
                        message: this.$t('message.Input')+this.$t('message.EmployeeCode'),
                        trigger: "blur"
                    }],
                    LoginType:[{
                        required: true,
                        message: this.$t('message.PleaseChoose')+this.$t('message.LoginMode'),
                        trigger: "change"
                    }],
                    ManageCompanys:[{
                        required: true,
                        message: this.$t('message.PleaseChoose')+this.$t('message.ResponCompany'),
                        trigger: "change"
                    }],
                    Roles:[{
                        required: true,
                        message: this.$t('message.PleaseChoose')+this.$t('message.RoleName'),
                        trigger: "change"
                    }],
                    chooseRoles:[]

                },
              IsSystemAdmin:getStore('IsSystemAdmin'),
              isedit:false,
                lnameW: 0+'px',
                nameW: 0+'px',
                labelWidth: 0+'px',
                dialogdownload:false,
                uploadUrl:baseUrl+'/api/user/Insertsysuser',
                dialogAssignRoles:false,
                companyCode:getStore('CompanyCode'),
                AssignRolesList:[]
            };
        },
        created() {
            this.watchHeight();
            this.initData();
            this.resetLabelWidth();
            this.getRoleList();
        },
        computed: {},
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight - 250;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            amexLogin(emil) {
                let params = {
                    user: null,
                    CultureCode: getStore('CultureCode'),
                    CompanyEmail:emil
                }
                Login2Amex(params).then(response => {
                    window.open(response.data.Result.url)
                }).catch(error => {
                })
            },
            topSearch(){
                console.log(this.activeNames);
                if(this.activeNames.length == 0){
                    this.tableHeight = this.tableHeight + 128;
                } else {
                    this.tableHeight = this.tableHeight - 128;
                }
            },
            topSearch(){
                if(this.activeNames.length == 0){
                    this.tableHeight = this.tableHeight + 128;
                } else {
                    this.tableHeight = this.tableHeight - 128;
                }
            },
            assignRoles(){
                let params = {
                    userId: this.selectUser,
                    roleIds: this.chooseRoles
                }
                SetUserRoles(params).then(response => {
                    // console.log(response);
                    if(response.data.Flag){

                        this.dialogAssignRoles = false;
                        this.$refs.roleTable.clearSelection();
                        this.$message({
                            type: "success",
                            message: this.$t('message.Success')
                        });
                    }
                }).catch(error => {
                })
            },
            getRoleList() {
                let params = {
                    searchCondition:'',
                    pageSize: 200,
                    pageIndex: 1
                }
                GetRolesList(params).then(response => {
                    this.roleList = response.data.Result.lstRole;
                }).catch(error => {
                })
            },
            assignOpen(id){
                this.dialogAssignRoles = true;
                this.$nextTick(function () {
                    this.$refs.roleTable.clearSelection();
                    this.selectUser = id;
                    let params = {
                        UserId: id
                    }
                    GetUserRoles(params).then(response => {
                        response.data.Result.forEach((item,index)=>{
                            this.roleList.forEach((item2,index2)=>{
                                if(item2.RoleID == item.RoleID){
                                    this.$refs.roleTable.toggleRowSelection(this.roleList[index2],true);
                                }
                            })
                        })
                    }).catch(error => {
                    })
                });
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 250;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getLocal('CultureCode') == 'en-US') {
                    this.lnameW = 90+'px';
                    this.nameW = 70+'px';
                    this.labelWidth = 100+'px';
                } else {
                    this.lnameW = 65+'px';
                    this.nameW = 70+'px';
                    this.labelWidth = 75+'px';
                }
            },
            async initData() {
                /**获取用户列表 */
                try {
                    // this.getLanguageResource();
                    this.getUsers();
                    // this.getCompanys();
                } catch (err) {
                    console.log("获取数据失败", err);
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.PageIndex = val;
                this.getUsers();
            },
            handleAdd() {
                this.editTitle = this.$t('message.Add');
                this.currentId=0;
                this.addForm.Id=0;
                this.dialogAddVisible = true;
                this.isedit = false;
            },
            handleEdit(index, row) {
                this.editTitle = this.$t('message.Edit');
                this.currentId = row.Id;
                this.getUserInfo();
                this.dialogAddVisible = true;
                this.isedit = true;
            },
            handleSelect(index) {
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
            },
             handleDelete(index, row) {
                this.$confirm(this.$t('message.deleteIt'), 'Warning', {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    this.currentId=row.Id;
                    this.deleteUser();

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
                });
            },
            submitForm(formName) {
                this.currentPage = 1;
                this.PageIndex = 1;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.getUsers();
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.currentPage = 1;
                this.PageIndex = 1;
                this.$refs[formName].resetFields();
                this.getUsers();
            },
            addInfo(formName) {
                this.$refs[formName].validate(async valid => {
                    if (valid) {

                        this.addUser();
                    } else {
                        return false;
                    }
                });
            },
            updateInfo(formName) {
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        try {
                            this.addUser();
                        } catch (err) {
                            console.log("更新信息失败", err);
                        }
                    } else {
                        return false;
                    }
                });
            },
             handleCheckedCitiesChange(value) {
              let checkedCount = value.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
             getUsers() {
                 this.isloading = true;
                let params = {
                    searchCondition: this.ruleForm.LoginName,
                    pageIndex: this.PageIndex,
                    pageSize: this.PageSize
                }
                 GetUserList(params).then(response => {
                     this.isloading = false;
                     this.tableData = response.data.Result.userList;
                     this.count = response.data.Result.TotalCount
                 }).catch(error => {
                 })
            },
            async addUser() {
                // this.addForm.ManageCompanys=this.addForm.ManageCompanys.join(',');
                // this.addForm.Roles=this.addForm.Roles.join(',');
                // debugger;
                if(!this.isedit){
                    this.addForm.CompanyCode = getStore('CompanyCode');
                }
                this.addForm =JSON.parse(JSON.stringify(this.addForm));
                // this.addForm.
                const crs = await userEdit(this.addForm);
                if (crs.Flag) {
                    this.dialogAddVisible = false;
                     this.$nextTick(function () {
                        this.$refs['addForm'].resetFields();
                        this.addForm.ManageCompanys=[];
                        this.addForm.Roles=[]
                    });
                    this.getUsers();
                   // this.resetForm('ruleForm');

                    // this.addForm.Name="";
                    // this.addForm.Email="";
                    // this.addForm.Employee="";
                    // this.currentId=0;
                    // this.addForm.LoginName="";
                } else {
                    this.$message({
                        type: "error",
                        message:"error"
                        // message: crs.Message
                    })
                }
            },
            async getUserInfo() {
                const crs = await getUserInfo({
                    Id: this.currentId
                });
                if (crs.Flag) {
                    // this.dialogAddVisible=false;
                    setTimeout(function () {
                        this.addForm = crs.Result;

                        // this.addForm.ManageCompanys=this.addForm.ManageCompanys.split(',');
                        // this.addForm.Roles=this.addForm.Roles.split(',');
                        // this.getRoleList();
                    }.bind(this), 0);
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            async getCompanys() {
                const crs = await getCompanys({
                    CompanyCode: "",
                    CompanyName: "",
                    UserId:getStore('Id'),
                    PageSize: 20,
                    PageIndex: 1
                });

                if (crs.Flag) {
                    this.companys = crs.Result.rows;
                }
            },
            async deleteUser() {
                const crs = await deleteUser({id:this.currentId});

                if (crs.Flag) {
                    this.$message({
                        type: "success",
                        message: crs.Message
                    })
                    this.getUsers();
                }
                else{
                     this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
                Cancel(){
                    this.dialogAddVisible = false;
                    this.$nextTick(function () {
                        this.$refs['addForm'].resetFields();
                        this.addForm.ManageCompanys=[];
                        this.addForm.Roles=[]
                    });
                },
                async uploadTemplate(){
                    const data = await getusertemplate();
                    if(data.Flag){
                        window.open(baseUrl+data.Result)
                    }
                },
                async EnableUser(id){
                    const data = await enableUser({
                        id:id
                    });
                    if(data.Flag){
                        this.getUsers();
                    }
                    else{
                        this.$message.error(data.Message);
                    }
                },
                handleAttachmentScucess(res, file) {
                if (res.Flag) {
                    // debugger;
                    this.$message.success(this.$t('message.FileImportSuccessfully'));
                    this.dialogdownload = false;
                    this.getUsers();
                } else {
                    this.$message.error(this.$t('message.FileImportFailed'));
                }
            },
            uploadError(err, file){
                this.$message.error(this.$t('message.FileImportFailed'));
            },
            RoleEdit(index,row){
                this.dialogAssignRoles = true;
                this.currentId = row.Id;
                if(row.Roles!=null){
                    this.AssignRolesList = row.Roles.split(',')
                }
                this.getRoleList();
            },
            handleSelectionChange(value){
                let that = this;
                this.chooseRoles =[];
                value.forEach(item=>{
                    that.chooseRoles.push(item.RoleID)
                })
            }
        }
    };

</script>
