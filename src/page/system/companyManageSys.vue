<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-form :model="ruleForm" ref="ruleForm">
                <el-form-item :label="$t('message.CompanyName')" prop="CompanyName" :label-width="nameW">
                    <el-input clearable v-model="ruleForm.CompanyName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.CompanyCode')" prop="CompanyCode" :label-width="companyW">
                    <el-input clearable v-model="ruleForm.CompanyCode"></el-input>
                </el-form-item>
                <div class="button-line">
                    <el-form-item>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button type="primary" @click="submitForm('ruleForm')" icon="iconfont icon-sousuo"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                            <el-button type="info" @click="resetForm('ruleForm')" icon="iconfont icon-zhongzhi"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table_container" v-loading='isloading'>
            <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                <el-button class="addBtn" type="primary" icon="iconfont icon-xinzeng-wubiankuang" @click="handleAdd()"></el-button>
            </el-tooltip>
            <!-- <el-button type="primary" @click="handleAdd()" class="el-icon-plus" v-if="IsSystemAdmin==1"></el-button> -->
            <el-table ref="multipleTable" :data="tableData" :row-key="row => row.index" style="width: 100%" class="tableStyle" :max-height="tableHeight" :height="tableHeight" :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                <el-table-column :label="$t('message.CompanyName')" prop="CompanyName">
                    <!-- <template slot-scope="scope">
                    <a class='linkcolor' @click="renYuanDetail(scope.row.id)">{{scope.row.renYuanNM}}</a>
                 </template>  -->
                </el-table-column>

                <!-- <el-table-column
                  label="公司地址"
                  prop="DetpName">
                </el-table-column> -->
                <el-table-column :label="$t('message.CompanyEnglishName')" prop="CompanyENName">
                </el-table-column>
                <el-table-column :label="$t('message.Domain')" prop="DoMain">
                </el-table-column>
                <!-- <el-table-column :label="最大员工号" prop="CompanyENName">
                </el-table-column> -->
                <!-- <el-table-column
                  label="公司负责人电话"
                  prop="IsTemporaryStr">
                </el-table-column> -->

                <el-table-column :label="$t('message.Operation')" width="130">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                            <el-button icon="iconfont icon-bianji-kong" class="hoverBtn" @click="handleEdit(scope.$index, scope.row)"></el-button>
                        </el-tooltip> -->
                         <el-tooltip class="item" effect="dark" :content="$t('message.SetUpAdministrator')" placement="top">
                            <el-button icon="iconfont icon-renyuanguanli" class="hoverBtn" @click="handleSetAdmin(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                          <el-button icon="iconfont icon-bianji-kong" class="hoverBtn" @click="handleEdit(scope.$index, scope.row)"></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                          <el-button v-if="scope.row.IsSystemAdmin!=2"  icon="iconfont icon-shanchu-kong" class="hoverBtn" @click="handleDelete(scope.$index, scope.row)"></el-button>
                      </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="20" layout="total, prev, pager, next, jumper" :total="count" background>
                </el-pagination>
            </div>
            <el-dialog :title="editTitle" :visible.sync="dialogAddVisible" width="600px" :close-on-click-modal='false'>
                <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">
                    <el-form-item :label="$t('message.CompanyName')" prop="CompanyName">
                        <el-input v-model="addForm.CompanyName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.CompanyEnglishName')" prop="CompanyENName">
                        <el-input v-model="addForm.CompanyENName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.CompanyCode')" prop="CompanyCode">
                        <el-input v-model="addForm.CompanyCode" :disabled="isEdit"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.Domain')" prop="DoMain">
                        <el-input v-model="addForm.DoMain" auto-complete="off"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="最大员工号" prop="MaxEmployeeCode">
                        <el-input v-model="addForm.MaxEmployeeCode"></el-input>
                    </el-form-item>
                     <el-form-item label="Ad账号前缀" prop="PrefixAdCount">
                        <el-input v-model="addForm.PrefixAdCount"></el-input>
                    </el-form-item> -->
                    <el-form-item :label="$t('message.IsNeedSendInformation')" prop="IsNeedSendInformation">
                        <el-radio-group v-model="addForm.IsNeedSendInformation">
                            <el-radio :label="true">{{$t('message.Yes')}}</el-radio>
                            <el-radio :label="false">{{$t('message.No')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="dialogAddVisible = false" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="add('addForm')" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="editTitle" :visible.sync="dialogSetAdminVisible" width="700px" :close-on-click-modal='false'>
                <el-form :model="setForm" :rules="setrules" ref="setForm" :label-width="labelWidths">
                    <el-form-item :label="$t('message.UserAccount')" prop="Name">
                        <el-input v-model="setForm.Name" auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item :label="$t('message.LoginName')" prop="LoginName">
                        <el-input v-model="setForm.LoginName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.Email')" prop="Email">
                        <el-input v-model="setForm.Email"  auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="dialogSetAdminVisible = false" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="setAdmin('setForm')" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
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
        AddAdmin,
        getCompanyAdmin
    } from "@/api/getData";
    import { getLocal, getStore } from '../../config/mUtils';
    export default {
        data() {
            return {
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
                currentCompanyCode: 0,
                ruleForm: {
                    CompanyName: "",
                    CompanyCode: "",

                },
                addForm: {
                    Id: 0,
                    CompanyCode: "",
                    CompanyName: "",
                    CompanyENName: "",
                    createTime: "",
                    updateTime: "",
                    CompanyShortName: "",
                    UpdaterId:getStore('Id'),
                    MaxEmployeeCode:"",
                    IsNeedSendInformation:true,
                    DoMain:"",
                    EmployeeCodeLength:10,
                    PrefixAdCount:""
                },
                setForm: {
                    Id: 0,
                    CompanyCode: "",
                    Name: "",
                    LoginName: "",
                    Email:""
                },
                rules: {
                    CompanyName: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.CompanyName'),
                        trigger: "change"
                    }],
                    CompanyENName: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.CompanyEnglishName'),
                        trigger: "change"
                    }],
                    CompanyCode: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.CompanyCode'),
                        trigger: "change"
                    }]
                },
                setrules: {
                    LoginName: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.LoginName'),
                        trigger: "change"
                    }],
                    Name: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.UserAccount'),
                        trigger: "change"
                    }],
                    Email: [{
                        required: true,
                        message: this.$t('message.Input')+ this.$t('message.Email'),
                        trigger: "change"
                    }]
                },
                dialogAddVisible: false,
                editTitle: "",
                IsSystemAdmin:getStore('IsSystemAdmin'),
                isEdit:false,
                isloading:false,
                tableHeight: 0,
                nameW: 0+'px',
                companyW: 0+'px',
                labelWidth: 0+'px',
                labelWidths: 0+'px',
                dialogSetAdminVisible: false,

            };
        },
        created() {
            this.getLanguageResource();
            this.addForm.Id = this.currentId;
            this.initData();
            this.editTitle = this.$t('message.Add');
            this.watchHeight();
            this.resetLabelWidth();
        },
        computed: {},
        components: {
            headTop
        },
        watch:{

        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight-280;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight-280;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getLocal('language') == 'en-US') {
                    this.nameW = 110+'px';
                    this.companyW = 125+'px';
                    this.labelWidth = 120+'px';
                    this.labelWidths = 100+'px';
                } else {
                    this.nameW = 60+'px';
                    this.companyW = 80+'px';
                    this.labelWidth = 110+'px';
                    this.labelWidths = 70+'px';
                }
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
                this.isloading = true;
                const crs = await getCompanys({
                    CompanyCode: this.ruleForm.CompanyCode,
                    CompanyName: this.ruleForm.CompanyName,
                    UserId:getStore('Id'),
                    PageSize: this.PageSize,
                    PageIndex: this.PageIndex,
                    IsSystemAdmin:getStore('IsSystemAdmin')
                });
                this.tableData = [];

                if (crs.Flag) {
                    this.isloading = false;
                    this.tableData = crs.Result.rows;
                    this.count = crs.Result.total;
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
            async setAdmin(from) {
                this.isEdit = false;
                this.$refs[from].validate(valid => {
                    if (valid) {
                        this.AddAdminUser();
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$t('message.CorrectInformation')
                        });
                    }
                })

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.PageIndex = val;
                this.getCompanys();
            },
            handleAdd() {
                this.dialogAddVisible = true;
                this.isEdit = false;
                // this.addForm.Id = 0;
                 this.addForm={
                    Id: 0,
                    CompanyCode: "",
                    CompanyName: "",
                    CompanyENName: "",
                    createTime: "",
                    updateTime: "",
                    CompanyShortName: "",
                    UpdaterId:getStore('Id'),
                    MaxEmployeeCode:"",
                    IsNeedSendInformation:true,
                    DoMain:"",
                    EmployeeCodeLength:10,
                    PrefixAdCount:""
                }
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
             handleSetAdmin(index, row) {
                this.editTitle = this.$t('message.Edit');
                this.isEdit = true;
                this.currentId = row.Id;
                 this.currentCompanyCode=row.CompanyCode;
                this.getCompanyAdminInfo(row.CompanyCode);
                this.dialogSetAdminVisible = true;
            },
            async addcompany() {
                const crs = await companyEdit(this.addForm);
                if (crs.Flag) {
                    this.dialogAddVisible = false;
                    this.getCompanys();
                    this.resetForm('addForm');
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            async getCompanyInfo() {
                const crs = await getCompanyInfo({
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
            async getCompanyAdminInfo(companyCode) {
                const crs = await getCompanyAdmin({
                    companyCode: companyCode
                });
                if (crs.Flag) {
                    this.setForm = crs.Result;
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
            async deleteCompany() {
                const crs = await deleteCompany({
                    id: this.currentId
                });
                if (crs.Flag) {
                    this.$message({
                        type: 'success',
                        message: this.$t('message.DeleteCompleted')
                    });
                    this.getCompanys();
                } else {
                    this.$message({
                        type: "error",
                        message: crs.Message
                    })
                }
            },
             async AddAdminUser() {
                 this.setForm.CompanyCode=this.currentCompanyCode;
                const crs = await AddAdmin(this.setForm);
                if (crs.Flag) {
                    this.dialogSetAdminVisible = false;
                    this.getCompanys();
                    this.resetForm('setForm');
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
            }
        }
    };

</script>
