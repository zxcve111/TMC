<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-form :model="search" ref="ruleForm">
                <el-form-item :label="$t('message.QueryInformation')" prop="number" :label-width="nameW">
                    <el-input clearable v-model="search.number"></el-input>
                </el-form-item>
                <div class="button-line">
                    <el-form-item>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button type="primary" @click="getApplyList" icon="iconfont icon-sousuo"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                            <el-button type="info" @click="resetForm('ruleForm')" icon="iconfont icon-zhongzhi"></el-button>
                        </el-tooltip>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table_container"  v-loading='isloading'>
            <el-tooltip class="item" effect="dark" :content="$t('message.booking')" placement="top">
                <el-button class="addBtn"type="primary" @click="booking" icon="iconfont icon-booking"></el-button>
            </el-tooltip>
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
                <el-table-column :label="$t('message.om_OrderMunber')" prop="RoleName">
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewApply(scope.row)">{{scope.row.MappingNo}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.om_OrderPerson')" prop="ChineseName"></el-table-column>
                <el-table-column :label="$t('message.om_OrderTime')" prop="CreateTimeStr">
                </el-table-column>
                <el-table-column :label="$t('message.om_OrderState')">
                    <template slot-scope="scope">
                        <span> {{$t('message.OrderStatus'+scope.row.AmexOrderStatus)}}</span>
                    </template>
                </el-table-column>
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
            <el-dialog :title="$t('message.ta_DeleteApply')" :visible.sync="dialogAddVisible3"  width="600px" :close-on-click-modal='false' @close="DelectRoleCannel">
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
            <el-dialog :title="$t('message.DeleteRole')" :visible.sync="dialogAddVisible"  width="600px" :close-on-click-modal='false' @close="cancelConfig">
                <el-tree
                    :default-checked-keys='checkNodes'
                    :props="props"
                    :data="treeData"
                    show-checkbox
                    ref="tree"
                    node-key="id"
                >
                </el-tree>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="cancelConfig" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="commitAuth" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="chooseTitle" :visible.sync="dialogAddVisibleTitle" width="600px" :close-on-click-modal='false'
                       @close="dialogAddVisibleTitle = false">
                <el-form :model="addCost" :rules="rules" ref="addCost" :label-width="dialogOneW">
                    <el-form-item :label="$t('message.ta_ApplyType')" prop="ExpenseItemID">
                        <el-select clearable v-model="addCost.ExpenseTypeID" :placeholder="chooseHold" filterable style="width:200px;">
                            <el-option v-for="item in topList" :key="item.ExpenseTypeID"
                                       :label="item.ExpenseTypeName"
                                       :value="item.ExpenseTypeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="dialogAddVisibleTitle = false" icon="iconfont icon-guanbi-wukuang"></el-button>
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
    import { baseUrl, baseImgPath } from "@/config/env";
    import { exportPDFfunGet } from "@/config/fetch";
    import {GetRolesList,CreateUpdRoles,DelRoleById,GetAllPages,GetPagePression,SetPagePression,GetApplyOrderList,DelApplyOrder,JWTLogin,GetAdvanceOrder} from '../../apiNew/api.js'
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
                addCost:{
                    ExpenseTypeID:''
                },
                topList:[],
                chooseTitle: this.$t('message.ChooseTitle'),
                chooseHold: this.$t('message.chooseHold'),
                checkNodes:[],
                checkNodesCopy:[],
                authId:'',
                delectID: '',
                baseUrl,
                baseImgPath,
                PageIndex: 1,
                PageSize: 20,
                count: 5,
                tableData:[],
                // tableData: [{
                //     OrderNo: 334573021,
                //     OrderPerson:'张帆',
                //     CreatTimeStr: '2019-04-01 09:21:57',
                //     OrderState:'预订中'
                // },{
                //     OrderNo: 334573022,
                //     OrderPerson:'王文建',
                //     CreatTimeStr: '2019-04-04 09:44:47',
                //     OrderState:'预订成功'
                // },{
                //     OrderNo: 334573023,
                //     OrderPerson:'夏艳',
                //     CreatTimeStr: '2019-04-06 12:48:31',
                //     OrderState:'出票成功'
                // },{
                //     OrderNo: 334573026,
                //     OrderPerson:'杨莉',
                //     CreatTimeStr: '2019-04-02 15:58:46',
                //     OrderState:'预订中'
                // },{
                //     OrderNo: 334573045,
                //     OrderPerson:'陈隆',
                //     CreatTimeStr: '2019-04-06 14:12:34',
                //     OrderState:'预订成功'
                // }],
                currentPage: 1,
                dialogFormVisible: false,
                dialogAddVisible2:false,
                dialogAddVisible3:false,
                dialogAddVisible: false,
                dialogAddVisibleTitle: false,
                isloading: false,
                companys:[],
                tableHeight: 0,
                addForm: {
                    RoleId:'',
                    RoleName: "",
                    Description:'',
                    EnglishName:'',
                },
                search:{
                    number: ""
                },
                rules: {
                    ExpenseTypeID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ta_ApplyType'),
                        trigger: "change"
                    }],
                },
                treeData:[],
                props: {
                    children: 'children',
                    label: 'label'
                },
                dialotitle:this.$t('message.Add'),
                nameW: 0+'px',
                companyW : 0+'px',
                labelWidth : 0+'px'
            };
        },
        created() {
            this.getAmex();
            this.watchHeight();
            this.initData();
            this.resetLabelWidth();
        },
        computed: {},
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight-275;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            getAmex(){
                let params = {
                    user: null
                }
                GetAdvanceOrder(params).then(response => {
                    this.tableData = response.data.Result;

                }).catch(error => {
                })
            },
            booking() {
                let Guid = this.newGuid();
                let params = {
                    loginExternalOrderNo:Guid,
                    user:null
                }
                JWTLogin(params).then(response => {
                    window.open(response.data.Result)
                    this.$confirm(this.$t('message.booked'), 'Warning', {
                        confirmButtonText: ' ',
                        cancelButtonText: ' ',
                        confirmButtonClass: 'iconfont icon-gou-wukuang',
                        cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                        type: 'warning'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.complateBook')
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: this.$t('message.continueBooking')
                        });
                    });
                }).catch(error => {
                })
            },
            newGuid() {
                let guid = "";
                for (let i = 1; i <= 32; i++) {
                    let n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                        guid += "-";
                }
                return guid;
            },
            chosenTitle(params){
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        this.$router.push({path:'/applicationDetail',query:{ExpenseTypeID :this.addCost.ExpenseTypeID}});
                    } else {
                        return false;
                    }
                });

            },
            delectApply(index, row){
                this.$confirm(this.$t('message.deleteIt'), 'Warning', {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:row.Id
                    }
                    DelApplyOrder(params).then(response => {
                        if(response.data.Flag){
                            this.getApplyList();
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
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
            viewApply(item){
                this.$router.push({path:'/applicationDetail',query:{OrderNo:item.Id}});
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight-275;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getStore('CultureCode') == 'en-US') {
                    this.nameW = 130+'px';
                    this.companyW = 125+'px';
                    this.labelWidth = 140+'px';
                    this.dialogOneW = 100 + 'px';
                } else {
                    this.nameW = 65+'px';
                    this.companyW = 85+'px';
                    this.labelWidth = 70+'px';
                    this.dialogOneW = 90 + 'px';
                }
            },
            async initData() {
                /**获取用户列表 */
                try {
                    // this.getLanguageResource();
                    // this.getCompanys();
                    //   this.getPageData();
                    // this.getApplyList();
                    // this.getPermission();
                } catch (err) {
                    console.log("获取数据失败", err);
                }
            },
            // mm
            openNewRole(){
                this.dialogAddVisibleTitle = true;
            },
            CancelNewRole(){
                this.dialogAddVisible2 = false;
                this.$refs['addForm'].resetFields();
            },
            openDelectRole(id){
                this.delectID = id;
                this.dialogAddVisible3 = true;
            },
            DelectRoleCannel(){
                this.dialogAddVisible3 = false;
            },
            getApplyList() {
                this.isloading = true;
                // let params = {
                //     searchCondition:this.ruleForm.RoleName,
                //     pageSize: this.PageSize,
                //     pageIndex: this.PageIndex
                // }
                let params = {
                    PageSize: this.PageSize,
                    PageIndex: this.PageIndex,
                    searchCondition:this.search.number,
                }
                GetApplyOrderList(params).then(response => {
                    this.tableData = response.data.Result.applyMain;
                    this.count = response.data.Result.TotalCount
                    this.isloading = false;
                }).catch(error => {
                })
            },
            addNewRole(params){
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        let roleInfo = {
                            RoleId:this.addForm.RoleId,
                            RoleName:this.addForm.RoleName,
                            RoleEnName:this.addForm.EnglishName,
                            Description:this.addForm.Description,
                            user:null
                        }
                        CreateUpdRoles(roleInfo).then(response => {
                            if(response.data.Flag){
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
            deleteRole(){
                let params ={
                    roleId: this.delectID,
                }
                DelRoleById(params).then(response => {
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
                        this.dialogAddVisible3 = false;
                        this.getRoleList();

                    }
                }).catch(error => {
                })
            },
            editRole(row){
                this.dialotitle = this.$t('message.Edit');
                this.addForm ={
                    RoleName: row.RoleName,
                    Description: row.Description,
                    EnglishName: row.RoleEnName,
                    RoleId: row.RoleID
                }
                this.dialogAddVisible2 = true;
            },
            configAuth(id){
                this.authId = id;
                let params = {
                    roleId : id
                }
                GetPagePression(params).then(response => {
                    response.data.Result.forEach((item,index)=>{
                        this.checkNodes.push(item.PageID)
                    })
                    this.getPageData();
                }).catch(error => {
                })
                this.dialogAddVisible = true;
            },
            commitAuth(){
                console.log(this.$refs.tree.getCheckedKeys());
                let params = {
                    pageIds : this.$refs.tree.getCheckedKeys(),
                    roleId : this.authId
                }
                SetPagePression(params).then(response => {
                    if(response.data.Flag){
                        this.$message({
                            type: "success",
                            message: this.$t('message.Success')
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: this.$t('message.Fail')
                        });
                    }
                }).catch(error => {
                })
                this.authId = ''
                this.checkNodes = [];
                this.dialogAddVisible = false;
            },
            cancelConfig(){
                this.dialogAddVisible = false;
                this.authId = '';
                this.checkNodes = []
            },
            getPageData(){
                GetAllPages().then(response => {
                    if(response.data.Flag){
                        this.treeData = response.data.Result;
                    }else {
                    }
                }).catch(error => {
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getApplyList();
            },




            async getCompanys() {
                const crs = await getCompanys({
                    CompanyCode:getStore('CompanyCode'),
                    CompanyName: "",
                    UserId:getStore('Id'),
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
                this.getRoleList();
            },

            handleAdd() {
                this.dialogAddVisible = true;
                this.dialotitle = this.$t('message.Add');
                this.addForm.Id=0;
                this.addForm.RoleName="";
                this.addForm.CompanyCode=getStore('CompanyCode');
                this.treeData=[];
                this.getPermission();
            },
            handleEdit(index, row) {
                this.addForm = Object.assign({}, row);
                this.dialogAddVisible = true;
                this.dialotitle = this.$t('message.Edit');
                // alert(row.RolePermission);
                let setNodes=[];
                let setIds = row.RolePermission.split(',');
                console.log(setIds);
                setIds.forEach((item,index)=>{

                    this.treeData.forEach((node,k)=>{

                        if(node.children.length>0){
                            for( let i in node.children){
                                // if(node.children[i].id==item){
                                //   setNodes.push(node.children[i]);
                                // }
                                if(node.children[i].children.length>0){
                                    for(let m=0; m<node.children[i].children.length;m++){
                                        if(node.children[i].children[m].id==item){
                                            setNodes.push(node.children[i].children[m]);
                                        }
                                    }
                                }
                                else{
                                    if(node.children[i].id==item){
                                        setNodes.push(node.children[i]);
                                    }
                                    // else{
                                    //   break;
                                    // }
                                }
                            }
                        }
                        else{
                            if(node.Id==item){
                                setNodes.push(node);
                            }
                            else{
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

            Cancel(){
                this.dialogAddVisible=false;
                this.$refs['addForm'].resetFields();
            },
            addRole(formName) {
                let selectNodes = this.$refs.tree.getCheckedNodes();
                let NodeIDs =[];
                selectNodes.forEach((item,index) =>{
                    NodeIDs.push(item.id);
                });
                let halfcheckedNode = this.$refs.tree.getHalfCheckedNodes();
                halfcheckedNode.forEach(item=>{
                    NodeIDs.push(item.id)
                })

                this.addForm.RolePermission=NodeIDs.join(',');
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
            handleDelete(index,row){
                this.$confirm(this.$t('message.deleteIt'), 'Warning', {
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
