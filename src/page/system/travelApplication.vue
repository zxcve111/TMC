<template>
    <div class="fillcontain" v-loading="allLoading">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-collapse v-model="activeNames" @change="topSearch">
                <el-collapse-item :title="$t('message.Search')" name="1">
            <el-form :model="search" ref="ruleForm" @submit.native.prevent>
                <el-form-item :label="$t('message.ta_ApplicationNumber')" prop="number" :label-width="nameW">
                    <el-input clearable v-model="search.number" oninput="value=value.replace(/[\W]/g,'')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ApprovalStatus')" prop="approveState" :label-width="nameW">
                    <el-select clearable filterable v-model="search.approveState" placeholder=" ">
                        <el-option v-for="item in ApprovalStatus" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="button-line">
                <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                    <el-button type="primary" @click="searchList" icon="iconfont icon-sousuo"></el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                    <el-button type="info" @click="resetForm('ruleForm')" icon="iconfont icon-zhongzhi"></el-button>
                </el-tooltip>
            </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="table_container" v-loading='isloading'>
            <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top" style="z-index: 20">
                <el-button class="addBtn" type="primary" @click="openNewRole"
                           icon="iconfont icon-xinzeng-wubiankuang"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('message.lang_AMexLogin')" placement="top">
                <el-button class="addBtn" type="primary" @click="Login2Amex"
                           icon="iconfont icon-booking"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('message.BookingTemplate')" placement="top">
                <el-button icon="iconfont icon-xiazai-kong" class="addBtn" type="primary"
                           @click="downloadTemplate"></el-button>
            </el-tooltip>
            <el-table
                ref="multipleTable"
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%;margin-top: 20px;"
                class="tableStyle"
                :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }"
                :height="tableHeight"
                :max-height="tableHeight">
                <el-table-column :label="$t('message.ta_ApplicationNumber')" min-width="160">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="$t('message.SupplementaryPlan')" placement="top" :disabled="scope.row.OriginalMainId == null">
                          <el-button type="text" @click="viewApply(scope.row)" class="tableButton">{{scope.row.OrderNo}}<span v-if="scope.row.OriginalMainId != null" style="color: red;"><i class="iconfont icon-jihua" style="font-size: 20px;position: relative;top: 2px;"></i></span></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.ta_CreateTime')" prop="CreatTimeStr" width="150"></el-table-column>
                <el-table-column :label="$t('message.ta_CostSummary')" min-width="200">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.ApplyDetail">
                            <span v-if="item.ExpenseItem != null">{{item.ExpenseItem}}</span>
                            <span v-else>{{$t('message.notNull')}}</span>
                            <span v-if="item.CostCenter != null">{{item.CostCenter}}</span>
                            <span v-else>{{$t('message.notNull')}}</span>
                            <span v-if="item.SumMoney != ''">{{item.SumMoney}}</span>
                            <span v-else>{{$t('message.notNull')}}</span><br>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.ta_TotalSum')" prop="SumMoney" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.CurrencyName}} {{scope.row.SumMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.ta_ApprovalStatus')" min-width="115">
                    <template slot-scope="scope">
                        <span> {{$t('message.'+scope.row.ApproveStatus)}}/{{$t('message.'+scope.row.AccountStatus)}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.ta_CurrentApproveName')" min-width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.CurrentApproveName != ''">{{scope.row.CurrentApproveName}}</span>
                        <span v-else>{{$t('message.notNull2')}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.orderStatus')" min-width="100">
                    <template slot-scope="scope">
                        <span> {{$t('message.'+scope.row.OrderPushType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('message.Operation')" width="120">
                    <template slot-scope="scope">
                        <!--<el-tooltip class="item" effect="dark" :content="$t('message.Commit')" placement="top">-->
                        <!--<el-button icon="iconfont icon-shengcheng" class="hoverBtn" @click="editRole(scope.row)"></el-button>-->
                        <!--</el-tooltip>-->
                        <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                            <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn"
                                       @click="delectApply(scope.$index, scope.row)"
                                       :disabled="scope.row.ApproveStatus != 8211 || scope.row.OrderPushType == '2' ||scope.row.OrderPushType == '3' || scope.row.OrderPushType == '4'"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.rebook')" placement="top">
                            <el-button icon="iconfont icon-dingdan-chulizhong" class="hoverBtn"
                                       @click="amexLogin(scope.$index, scope.row)"
                                       :disabled="scope.row.TicketStatus == '0'"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.addProject')" placement="top">
                            <el-button icon="iconfont icon-xinzeng-kong" class="hoverBtn"
                                       @click="addPlan(scope.$index, scope.row)"
                                       :disabled="(scope.row.AccountStatus != 8202 || scope.row.ApproveStatus !=8213|| scope.row.OriginalMainId != null)||companyId == 1002621"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="PageSize"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
            </div>
            <el-dialog :title="$t('message.ta_DeleteApply')" :visible.sync="dialogAddVisible3" width="600px"
                       :close-on-click-modal='false'>
                <span>{{$t('message.ta_DeleteApplyMessage')}}</span>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="DelectRoleCannel" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="delectApplyCommit" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="chooseTitle" :modal-append-to-body="false" :visible.sync="dialogAddVisibleTitle"
                       width="600px" :close-on-click-modal='false'
                       @close="cannelNew">
                <el-form :model="addCost" :rules="rules" ref="addCost" :label-width="dialogOneW">
                    <el-form-item :label="$t('message.ta_Company')" prop="company" v-show="false">
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
                        <el-select clearable v-model="addCost.ExpenseTypeID" @change="changeMeeting"
                                   :placeholder="chooseHold" filterable style="width:200px;">
                            <el-option v-for="item in topList" :key="item.ExpenseTypeID"
                                       :label="item.ExpenseTypeName"
                                       :value="item.ExpenseTypeID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('message.ad_CostType')" prop="costId" v-if="companyId != 1002621">
                        <el-select clearable v-model="addCost.costId" 
                                   :placeholder="chooseCost" filterable style="width:200px;">
                            <el-option v-for="item in costList" :key="item.ExpenseItemID"
                                       :label="item.ExpenseItemName"
                                       :value="item.ExpenseItemID">
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
        Login2Amex,
        GetPagePression,
        SetPagePression,
        GetApplyOrderList,
        DelApplyOrder,
        GetCostCenter,
        JWTLogin,
        GetFileInfoByFileId,
        GetCurrencyType,
    } from '../../apiNew/api.js'
    import {getStore, getLocal,setStore,removeStore} from "../../config/mUtils"
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
                delectApplyID:'',
                isMeeting:false,
                activeNames: [],
                allLoading:false,
                addCost: {
                    company: '',
                    team: '',
                    ExpenseTypeID: '',
                    currencyType:"",
                    costId:''
                },
                companyList: [],
                teamList: [],
                topList: [],
                costList:[],
                checkNodes: [],
                checkNodesCopy: [],
                authId: '',
                delectID: '',
                baseUrl,
                baseImgPath,
                PageIndex: 1,
                PageSize: 10,
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
                    number: "",
                    approveState:"",
                },
                treeData: [],
                props: {
                    children: 'children',
                    label: 'label'
                },
                dialotitle: this.$t('message.Add'),
                nameW: 0 + 'px',
                companyW: 0 + 'px',
                labelWidth: 0 + 'px',
                CurrencyTypeList:[],
                text1:this.$t('message.notNull'),
                emlogin:'',
                companyId:getStore('CompanyID'),
            };
        },
        filters: {
            NumFormat: function (value) {
                if(typeof value !== 'string'){
                    value = value.toString();
                }
                if (!value) return '0.00';
                var intPart = Number(value).toFixed(0); // 获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断
                var floatPart = '.00'; // 预定义小数部分
                var value2Array = value.split('.');
                if (value2Array.length === 2) { // =2表示数据有小数位
                    floatPart = value2Array[1].toString(); // 拿到小数部分
                    if (floatPart.length === 1) { // 补0,实际上用不着
                        return intPartFormat + '.' + floatPart + '0';
                    } else {
                        return intPartFormat + '.' + floatPart;
                    }
                } else {
                    return intPartFormat + floatPart;
                }
            }
        },
        created() {
            this.watchHeight();
            this.initData();
            this.resetLabelWidth();
            if(!getStore('sanlian')){
                this.getSanSelect();
            } else {
                this.companyList = JSON.parse(getStore('sanlian'));
                console.log(  this.companyList )
            }
            if(this.$route.query.emlogin){
                this.emlogin=this.$route.query.emlogin;
              //  this.openNewRole();
            }
            if(this.$route.query.team){
                this.addCost.team=this.$route.query.team
            }
            if(this.$route.query.ExpenseTypeID){
                this.addCost.ExpenseTypeID=this.$route.query.ExpenseTypeID
            }
        },
        computed: {
            ApprovalStatus() {
                return [
                    {label:this.$t('message.8211'),
                    value:8211},
                    {label:this.$t('message.8212'),
                     value:8212},
                    {label:this.$t('message.8213'),
                     value:8213},]
            },
            chooseTitle:function () {
                return this.$t('message.ChooseTitle')
            },
            chooseHold:function () {
                return this.$t('message.chooseHold')
            },
            chooseCost:function(){
                return this.$t('message.chooseCost')
            },
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
                    currencyType: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.lang_currency'),
                        trigger: "blur"
                    }],
                    costId:[{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostType'),
                        trigger: "change"
                    }],
                }
            },
        },
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight - 295;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            Login2Amex() {
                let params = {
                    user: null,
                    CultureCode: getStore('CultureCode'),
                }
                Login2Amex(params).then(response => {
                    window.open(response.data.Result.url)
                }).catch(error => {
                })
            },
            downloadTemplate(){
                let params = {
                    FileId: 5479402
                }
                GetFileInfoByFileId(params).then(response => {
                    // window.open(response.data.Result.FilePath)
                    let elemIF = document.createElement("iframe");
                    elemIF.src = response.data.Result.FilePath;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }).catch(function (error) {
                })
            },
            addPlan(index,row){
                this.$confirm(this.$t('message.supplementaryPlan'), this.$t('message.warning'), {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({
                        path: '/applicationDetail',
                        query: {company:getStore('CompanyID'),team:row.TeamID,ExpenseTypeID: row.ExpenseTypeID,OriginalMainId:row.Id,CostId:row.ExpenseItemID}
                    });
                }).catch(() => {
                });
            },
            delectApplyCommit(){
                let params = {
                    id: this.delectApplyID,
                    user: null
                }
                DelApplyOrder(params).then(response => {
                    if (response.data.Flag) {
                        this.searchList();
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
                this.dialogAddVisible3 = false;
                this.getApplyList();
            },
            changeMeeting(){
                this.topList.forEach((item,index)=>{
                    if(this.addCost.ExpenseTypeID == item.ExpenseTypeID){
                        this.isMeeting = item.IsMeeting;
                         this.addCost.costId=''
                        if (this.addCost.ExpenseTypeID == '') {
                              this.costList = [];
                        }else{
                            this.costList=item.ExpenseItemList;
                           
                        }
                    }
                    
                })
            },
            amexLogin(index,row){
                let params = {
                    ApplyMainId: row.Id,
                    loginExternalOrderNo: row.OrderGuid,
                    ExpenseTypeID: row.ExpenseTypeID,
                    ExpenseTypeName: row.ExpenseTypeName,
                    user: null,
                    CompanyID: row.CompanyID,
                    TeamID: row.TeamID,
                    CultureCode:getStore('CultureCode'),
                }
                JWTLogin(params).then(response => {
                    window.open(response.data.Result.url)
                    this.order = response.data.Result.OrderNo;
                    this.IdGuid = response.data.Result.applyMainId
                    this.flashShow = true
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
            jiaoyan(){
                this.$nextTick(() => {
                    this.search.number = this.search.number.replace(/[\W]/g, '')
                })
            },
            cannelNew() {
                this.dialogAddVisibleTitle = false;
                this.addCost = {
                    company: '',
                    team: '',
                    ExpenseTypeID: '',
                    costId:''
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
                            if(this.teamList.length == 1){
                                this.addCost.team = this.companyList[index].TeamList[0].TeamID;
                            }
                            if(this.topList.length == 1){
                                this.addCost.ExpenseTypeID = this.companyList[index].ExpenseTypeList[0].ExpenseTypeID;
                            }
                        }
                    })
                }
            },
            chosenTitle(params) {
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        if(getStore("OrderNo")){
                            removeStore("OrderNo");
                        };
                        this.$router.push({
                            path: '/applicationDetail',
                            query: {company:this.addCost.company,team:this.addCost.team,ExpenseTypeID: this.addCost.ExpenseTypeID,isMeeting:this.isMeeting,CostId:this.addCost.costId}
                        });
                    } else {
                        return false;
                    }
                });
            },
            getSanSelect() {
                this.allLoading = true;
                let params = {
                    user: null
                }
                GetCostCenter(params).then(response => {
                    this.companyList = response.data.Result.Result;
                    this.addCost.company = getStore("1000003");
                    window.sessionStorage.setItem('sanlian', JSON.stringify(response.data.Result.Result));
                    this.allLoading = false;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: this.$t('message.Fail')
                    });
                })
            },
            delectApply(index, row) {
                this.dialogAddVisible3 = true;
                this.delectApplyID = row.Id;
                // this.$confirm(this.$t('message.deleteIt'), this.$t('message.warning'), {
                //     confirmButtonText: ' ',
                //     cancelButtonText: ' ',
                //     confirmButtonClass: 'iconfont icon-gou-wukuang',
                //     cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                //     type: 'warning'
                // }).then(() => {

                // }).catch(() => {

                // });
            },
            viewApply(item) {
                    this.$router.push({
                        path: '/applicationDetail',
                        query: {OrderNo: item.Id, ApproveStatus: item.ApproveStatus, AccountStatus: item.AccountStatus,CostId:item.ExpenseItemID}
                    });

            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 295;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            resetLabelWidth() {
                if (getStore('CultureCode') == 'en-US') {
                    this.nameW = 120 + 'px';
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
                this.$nextTick(() => {
                    this.$refs['addCost'].resetFields();
                })
                this.addCost.company = getStore('CompanyID');
                this.changeSub();
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
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
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
                    PageSize: this.PageSize,
                    PageIndex: this.PageIndex,
                    searchCondition: this.search.number,
                    approveState: this.search.approveState,
                    CompanyID: getStore("CompanyID")
                }
                GetApplyOrderList(params).then(response => {
                    this.tableData = response.data.Result.applyMain;
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
                this.$refs[formName].resetFields();
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
