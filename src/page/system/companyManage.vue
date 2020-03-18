<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="companyBoxAll">
            <div class="title">
                <h1>费卡华瑞</h1>
            </div>
            <div class="companyBox" id="autoBox" :style="{'height':autoBox}">
                <div class="companyList">
                    <div class="companyTree" ref="companyTree"  style="overflow: auto">

                        <el-tree  v-loading="loading" :data="tableData" :props="props" node-key="Code" :default-expanded-keys="['40000331']"></el-tree>
                    </div>
                    <!--<div class="companytable">-->
                    <!--<div class="title">-->
                    <!--&lt;!&ndash;<el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button style="margin-left:10px;margin-top:-3px;" type="primary" @click="handleAdd()" class="el-icon-plus"></el-button>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                    <!--</div>-->
                    <!--<div class="companyInfor" v-if="isShowInfor">-->
                    <!--<ul>-->
                    <!--<li>{{$t('message.companyInfor')}}：</li>-->
                    <!--<li>{{$t('message.CompanyName')}}：{{currentCompanyName}}</li>-->
                    <!--<li>{{$t('message.CompanyCode')}}：{{currentCompanyCode}}</li>-->
                    <!--<li>{{$t('message.CompanyEnglishName')}}：{{currentCompanyEnName}}</li>-->
                    <!--</ul>-->
                    <!--</div>-->
                    <!--<div v-if="!isShowInfor" v-loading='isloading' style="margin-top:-10px">-->
                    <!--<el-table ref="multipleTable" :data="OrgTable" :row-key="row => row.index"-->
                    <!--class="tableStyle" :height="tableHeight" :header-cell-style="{-->
                    <!--'background-color': '#f8f8f9',-->
                    <!--}">-->
                    <!--<el-table-column :label="$t('message.DepartmentCode')" prop="DepartmentCode">-->
                    <!--&lt;!&ndash; <template slot-scope="scope">-->
                    <!--<a class='linkcolor' @click="renYuanDetail(scope.row.id)">{{scope.row.renYuanNM}}</a>-->
                    <!--</template>  &ndash;&gt;-->
                    <!--</el-table-column>-->
                    <!--<el-table-column :label="$t('message.DepartmentName')" prop="DepartmentName">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column :label="$t('message.DepartmentParentCode')" prop="DepartmentParentCode">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column :label="$t('message.OrgManage')" prop="UserName">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column :label="$t('message.Orgadmin')" prop="ManagerName">-->
                    <!--</el-table-column>-->
                    <!--&lt;!&ndash;<el-table-column :label="$t('message.Operation')" width="100">&ndash;&gt;-->
                    <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button icon="iconfont icon-bianji-kong" class="hoverBtn" @click="handleEdit(scope.$index, scope.row)"></el-button>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" @click="handleDelete(scope.$index, scope.row)"></el-button>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
                    <!--&lt;!&ndash;&lt;!&ndash; <el-button size="mini" type="primary" class="editIcon" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> &ndash;&gt;&ndash;&gt;-->
                    <!--&lt;!&ndash;&lt;!&ndash; <el-button size="mini" type="primary" class="delIcon" @click="handleDelete(scope.$index, scope.row)">删除</el-button> &ndash;&gt;&ndash;&gt;-->
                    <!--&lt;!&ndash;</template>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
                    <!--</el-table>-->
                    <!--<div class="Pagination">-->
                    <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="PageIndex"-->
                    <!--:page-size="PageSize" layout="total, prev, pager, next, jumper" :total="count">-->
                    <!--</el-pagination>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</div>-->
                </div>
                <!--<el-dialog :title="editTitle" :visible.sync="dialogAddVisible" width="700px" :close-on-click-modal='false'>-->
                <!--<el-form :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">-->
                <!--<el-form-item :label="$t('message.DepartmentName')" prop="DepartmentName">-->
                <!--<el-input v-model="addForm.DepartmentName" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('message.DepartmentCode')" prop="DepartmentCode">-->
                <!--<el-input v-model="addForm.DepartmentCode" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('message.DepartmentParentCode')" prop="DepartmentParentCode">-->
                <!--<el-input v-model="addForm.DepartmentParentName" :disabled="true">-->
                <!--<el-button type="info"  class="gry nbrs" slot="append" icon="el-icon-close"  @click="addForm.DepartmentParentName='';" style="border-right:1px solid #dfdfdf;margin-right:-10px"></el-button>-->
                <!--<el-button slot="append" icon="el-icon-search" type="primary" style="line-height: 18px;margin-right: 0;" @click="dialogOrgVisible=true;getDialogOrg()"></el-button>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<div style="display:flex" v-if="isEdit">-->
                <!--<el-form-item :label="$t('message.OrgManage')" prop="UserID" style="width: 320px">-->
                <!--<el-input v-model="addForm.UserName" :disabled="true" clearable>-->
                <!--<el-button type="info"  class="gry nbrs" slot="append" icon="el-icon-close"  @click="addForm.UserName='';addForm.UserID=''" style="border-right:1px solid #dfdfdf;margin-right:-10px"></el-button>-->
                <!--<el-button slot="append" type="primary"  class="blue" icon="el-icon-search" @click="addManage(0)"></el-button>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item :label="$t('message.Orgadmin')" prop="ManagerId"   style="width: 320px">-->
                <!--<el-input v-model="addForm.ManagerName" :disabled="true" clearable>-->

                <!--<el-button type="info"  class="gry nbrs" slot="append" icon="el-icon-close"  @click="addForm.ManagerName='';addForm.ManagerId=''" style="border-right:1px solid #dfdfdf;margin-right:-10px"></el-button>-->
                <!--<el-button slot="append" type="primary" class="blue" icon="el-icon-search"  @click="addManage(1)"></el-button>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <!--</div>-->
                <!--<el-form-item :label="$t('message.DepartmentDesc')" prop="DepartmentDesc">-->
                <!--<el-input type="textarea" resize="none" v-model="addForm.DepartmentDesc" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">-->
                <!--<el-button @click="dialogAddVisible = false" icon="iconfont icon-guanbi-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">-->
                <!--<el-button type="primary" @click="add('addForm')" icon="iconfont icon-gou-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--</div>-->
                <!--</el-dialog>-->
                <!--<el-dialog :title="$t('message.SelectOrg')" :visible.sync="dialogOrgVisible" width="700px" :close-on-click-modal='false'>-->
                <!--<div style="margin-bottom:20px">-->
                <!--<el-input  v-model="searchOrgKey" class="input-with-select" :placeholder="$t('message.Organization')">-->
                <!--<el-button slot="append" icon="el-icon-search" type="primary" class="nbrs" style="line-height: 18px;margin-right: 0;" @click="getDialogOrg()"></el-button>-->
                <!--</el-input>-->
                <!--</div>-->
                <!--<el-tree :data="dialogTreeList"   :props="props"@node-click="handleDialogNodeClick"></el-tree>-->
                <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">-->
                <!--<el-button @click="dialogOrgVisible = false" icon="iconfont icon-guanbi-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">-->
                <!--<el-button type="primary" @click="setOrg" icon="iconfont icon-gou-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--</div>-->
                <!--</el-dialog>-->
                <!--<el-dialog :title="$t('message.UserAccount')" :visible.sync="dialogUserVisible" width="700px" :close-on-click-modal='false'>-->
                <!--<div style="margin-bottom:20px">-->
                <!--<el-input  v-model="searchUserKey" class="input-with-select">-->
                <!--<el-button slot="append" icon="el-icon-search" type="primary" class="nbrs" style="line-height: 18px;margin-right: 0;" @click="getDialogUsers()"></el-button>-->
                <!--</el-input>-->
                <!--</div>-->
                <!--<el-table ref="multipleTable" :data="dialogUserList" class="tableStyle" :max-height="600"-->
                <!--:header-cell-style="{-->
                <!--'background-color': '#f8f8f9',-->
                <!--}">-->
                <!--<el-table-column width="55">-->
                <!--<template slot-scope="scope">-->
                <!--<el-radio :label="scope.row.Id" v-model="UserRadio" @change.native="getUserRow(scope.$index,scope.row)">&nbsp;</el-radio>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('message.UserAccount')" prop="LoginName">-->
                <!--&lt;!&ndash; <template slot-scope="scope">-->
                <!--<a class='linkcolor' @click="renYuanDetail(scope.row.id)">{{scope.row.renYuanNM}}</a>-->
                <!--</template>  &ndash;&gt;-->
                <!--</el-table-column>-->
                <!--<el-table-column :label="$t('message.UserName')" prop="Name">-->
                <!--</el-table-column>-->
                <!--&lt;!&ndash; <el-table-column :label="$t('message.Telephone')" prop="Mobile">-->
                <!--</el-table-column> &ndash;&gt;-->

                <!--</el-table>-->
                <!--<div class="Pagination">-->
                <!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="userPageIndex"-->
                <!--:page-size="userPageSize" layout="total, prev, pager, next, jumper" :total="userCount">-->
                <!--</el-pagination>-->
                <!--</div>-->
                <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">-->
                <!--<el-button @click="dialogUserVisible = false" icon="iconfont icon-guanbi-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">-->
                <!--<el-button type="primary" @click="setUsers" icon="iconfont icon-gou-wukuang"></el-button>-->
                <!--</el-tooltip>-->
                <!--</div>-->
                <!--</el-dialog>-->

            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.companyInfor{
    padding: 20px;
    ul{
        li:first-child{
            font-size: 16px;
        }
        li{
            line-height: 30px;
        }
    }
}
.companytable{
    .title{
        cursor: pointer;
    }
}
.companyList .el-tree-node__label{
    font-size: 12px!important;
}
</style>

<script>
    import {GetAllOrganizationToTree} from '../../apiNew/api.js'
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
        companyEdit,
        deleteCompany,
        getCompanyInfo,
        getSysDepartmentList,
        editSysDepartment,
        deleteSysDepartment,
        getSysDepartmentInfo,
        getDepartmentPageList,
        getDepartmentUserList,
        getDepartmentFullName
    } from "@/api/getData";
    import { getLocal, getStore } from '../../config/mUtils';
    export default {
        data() {
            return {
                loading:true,
                props: {
                    children: 'children',
                    label: 'Name'
                },
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                city: {},
                PageIndex: 1,
                PageSize: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                currentId: 0,
                labelWidth: 0+'px',
                ruleForm: {
                    DepartmentName: "",
                    CompanyCode: "",

                },
                addForm: {
                    Id: 0,
                    DepartmentCode: "",
                    DepartmentName: "",
                    DepartmentDesc: "",
                    DepartmentParentCode: "",
                    DepartmentParentName: "",
                    UserID:"",
                    ManagerId:"",
                    UpdaterId:getStore('Id'),
                    CompanyCode:getStore('CompanyCode'),
                    ManagerName:"",
                    UserName:""
                },
                rules: {
                    DepartmentName: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.DepartmentName'),
                        trigger: "change"
                    }],
                    DepartmentCode: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.DepartmentCode'),
                        trigger: "change"
                    }],
                    // CompanyCode: [{
                    //     required: true,
                    //     message: this.$t('message.Input')+ this.$t('message.CompanyCode'),
                    //     trigger: "change"
                    // }]
                },
                dialogAddVisible: false,
                editTitle: "",
                IsSystemAdmin:getStore('IsSystemAdmin'),
                isEdit:false,
                isloading:true,
                currentCompanyCode:getStore('CompanyCode'),
                currentCompanyName:getStore('CompanyName'),
                currentCompanyEnName:getStore('CompanyEnName'),
                isShowInfor:true,
                selectOrgCode:getStore('CompanyCode'),
                tableHeight: 0,
                autoBox:0,
                OrgTable:[],
                addOrg:"",
                dialogOrgVisible:false,
                searchOrgKey:"",
                dialogTreeList:[],
                dialogUserList:[],
                userPageIndex: 1,
                userPageSize: 10,
                userCount:0,
                usertype:-1,
                dialogUserVisible:false,
                searchUserKey:"",
                UserRadio:0,
                selectDepartment:"",
                selectDepartmentCode:""
            };
        },
        created() {
            this.getAllDepartment();
            // this.getLanguageResource();
            window.addEventListener('resize', this.watchHeight);
            this.watchHeight();
            this.addForm.Id = this.currentId;
            this.editTitle = this.$t('message.Add');
            // this.initData();
            // this.getCompanys();
            this.resetLabelWidth();
        },
        destroyed(){
            window.removeEventListener('resize', this.watchHeight)
        },
        mounted(){
            setTimeout(() => {
                const that = this;
                    let widowHeight = document.documentElement.clientHeight-110;
                    that.tableHeight = widowHeight-100;
                    that.autoBox = widowHeight-60+'px';
            }, 1);
        },

        computed: {

        },
        components: {
            headTop
        },
        watch:{

        },
        methods: {
            getAllDepartment(){
                GetAllOrganizationToTree
                GetAllOrganizationToTree().then(response => {
                    this.tableData = response.data.Result;
                    this.loading = false;
                }).catch(error => {
                })
            },
            resetLabelWidth() {
                if (getLocal('language') == 'en-US') {
                    this.labelWidth = 130+'px';
                } else {
                    this.labelWidth = 70+'px';
                }
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight-110;
                        that.tableHeight = widowHeight-100;
                        that.autoBox = widowHeight-60+'px';
                    };
                }, 1);
            },
            async initData() {
                /**获取用户列表 */
                try {

                    this.getCompanys();
                } catch (err) {
                    console.log("获取数据失败", err);
                }
            },
            submitForm(){
                this.getCompanys()
            },
            async getCompanys() {
                const crs = await getSysDepartmentList({
                    CompanyCode: getStore('CompanyCode'),
                });
                this.tableData = [];

                if (crs.Flag) {
                    this.isloading = false;
                    this.tableData = crs.Result;

                }
            },
            async add(from) {

                this.$refs[from].validate(valid => {
                    if (valid) {
                        this.addcompany();
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$t('message.CorrectInformation')
                        });
                    }
                })

            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.PageIndex = val;
                this.getCompanys();
            },
            handleAdd() {
                this.dialogAddVisible = true;
                this.addForm.Id = 0;
                 this.isEdit = false;
                this.editTitle = this.$t('message.Add');
                this.addForm={
                    Id: 0,
                    DepartmentCode: "",
                    DepartmentName: "",
                    DepartmentDesc: "",
                    DepartmentParentCode: this.selectDepartmentCode,
                    DepartmentParentName:this.selectDepartment,
                    UserID:"",
                    ManagerId:"",
                    UpdaterId:getStore('Id'),
                    CompanyCode:getStore('CompanyCode'),
                    ManagerName:"",
                    UserName:""
                }
                // alert(this.addForm.DepartmentParentName)
                if(this.addForm.DepartmentParentName==""||this.addForm.DepartmentParentName==undefined){
                     this.addForm.DepartmentParentName = this.currentCompanyName;
                }
                //
                this.$nextTick(function(){
                    this.$refs['addForm'].clearValidate();
                })
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
                    this.deleteCompany();

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
                });
            },
            handleEdit(index, row) {
                this.editTitle = this.$t('message.Edit');
                this.isEdit = true;
                this.currentId = row.Id;
                this.getCompanyInfo();
                this.dialogAddVisible = true;
            },
            async addcompany() {
                const crs = await editSysDepartment(this.addForm);
                if (crs.Flag) {
                    this.dialogAddVisible = false;
                    this.getCompanys();
                    this.getDepartmentPageList(this.selectDepartmentCode);
                    this.resetForm('addForm');
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            async getCompanyInfo() {
                const crs = await getSysDepartmentInfo({
                    id: this.currentId
                });
                if (crs.Flag) {
                    this.addForm = crs.Result;
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            async deleteCompany() {
                const crs = await deleteSysDepartment({
                    id: this.currentId
                });
                if (crs.Flag) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.DeleteCompleted')
                    });
                    this.getDepartmentPageList(this.addForm.DepartmentParentCode);
                     this.getCompanys();
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getCompanys();
            },
            handleNodeClick(data){
                console.log(data);
                this.isShowInfor = false;
                this.addForm.DepartmentParentCode=data.id;
               
                this.addForm.DepartmentParentName = data.label;
                this.selectDepartment = data.label
                this.selectDepartmentCode = data.id
                this.getDepartmentPageList(data.id);
                // this.DepartmentParentName
            },
            async getDepartmentPageList(id){
                const data = await getDepartmentPageList({
                    DepartmentParentCode:id,
                    PageSize:this.PageSize,
                    PageIndex:this.PageIndex
                })
                if(data.Flag){
                    this.OrgTable = data.Result.rows;
                    this.count = data.Result.total
                }


            },

            async getDialogOrg(){
                const crs = await getSysDepartmentList({
                    CompanyCode: getStore('CompanyCode'),
                    DepartmentName:this.searchOrgKey
                });
                if(crs.Flag){
                    this.dialogTreeList = crs.Result
                }
            },
            handleDialogNodeClick(data){
                this.addForm.DepartmentParentCode=data.id;
                this.getDepartmentFullName(data.id);


            },
            setOrg(){
                this.dialogOrgVisible = false;
            },
            async getDialogUsers(){
                const data = await getDepartmentUserList({
                    SearchKey:this.searchUserKey,
                    CompanyCode:getStore('CompanyCode'),
                    UserId:getStore('Id'),
                    PageSize:this.userPageSize,
                    PageIndex:this.userPageIndex,
                    DepartmentCode:this.addForm.DepartmentCode
                });
                if(data.Flag){
                    this.dialogUserList=data.Result.rows;
                    this.userCount = data.Result.total;
                }

            },
            addManage(usertype){
                this.UserRadio="";
                this.dialogUserVisible = true;
                this.getDialogUsers();
                this.usertype = usertype;

            },
            setUsers(){
                this.dialogUserVisible = false
            },
            getUserRow(index,row){
                // debugger
                if(this.usertype===0){
                    this.addForm.UserName = row.Name;
                    this.addForm.UserID = row.Id
                }
                else{
                    this.addForm.ManagerName = row.Name;
                    this.addForm.ManagerId = row.Id
                }
            },
            async getDepartmentFullName(DepCode){
                const data = await getDepartmentFullName({
                    CompanyCode:getStore('CompanyCode'),
                    DepartmentCode:DepCode
                });
                if(data.Flag){
                    this.addForm.DepartmentParentName = data.Result;
                }
            }

        }
    };

</script>
