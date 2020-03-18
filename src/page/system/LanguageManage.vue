<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-collapse v-model="activeNames" @change="topSearch">
                <el-collapse-item :title="$t('message.Search')" name="1">
            <el-form :model="ruleForm" ref="ruleForm"  @submit.native.prevent>
                <el-form-item :label="$t('message.lm_ResourceId')" prop="ItemID" :label-width="nameW">
                    <el-input clearable v-model="ruleForm.ItemID" :maxlength=50 clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.lm_ResourceContent')" prop="ItemContent" :label-width="contentW">
                    <el-input clearable v-model="ruleForm.ItemContent" :maxlength=50 clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.lm_LanguageType')" prop="CultureCode" :label-width="languageW">
                    <el-select clearable filterable v-model="ruleForm.CultureCode" placeholder=" ">
                        <el-option v-for="item in language" :key="item.label" :label="item.label" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <div class="button-line">
                    <el-form-item>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button type="primary" @click="submitForm" icon="iconfont icon-sousuo"></el-button>
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
        <div class="table_container" v-loading="isloading">
            <el-button-group>
                <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                    <el-button class="addBtn" type="primary" icon="iconfont icon-xinzeng-wubiankuang" @click="handleAdd"></el-button>
                </el-tooltip>
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.ImportEXCEL')" placement="top">-->
                    <!--<el-upload class="upload-demo" ref="upload" :action="baseUrl+'/api/language/uploadLanguage'" :on-success="handleAttachmentScucess"-->
                               <!--:show-file-list=false :multiple=true>-->
                        <!--<el-button class="addBtn uploadStyle" type="primary" icon="iconfont icon-Icon-daoru"></el-button>-->
                    <!--</el-upload>-->
                <!--</el-tooltip>-->
                <!--<el-tooltip class="item" effect="dark" :content="$t('message.ExportEXCEL')" placement="top">-->
                    <!--<el-button class="addBtn ml nobrs" type="primary" icon="iconfont icon-fenxiang" @click="exportExcel()"></el-button>-->
                <!--</el-tooltip>-->
            </el-button-group>
            <el-table ref="multipleTable" :data="tableData" :row-key="row => row.index" style="width: 100%;margin-top: 20px;" class="tableStyle" :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }"
                      :height="tableHeight"
                      :max-height="tableHeight">
                <el-table-column :label="$t('message.lm_ResourceId')" prop="ItemID">
                </el-table-column>
                <el-table-column :label="$t('message.lm_ResourceContent')" prop="ItemContent">
                </el-table-column>
                <el-table-column :label="$t('message.lm_LanguageType')" prop="CultureCode">
                </el-table-column>
                <el-table-column :label="$t('message.Operation')" width="100">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                            <el-button icon="iconfont icon-bianji-kong" class="hoverBtn" @click="handleEdit(scope.$index, scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                            <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" @click="openDelectRole(scope.row.Id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="PageSize" layout="total, prev, pager, next, jumper" :total="count" background>
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="$t('message.Add')" :visible.sync="dialogAddVisible" width="500px" :close-on-click-modal='false' @close="cancel">
            <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">
                <el-form-item :label="$t('message.lm_ResourceId')" prop="ItemID">
                    <el-input v-model="addForm.ItemID" auto-complete="off" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.lm_ResourceContent')" prop="ItemContent">
                    <el-input v-model="addForm.ItemContent" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.lm_LanguageType')" prop="CultureCode">
                    <el-select clearable filterable v-model="addForm.CultureCode" placeholder=" ">
                        <el-option v-for="item in language" :key="item.label" :label="item.label" :value="item.label"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                    <el-button @click="cancel" icon="iconfont icon-guanbi-wukuang"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                    <el-button type="primary" @click="addInfo('addForm')" icon="iconfont icon-gou-wukuang"></el-button>
                </el-tooltip>
            </div>
        </el-dialog>
        <el-dialog :title="$t('message.lm_Delect')" :modal-append-to-body="false" :visible.sync="dialogAddVisible3"  width="600px" :close-on-click-modal='false' @close="DelectRoleCannel">
            <span>{{$t('message.lm_DelectSure')}}</span>
            <div slot="footer" class="dialog-footer">
                <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                    <el-button @click="DelectRoleCannel" icon="iconfont icon-guanbi-wukuang"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                    <el-button type="primary" @click="deleteRole" icon="iconfont icon-gou-wukuang"></el-button>
                </el-tooltip>
            </div>
        </el-dialog>
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
        editLanguage,
        getResuouceList,
        getlanguage,
        getCompanys,
        getListguageInfo
    } from "@/api/getData";
    import {
        getLocal
    } from '../../config/mUtils';
    import {
        GetLanguageResource,
        CreateUpdLanguageResource,
        DelLanguageResourceById
    } from '../../apiNew/api.js'
    export default {
        data() {
            return {
                activeNames: ['1'],
                baseUrl,
                baseImgPath,
                delectID:'',
                dialogAddVisible3:false,
                restaurant_id: null,
                city: {},
                PageIndex: 1,
                PageSize: 10,
                count: 0,
                tableData: [],
                isloading: false,
                currentPage: 1,
                selectTable: {},
                addForm: {
                    Id:'',
                    ItemID: "",
                    ItemContent: "",
                    CultureCode: "",
                    user:null
                },
                dialogAddVisible: false,
                ruleForm: {
                    ItemID: "",
                    ItemContent: "",
                    CultureCode: ""
                },

                language: [
                    {label:'en-US',},
                    {label:'zh-CN',},
                ],
                companys: [],
                tableHeight: 0,
                nameW: 0+'px',
                contentW: 0+'px',
                languageW: 0+'px',
                labelWidth: 0+'px'
            };
        },
        created() {
            this.watchHeight();
            this.getList();
            this.resetLabelWidth();
        },
        computed: {
            rules:function () {
                return {
                    ItemID: [{
                        required: true,
                        message: this.$t('message.Input')+' '+this.$t('message.lm_ResourceId'),
                        trigger: "blur"
                    }],
                    ItemContent: [{
                        required: true,
                        message: this.$t('message.Input')+' '+this.$t('message.lm_ResourceContent'),
                        trigger: "blur"
                    }],
                    CultureCode: [{
                        required: true,
                        message:this.$t('message.PleaseSelect')+' '+this.$t('message.lm_LanguageType'),
                        trigger: "blur"
                    }]
                }
            }
        },
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight-295;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            topSearch(){
                console.log(this.activeNames);
                if(this.activeNames.length == 0){
                    this.tableHeight = this.tableHeight + 128;
                } else {
                    this.tableHeight = this.tableHeight - 128;
                }
            },
            cancel(){
                this.dialogAddVisible = false;
                this.$refs['addForm'].resetFields();
            },
            openDelectRole(id){
                this.delectID = id;
                this.dialogAddVisible3 = true;
            },
            deleteRole(){
                let params ={
                    Id: this.delectID,
                }
                DelLanguageResourceById(params).then(response => {
                    if(response.data.Flag){
                        this.$message({
                            type: "success",
                            message: this.$t('message.Success')
                        });
                    }else {
                        this.$message({
                            type: "error",
                            message: this.$t('message.Fail')
                        });
                    }
                    this.submitForm();
                    this.dialogAddVisible3 = false;
                }).catch(error => {
                })
            },
            DelectRoleCannel(){
                this.dialogAddVisible3 = false;
            },

            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight-295;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getLocal('CultureCode') == 'en-US') {
                    this.nameW = 90+'px';
                    this.contentW = 135+'px';
                    this.languageW = 125+'px';
                    this.labelWidth = 125+'px';
                } else {
                    this.nameW = 65+'px';
                    this.contentW = 85+'px';
                    this.languageW = 85+'px';
                    this.labelWidth = 70+'px';
                }
            },
            async initData() {
                try {
                    this.getListguageList();
                    this.getCompanys();
                     this.getResuouceList();
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
                 this.getList();
            },
            handleAdd() {
                this.dialogAddVisible = true;
                this.$refs['addForm'].resetFields();
                this.addForm={
                    Id:'',
                    ItemID: "",
                    ItemContent: "",
                    CultureCode: "",
                    user:null
                }
            },
            handleEdit(index, row) {
                this.dialogAddVisible = true;
                console.log(this.tableData[index]);
                this.addForm = {
                    Id:this.tableData[index].Id.toString(),
                    ItemID: this.tableData[index].ItemID,
                    ItemContent: this.tableData[index].ItemContent,
                    CultureCode: this.tableData[index].CultureCode,
                    user:null
                }
            },
            handleRemove(index, row) {
                this.updateForm = Object.assign({}, row);
                this.dialogFormVisible = true;
                this.isTemporary = row.IsTemporary == 2 ? true : false;
            },
            handleSelect(index) {
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
            },
            getList(){
                this.isloading = true;
                let params = {
                    CultureCode:this.ruleForm.CultureCode,
                    ItemID:this.ruleForm.ItemID,
                    ItemContent:this.ruleForm.ItemContent,
                    pageIndex:this.PageIndex,
                    pageSize:this.PageSize
                }
                GetLanguageResource(params).then(response => {
                    this.tableData = response.data.Result.languageResource;
                    this.count = response.data.Result.TotalCount;
                    this.isloading = false;
                }).catch(function (error) {
                })
            },
            submitForm() {
                this.currentPage = 1;
                this.PageIndex = 1;
                this.getList();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.submitForm();
            },
            exportExcel() {
                this.exportExcelFile();
            },
            addInfo(formName) {
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        let params = this.addForm;
                        CreateUpdLanguageResource(params).then(response => {
                            this.getList();
                            this.dialogAddVisible = false
                        }).catch(function (error) {
                        })
                    } else {
                        return false;
                    }
                });
            },
            async exportPDF() {
                var url = baseUrl + "/api/Manage/CreatExcelTemplate";
                exportPDFfunGet(url);
            },
            async getCompanys() {
                const crs = await getCompanys({
                    CompanyCode: "",
                    CompanyName: "",
                    PageSize: 20,
                    PageIndex: 1
                });

                if (crs.Flag) {
                    this.companys = crs.Result.rows;
                }
            },
            handleAttachmentScucess(res, file) {
                if (res.Flag) {
                    this.$message.success(this.$t('message.FileImportSuccessfully'));
                    this.getResuouceList();
                } else {
                    this.$message.error(this.$t('message.FileImportFailed'));
                }
            },
            async exportExcelFile() {
                let url=baseUrl+"/api/language/exportLanguage";
                exportPDFfunGet(url);
            }
        }
    };

</script>
