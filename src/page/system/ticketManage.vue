<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-collapse v-model="activeNames" @change="topSearch">
                <el-collapse-item :title="$t('message.Search')" name="1">
            <el-form :model="search" ref="ruleForm">
                <el-form-item :label="$t('message.tm_date')" prop="number" :label-width="nameW">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="date"
                        type="daterange"
                        range-separator="—">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="button-line">
                <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                    <el-button type="primary" @click="searchList" icon="iconfont icon-sousuo"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                    <el-button type="info" @click="resetForm" icon="iconfont icon-zhongzhi"></el-button>
                </el-tooltip>
            </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="table_container" v-loading='isloading' style="padding-top: 20px">
            <el-table
                ref="multipleTable"
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%;"
                class="tableStyle"
                :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }"
                :height="tableHeight"
                :max-height="tableHeight">
                <el-table-column :label="$t('message.ta_ApplicationNumber')" prop="OrderNo"></el-table-column>
                <el-table-column :label="$t('message.ad_CostType')" prop="ExpenseItem"></el-table-column>
                <el-table-column :label="$t('message.ad_SubCostType')" prop="SubExpenseItem"></el-table-column>
                <el-table-column :label="$t('message.ad_CostCenter')" prop="CostCenter"></el-table-column>
                <el-table-column :label="$t('message.ta_CreateTime')" prop="CreatTimeStr"></el-table-column>
                <el-table-column :label="$t('message.tm_Passage')" prop="Remark"></el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
            </div>
            <el-dialog :title="$t('message.ta_DeleteApply')" :visible.sync="dialogAddVisible3" width="600px"
                       :close-on-click-modal='false' @close="DelectRoleCannel">
                <span>{{$t('message.ta_DeleteApplyMessage')}}</span>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="DelectRoleCannel" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="deleteRole()" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="chooseTitle" :modal-append-to-body="false" :visible.sync="dialogAddVisibleTitle"
                       width="600px" :close-on-click-modal='false'
                       @close="cannelNew">
                <el-form :model="addCost" :rules="rules" ref="addCost" :label-width="dialogOneW">
                    <el-form-item :label="$t('message.ta_Company')" prop="company">
                        <el-select clearable v-model="addCost.company" @change="changeSub" :placeholder="chooseHold"
                                   filterable style="width:200px;">
                            <el-option v-for="item in companyList" :key="item.CompanyID"
                                       :label="item.CompanyName"
                                       :value="item.CompanyID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.ta_Team')" prop="team">
                        <el-select clearable v-model="addCost.team" :placeholder="chooseHold"
                                   filterable style="width:200px;">
                            <el-option v-for="item in teamList" :key="item.TeamID"
                                       :label="item.TeamName"
                                       :value="item.TeamID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.ta_ApplyType')" prop="ExpenseTypeID">
                        <el-select clearable v-model="addCost.ExpenseTypeID"
                                   :placeholder="chooseHold" filterable style="width:200px;">
                            <el-option v-for="item in topList" :key="item.ExpenseTypeID"
                                       :label="item.ExpenseTypeName"
                                       :value="item.ExpenseTypeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="cannelNew" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="chosenTitle('addCost')"
                                   icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
        </div>
    </div>
</template>


<script>
    import axios from 'axios'
    import headTop from "../../components/headTop";
    import {baseUrl, baseImgPath} from "@/config/env";
    import {exportPDFfunGet} from "@/config/fetch";
    import {
        GetRolesList,
        CreateUpdRoles,
        DelRoleById,
        GetAllPages,
        GetPagePression,
        SetPagePression,
        GetApplyOrderList,
        DelApplyOrder,
        GetCostCenter,
        GetAirPlusTicketInfo
    } from '../../apiNew/api.js'
    import {getStore, getLocal} from "../../config/mUtils"
    import {
        getRoleList,
        getCompanys,
        editRole,
        deleteRole,
        permissions,
        getRoleInfo
    } from "@/api/getData";

    export default {
        data() {
            return {
                activeNames: ['1'],
                date:"",
                addCost: {
                    company: '',
                    team: '',
                    ExpenseTypeID: ''
                },
                companyList: [],
                teamList: [],
                topList: [],
                chooseTitle: this.$t('message.ChooseTitle'),
                chooseHold: this.$t('message.chooseHold'),
                checkNodes: [],
                checkNodesCopy: [],
                authId: '',
                delectID: '',
                baseUrl,
                baseImgPath,
                PageIndex: 1,
                PageSize: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                dialogFormVisible: false,
                dialogAddVisible2: false,
                dialogAddVisible3: false,
                dialogAddVisible: false,
                dialogAddVisibleTitle: false,
                isloading: false,
                companys: [],
                tableHeight: 0,
                addForm: {
                    RoleId: '',
                    RoleName: "",
                    Description: '',
                    EnglishName: '',
                },
                search: {
                    number: ""
                },
                treeData: [],
                props: {
                    children: 'children',
                    label: 'label'
                },
                dialotitle: this.$t('message.Add'),
                nameW: 0 + 'px',
                companyW: 0 + 'px',
                labelWidth: 0 + 'px'
            };
        },
        filters: {
            changeNull: function (val) {
                if (val == null) {
                    return '暂未选择';
                } else {
                    return val
                }

            },
        },
        created() {
            this.watchHeight();
            this.initData();
            this.resetLabelWidth();
        },
        computed: {
            rules: function () {
                return{
                    team: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ta_Team'),
                        trigger: "blur"
                    }],
                    company: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ta_Company'),
                        trigger: "blur"
                    }],
                    ExpenseTypeID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ta_ApplyType'),
                        trigger: "blur"
                    }],
                }
            },
        },
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight - 255;
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
            cannelNew() {
                this.dialogAddVisibleTitle = false;
                this.addCost = {
                    company: '',
                    team: '',
                    ExpenseTypeID: ''
                };
            },
            changeSub() {
                this.addCost.team = null;
                this.addCost.ExpenseTypeID = null;
                if (this.addCost.company == '') {
                    this.teamList = [];
                    this.topList = [];
                } else {
                    this.companyList.forEach((item, index) => {
                        if (this.addCost.company == item.CompanyID) {
                            // this.addCost.ExpenseItem = item.ExpenseItemName
                            this.teamList = this.companyList[index].TeamList;
                            this.topList = this.companyList[index].ExpenseTypeList;
                        }
                    })
                }
            },
            chosenTitle(params) {
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        this.$router.push({
                            path: '/applicationDetail',
                            query: {company:this.addCost.company,team:this.addCost.team,ExpenseTypeID: this.addCost.ExpenseTypeID,}
                        });
                    } else {
                        return false;
                    }
                });
            },
            delectApply(index, row) {
                this.$confirm(this.$t('message.deleteIt'), this.$t('message.warning'), {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id: row.Id,
                        user: null
                    }
                    DelApplyOrder(params).then(response => {
                        if (response.data.Flag) {
                            this.getApplyList();
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: this.$t('message.Fail')
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
                });
            },
            viewApply(item) {
                this.$router.push({
                    path: '/applicationDetail',
                    query: {OrderNo: item.Id, ApproveStatus: item.ApproveStatus, AccountStatus: item.AccountStatus}
                });
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 255;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getStore('CultureCode') == 'en-US') {
                    this.nameW = 80 + 'px';
                    this.companyW = 125 + 'px';
                    this.labelWidth = 140 + 'px';
                    this.dialogOneW = 100 + 'px';
                } else {
                    this.nameW = 65 + 'px';
                    this.companyW = 85 + 'px';
                    this.labelWidth = 70 + 'px';
                    this.dialogOneW = 90 + 'px';
                }
            },
            async initData() {
                /**获取用户列表 */
                try {
                    // this.getLanguageResource();
                    // this.getCompanys();
                    //   this.getPageData();
                    this.getApplyList();
                    // this.getPermission();
                } catch (err) {
                    console.log("获取数据失败", err);
                }
            },
            // mm
            openNewRole() {
                this.dialogAddVisibleTitle = true;
            },
            CancelNewRole() {
                this.dialogAddVisible2 = false;
                this.$refs['addForm'].resetFields();
            },
            openDelectRole(id) {
                this.delectID = id;
                this.dialogAddVisible3 = true;
            },
            DelectRoleCannel() {
                this.dialogAddVisible3 = false;
            },
            searchList(){
                this.currentPage = 1;
                this.PageIndex = 1;
                this.getApplyList();
            },
            getApplyList() {
                this.isloading = true;
                // let params = {
                //     searchCondition:this.ruleForm.RoleName,
                //     pageSize: this.PageSize,
                //     pageIndex: this.PageIndex
                // }
                let params = {
                    timeFrom: this.date[0],
                    timeTo: this.date[1],
                    PageSize: this.PageSize,
                    PageIndex: this.PageIndex,
                }
                GetAirPlusTicketInfo(params).then(response => {
                    this.tableData = response.data.Result.lstTicket;
                    this.count = response.data.Result.TotalCount
                    this.isloading = false;
                }).catch(error => {
                })
            },
            addNewRole(params) {
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        let roleInfo = {
                            RoleId: this.addForm.RoleId,
                            RoleName: this.addForm.RoleName,
                            RoleEnName: this.addForm.EnglishName,
                            Description: this.addForm.Description,
                            user: null
                        }
                        CreateUpdRoles(roleInfo).then(response => {
                            if (response.data.Flag) {
                                this.$message({
                                    type: "success",
                                    message: this.$t('message.Success')
                                });
                                this.$refs['addForm'].resetFields();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: this.$t('message.Fail')
                                });
                            }
                            this.dialogAddVisible2 = false;
                            this.getRoleList();
                        }).catch(error => {
                        })
                    } else {
                        return false;
                    }
                });
            },
            deleteRole() {
                let params = {
                    roleId: this.delectID,
                }
                DelRoleById(params).then(response => {
                    if (response.data.Flag) {
                        this.$message({
                            type: "success",
                            message: this.$t('message.Success')
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$t('message.Fail')
                        });
                        this.dialogAddVisible3 = false;
                        this.getRoleList();

                    }
                }).catch(error => {
                })
            },
            editRole(row) {
                this.dialotitle = this.$t('message.Edit');
                this.addForm = {
                    RoleName: row.RoleName,
                    Description: row.Description,
                    EnglishName: row.RoleEnName,
                    RoleId: row.RoleID
                }
                this.dialogAddVisible2 = true;
            },
            getPageData() {
                GetAllPages().then(response => {
                    if (response.data.Flag) {
                        this.treeData = response.data.Result;
                    } else {
                    }
                }).catch(error => {
                })
            },
            resetForm(formName) {
                this.date = ''
                this.searchList();
            },


            async getCompanys() {
                const crs = await getCompanys({
                    CompanyCode: getStore('CompanyCode'),
                    CompanyName: "",
                    UserId: getStore('Id'),
                    PageSize: 20,
                    PageIndex: 1
                });

                if (crs.Flag) {
                    this.companys = crs.Result.rows;

                }
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return "info-row";
                } else if (index === 3) {
                    return "positive-row";
                }
                return "";
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.PageIndex = val;
                this.getApplyList();
            },

            handleAdd() {
                this.dialogAddVisible = true;
                this.dialotitle = this.$t('message.Add');
                this.addForm.Id = 0;
                this.addForm.RoleName = "";
                this.addForm.CompanyCode = getStore('CompanyCode');
                this.treeData = [];
                this.getPermission();
            },
            handleEdit(index, row) {
                this.addForm = Object.assign({}, row);
                this.dialogAddVisible = true;
                this.dialotitle = this.$t('message.Edit');
                // alert(row.RolePermission);
                let setNodes = [];
                let setIds = row.RolePermission.split(',');
                console.log(setIds);
                setIds.forEach((item, index) => {

                    this.treeData.forEach((node, k) => {

                        if (node.children.length > 0) {
                            for (let i in node.children) {
                                // if(node.children[i].id==item){
                                //   setNodes.push(node.children[i]);
                                // }
                                if (node.children[i].children.length > 0) {
                                    for (let m = 0; m < node.children[i].children.length; m++) {
                                        if (node.children[i].children[m].id == item) {
                                            setNodes.push(node.children[i].children[m]);
                                        }
                                    }
                                } else {
                                    if (node.children[i].id == item) {
                                        setNodes.push(node.children[i]);
                                    }
                                    // else{
                                    //   break;
                                    // }
                                }
                            }
                        } else {
                            if (node.Id == item) {
                                setNodes.push(node);
                            } else {
                                return;
                            }
                        }
                    });
                });
                console.log(setNodes)
                this.$nextTick(function () {
                    this.$refs.tree.setCheckedNodes(setNodes);
                });

            },
            handleSelect(index) {
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
            },
            submitForm(formName) {
                this.getRoleList();
            },

            Cancel() {
                this.dialogAddVisible = false;
                this.$refs['addForm'].resetFields();
            },
            addRole(formName) {
                let selectNodes = this.$refs.tree.getCheckedNodes();
                let NodeIDs = [];
                selectNodes.forEach((item, index) => {
                    NodeIDs.push(item.id);
                });
                let halfcheckedNode = this.$refs.tree.getHalfCheckedNodes();
                halfcheckedNode.forEach(item => {
                    NodeIDs.push(item.id)
                })

                this.addForm.RolePermission = NodeIDs.join(',');
                console.log(this.addForm.permissions)

                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        this.dialogAddVisible = false;
                        try {
                            const res = await editRole(this.addForm);
                            if (res.Flag) {
                                this.$message({
                                    type: "success",
                                    message: this.$t('message.Success')
                                });
                                //this.$nextTick(function () {
                                this.$refs['addForm'].resetFields();
                                // this.$refs.tree.setCheckedNodes(setNodes);
                                //});
                                this.getRoleList();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.message
                                });
                            }
                        } catch (err) {
                            console.log("新增信息失败", err);
                        }
                    } else {
                        return false;
                    }
                });
            },
            handleDelete(index, row) {
                this.$confirm(this.$t('message.deleteIt'), this.$t('message.warning'), {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    this.deleteRole(row.Id)

                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: 'Delete canceled'
                    // });
                });
            },
            getCheckedNodes() {
                console.log(this.$refs.tree.getCheckedNodes());
            },
        }
    };
</script>
