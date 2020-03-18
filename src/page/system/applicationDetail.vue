<template>
    <div class="fillcontain" v-loading="loadingAll">
        <head-top @changeLan='detailChangeSize'></head-top>

        <div class="all">
                <div class="search-box-long" id="searchBox" style="padding-bottom:30px">
                    <div class="applyTitle">{{$t('message.ad_ApplicationInfo')}}
                        <el-tooltip class="item" effect="dark" :content="$t('message.toMainPlan')" placement="top" v-if="OriginalMainId != null">
                            <el-button type="primary" @click="toMainPlan" icon="iconfont icon-daoru"></el-button>
                        </el-tooltip>
                        <span style="color: red" v-if="!disabledType">{{$t('message.ad_amexInfo')}}</span>
                    </div>
                    <el-form :model="applicationInfo" ref="topForm" :disabled="disabledType" :rules="toprules">
                        <el-form-item :label="$t('message.ta_ApplicationNumber')" prop="to" :label-width="reasonW">
                            <el-input v-model="OrderNo" disabled style="width: 163px;"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.ta_ApplyType')" prop="to" :label-width="reasonW">
                            <el-input v-model="applyType" disabled style="width: 163px;"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_CostType')" prop="to" :label-width="reasonW" v-if="companyId != 1002621 &&CostId!='' ">
                            <el-input v-model="costType" disabled style="width: 163px;"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_Oversea')" prop="overseaList" :label-width="reasonW">
                            <el-select clearable v-model="applicationInfo.overseaList" placeholder=" "
                                       style="width: 163px;">
                                <el-option v-for="item in overseaOption" :key="item.overseaCode" :label="item.overseaName"
                                           :value="item.overseaCode">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="$t('message.ad_EstimatedStartDate')" prop="startData" :label-width="reasonW">
                            <el-date-picker v-model="applicationInfo.startData" type="date" :picker-options="pickerOptions0" @change="changeStartTime" :default-value="changeStart"
                                            class="dateStyle"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_EstimatedCloseDate')" prop="endData" :label-width="reasonW">
                            <el-date-picker v-model="applicationInfo.endData" type="date"
                                            class="dateStyle" :picker-options="pickerOptions1" @change="changeEndTime" :default-value="changeEnd"
                                            style="width: 178px;"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_loaction')" prop="Place" :label-width="reasonW">
                            <el-tooltip class="item" effect="dark" :content="applicationInfo.Place" placement="top" :disabled="applicationInfo.Place ==''">
                                <el-input v-model="applicationInfo.Place" auto-complete="off" style="width: 163px;" class="ellipsis2"
                                      :maxlength=50 clearable></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_TripPurpose')" prop="Purpose" :label-width="reasonW" v-if='companyId == 1002621'>
                            <el-tooltip class="item" effect="dark" :content="applicationInfo.Purpose" placement="top" :disabled="applicationInfo.Purpose ==''">
                            <el-input v-model="applicationInfo.Purpose" auto-complete="off" style="width: 163px;"  class="ellipsis2"
                                      :maxlength=32 clearable></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_TripPurpose')" prop="Purpose" :label-width="reasonW" v-else>
                            <el-tooltip class="item" effect="dark" :content="applicationInfo.Purpose" placement="top" :disabled="applicationInfo.Purpose ==''">
                            <el-input v-model="applicationInfo.Purpose" auto-complete="off" style="width: 163px;"  class="ellipsis2"
                                      :maxlength=100 clearable></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :label="$t('message.lang_currency')"  :label-width="reasonW">
                            <el-input v-model="CurrencyText" auto-complete="off" style="width: 163px;"  class="ellipsis2" disabled
                                      :maxlength=100 clearable></el-input>
                            <!--<el-select clearable v-model="applicationInfo.Currency" placeholder=" " filterable disabled-->
                                       <!--@change="changeCtext"-->
                                       <!--style="width: 163px;">-->
                                <!--<el-option v-for="item in currencyTypeList" :key="item.CurrencyID" :label="item.CurrencyName"-->
                                           <!--:value="item.CurrencyID">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        
                        <el-form-item :label="$t('message.ad_customerReason')"  :label-width="reasonW" prop="CustomerReason" v-if="companyId == 1002621 && isMeeting==true">
                            <el-input v-model.trim="applicationInfo.CustomerReason" auto-complete="off" style="width: 163px;"  class="ellipsis2" 
                                       :maxlength=256 clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_Speaker')"  :label-width="reasonW" prop="Speaker" v-if="companyId == 1002621 && isMeeting==true">
                            <el-input v-model.trim="applicationInfo.Speaker" auto-complete="off" style="width: 163px;overflow：hidden"  class="ellipsis2" 
                                      :maxlength=64  clearable></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_Baosheng')" prop="Baosheng" :label-width="reasonW" v-if="companyId == 1002621 && isMeeting==true">
                            <el-select clearable v-model="applicationInfo.Baosheng" placeholder=" "
                                       style="width: 163px;">
                                <el-option v-for="item in baosheng" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- OAnumber -->
                        <!-- <el-form-item :label="$t('message.ad_OAnumber')" style="line-height:20px" prop="OAnumber" :label-width="reasonW" :rules="{
      required: this.OArequire, message: this.$t('message.Input') + ' ' + this.$t('message.ad_OAnumber'), trigger: 'blur' }">                      
                                   <el-input v-model.trim="applicationInfo.OAnumber" auto-complete="off" style="width: 163px;"  class="ellipsis2" 
                                      :maxlength=50  clearable ></el-input>
                                        <div class="sub-title" style="font-size:12px;color:red;line-height:20px;position:absolute;">{{this.$t('message.Lang_OATips')}}
                                            <el-link style='margin-left:5px' href="https://oa.fresenius-kabi.com.cn/" icon="el-icon-link" target="_blank"></el-link>
                                             <el-tooltip class="item" effect="dark" :content="$t('message.ad_Document')" placement="right-start">
                                                <el-link style='margin-left:5px' icon="el-icon-question" target="_blank" href='https://tmc.fresenius-kabi.com.cn/Content/Image/InterfaceOAInstruction.jpg'></el-link>
                                             </el-tooltip>
                                        </div>
                        </el-form-item> -->
                    </el-form>
                    <el-dialog :title="mainPlanTitle" :modal-append-to-body="false" :visible.sync="mainPlanshow" width="900px"
                               :close-on-click-modal='false'>
                        <div style="border: 1px solid #d9d9d9;">
                            <main-plan v-bind:OriginalMainId="OriginalMainId"></main-plan>
                        </div>
                    </el-dialog>
                </div>
                <div class="table_container" v-if="orderShow">
                    <div class="applyTitle">{{$t('message.ad_OrderCost')}}</div>
                    <el-tooltip class="item" effect="dark" :content="$t('message.booking')" placement="top"  v-if="!disabledType && ticketTable.length == 0 && hotelTable.length == 0 && hasIntlAir != 1">
                        <el-button class="addBtn" type="primary" @click="booking" :disabled="tooltipShow"
                                   icon="iconfont icon-booking"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.changeTicket')" placement="top"  v-if="!disabledType && hasIntlAir != 1 && (ticketTable.length != 0 || hotelTable.length != 0)">
                        <el-button class="addBtn" type="primary" @click="Login2Amex" :disabled="tooltipShow"
                                   icon="iconfont icon-daiban"></el-button>
                    </el-tooltip>
                    <!--<el-tooltip class="item" effect="dark" :content="$t('message.booking')" placement="top">-->
                    <!--<el-button class="addBtn" type="primary" @click="booking" :disabled="tooltipShow"-->
                    <!--v-if="!disabledType && ticketTable.length == 0 && hotelTable.length == 0 && hasIntlAir != 1"-->
                    <!--icon="iconfont icon-feiji"></el-button>-->
                    <!--</el-tooltip>-->
                    <el-tooltip class="item" effect="dark" :content="$t('message.fresh')" placement="top">
                        <el-button type="primary" class="addBtn" @click="getAmex" icon="iconfont icon-zhongzhi"
                                   v-if="!disabledType"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.ensure')" placement="top">
                        <el-button class="addBtn" type="primary" @click="booking"
                                   v-if="hasIntlAir == 1 && orderPushType != 2 && !disabledType"
                                   :disabled="intlAirPushType != 'BOOKED'"
                                   icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>

                    <span style="color: red" v-if="hasIntlAir == 1 && intlAirPushType == 'BOOKED' && orderPushType != 2">{{$t('message.ad_ensureText')}}</span>
                    <span style="color: red" v-if="hasIntlAir == 1 && intlAirPushType != 'BOOKED'">{{$t('message.ad_ensureText2')}}</span>
                    <div class="amex">
                        <p>{{$t('message.ad_TicketCost')}}
                            <el-tooltip class="item" effect="dark" :content="$t('message.ad_moreEdit')" placement="top">
                                <el-button class="addBtn" type="primary" @click="openAirAll"
                                           v-if="!disabledType && (isMeeting || !LockCostCenter)"
                                           :disabled="ticketAllList.length == 0 || (!isMeeting && LockCostCenter)"
                                           style="margin: 0"
                                           icon="iconfont icon-bianji-kong"></el-button>
                            </el-tooltip>
                        </p>
                        <el-table
                            ref="ticketTable"
                            :data="ticketTable"
                            :row-key="row => row.index"
                            style="width: 100%;"
                            class="tableStyle"
                            @selection-change="ticketAll"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column
                                type="selection"
                                width="55" v-if="!disabledType">
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_CostType')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.ExpenseItem">{{scope.row.ExpenseItem}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_SubCostType')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.SubExpenseItem">{{scope.row.SubExpenseItem}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_CostCenter')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.CostCenter">{{scope.row.CostCenter}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting==true&&companyId!=1002621" prop="ProductName"></el-table-column>
                            <el-table-column :label="$t('message.ad_Cost')">
                                <template slot-scope="scope">
                                    {{scope.row.SumMoney | NumFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                            <el-table-column :label="$t('message.ReasonCode')" prop="ReasonCode"></el-table-column>
                            <el-table-column :label="$t('message.Operation')" width="150">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                                        <el-button icon="iconfont icon-bianji-kong" class="hoverBtn"
                                                   :disabled="disabledType" v-if="isMeeting==true || !LockCostCenter"
                                                   @click="showAirCost(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('message.View')" placement="top">
                                        <el-button icon="iconfont icon-yanjing-shi" class="hoverBtn"
                                                   @click="showAirInfo(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="amex">
                        <p>{{$t('message.ad_HotelCost')}}
                            <el-tooltip class="item" effect="dark" :content="$t('message.ad_moreEdit')" placement="top">
                                <el-button class="addBtn" type="primary" @click="openHotelAll"
                                           v-if="!disabledType && (isMeeting || !LockCostCenter)"
                                           :disabled="hotelAllList.length == 0 ||  (!isMeeting && LockCostCenter)"
                                           style="margin: 0"
                                           icon="iconfont icon-bianji-kong"></el-button>
                            </el-tooltip>
                        </p>
                        <el-table
                            ref="hotelTable"
                            :data="hotelTable"
                            :row-key="row => row.index"
                            style="width: 100%;"
                            class="tableStyle"
                            @selection-change="hotelAll"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column
                                type="selection"
                                width="55" v-if="!disabledType">
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_CostType')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.ExpenseItem">{{scope.row.ExpenseItem}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_SubCostType')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.SubExpenseItem">{{scope.row.SubExpenseItem}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_CostCenter')">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.CostCenter">{{scope.row.CostCenter}}</span>
                                    <span v-else style="color: red">{{$t('message.notNull')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting==true&&companyId!=1002621"  prop="ProductName"></el-table-column>
                            <el-table-column :label="$t('message.ad_Cost')">
                                <template slot-scope="scope">
                                    {{scope.row.SumMoney | NumFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                            <el-table-column :label="$t('message.ReasonCode')" prop="ReasonCode"></el-table-column>
                            <el-table-column :label="$t('message.Operation')" width="150">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                                        <el-button icon="iconfont icon-bianji-kong" class="hoverBtn"
                                                   :disabled="disabledType"  v-if="isMeeting || !LockCostCenter"
                                                   @click="showHotelCost(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" :content="$t('message.View')" placement="top">
                                        <el-button icon="iconfont icon-yanjing-shi" class="hoverBtn"
                                                   @click="showHotelInfo(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="airShow" width="600px"
                               :close-on-click-modal='false'
                               @close="CancelAirCost">
                        <el-form :model="airCost" :rules="airrules" ref="airCost" :label-width="dialogOneW">
                            <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                                <el-select clearable v-model="airCost.ExpenseItemID" placeholder=" " filterable :disabled=" !isMeeting"
                                           @change="changeAirSub">
                                    <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                                <el-select clearable v-model="airCost.SubExpenseItemID" placeholder="" filterable :disabled=" !isMeeting"
                                           @change="changeAirSub2">
                                    <el-option v-for="item in selectListSub" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                                <el-select clearable v-model="airCost.CostCenterID" placeholder=" " filterable :disabled=" !isMeeting && LockCostCenter"
                                           @change="changeAirSub3">
                                    <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                               :label="item.CostCenterName"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting==true&&companyId!=1002621">
                                <el-select clearable v-model="airCost.ProductId" placeholder="" filterable  @change="changeAirSub4">
                                    <el-option v-for="item in ProductList" :key="item.ProductID"
                                               :label="item.ProductName"
                                               :value="item.ProductID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Cost')" prop="SumMoney">
                                <el-input v-model="airCost.SumMoney" auto-complete="off" disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Customers')" prop="Customers" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="airCost.Customers" filterable  multiple collapse-tags>
                                <el-option
                                  v-for="item in customerListCopy"
                                  :key="item.CustomerID"
                                  :label="item.CustomerName"
                                  :value="item.CustomerID">
                                </el-option>
                               </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Companys')" prop="Companys" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="airCost.Companys" filterable  multiple collapse-tags>
                                <el-option
                                  v-for="item in companyListCopy"
                                  :key="item.EmployeeID"
                                  :label="item.EmployeeName"
                                  :value="item.EmployeeID">
                                </el-option>
                               </el-select>
                            </el-form-item>

                            <!-- <111> -->
                            <el-form-item :label="$t('message.ad_Remarks')" prop="Remark">
                                <el-input type="textarea" v-model="airCost.Remark" auto-complete="off"
                                          :maxlength=100 disabled></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CancelAirCost" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitAirCost('airCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="airShowAll" width="600px"
                               :close-on-click-modal='false'
                               @close="CancelAirCostAll">
                        <el-form :model="airCost" :rules="airrules" ref="airCost" :label-width="dialogOneW">
                            <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                                <el-select clearable v-model="airCost.ExpenseItemID" placeholder=" " filterable :disabled=" !isMeeting"
                                           @change="changeAirSub">
                                    <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                                <el-select clearable v-model="airCost.SubExpenseItemID" placeholder="" filterable :disabled=" !isMeeting"
                                           @change="changeAirSub2">
                                    <el-option v-for="item in selectListSub" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                                <el-select clearable v-model="airCost.CostCenterID" placeholder=" " filterable
                                           @change="changeAirSub3">
                                    <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                               :label="item.CostCenterName"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting==true&&companyId!=1002621">
                                <el-select clearable v-model="airCost.ProductId" placeholder="" filterable  @change="changeAirSub4">
                                    <el-option v-for="item in ProductList" :key="item.ProductID"
                                               :label="item.ProductName"
                                               :value="item.ProductID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CancelAirCostAll" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitAirCost('airCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="hotelShow" width="600px"
                               :close-on-click-modal='false'
                               @close="CancelHotelCost">
                        <el-form :model="hotelCost" :rules="airrules" ref="hotelCost" :label-width="dialogOneW">
                            <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                                <el-select clearable v-model="hotelCost.ExpenseItemID" placeholder=" " filterable :disabled=" !isMeeting"
                                           @change="changeHotelSub">
                                    <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                                <el-select clearable v-model="hotelCost.SubExpenseItemID" placeholder="" filterable :disabled=" !isMeeting"
                                           @change="changeHotelSub2">
                                    <el-option v-for="item in selectListSub" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                                <el-select clearable v-model="hotelCost.CostCenterID" placeholder=" " filterable  :disabled=" !isMeeting && LockCostCenter"
                                           @change="changeHotelSub3">
                                    <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                               :label="item.CostCenterName"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting==true&&companyId!=1002621">
                                <el-select clearable v-model="hotelCost.ProductId" placeholder="" filterable  @change="changeHotelSub4">
                                    <el-option v-for="item in ProductList" :key="item.ProductID"
                                               :label="item.ProductName"
                                               :value="item.ProductID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Cost')" prop="SumMoney">
                                <el-input v-model="hotelCost.SumMoney" auto-complete="off" disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Customers')" prop="Customers" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="hotelCost.Customers" filterable  collapse-tags multiple>
                                <el-option
                                  v-for="item in customerListCopy"
                                  :key="item.CustomerID"
                                  :label="item.CustomerName"
                                  :value="item.CustomerID">
                                </el-option>
                               </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Companys')" prop="Companys" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="hotelCost.Companys" filterable  collapse-tags multiple>
                                <el-option
                                  v-for="item in companyListCopy"
                                  :key="item.EmployeeID"
                                  :label="item.EmployeeName"
                                  :value="item.EmployeeID">
                                </el-option>
                               </el-select>
                            </el-form-item>
                            <!-- 111 -->
                            <el-form-item :label="$t('message.ad_Remarks')" prop="Remark">
                                <el-input type="textarea" v-model="hotelCost.Remark" auto-complete="off"
                                          :maxlength=100 disabled></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CancelHotelCost" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitHotelCost('hotelCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="hotelShowAll" width="600px"
                               :close-on-click-modal='false'
                               @close="CancelHotelCost">
                        <el-form :model="hotelCost" :rules="airrules" ref="hotelCost" :label-width="dialogOneW">
                            <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                                <el-select clearable v-model="hotelCost.ExpenseItemID" placeholder=" " filterable :disabled=" !isMeeting"
                                           @change="changeHotelSub">
                                    <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                                <el-select clearable v-model="hotelCost.SubExpenseItemID" placeholder="" filterable :disabled=" !isMeeting"
                                           @change="changeHotelSub2">
                                    <el-option v-for="item in selectListSub" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                                <el-select clearable v-model="hotelCost.CostCenterID" placeholder=" " filterable
                                           @change="changeHotelSub3">
                                    <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                               :label="item.CostCenterName"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting==true&&companyId!=1002621">
                                <el-select clearable v-model="hotelCost.ProductId" placeholder="" filterable  @change="changeHotelSub4">
                                    <el-option v-for="item in ProductList" :key="item.ProductID"
                                               :label="item.ProductName"
                                               :value="item.ProductID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CancelHotelCostAll" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitHotelCost('hotelCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="hotelTitle" :modal-append-to-body="false" :visible.sync="hotelInfoShow" width="800px"
                               :close-on-click-modal='false'
                               @close="closeHotelInfo">
                        <div v-loading="infoLoading">
                            <div class="hotelBox">
                                <el-row class="row">
                                    <el-col :span="12" class="">{{$t('message.HotelName')}}:<span class="info">{{hotelInfo.HotelName}}</span>
                                    </el-col>
                                    <el-col :span="12" class="bd-l bd-r">{{$t('message.HotelTel')}}:<span class="info">{{hotelInfo.HotelTel}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="12" class="">{{$t('message.CheckInDay')}}:<span class="info">{{hotelInfo.CheckInDate}}</span>
                                    </el-col>
                                    <el-col :span="12" class="bd-l">{{$t('message.CheckOutDay')}}:<span class="info">{{hotelInfo.CheckOutDate}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="12" class="">{{$t('message.TotalStay')}}:<span class="info">{{hotelInfo.TotalStay}}</span>
                                    </el-col>
                                    <el-col :span="12" class="bd-l">{{$t('message.RoomCount')}}:<span class="info">{{hotelInfo.RoomCount}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="4" class="">{{$t('message.CheckInCity')}}:<span class="info">{{hotelInfo.City}}</span>
                                    </el-col>
                                    <el-col :span="20" class="bd-l">{{$t('message.HotelAddress')}}:<span class="info">{{hotelInfo.Address}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row bd-b" v-if="hotelInfo.reasonCode">
                                    <el-col :span="24" class="">{{$t('message.lowPrice')}}:<span class="info">{{hotelInfo.reasonCode}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row bd-b">
                                    <el-col :span="24" class="">{{$t('message.SumPrice')}}:<span class="info">￥ {{hotelInfo.SumPrice | fix2}}</span><span
                                        v-if="hotelInfo.TaxPrice">({{$t('message.TaxPrice')}}:<span class="info">￥ {{hotelInfo.TaxPrice | fix2}}</span>)</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>


                    </el-dialog>
                    <el-dialog :title="AirTitle" :modal-append-to-body="false" :visible.sync="airInfoShow" width="800px"
                               :close-on-click-modal='false'
                               @close="closeAirInfo">
                        <div v-loading="infoLoading">
                            <div class="hotelBox">
                                <el-row class="row">
                                    <el-col :span="13" class="">{{$t('message.TicketMain')}}:<span class="info">{{airInfo.deptPortName}}-{{airInfo.arrivalPortName}}({{airInfo.flyDate}})</span>
                                    </el-col>
                                    <el-col :span="11" class="bd-l bd-r">{{$t('message.AirlineName')}}:<span class="info">{{airInfo.airlineName}} {{airInfo.flightNo}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="13" class="">{{$t('message.DeptDate')}}:<span class="info">{{airInfo.deptDate}}</span>
                                    </el-col>
                                    <el-col :span="11" class="bd-l">{{$t('message.DeptPortName')}}:<span class="info">{{airInfo.deptPortName}} {{airInfo.deptTerminal}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row">
                                    <el-col :span="13" class="">{{$t('message.ArrivalDate')}}:<span class="info">{{airInfo.arrivalDate}}</span>
                                    </el-col>
                                    <el-col :span="11" class="bd-l">{{$t('message.ArrivalPortName')}}:<span class="info">{{airInfo.arrivalPortName}} {{airInfo.arrivalTerminal}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row bd-b" v-if="airInfo.reasonCode">
                                    <el-col :span="24" class="">{{$t('message.lowPrice')}}:<span class="info">{{airInfo.reasonCode}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="row bd-b">
                                    <el-col :span="24" class="">{{$t('message.SumPrice')}}:<span class="info">￥ {{airInfo.sumPrice | fix2}}</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>


                    </el-dialog>
                    <el-dialog :title="FlashTitle" :modal-append-to-body="false" :visible.sync="flashShow" width="800px"
                               :close-on-click-modal='false'
                               @close="getAmex">
                        <span>{{this.$t('message.booked')}}</span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="getAmex" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="getAmex" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>

                    </el-dialog>
                </div>
                <div class="table_container" v-loading='isloading'>
                    <div class="applyTitle">{{$t('message.ad_OtherCost')}}</div>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                        <el-button class="addBtn" type="primary" v-if="!disabledType" @click="addNewCost"
                                   icon="iconfont icon-xinzeng-wubiankuang"></el-button>
                    </el-tooltip>
                    <el-table
                        ref="multipleTable"
                        :data="tableDataCost"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_CostType')" prop="ExpenseItem"></el-table-column>
                        <el-table-column :label="$t('message.ad_SubCostType')" prop="SubExpenseItem"></el-table-column>
                        <el-table-column :label="$t('message.ad_CostCenter')" prop="CostCenter"></el-table-column>
                        <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting==true&&companyId!=1002621">
                            <template slot-scope="scope">
                                <span v-if="scope.row.ProductName">{{scope.row.ProductName}}</span>
                                <span v-else>{{$t('message.notNull2')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.ad_Cost')">
                            <template slot-scope="scope">
                                {{scope.row.SumMoney | NumFormat}}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                        <el-table-column :label="$t('message.Operation')" width="150">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                                    <el-button icon="iconfont icon-bianji-kong" class="hoverBtn" :disabled="disabledType"
                                               @click="handleEditCost(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                                    <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" :disabled="disabledType"
                                               @click="handleDeleteCost(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisible"
                               width="600px" :close-on-click-modal='false'
                               @close="CanceladdNewCost">
                        <el-form :model="addCost" :rules="rules" ref="addCost" :label-width="dialogOneW">
                            <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                                <el-select clearable v-model="addCost.ExpenseItemID" placeholder=" " filterable
                                           @change="changeSub" v-if="companyId == 1002621||CostId==''">
                                    <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                                <el-input v-model="addCost.ExpenseItem" disabled clearable v-if="companyId != 1002621&&CostId!=''"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                                <el-select clearable v-model="addCost.SubExpenseItemID" placeholder="" filterable
                                           @change="changeSub2">
                                    <el-option v-for="item in CostOther" :key="item.ExpenseItemID"
                                               :label="item.ExpenseItemName"
                                               :value="item.ExpenseItemID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                                <el-select clearable v-model="addCost.CostCenterID" placeholder=" " filterable :disabled=" !isMeeting && LockCostCenter"
                                           @change="changeSub3">
                                    <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                               :label="item.CostCenterName"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Product')" prop="ProductId"  v-if="isMeeting && ProductList.length !=0&&companyId!=1002621">
                                <el-select clearable v-model="addCost.ProductId" placeholder="" filterable  @change="changeSub4">
                                    <el-option v-for="item in ProductList" :key="item.ProductID"
                                               :label="item.ProductName"
                                               :value="item.ProductID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Cost')" prop="SumMoney">
                                <el-input v-model="addCost.SumMoney" auto-complete="off"
                                          oninput="value=value.replace(/[^\d.]/g,'')" @change="liangwei"
                                          type="number" clearable></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Customers')" prop="Customers" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="addCost.Customers" filterable  multiple collapse-tags>
                                <el-option
                                  v-for="item in customerListCopy"
                                  :key="item.CustomerID"
                                  :label="item.CustomerName"
                                  :value="item.CustomerID">
                                </el-option>
                               </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Companys')" prop="Companys" v-if="isMeeting==true&&companyId==1002621">
                               <el-select v-model="addCost.Companys" filterable  multiple collapse-tags>
                                <el-option
                                  v-for="item in companyListCopy"
                                  :key="item.EmployeeID"
                                  :label="item.EmployeeName"
                                  :value="item.EmployeeID">
                                </el-option>
                               </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Remarks')" prop="Remark" style="margin-top: 25px">
                                <el-input type="textarea" v-model="addCost.Remark" auto-complete="off"
                                          :maxlength=100 clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CanceladdNewCost" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitNewCost('addCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectCost" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>

                    </el-dialog>
                </div>
                <div class="table_container" v-loading='isloading' v-if="isMeeting">
                    <div class="applyTitle">{{$t('message.ad_PeerCustomers')}}</div>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                        <el-button class="addBtn" type="primary" v-if="!disabledType" @click="addPeer"
                                   icon="iconfont icon-xinzeng-wubiankuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.editSum')" placement="top">
                        <el-button class="addBtn" type="primary" v-if="!disabledType&&companyId!=1002621" @click="peerNum"
                                   icon="iconfont icon-renyuan-kong"></el-button>
                    </el-tooltip>
                    <el-table
                          ref="multipleTable"
                        :data="customerList"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_name')" prop="CustomerName"></el-table-column>
                        <el-table-column :label="$t('message.ad_company')" prop="Company"></el-table-column>
                        <el-table-column :label="$t('message.ad_department')" prop="Department"></el-table-column>
                        <el-table-column :label="$t('message.ad_level')" prop="CustomerLevel"></el-table-column>
                        <el-table-column :label="$t('message.Operation')" >
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                                    <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" :disabled="disabledType"
                                               @click="handleDeletePeer(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow2"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel2" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectPeer" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisibleTr"
                               width="950px" :close-on-click-modal='false'
                               @close="dialogAddVisibleTr = false;searchName.customName = ''">
                        <el-form :model="searchName" ref="addForm" :label-width="labelWidth2" style="float: left;"
                                 @submit.native.prevent>
                            <el-form-item :label="$t('message.ad_name')" prop="RoleName" class="littleItem">
                                <el-input v-model="searchName.customName" auto-complete="off" clearable
                                          style="float: left;width: 200px;"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button
                                style="margin-left:20px;float: left;margin-top: 6px;"
                                type="primary"
                                icon="iconfont icon-sousuo"
                                @click="searchMan"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                            <el-button type="info" icon="iconfont icon-zhongzhi"
                                       style="margin-left:20px;float: left;margin-top: 6px;" @click="unSearch"></el-button>
                        </el-tooltip>
                        <el-table
                            @select="onTableSelect"
                            v-loading="transferLoading"
                            ref="multipleTable3"
                            :data="transferData"
                            :row-key="row => row.index"
                            @selection-change="handleSelectionChange"
                            style="width: 100%;margin-top: 20px;"
                            class="tableStyle transferTable"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }"
                            :height="tableHeight2"
                            :max-height="tableHeight2">
                            <el-table-column type="selection" width="30"></el-table-column>
                            <el-table-column :label="$t('message.ad_name')" prop="CustomerName"
                                             min-width="130"></el-table-column>
                            <el-table-column :label="$t('message.ad_company')" prop="Company"
                                             min-width="100"></el-table-column>
                            <el-table-column :label="$t('message.ad_department')" prop="Department"
                                             min-width="80"></el-table-column>
                            <el-table-column :label="$t('message.ad_level')" prop="CustomerLevel"
                                             min-width="55"></el-table-column>
                        </el-table>
                        <div class="Pagination">
                            <el-pagination
                                @current-change="handleCurrentChange2"
                                :current-page="currentPage"
                                :page-size='PageSize'
                                background
                                layout="total, prev, pager, next, jumper"
                                :total="count">
                            </el-pagination>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="dialogAddVisibleTr = false;searchName.customName = ''"
                                           icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitCustom('addCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectCost" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title=" dialotitle2" :modal-append-to-body="false" :visible.sync="peerShow"
                               width="900px" :close-on-click-modal='false'>
                        <div>{{$t('message.hospitalNum')}}</div>
                        <el-table
                            ref="multipleTable2"
                            :data="hospitalSum"
                            :row-key="row => row.index"
                            style="width: 100%;margin: 20px 0;"
                            class="tableStyle sumBox"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column label="A"  width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="hospitalSum[0].hospitalA" @keyup.native="commitSum" @blur="feiling(0)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear(0)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="B" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="hospitalSum[0].hospitalB" @keyup.native="commitSum" @blur="feiling(1)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear(1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="C" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="hospitalSum[0].hospitalC" @keyup.native="commitSum" @blur="feiling(2)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear(2)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="D" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="hospitalSum[0].hospitalD" @keyup.native="commitSum" @blur="feiling(3)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear(3)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.sum')" width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="hospitalSum[0].sum" disabled></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.Department')" min-width="100">
                                <template slot-scope="scope">
                                    <el-input v-model="hospitalSum[0].department"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div>{{$t('message.bloodNum')}}</div>
                        <el-table
                            ref="multipleTable2"
                            :data="bloodSum"
                            :row-key="row => row.index"
                            style="width: 100%;margin: 20px 0;"
                            class="tableStyle"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column label="A"  width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="bloodSum[0].bloodA" @keyup.native="commitSum2" @blur="feiling2(0)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear2(0)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="B" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="bloodSum[0].bloodB" @keyup.native="commitSum2" @blur="feiling2(1)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear2(1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="" width="85">

                            </el-table-column>
                            <el-table-column label="" width="85">

                            </el-table-column>
                            <el-table-column :label="$t('message.sum')" width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="bloodSum[0].sum" disabled></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="100">
                            </el-table-column>
                        </el-table>
                        <div>{{$t('message.franchiserNum')}}</div>
                        <el-table
                            ref="multipleTable2"
                            :data="franchiserSum"
                            :row-key="row => row.index"
                            style="width: 100%;margin: 20px 0;"
                            class="tableStyle"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column label="A"  width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="franchiserSum[0].franchiserA" @keyup.native="commitSum3" @blur="feiling3(0)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear3(0)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="B" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="franchiserSum[0].franchiserB" @keyup.native="commitSum3" @blur="feiling3(1)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear3(1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="C" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="franchiserSum[0].franchiserC" @keyup.native="commitSum3" @blur="feiling3(2)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear3(2)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="D" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="franchiserSum[0].franchiserD" @keyup.native="commitSum3" @blur="feiling3(3)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear3(3)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.sum')" width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="franchiserSum[0].sum" disabled></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="" min-width="100">
                            </el-table-column>
                        </el-table>
                        <div>{{$t('message.customerNum')}}</div>
                        <el-table
                            ref="multipleTable2"
                            :data="CustomerSum"
                            :row-key="row => row.index"
                            style="width: 100%;margin: 20px 0;"
                            class="tableStyle"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                            <el-table-column label="AA" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerAA" @keyup.native="commitSum4" @blur="feiling4(0)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear4(0)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="A" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerA" @keyup.native="commitSum4" @blur="feiling4(1)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear4(1)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="B" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerB" @keyup.native="commitSum4" @blur="feiling4(2)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear4(2)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="C" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerC" @keyup.native="commitSum4" @blur="feiling4(3)" oninput="value=value.replace(/[^\d]/g,'')"  @focus="clear4(3)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="D" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerD" @keyup.native="commitSum4" @blur="feiling4(4)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear4(4)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.other')" width="85">
                                <template slot-scope="scope">
                                    <el-input type="number" v-model="CustomerSum[0].CustomerOther" @keyup.native="commitSum4" @blur="feiling4(5)" oninput="value=value.replace(/[^\d]/g,'')" @focus="clear4(5)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.sum')" width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="CustomerSum[0].sum" disabled></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.Employee')" min-width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="CustomerSum[0].EmployeeNum"  @keyup.native="commitSum4" @blur="feiling4(6)" oninput="value=value.replace(/[^\d]/g,'')"  @focus="clear4(6)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('message.totalSum')" min-width="85">
                                <template slot-scope="scope">
                                    <el-input v-model="CustomerSum[0].totalSum" disabled></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="peerCancel" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitPeer" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                </div>
<!-- 公司人员 -->
                <div class="table_container" v-loading='isloading' v-if="isMeeting==true&&companyId==1002621">
                    <div class="applyTitle">{{$t('message.ad_PeerCompanys')}}</div>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                        <el-button class="addBtn" type="primary" v-if="!disabledType" @click="addPeercompany"
                                   icon="iconfont icon-xinzeng-wubiankuang"></el-button>
                    </el-tooltip>
                    <el-table
                        ref="multipleTable2"
                        :data="companyList"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_empnum')" prop="EmployeeNO"></el-table-column>
                        <el-table-column :label="$t('message.ad_name')" prop="EmployeeName" ></el-table-column>
                        <el-table-column :label="$t('message.ad_department')" prop="TeamName" ></el-table-column>
                        <el-table-column :label="$t('message.Operation')" >
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                                    <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" :disabled="disabledType"
                                               @click="handleDeletePeer2(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow3"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel3" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectPeercom" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                    <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisibleTr2"
                               width="950px" :close-on-click-modal='false'
                               @close="dialogAddVisibleTr2 = false;searchName.companyName = ''">
                        <el-form :model="searchName" ref="addForm" :label-width="labelWidth2" style="float: left;"
                                 @submit.native.prevent>
                            <el-form-item :label="$t('message.ad_name')" prop="RoleName" class="littleItem">
                                <el-input v-model="searchName.companyName" auto-complete="off" clearable
                                          style="float: left;width: 200px;"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                            <el-button
                                style="margin-left:20px;float: left;margin-top: 6px;"
                                type="primary"
                                icon="iconfont icon-sousuo"
                                @click="searchCom"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                            <el-button type="info" icon="iconfont icon-zhongzhi"
                                       style="margin-left:20px;float: left;margin-top: 6px;" @click="unSearchcom"></el-button>
                        </el-tooltip>
                        <el-table
                            @select="onTableSelect"
                            v-loading="transferLoading"
                            ref="multipleTable4"
                            :data="transferData2"
                            :row-key="row => row.index"
                            @selection-change="handleSelectionChange2"
                            style="width: 100%;margin-top: 20px;"
                            class="tableStyle transferTable"
                            :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }"
                            :height="tableHeight2"
                            :max-height="tableHeight2">
                            <el-table-column type="selection" width="30"></el-table-column>
                            <el-table-column :label="$t('message.ad_empnum')" prop="EmployeeNO"
                                             min-width="100"></el-table-column>
                            <el-table-column :label="$t('message.ad_name')" prop="EmployeeName"
                                             min-width="120"></el-table-column>
                            <el-table-column :label="$t('message.ad_department')" prop="TeamName"
                                             min-width="130"></el-table-column>
                        </el-table>
                        <div class="Pagination">
                            <el-pagination
                                @current-change="handleCurrentChange3"
                                :current-page="currentPage"
                                :page-size='PageSize'
                                background
                                layout="total, prev, pager, next, jumper"
                                :total="count">
                            </el-pagination>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="dialogAddVisibleTr2 = false;searchName.companyName = ''"
                                           icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="commitCompanyCustom('addCost')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>

                    <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectCost" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                    </el-dialog>
                </div>
             <div class="table_container" v-loading='isloading' v-if='Ordershow'>
                    <div class="applyTitle">{{$t('message.ad_Internalorder')}}</div>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                        <el-button class="addBtn" type="primary" v-if="!disabledType" @click="addInternalOrder"
                                   icon="iconfont icon-xinzeng-wubiankuang"></el-button>
                    </el-tooltip>
                    <el-table
                        ref="multipleTable"
                        :data="tableDataOrder"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_Internalorder')" prop="OrderName"></el-table-column>
                        <el-table-column :label="$t('message.ad_CostCenter')" prop="OrderCostcenterName"></el-table-column>
                        <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                        <el-table-column :label="$t('message.Operation')" width="150">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                                        <el-button icon="iconfont icon-bianji-kong" class="hoverBtn"
                                                   :disabled="disabledType"
                                                   @click="editorder(scope.$index, scope.row)"></el-button>
                                    </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                                    <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" :disabled="disabledType"
                                               @click="deleteorder(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                </div>
                <div class="table_container" v-loading='isloading'>
                    <div class="applyTitle">{{$t('message.ad_AttachmentInfo')}}<span style="color: red">({{$t('message.fileText')}})</span></div>
                        <el-upload
                            style="margin-top: 20px;"
                            :disabled="disabledType2"
                            :show-file-list='false'
                            accept=".doc,.docx,.xlsx,.gif,.ppt,.pptx,.pdf,.rar,.zip,.7z,.jpg,.jpeg,.bmp,.gif,.png"
                            :action='baseUrl+"/api/Apply/UploadFile"'
                            :before-upload = "panFile"
                            :on-success=" getAttachmentRes"
                            v-if="!disabledType2">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Upload')" placement="top"
                                        style="width: 40px;display: inline-block;margin-right: 10px">
                            <el-button  type="primary" icon="iconfont icon-fujian"
                                       v-if="!disabledType2"></el-button>
                            </el-tooltip>
                        </el-upload>

                    <!--<el-tooltip class="item" effect="dark" :content="$t('message.ad_PackageDownload')" placement="top">-->
                    <!--<el-button class="addBtn" type="primary" @click="downloadPackage()"-->
                    <!--icon="iconfont icon-Icon-daoru"></el-button>-->
                    <!--</el-tooltip>-->
                    <!--<el-tooltip class="item" effect="dark" :content="$t('message.Upload')" placement="top">-->
                    <!--<el-button class="addBtn" type="primary" @click="addTrip()" icon="iconfont icon-chuansong-kong"></el-button>-->
                    <!--</el-tooltip>-->
                    <el-table
                        ref="multipleTable"
                        :data="tableDataAttachment"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        @selection-change="changeDownloadList"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_AttachmentName')" prop="FileName"></el-table-column>
                        <el-table-column :label="$t('message.ad_AttachmentTime')" prop="CreateDateStr"></el-table-column>
                        <el-table-column :label="$t('message.ad_AttachmentSize')">
                            <template slot-scope="scope">
                                {{scope.row.FileSize}}KB
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.Operation')" width="150">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="$t('message.ad_Download')" placement="top">
                                    <el-button icon="iconfont icon-xiazai-kong" class="hoverBtn"
                                               @click="downAttachment(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                                    <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" :disabled="disabledType2"
                                               @click="handleDeleteAttachment(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('message.ad_View')" placement="top">
                                    <el-button icon="iconfont icon-yanjing-kong" class="hoverBtn"
                                               v-if="scope.row.FileExtension == '.pdf'"
                                               @click="viewAttachment(scope.$index, scope.row)"></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog :title="$t('message.ad_ViewAttachment')" :modal-append-to-body="false"
                               :visible.sync="fileShow" width="900px"
                               :close-on-click-modal='false'
                               @close="fileShow = false">
                        <iframe class="prism-player" :src="previewUrl" width="100%" height="100%"></iframe>
                    </el-dialog>
                </div>
                
                <div class="table_container" v-loading='isloading' v-if="tableDataApprove.length > 0">
                    <div class="applyTitle">{{$t('message.ta_ApprovalStatus')}}</div>
                    <el-table
                        ref="multipleTable"
                        :data="tableDataApprove"
                        :row-key="row => row.index"
                        style="width: 100%;margin-top: 20px;"
                        class="tableStyle"
                        :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                        <el-table-column :label="$t('message.ad_ApprovalMan')" prop="Approver"></el-table-column>
                        <el-table-column :label="$t('message.ad_ApprovalResult')" prop="ApproveResult"></el-table-column>
                        <el-table-column :label="$t('message.ad_ApprovalTime')" prop="ApproveTime"></el-table-column>
                        <el-table-column :label="$t('message.ad_ApprovalSuggestion')"
                                         prop="ApproveOpinion"></el-table-column>
                    </el-table>
                </div>
                <div class="table_container" v-loading='isloading'>
                    <div class="applyTitle" style="text-align: right;color: red;font-weight: bold;padding-right: 20px">
                        {{$t('message.ad_totalMoney')}}: {{CurrencyText}} {{totalMoney | NumFormat}}
                    </div>
                </div>
                <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisibleTr3"
                               width="650px" :close-on-click-modal='false'
                               @close="dialogAddVisibleTr3 = false"> 
                        <el-form :model="Inertnal" :rules="orderrule" ref="Inertnal" label-width="100px">
                            <el-form-item :label="$t('message.ad_Internalorder')" prop="Order">
                                <el-select clearable v-model="Inertnal.Order" placeholder=" " filterable>
                                    <el-option v-for="item in OrderList" :key="item.InternalOrderID"
                                               :label="item.InternalOrderName"
                                               :value="item.InternalOrderID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_CostCenter')" prop="OrderCostcenter">
                                <el-select clearable v-model="Inertnal.OrderCostcenter" placeholder=" " filterable>
                                    <el-option v-for="item in OrderCostcenterList" :key="item.CostCenterID"
                                               :label="item.CostCenter"
                                               :value="item.CostCenterID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('message.ad_Remarks')">
                              <el-input type="text" v-model="Inertnal.remark" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>   
                         <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="CancelOrder" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="saveOrder('Inertnal')" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>      
                </el-dialog>
                <el-dialog :title=" $t('message.warning')" :modal-append-to-body="false" :visible.sync="delectShow4"
                               width="600px" :close-on-click-modal='false'>
                    <span>
                        {{this.$t('message.deleteIt')}}
                    </span>
                        <div slot="footer" class="dialog-footer">
                            <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                                <el-button @click="delectCancel4" icon="iconfont icon-guanbi-wukuang"
                                           :disabled="disabledType"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                                <el-button type="primary" @click="delectOrder" :disabled="disabledType"
                                           icon="iconfont icon-gou-wukuang"></el-button>
                            </el-tooltip>
                        </div>
                </el-dialog>
        </div>
        <div class="buttom_button" v-if="!loadingAll">
            <!-- <div style="display:inline-block;color:red;margin-right:10px">{{$t('message.ad_special')}}</div> -->
            <el-tooltip class="item" effect="dark" :content="$t('message.back')" placement="top">
                <el-button type="primary" @click="back" icon="iconfont icon-fanhui"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                <el-button class="addBtn" type="primary" @click="saveAll(0,0)"
                           icon="iconfont icon-baocun1" v-if="!disabledType"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('message.Commit')" placement="top">
                <el-button class="addBtn" type="primary" @click="saveAll(1,1)"
                           :disabled="!(hasIntlAir == 0 && (orderPushType == '0' || orderPushType == '2' || orderPushType == '3' || orderPushType == '4' || orderPushType == null || orderPushType == '6')) && !(hasIntlAir == 1 && (orderPushType == '4' || orderPushType == '2' || orderPushType == '3'|| orderPushType == '6'))"
                           icon="iconfont icon-chuansong-kong" v-if="!disabledType"></el-button>9
            </el-tooltip>
        </div>
    </div>
</template>
<style>
.el-table__header{ width: 100%\0 !important; } .el-table__body{ width: 100%\0 !important; }</style>
<script>
    import axios from 'axios'
    import {
        ajax, AjaxPOST
    } from "@/config/fetch";
    import headTop from "../../components/headTop";
        import cn from '../../i18n/langs/cn';
    import mainPlan from "@/page/system/applicationDetailCopy";
    import {baseUrl, baseImgPath} from "@/config/env";
    import {exportPDFfunGet} from "@/config/fetch";

    import {
        GetAllPages,
        SaveApplyOrder,
        GetApplyOrderDetail,
        GetFileInfoByFileId,
        JWTLogin,
        GetCostCenter,
        JWTLoginRefresh,
        SavePlaneHotelDetail,
        GetHotelDetail,
        GetAirDetail,
        GetApproveHistoryFromEM,
        GetCustomer,
        GetGuid,
        GetCurrencyType,
        SubmitApplyOrder,
        CheckSubmit,
        Login2Amex,
        GetCompanylist
    } from '../../apiNew/api.js'
    import {getStore, getLocal,setStore} from "../../config/mUtils"
    import {
        getRoleList,
        getCompanys,
        editRole,
        deleteRole,
        permissions,
        getRoleInfo,
        getConfigInfo
    } from "@/api/getData";

    export default {
        data() {
            return {
                changeStart:new Date(),
                changeEnd:new Date(),
                coverageData:{},
                hospitalSum:[
                    {
                        hospitalA:0,
                        hospitalB:0,
                        hospitalC:0,
                        hospitalD:0,
                        sum:0,
                        department:"",
                    }
                ],
                CustomerSum:[
                    {
                        CustomerAA:0,
                        CustomerA:0,
                        CustomerB:0,
                        CustomerC:0,
                        CustomerD:0,
                        CustomerOther:0,
                        sum:0,
                        totalSum:0,
                        EmployeeNum:0,
                    }
                ],
                franchiserSum:[
                    {
                        franchiserA:0,
                        franchiserB:0,
                        franchiserC:0,
                        franchiserD:0,
                        sum:0,
                    }
                ],
                bloodSum:[
                    {
                        bloodA:0,
                        bloodB:0,
                        sum:0,
                    }
                ],
                peerShow:false,
                LockCostCenter:false,
                fixedId:'',
                mainPlanshow:false,
                OriginalMainId:null,
                ProductList:[],
                isMeeting:false,
                ticketAllList:[],
                hotelAllList:[],
                CurrencyText: 'CNY',
                tableHeight2: 389,
                searchName: {
                    customName: '',
                    companyName:''
                },
                transferLoading: false,
                customerList: [],
                customerListCopy: [],
                companyListCopy:[],
                companyList:[],
                currentPage: 1,
                PageSize: 10,
                count: 0,
                filterMethod(query, item) {
                    return item.CustomerName.indexOf(query) > -1;
                },
                transferData: [],
                transferData2: [],
                transferValue: [3],
                tooltipShow: false,
                delectIndex: 0,
                delectIndex2: 0,
                delectIndex3:0,
                flashShow: false,
                othertotalMoney: '',
                airtotalMoney: '',
                hoteltotalMoney: '',
                totalMoney: 0,
                hasIntlAir: 0,
                intlAirPushType: '',
                orderPushType: 0,
                company: '',
                team: '',
                OrderNo: '',
                tableDataApprove: [],
                ticketCheck: true,
                orderCheck: true,
                hotelCheck: true,
                infoLoading: true,
                ApplyMainId: '',
                editAirIndex: null,
                baosheng:[
                    {
                       value: '1',
                       label: '是'
                    },
                    {
                       value: '2',
                       label: '否'
                    },
                ],
                airCost: {
                    DetailId: [],
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                },
                hotelCost: {
                    DetailId: [],
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                },
                airShow: false,
                airShowAll: false,
                airInfoShow: false,
                delectShow3: false,
                delectShow2: false,
                
                delectShow: false,
                airInfo: {},
                hotelInfo: {},
                hotelShow: false,
                hotelShowAll: false,
                hotelInfoShow: false,
                OrderGuid: '',
                IdGuid: '',
                ticketTable: [],
                hotelTable: [],
                disabledType: true,
                disabledType2: true,
                pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.applicationInfo.endData) {
                            return time.getTime() > this.applicationInfo.endData;
                        }
                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        if (this.applicationInfo.startData) {
                            return time.getTime() < this.applicationInfo.startData;
                        }
                    }
                },
                booked: false,
                fileFlowList: [],
                downloadTokenList: [],
                downloadList: [],
                previewUrl: '',
                loadingAll: false,
                tableDataAttachment: [],
                editCostIndex: null,
                editTripIndex: null,
                tableDataTrip: [],
                tableDataCost: [],
                tableDataOrder:[],
                sanList: {},
                selectList: [],
                selectListSub: [],
                costCenterList: [],
                addTripInfo: {
                    TripDate: '',
                    TripTimeStart: '',
                    TripTimeEnd: '',
                    WorkContent: ''
                },
                addCost: {
                    InfoType: 3,
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                },
                applicationInfo: {
                    Place: '',
                    type: [],
                    startData: '',
                    endData: '',
                    team: '',
                    overseaList: '',
                    Purpose: '',
                    Currency: 10516,
                    Speaker:'',
                    CustomerReason:'',
                    Baosheng:'',
                    OAnumber:'',
                },

                checkNodes: [],
                checkNodesCopy: [],
                authId: '',
                delectID: '',
                baseUrl,
                baseImgPath,
                PageIndex: 1,
                count: 0,
                tableData: [],
                currentPage: 1,
                fileShow: false,
                dialogAddVisibleTitle: false,
                dialogFormVisible: false,
                dialogAddVisible2: false,
                dialogAddVisible3: false,
                dialogAddVisible: false,
                dialogAddVisibleTr: false,
                dialogAddVisibleTr2:false,
                dialogAddVisibleTr3:false,
                isloading: false,
                companys: [],
                tableHeight: 0,
                addForm: {
                    RoleId: '',
                    RoleName: "",
                    Description: '',
                    EnglishName: '',
                },
                TripDetails: {
                    tripTime: '',
                    startTime: '',
                    endTime: ''
                },
                ruleForm: {
                    RoleName: ""
                },
                treeData: [],
                props: {
                    children: 'children',
                    label: 'label'
                },
                costType:'',
                costTypeId:'',
                applyType: '',
                applyTypeId: '',
                nameW: 0 + 'px',
                dataW: 0 + 'px',
                reasonW: 0 + 'px',
                labelWidth: 0 + 'px',
                dialogOneW: 0 + 'px',
                orderShow: true,
                orderContent: '',
                orderType: 0,
                ExpenseTypeID: '',
                labelWidth2: "",
                currencyTypeList: [],
                dialotitle:this.$t('message.Add'),
                dialotitle2:this.$t('message.peer'),
                CostId:'',
                companyId:getStore('CompanyID'),
                CostOther:[],
                Customers:[],
                Companys:[],
                OArequire:true,
                Inertnal:{},
                OrderCostcenterList:[],
                addorder:{},
                editOrderIndex:null,
                delectIndex4:0,
                delectShow4:false,
                OrderList:[],
                Ordershow:false,
            };
        },
        filters: {
            fix2: function (val) {
                if (val == null) {
                    return val;
                } else {
                    return parseInt(val).toFixed(2)
                }
            },
            NumFormat: function (value) {
                if (typeof value !== 'string') {
                    value = value.toString();
                }
                if (!value) return '0.00';
                var intPart = value.toString().split('.');
                var intPartFormat = intPart[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            //     return num.join('.');
            //    var intPart = Number(value).toFixed(0); // 获取整数部分
             //   var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断
                
                var floatPart = '.00'; // 预定义小数部分
                var value2Array = value.split('.');
                if (value2Array.length === 2) { // =2表示数据有小数位
                    floatPart = value2Array[1].toString(); // 拿到小数部分
                    if (floatPart.length === 1) { // 补0,实际上用不着
                    console.log(intPartFormat)
                        return intPartFormat + '.' + floatPart + '0';
                    } else {
                        console.log(intPartFormat)
                        return intPartFormat + '.' + floatPart;
                    }
                    
                } else {
                    return intPartFormat + floatPart;
                }
            }
        },
        created() {
            this.getConfigInfo();
            if(this.$route.query.OriginalMainId){
                this.OriginalMainId = this.$route.query.OriginalMainId;
                this.getTopInfo();
            }
            if(this.$route.query.isMeeting){
                this.isMeeting = this.$route.query.isMeeting;
            }
            if (this.$route.query.company) {
                this.company = this.$route.query.company;
            }
            if (this.$route.query.team) {
                this.TeamID = this.$route.query.team;
            }
            if (this.$route.query.ExpenseTypeID) {
                this.ExpenseTypeID = this.$route.query.ExpenseTypeID;
            }
            if (this.$route.query.CostId) {
                    this.addCost.ExpenseItemID = this.$route.query.CostId;
                    this.CostId=this.$route.query.CostId
                }
            if (this.ExpenseTypeID) {
                this.getSanSelect(this.company, this.TeamID, this.ExpenseTypeID,this.CostId);
                this.getSanSelectOther(this.company, this.TeamID, this.ExpenseTypeID,this.CostId);
            }
            if (this.$route.query.OrderNo) {
                this.IdGuid = this.$route.query.OrderNo;
                this.getDetail();
            }
            if(getStore("OrderNo")){
                this.IdGuid = this.$route.query.OrderNo;
                this.getDetail();
            };
            if (this.$route.query.ApproveStatus == 8211) {
                if (this.$route.query.AccountStatus == 8206) {
                    this.disabledType2 = false;
                } else {
                    this.disabledType = false;
                    this.disabledType2 = false;
                }
            }
            if (!this.$route.query.ApproveStatus) {
                this.disabledType = false;
                this.disabledType2 = false;
            }
            this.watchHeight();
            this.resetLabelWidth();
            this.getApproveHistory();
           // this.getCurrencyType();
        },
        watch: {
            '$route'(to,from) {
                this.disabledType = true;
                this.disabledType2 = true;
                if(this.$route.query.OriginalMainId){
                    this.OriginalMainId = this.$route.query.OriginalMainId;
                }
                if(this.$route.query.isMeeting){
                    this.isMeeting = this.$route.query.isMeeting;
                }
                if (this.$route.query.company) {
                    this.company = this.$route.query.company;
                }
                if (this.$route.query.team) {
                    this.TeamID = this.$route.query.team;
                }
                if (this.$route.query.ExpenseTypeID) {
                    this.ExpenseTypeID = this.$route.query.ExpenseTypeID;
                }
                if (this.$route.query.CostId) {
                    this.addCost.ExpenseItemID = this.$route.query.CostId;
                }
                if (this.ExpenseTypeID) {
                    this.getSanSelect(this.company, this.TeamID, this.ExpenseTypeID,this.CostId);
                }
                if (this.$route.query.OrderNo) {
                    this.IdGuid = this.$route.query.OrderNo;
                    this.getDetail()
                }
                if (this.$route.query.ApproveStatus == 8211) {
                    if (this.$route.query.AccountStatus == 8206) {
                        this.disabledType2 = false;
                    } else {
                        this.disabledType = false;
                        this.disabledType2 = false;
                    }
                }
                if (!this.$route.query.ApproveStatus) {
                    this.disabledType = false;
                    this.disabledType2 = false;
                }
                this.watchHeight();
                this.resetLabelWidth();
                this.getApproveHistory();
                //this.getCurrencyType();
            },

            tableDataCost: {
                handler: function (newdata, olddata) {
                    this.othertotalMoney = 0;
                    newdata.forEach((item, index) => {
                        this.othertotalMoney = Number(this.othertotalMoney) + Number(item.SumMoney);
                    })
                    this.totalMoney = Number(this.othertotalMoney) + Number(this.hoteltotalMoney) + Number(this.airtotalMoney);
                },
                deep: true
            },
            ticketTable(newdata, olddata) {
                this.airtotalMoney = 0;
                newdata.forEach((item, index) => {
                    this.airtotalMoney = Number(this.airtotalMoney) + Number(item.SumMoney);
                })
                this.totalMoney = Number(this.othertotalMoney) + Number(this.hoteltotalMoney) + Number(this.airtotalMoney);
            },
            hotelTable(newdata, olddata) {
                this.hoteltotalMoney = 0;
                newdata.forEach((item, index) => {
                    this.hoteltotalMoney = Number(this.hoteltotalMoney) + Number(item.SumMoney);
                })
                this.totalMoney = Number(this.othertotalMoney) + Number(this.hoteltotalMoney) + Number(this.airtotalMoney);
            },

        },
        computed: {
            mainPlanTitle: function () {
                return this.$t('message.mainPlanTitle')
            },
            hotelTitle: function () {
                return this.$t('message.HotelTitle')
            },
            AirTitle: function () {
                return this.$t('message.AirTitle')
            },
            FlashTitle: function () {
                return this.$t('message.warning')
            },
            overseaOption() {
                return [{
                    overseaCode: 1,
                    overseaName: this.$t('message.ad_Domestic')
                }, {
                    overseaCode: 2,
                    overseaName: this.$t('message.ad_Abooard')
                }]
            },
            airrules: function () {
                let checkAge = (rule, value, callback) => {
                    if (value > 99999999.99) {
                        return callback(new Error(this.$t('message.moneyMax')));
                    } else {
                        callback();
                    }
                }
                return {
                    ExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostType'),
                        trigger: "change"
                    }],
                    SubExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_SubCostType'),
                        trigger: "change"
                    }],
                    CostCenterID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostCenter'),
                        trigger: "change"
                    }],
                    TripDate: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_TripTime'),
                        trigger: "blur"
                    }],
                    TripTimeStart: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_StartTime'),
                        trigger: "blur"
                    }],
                    TripTimeEnd: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_StartTime'),
                        trigger: "blur"
                    }],
                    WorkContent: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_JobContent'),
                        trigger: "blur"
                    }]
                }
            },
            rules: function () {
                let checkAge = (rule, value, callback) => {
                    if (value > 99999999.99) {
                        return callback(new Error(this.$t('message.moneyMax')));
                    } else {
                        callback();
                    }
                }
                return {
                    ExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostType'),
                        trigger: "change"
                    }],
                    SubExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_SubCostType'),
                        trigger: "change"
                    }],
                    CostCenterID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostCenter'),
                        trigger: "change"
                    }],
                    SumMoney: [
                        {validator: checkAge, trigger: 'blur'},
                        {
                            required: true,
                            message: this.$t('message.Input') + ' ' + this.$t('message.ad_Cost'),
                            trigger: "blur"
                        }
                    ],
                    TripDate: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_TripTime'),
                        trigger: "blur"
                    }],
                    TripTimeStart: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_StartTime'),
                        trigger: "blur"
                    }],
                    TripTimeEnd: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_StartTime'),
                        trigger: "blur"
                    }],
                    WorkContent: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_JobContent'),
                        trigger: "blur"
                    }],
                    
                }
            },
            orderrule:function(){
                return {
                    Order: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_Internalorder'),
                        trigger: "change"
                    }],
                    OrderCostcenter: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostCenter'),
                        trigger: "change"
                    }],
                }
            },
            toprules: function () {
                return {
                    overseaList: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_Oversea'),
                        trigger: "change"
                    }],
                    startData: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_EstimatedStartDate'),
                        trigger: "blur"
                    }],
                    endData: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_EstimatedCloseDate'),
                        trigger: "blur"
                    }],
                    Purpose: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_TripPurpose'),
                        trigger: "blur",
                        pattern: '[^ \x22]+'
                    }],
                    Place: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_loaction'),
                        trigger: "blur",
                        pattern: '[^ \x22]+'
                    }],
                    Currency: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.lang_currency'),
                        trigger: "blur"
                    }],
                    CustomerReason: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_customerReason'),
                        trigger: "blur",
                        pattern: '[^ \x22]+'
                    }],
                    Speaker: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_Speaker'),
                        trigger: "blur",
                        pattern: '[^ \x22]+'
                    }],
                    // OAnumber: [{
                    //     required: this.OArequire,
                    //     message: this.$t('message.Input') + ' ' + this.$t('message.ad_OAnumber'),
                    //     trigger: "blur"
                    // }]
                }
            }
        },
        components: {
            headTop,mainPlan
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight - 50;
                let allBox =  document.getElementsByClassName("all")[0];
                allBox.style.height = widowHeight +"px";
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
            changeEndTime(val){
                console.log(this.applicationInfo.endData);
                if(this.applicationInfo.endData !=null){
                    this.changeStart = new Date(this.applicationInfo.endData);
                }else {
                    this.changeStart = new Date();
                }

            },
            changeStartTime(val){
                if(this.applicationInfo.startData != null){
                    this.changeEnd = new Date(this.applicationInfo.startData);
                }else {
                    this.changeEnd = new Date();
                }

            },
            reallySubmit(params){
                SubmitApplyOrder(params).then(response => {
                    if (response.data.Flag) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.Success')
                        });
                        this.$router.push("travelApplication");

                    } else {
                        this.loadingAll = false;
                        let res=response.data.Message.toString()
                        let langarr=Object.keys(cn.message);
                        let mark=false
                    
                        if(res.search(/<[^>]+>/) != -1){
                            
                            this.$message.error(
                                {
                                    showClose: true,
                                   dangerouslyUseHTMLString: true,
                                   message: response.data.Message
                                }
                            );
                         }
                        else{
                            langarr.forEach((item,index)=>{
                                  if(item==response.data.Message){
                                      mark=true
                                  }
                            })
                            if(mark){
                            this.$message({
                            type: 'error',
                            message: this.$t('message.'+response.data.Message)
                        });
                            }
                            else{
                                this.$message.error(
                                {
                                    showClose: true,
                                   dangerouslyUseHTMLString: true,
                                   message: response.data.Message
                                }
                            );
                            }
                        }
                        
                    }
                })
            },
            beforeSave(ref){
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingAll = true;
                        let centercheck = false
                        if (this.tableDataCost.length == 0 && this.ticketTable.length == 0 && this.hotelTable.length == 0) {
                            this.$message({
                                type: 'error',
                                message: this.$t('message.inputText')
                            });
                            this.loadingAll = false;
                            return false
                        }
                        if(this.tableDataOrder){
                            this.tableDataOrder.forEach((item,index)=>{
                                this.OrderCostcenterList.forEach((item2,index2)=>{
                                    if(item.OrderCostcenterName==item2.CostCenter){
                                        centercheck=true
                                    }
                                })
                                if(centercheck==false){
                                    this.$message({
                                        type: 'warning',
                                        message: this.$t('message.OrderCostCenter')
                                    });
                                    this.loadingAll = false;
                                    this.orderCheck=false;
                                    return false
                                }
                            })
                        }  
                        if (this.ticketTable) {
                            this.ticketTable.forEach((item, index) => {
                                if (!item.ExpenseItem) {
                                    document.documentElement.scrollTop = 0;
                                    this.$message({
                                        type: 'warning',
                                        message: this.$t('message.FillTicket')
                                    });
                                    this.ticketCheck = false;
                                    this.loadingAll = false;
                                    return false
                                }
                            })
                        }
                        if (this.hotelTable) {
                            this.hotelTable.forEach((item, index) => {
                                if (!item.ExpenseItem) {
                                    document.documentElement.scrollTop = 0;
                                    this.$message({
                                        type: 'warning',
                                        message: this.$t('message.FillTicket')
                                    });
                                    this.hotelCheck = false;
                                    this.loadingAll = false;
                                    return false
                                }
                            })
                        }
                        if (this.hotelCheck && this.ticketCheck&&this.orderCheck) {
                            let ids = [];
                            this.tableDataAttachment.forEach((item, index) => {
                                ids.push(item.Id)
                            })
                            let start = this.applicationInfo.startData.getFullYear() + '-' + (this.applicationInfo.startData.getMonth() + 1) + '-' + this.applicationInfo.startData.getDate();
                            ;
                            let end = this.applicationInfo.endData.getFullYear() + '-' + (this.applicationInfo.endData.getMonth() + 1) + '-' + this.applicationInfo.endData.getDate();
                            let transferL = [];
                            if (this.customerList) {
                                this.customerList.forEach((item, index) => {
                                    let item2 = {
                                        CustomerId: item.CustomerID
                                    }
                                    transferL.push(item2)
                                })
                            }
                            let params = {
                                lstCustomerViewModel: transferL,
                                ApplyMainViewModel: {
                                    CompanyID: this.company,
                                    TeamID: this.TeamID,
                                    id: this.IdGuid,
                                    OrderType: this.orderType,
                                    AreaType: this.applicationInfo.overseaList,
                                    Place: this.applicationInfo.Place,
                                    ApplyDateStart: start,
                                    ApplyDateEnd: end,
                                    TripPurpose: this.applicationInfo.Purpose,
                                    Currency: this.applicationInfo.Currency,
                                    OriginalMainId:this.OriginalMainId,
                                    OANo:this.applicationInfo.OAnumber
                                },
                                lstApplyDetailViewModel: this.tableDataCost,
                                lstTripDetailViewModel: this.tableDataTrip,
                                SaveType: 2,
                                FileIds: ids,
                                ExpenseTypeID: this.ExpenseTypeID,
                                ExpenseTypeName: this.applyType,
                                coverageData:this.coverageData,
                                CultureCode: getStore('CultureCode'),
                            }
                            CheckSubmit(params).then(response => {
                                if (response.data.Flag) {
                                    this.reallySubmit(params)
                                } else {
                                    this.loadingAll = false; 
                                    this.$message({
                                        type: 'error',
                                        duration:8000,
                                        message: this.$t('message.'+response.data.Message)
                                    });
                                }
                            })
                        }
                    } else {
                        document.documentElement.scrollTop = 0;
                        this.loadingAll = false;
                        return false;
                    }
                });
            },
            panFile(file){
                this.loadingAll = true;
                let fileName = file.name.lastIndexOf(".");//取到文件名开始到最后一个点的长度
                let fileNameLength = file.name.length;//取到文件名长度
                let fileFormat = file.name.substring(fileName + 1, fileNameLength);//截
                if(fileFormat !=="doc" && fileFormat !=="docx" && fileFormat !=="xls" && fileFormat !=="xlsx" && fileFormat !=="ppt" && fileFormat !=="pptx" && fileFormat !=="pdf" && fileFormat !=="rar" && fileFormat !=="zip" && fileFormat !=="7z" && fileFormat !=="jpg" && fileFormat !=="jpeg" && fileFormat !=="bmp" && fileFormat !=="gif" && fileFormat !=="png"){
                    this.$message({
                        type: 'error',
                        message: this.$t('message.wrongType')
                    });
                    this.loadingAll = false;
                    return false
                }
                if(fileName>=50){
                    this.$message({
                        type: 'error',
                        message: this.$t('message.wrongLength')
                    });
                    this.loadingAll = false;
                    return false
                }
                if(file.size / 1024 / 1024 > 20){
                    this.$message({
                        type: 'error',
                        message: this.$t('message.wrongSize')
                    });
                    this.loadingAll = false;
                    return false
                }
            },
            clear(num){
                if(num == 0){
                        this.hospitalSum[0].hospitalA = 0;
                } else if(num == 1){
                        this.hospitalSum[0].hospitalB = 0;
                }else if(num == 2){
                        this.hospitalSum[0].hospitalC = 0;
                }else {
                        this.hospitalSum[0].hospitalD = 0;
                }

            },
            clear2(num){
                if(num == 0){
                        this.bloodSum[0].bloodA = '';
                } else {
                        this.bloodSum[0].bloodB = '';
                }
            },
            clear3(num){
                if(num == 0){
                        this.franchiserSum[0].franchiserA = '';
                } else if(num == 1){
                        this.franchiserSum[0].franchiserB = '';
                }else if(num == 2){
                        this.franchiserSum[0].franchiserC = '';
                }else {
                        this.franchiserSum[0].franchiserD = '';
                }

            },
            clear4(num){
                if(num == 0){
                        this.CustomerSum[0].CustomerAA = '';
                } else if(num == 1){
                        this.CustomerSum[0].CustomerA = '';
                }else if(num == 2){
                        this.CustomerSum[0].CustomerB = '';
                }else if(num == 3) {
                        this.CustomerSum[0].CustomerC = '';
                } else if(num == 4){
                        this.CustomerSum[0].CustomerD = '';
                } else if(num == 5){
                        this.CustomerSum[0].CustomerOther = '';
                } else {
                        this.CustomerSum[0].EmployeeNum = '';
                }

            },
            peerCancel(){
                this.peerShow = false;
            },
            commitPeer(){
                // hospitalSum:[
                //     {
                //         hospitalA:0,
                //         hospitalB:0,
                //         hospitalC:0,
                //         hospitalD:0,
                //         sum:0,
                //         department:"",
                //     }
                // ],
                //     CustomerSum:[
                //     {
                //         CustomerAA:0,
                //         CustomerA:0,
                //         CustomerB:0,
                //         CustomerC:0,
                //         CustomerD:0,
                //         CustomerOther:0,
                //         sum:0,
                //         totalSum:0,
                //         EmployeeNum:0,
                //     }
                // ],
                //     franchiserSum:[
                //     {
                //         franchiserA:0,
                //         franchiserB:0,
                //         franchiserC:0,
                //         franchiserD:0,
                //         sum:0,
                //     }
                // ],
                //     bloodSum:[
                //     {
                //         bloodA:0,
                //         bloodB:0,
                //         sum:0,
                //     }
                // ],
                this.coverageData = {
                    HospitalA : this.hospitalSum[0].hospitalA,
                    HospitalB : this.hospitalSum[0].hospitalB,
                    HospitalC : this.hospitalSum[0].hospitalC,
                    HospitalD : this.hospitalSum[0].hospitalD,
                    HospitalSum : this.hospitalSum[0].sum,
                    HospitalDeparments : this.hospitalSum[0].department,
                    BloodBankA:this.bloodSum[0].bloodA,
                    BloodBankB:this.bloodSum[0].bloodB,
                    BloodBankSum:this.bloodSum[0].bloodA,
                    CustomerAA:this.CustomerSum[0].CustomerAA,
                    CustomerA:this.CustomerSum[0].CustomerA,
                    CustomerB:this.CustomerSum[0].CustomerB,
                    CustomerC:this.CustomerSum[0].CustomerC,
                    CustomerD:this.CustomerSum[0].CustomerD,
                    CustomerOthers:this.CustomerSum[0].CustomerOther,
                    CustomerSum:this.CustomerSum[0].sum,
                    EmployeeNum:this.CustomerSum[0].EmployeeNum,
                    TotalNum:this.CustomerSum[0].totalSum,
                    FranchiserA:this.franchiserSum[0].franchiserA,
                    FranchiserB:this.franchiserSum[0].franchiserB,
                    FranchiserC:this.franchiserSum[0].franchiserC,
                    FranchiserD:this.franchiserSum[0].franchiserD,
                    FranchiserSum:this.franchiserSum[0].sum,
                }
                this.peerShow = false
            },
            commitSum(){
                this.hospitalSum[0].sum = Number(this.hospitalSum[0].hospitalA) + Number(this.hospitalSum[0].hospitalB) + Number(this.hospitalSum[0].hospitalC) + Number(this.hospitalSum[0].hospitalD);
            },
            commitSum2(){
                this.bloodSum[0].sum = Number(this.bloodSum[0].bloodA) + Number(this.bloodSum[0].bloodB);
            },
            commitSum3(){
                this.franchiserSum[0].sum = Number(this.franchiserSum[0].franchiserA) + Number(this.franchiserSum[0].franchiserB) + Number(this.franchiserSum[0].franchiserC) + Number(this.franchiserSum[0].franchiserD);
            },
            commitSum4(){
                this.CustomerSum[0].sum = Number(this.CustomerSum[0].CustomerAA) + Number(this.CustomerSum[0].CustomerA) + Number(this.CustomerSum[0].CustomerB) + Number(this.CustomerSum[0].CustomerC) + Number(this.CustomerSum[0].CustomerD)+ Number(this.CustomerSum[0].CustomerOther);
                this.CustomerSum[0].totalSum = Number(this.CustomerSum[0].CustomerAA) + Number(this.CustomerSum[0].CustomerA) + Number(this.CustomerSum[0].CustomerB) + Number(this.CustomerSum[0].CustomerC) + Number(this.CustomerSum[0].CustomerD)+ Number(this.CustomerSum[0].CustomerOther)+Number(this.CustomerSum[0].EmployeeNum);
            },
            feiling(num){
                if(num == 0){
                    if(this.hospitalSum[0].hospitalA == ''){
                        this.hospitalSum[0].hospitalA = 0;
                    }else {
                        this.hospitalSum[0].hospitalA = parseInt(this.hospitalSum[0].hospitalA);
                    }
                } else if(num == 1){
                    if(this.hospitalSum[0].hospitalB == ''){
                        this.hospitalSum[0].hospitalB = 0;
                    }else {
                        this.hospitalSum[0].hospitalB = parseInt(this.hospitalSum[0].hospitalB);
                    }
                }else if(num == 2){
                    if(this.hospitalSum[0].hospitalC == ''){
                        this.hospitalSum[0].hospitalC = 0;
                    }else {
                        this.hospitalSum[0].hospitalC = parseInt(this.hospitalSum[0].hospitalC);
                    }
                }else {
                    if(this.hospitalSum[0].hospitalD == ''){
                        this.hospitalSum[0].hospitalD = 0;
                    }else {
                        this.hospitalSum[0].hospitalD = parseInt(this.hospitalSum[0].hospitalD);
                    }
                }
                this.commitSum();
            },
            feiling2(num){
                if(num == 0){
                    if(this.bloodSum[0].bloodA == ''){
                        this.bloodSum[0].bloodA = 0;
                    }else {
                        this.bloodSum[0].bloodA = parseInt(this.bloodSum[0].bloodA);
                    }
                } else {
                    if (this.bloodSum[0].bloodB == '') {
                        this.bloodSum[0].bloodB = 0;
                    } else {
                        this.bloodSum[0].bloodB = parseInt(this.bloodSum[0].bloodB);
                    }
                }
                this.commitSum2();
            },
            feiling3(num){
                if(num == 0){
                    if(this.franchiserSum[0].franchiserA == ''){
                        this.franchiserSum[0].franchiserA = 0;
                    }else {
                        this.franchiserSum[0].franchiserA = parseInt(this.franchiserSum[0].franchiserA);
                    }
                } else if(num == 1){
                    if(this.franchiserSum[0].franchiserB == ''){
                        this.franchiserSum[0].franchiserB = 0;
                    }else {
                        this.franchiserSum[0].franchiserB = parseInt(this.franchiserSum[0].franchiserB);
                    }
                }else if(num == 2){
                    if(this.franchiserSum[0].franchiserC == ''){
                        this.franchiserSum[0].franchiserC = 0;
                    }else {
                        this.franchiserSum[0].franchiserC = parseInt(this.franchiserSum[0].franchiserC);
                    }
                }else {
                    if(this.franchiserSum[0].franchiserD == ''){
                        this.franchiserSum[0].franchiserD = 0;
                    }else {
                        this.franchiserSum[0].franchiserD = parseInt(this.franchiserSum[0].franchiserD);
                    }
                }
                this.commitSum3();
            },
            feiling4(num){
                if(num == 0){
                    if(this.CustomerSum[0].CustomerAA == ''){
                        this.CustomerSum[0].CustomerAA = 0;
                    }else {
                        this.CustomerSum[0].CustomerAA = parseInt(this.CustomerSum[0].CustomerAA);
                    }
                } else if(num == 1){
                    if(this.CustomerSum[0].CustomerA == ''){
                        this.CustomerSum[0].CustomerA = 0;
                    }else {
                        this.CustomerSum[0].CustomerA = parseInt(this.CustomerSum[0].CustomerA);
                    }
                }else if(num == 2){
                    if(this.CustomerSum[0].CustomerB == ''){
                        this.CustomerSum[0].CustomerB = 0;
                    }else {
                        this.CustomerSum[0].CustomerB = parseInt(this.CustomerSum[0].CustomerB);
                    }
                }else if(num == 3) {
                    if(this.CustomerSum[0].CustomerC == ''){
                        this.CustomerSum[0].CustomerC = 0;
                    }else {
                        this.CustomerSum[0].CustomerC = parseInt(this.CustomerSum[0].CustomerC);
                    }
                } else if(num == 4){
                    if(this.CustomerSum[0].CustomerD == ''){
                        this.CustomerSum[0].CustomerD = 0;
                    }else {
                        this.CustomerSum[0].CustomerD = parseInt(this.CustomerSum[0].CustomerD);
                    }
                } else if(num == 5){
                    if(this.CustomerSum[0].CustomerOther == ''){
                        this.CustomerSum[0].CustomerOther = 0;
                    }else {
                        this.CustomerSum[0].CustomerOther = parseInt(this.CustomerSum[0].CustomerOther);
                    }
                } else {
                    if(this.CustomerSum[0].EmployeeNum == ''){
                        this.CustomerSum[0].EmployeeNum = 0;
                    }else {
                        this.CustomerSum[0].EmployeeNum = parseInt(this.CustomerSum[0].EmployeeNum);
                    }
                }
                this.commitSum4();
            },
            peerNum(){
                if(this.coverageData.HospitalA != undefined){
                    this.hospitalSum = [
                        {
                            hospitalA:this.coverageData.HospitalA,
                            hospitalB:this.coverageData.HospitalB,
                            hospitalC:this.coverageData.HospitalC,
                            hospitalD:this.coverageData.HospitalD,
                            sum:this.coverageData.HospitalSum,
                            department:this.coverageData.HospitalDeparments,
                        }
                    ];
                    this.CustomerSum = [
                        {
                            CustomerAA:this.coverageData.CustomerAA,
                            CustomerA:this.coverageData.CustomerA,
                            CustomerB:this.coverageData.CustomerB,
                            CustomerC:this.coverageData.CustomerC,
                            CustomerD:this.coverageData.CustomerD,
                            CustomerOther:this.coverageData.CustomerOthers,
                            sum:this.coverageData.CustomerSum,
                            EmployeeNum:this.coverageData.EmployeeNum,
                            totalSum:this.coverageData.TotalNum,
                        }
                    ];
                    this.franchiserSum = [
                        {
                            franchiserA:this.coverageData.FranchiserA,
                            franchiserB:this.coverageData.FranchiserB,
                            franchiserC:this.coverageData.FranchiserC,
                            franchiserD:this.coverageData.FranchiserD,
                            sum:this.coverageData.FranchiserSum,
                        }
                    ];
                    this.bloodSum = [
                        {
                            bloodA:this.coverageData.BloodBankA,
                            bloodB:this.coverageData.BloodBankB,
                            sum:this.coverageData.BloodBankSum,
                        }
                    ];
                }
                this.peerShow = true;
            },
            getTopInfo(){
                    let params = {
                        id: this.OriginalMainId
                    }
                    GetApplyOrderDetail(params).then(response => {
                        let applicationInfoCopy = response.data.Result.ApplyMain
                        this.applicationInfo = {
                            startData: new Date(applicationInfoCopy.ApplyDateStart),
                            endData: new Date(applicationInfoCopy.ApplyDateEnd),
                            overseaList: applicationInfoCopy.AreaType,
                            Purpose: applicationInfoCopy.TripPurpose,
                            Place: applicationInfoCopy.Place,
                            Currency: applicationInfoCopy.Currency
                        };

                    })
            },
            toMainPlan(){
                this.mainPlanshow = true;
            },
            openAirAll() {
                this.airShowAll = true;
                this.selectListSub = [];
                this.ProductList = [];
                this.airCost.DetailId = this.ticketAllList;
                if(!this.isMeeting) {
                    this.$nextTick(() => {
                        this.$refs['airCost'].clearValidate();
                        this.selectList.forEach((item, index2) => {
                            if (this.ticketTable[0].ExpenseItemID == item.ExpenseItemID) {
                                this.selectListSub = this.selectList[index2].SubExpenseItemList;
                            }
                        })
                        this.costCenterList.forEach((item2, index3) => {
                            if (this.ticketTable[0].CostCenterID == item2.CostCenterID) {
                                this.ProductList = this.costCenterList[index3].ProductList;
                            }
                        })
                    })
                    this.airCost.AMexItemId = this.ticketTable[0].AMexItemId;
                    this.airCost.ExpenseItemID = this.ticketTable[0].ExpenseItemID;
                    this.airCost.ExpenseItem = this.ticketTable[0].ExpenseItem;
                    this.airCost.SubExpenseItemID = this.ticketTable[0].SubExpenseItemID;
                    this.airCost.SubExpenseItem = this.ticketTable[0].SubExpenseItem;
                    this.airCost.ProductId =this.ticketTable[0].ProductId;
                    this.airCost.ProductName =this.ticketTable[0].ProductName;
                };
            },
            openHotelAll() {
                this.hotelShowAll = true;
                this.selectListSub = [];
                this.ProductList = [];
                this.hotelCost.DetailId = this.hotelAllList;
            },
            ticketAll(selection) {
                this.ticketAllList= [];
                selection.forEach((item,index)=>{
                    this.ticketAllList.push(item.Id)
                })
            },
            hotelAll(selection) {
                this.hotelAllList= [];
                selection.forEach((item,index)=>{
                    this.hotelAllList.push(item.Id)
                })
            },
            unSearch() {
                this.searchName.customName = '';
                this.currentPage = 1;
                this.getCustomer(1)
            },
            unSearchcom(){
                this.searchName.companyName = '';
                this.currentPage = 1;
                this.getCompanylist(1)
            },
            onTableSelect(rows, row) {
                let hash = {};
                this.customerListCopy = this.customerListCopy.reduce((preVal, curVal) => {
                    hash[curVal.CustomerID] ? '' : hash[curVal.CustomerID] = true && preVal.push(curVal);
                    return preVal
                }, [])
                let selected = rows.length && rows.indexOf(row) !== -1;
                if (!selected) {
                    this.customerListCopy.forEach((item, index) => {
                        if (item.CustomerID == row.CustomerID) {
                            this.customerListCopy.splice(index, 1)
                        }
                    })
                }
            },
            commitCustom() {
                let hash = {};
                // let hash2 = {};
                this.customerListCopy = this.customerListCopy.reduce((preVal, curVal) => {
                    hash[curVal.CustomerID] ? '' : hash[curVal.CustomerID] = true && preVal.push(curVal);
                    return preVal
                }, [])
                console.log(this.customerListCopy)
                this.customerList = [];
                this.customerListCopy.forEach((item, index) => {
                    this.customerList.push(item)
                })
                // this.customerList = this.customerList.reduce((preVal, curVal) => {
                //     hash2[curVal.CustomerID] ? '' : hash2[curVal.CustomerID] = true && preVal.push(curVal);
                //     return preVal
                // }, [])
                this.searchName.customName = ''
                this.dialogAddVisibleTr = false;
            },
            commitCompanyCustom() {
                let hash = {};
                // let hash2 = {};
                this.companyListCopy = this.companyListCopy.reduce((preVal, curVal) => {
                    hash[curVal.EmployeeID] ? '' : hash[curVal.EmployeeID] = true && preVal.push(curVal);
                    return preVal
                }, [])
                this.companyList = [];
                this.companyListCopy.forEach((item, index) => {
                    this.companyList.push(item)
                })
                // this.customerList = this.customerList.reduce((preVal, curVal) => {
                //     hash2[curVal.CustomerID] ? '' : hash2[curVal.CustomerID] = true && preVal.push(curVal);
                //     return preVal
                // }, [])
                this.searchName.companyName = ''
                this.dialogAddVisibleTr2 = false;
            },
            searchMan() {
                this.currentPage = 1;
                this.getCustomer(1)
            },
            searchCom(){
                this.currentPage = 1;
                this.getCompanylist(1)
            },
            handleSelectionChange(selection) {
                selection.forEach((item, index) => {
                    this.customerListCopy.push(item);
                })
            },
            handleSelectionChange2(selection) {
                selection.forEach((item, index) => {
                    this.companyListCopy.push(item);
                })
            },
            handleCurrentChange2(val) {
                this.currentPage = val;
                this.getCustomer(val)
            },
            handleCurrentChange3(val) {
                this.currentPage = val;
                this.getCompanylist(val)
            },
            addPeer() {
                this.dialogAddVisibleTr = true;
                this.currentPage = 1;
                this.getCustomer(this.currentPage)
                this.customerListCopy=[]
                this.customerList.forEach((item, index) => {
                    this.customerListCopy.push(item);
                })
            },
            addPeercompany() {
                this.dialogAddVisibleTr2 = true;
                this.currentPage = 1;
                this.getCompanylist(this.currentPage)
                this.companyListCopy=[]
                this.companyList.forEach((item, index) => {
                    this.companyListCopy.push(item);
                })
            },
            otherSum() {
                this.othertotalMoney = 0;
                this.tableDataCost.forEach((item, index) => {
                    this.othertotalMoney = Number(this.othertotalMoney) + Number(item.SumMoney);
                })
                this.totalMoney = Number(this.othertotalMoney) + Number(this.hoteltotalMoney) + Number(this.airtotalMoney);
            },
            liangwei() {
                this.addCost.SumMoney = (this.addCost.SumMoney.match(/^\d*(\.?\d{0,2})/g)[0]) || null
            },
            back() {
                if (this.disabledType) {
                    this.$router.push("travelApplication");
                } else {
                    this.$confirm(this.$t('message.wantSave'), this.$t('message.warning'), {
                        confirmButtonText: ' ',
                        cancelButtonText: ' ',
                        confirmButtonClass: 'iconfont icon-gou-wukuang',
                        cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                        closeOnClickModal:false,
                        type: 'warning',
                    }).then(() => {
                        this.saveAll(0,0);
                    }).catch(() => {
                        this.$router.push("travelApplication");
                    });
                }

            },
            getCustomer(index) {
                this.transferLoading = true;
                let params = {
                    AccountID: '',
                    CompanyCode: getStore("CompanyCode"),
                    CompanyID: this.company,
                    cultureCode: getStore('CultureCode'),
                    selected: 0,
                    CustomerName: this.searchName.customName,
                    user: null,
                    pageIndex: index,
                    pageSize: 10
                }
                GetCustomer(params).then(response => {
                    this.transferData = response.data.Result.lstCustomer;
                    this.count = response.data.Result.TotalCount;
                    this.$nextTick(() => {
                        this.transferData.forEach((item, index) => {
                            this.customerListCopy.forEach((item2, index2) => {
                                if (item.CustomerID == item2.CustomerID) {
                                    this.$refs.multipleTable3.toggleRowSelection(this.transferData[index], true)
                                }
                            })
                        })
                    })
                    this.transferLoading = false;
                }).catch(function (error) {
                })
            },
            getCompanylist(index) {
                this.transferLoading = true;
                let params = {
                    AccountID: '',
                    CompanyCode: getStore("CompanyCode"),
                    CompanyID: this.company,
                    cultureCode: getStore('CultureCode'),
                    selected: 0,
                    EmployeeName: this.searchName.companyName,
                    user: null,
                    pageIndex: index,
                    pageSize: 10
                }
                GetCompanylist(params).then(response => {
                    this.transferData2 = response.data.Result.lstEmployee;
                    this.count = response.data.Result.TotalCount;
                    this.$nextTick(() => {
                        this.transferData2.forEach((item, index) => {
                            this.companyListCopy.forEach((item2, index2) => {
                                if (item.EmployeeID == item2.EmployeeID) {
                                    this.$refs.multipleTable4.toggleRowSelection(this.transferData2[index], true)
                                }
                            })
                        })
                    })
                    this.transferLoading = false;
                }).catch(function (error) {
                })
            },
            getApproveHistory() {
                let params = {
                    mainId: this.$route.query.OrderNo,
                    user: null
                }
                GetApproveHistoryFromEM(params).then(response => {
                    this.tableDataApprove = response.data.Result.Result;
                }).catch(function (error) {
                })
            },
            showHotelInfo(index, row) {
                this.hotelInfoShow = true;
                let params = {
                    OrderNo: this.OrderNo,
                    AMexItemId: row.AMexItemId,
                    InfoType:row.InfoType
                }
                GetHotelDetail(params).then(response => {
                    this.hotelInfo = response.data.Result
                    this.infoLoading = false
                }).catch(function (error) {
                })
            },
            showAirInfo(index, row) {
                this.airInfoShow = true;
                let params = {
                    OrderNo: this.OrderNo,
                    AMexItemId: row.AMexItemId,
                    InfoType:row.InfoType
                }
                GetAirDetail(params).then(response => {
                    this.airInfo = response.data.Result
                    this.infoLoading = false
                }).catch(function (error) {
                })
            },
            closeAirInfo() {
                this.airInfoShow = false;
                this.airInfo = {};
                this.infoLoading = true;
            },
            closeHotelInfo() {
                this.hotelInfoShow = false;
                this.hotelInfo = {};
                this.infoLoading = true;
            },
            changeAirSub() {
                console.log(222);
                this.addCost.SubExpenseItemID = null;
                if (this.airCost.ExpenseItemID == '') {
                    this.selectListSub = [];
                } else {
                    this.selectList.forEach((item, index) => {
                        if (this.airCost.ExpenseItemID == item.ExpenseItemID) {
                            this.airCost.ExpenseItem = item.ExpenseItemName
                            this.selectListSub = this.selectList[index].SubExpenseItemList;
                        }
                    })
                }
            },
            changeAirSub2() {
                this.selectListSub.forEach((item, index) => {
                    if (this.airCost.SubExpenseItemID == item.ExpenseItemID) {
                        this.airCost.SubExpenseItem = item.ExpenseItemName
                    }
                })
            },
            changeAirSub3() {
                this.airCost.ProductId = null;
                if (this.airCost.CostCenterID == '') {
                    this.ProductList = [];
                } else {
                    this.costCenterList.forEach((item, index) => {
                        if (this.airCost.CostCenterID == item.CostCenterID) {
                            this.airCost.CostCenter = item.CostCenterName
                            this.ProductList = item.ProductList;
                        }
                    })
                }
            },
            changeAirSub4() {
                this.ProductList.forEach((item, index) => {
                    if (this.airCost.ProductId == item.ProductID) {
                        this.airCost.ProductName = item.ProductName
                    }
                })
            },
            commitAirCost(params) {
                this.$refs[params].validate((valid) => {
                    
                    if (valid) {
                        if((this.isMeeting==true&&this.companyId==1002621)&&(this.airCost.Customers.length==0&&this.airCost.Companys.length==0)){
                        this.$message.error(this.$t('message.ad_InputCustomerCompany'));
                        return
                        }
                        this.OrderCostcenterList.forEach((item,index)=>{
                                if(item.CostCenterID== this.ticketTable[this.editAirIndex].CostCenterID){
                                    this.OrderCostcenterList.splice(index,1)
                                    return
                                }
                        })
                        this.airCost.CustomerNames=''
                        this.airCost.EmployeeNames=''
                        if(this.isMeeting==true&&this.companyId==1002621){
                            this.customerListCopy.forEach((item, index) => {
                                     this.airCost.Customers.forEach((item2, index2) => {
                                       if(item2==item.CustomerID){
                                          if(this.airCost.CustomerNames==''){
                                               this.airCost.CustomerNames+=item.CustomerName
                                           }
                                           else{
                                               this.airCost.CustomerNames+=','+item.CustomerName.toString()
                                           }
                                       }
                                     })
                                  })
                             this.companyListCopy.forEach((item, index) => {
                                   this.airCost.Companys.forEach((item2, index2) => {
                                       if(item2==item.EmployeeID){
                                           if(this.airCost.EmployeeNames==''){
                                               this.airCost.EmployeeNames+=item.EmployeeName
                                           }
                                           else{
                                               this.airCost.EmployeeNames+=','+item.EmployeeName.toString()
                                           }
                                          
                                       }
                                   })
                            });

                        }
                           
                            this.airCost.CustomerIDs=this.airCost.Customers.toString();
                            this.airCost.EmployeeIDs=this.airCost.Companys.toString();
                        let params2 = this.airCost;
                        
                        SavePlaneHotelDetail(params2).then(response => {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
                            })
                            this.getAmex();
                        }).catch(function (error) {
                        })
                        this.airShow = false;
                        this.airShowAll = false;
                        this.airCost = {
                            DetailId: [],
                            ExpenseItemID: '',
                            ExpenseItem: '',
                            SubExpenseItemID: "",
                            SubExpenseItem: "",
                            CostCenterID: "",
                            CostCenter: "",
                            SumMoney: '',
                            Remark: '',
                            ProductId:'',
                            ProductName:'',
                            Customers:'',
                            Companys:'',
                            CustomerIDs:'',
                            CustomerNames:'',
                            EmployeeIDs:'',
                            EmployeeNames:'',
                        };
                        this.editCostIndex = null;
                    } else {
                        return false;
                    }
                });
            },
            CancelAirCostAll() {
                this.airCost = {
                    DetailId: [],
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                                        Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.airShowAll = false;
            },
            CancelAirCost() {
                this.airCost = {
                    DetailId: [],
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.airShow = false;
            },
            showAirCost(index, row) {

                this.editAirIndex = index;
                this.airShow = true;
                this.selectListSub = [];
                this.ProductList = [];
                this.dialotitle = this.$t('message.Edit');
                this.$nextTick(() => {
                    this.$refs['airCost'].clearValidate();
                    this.selectList.forEach((item, index2) => {
                        if (this.ticketTable[index].ExpenseItemID == item.ExpenseItemID) {
                            this.selectListSub = this.selectList[index2].SubExpenseItemList;    
                        }
                    })
                    this.costCenterList.forEach((item2, index3) => {
                        if (this.ticketTable[index].CostCenterID == item2.CostCenterID) {
                            this.ProductList = this.costCenterList[index3].ProductList;
                        }
                    })
                    let Cus=[]
                    let Emp=[]
                    if(this.ticketTable[index].CustomerIDs==''&&this.ticketTable[index].EmployeeIDs==''){
                        Cus=[]
                    }
                    else{
                       this.ticketTable[index].CustomerIDs.split(",").forEach((item3,index4)=>{
                        item3=Number(item3)
                        if(item3!=0){
                            Cus.push(item3)
                        }
                     })
                    }
                    if(this.ticketTable[index].CustomerIDs==''&&this.ticketTable[index].EmployeeIDs==''){
                      Emp=[]
                    }else{
                    this.ticketTable[index].EmployeeIDs.split(",").forEach((item4,index5)=>{
                        item4=Number(item4)
                        if(item4!=0){
                            Emp.push(item4)
                        }
                        
                    })
                    }
                    let idList = [];
                    idList.push(this.ticketTable[index].Id)
                    this.airCost = {
                        AMexItemId: this.ticketTable[index].AMexItemId,
                        DetailId: idList,
                        ExpenseItemID: this.ticketTable[index].ExpenseItemID,
                        ExpenseItem: this.ticketTable[index].ExpenseItem,
                        SubExpenseItemID: this.ticketTable[index].SubExpenseItemID,
                        SubExpenseItem: this.ticketTable[index].SubExpenseItem,
                        CostCenterID: this.ticketTable[index].CostCenterID,
                        CostCenter: this.ticketTable[index].CostCenter,
                        SumMoney: row.SumMoney,
                        Remark: this.ticketTable[index].Remark,
                        ProductId:this.ticketTable[index].ProductId,
                        ProductName:this.ticketTable[index].ProductName,
                        Customers:Cus,
                        Companys:Emp,
                        CustomerIDs:this.ticketTable[index].CustomerIDs,
                        CustomerNames:this.ticketTable[index].CustomerNames,
                        EmployeeIDs:this.ticketTable[index].EmployeeIDs,
                        EmployeeNames:this.ticketTable[index].EmployeeNames,
                    };
                })

            },
            changeHotelSub() {
                this.hotelCost.SubExpenseItemID = null;
                this.selectList.forEach((item, index) => {
                    if (this.hotelCost.ExpenseItemID == item.ExpenseItemID) {
                        this.hotelCost.ExpenseItem = item.ExpenseItemName
                        this.selectListSub = this.selectList[index].SubExpenseItemList;
                    }
                })
            },
            changeHotelSub2() {
                this.selectListSub.forEach((item, index) => {
                    if (this.hotelCost.SubExpenseItemID == item.ExpenseItemID) {
                        this.hotelCost.SubExpenseItem = item.ExpenseItemName
                    }
                })
            },
            changeHotelSub3() {
                this.hotelCost.ProductId = null;
                if (this.hotelCost.CostCenterID == '') {
                    this.ProductList = [];
                } else {
                    this.costCenterList.forEach((item, index) => {
                        if (this.hotelCost.CostCenterID == item.CostCenterID) {
                            this.hotelCost.CostCenter = item.CostCenterName
                            this.ProductList = item.ProductList;
                        }
                    })
                }
            },
            changeHotelSub4() {
                this.ProductList.forEach((item, index) => {
                    if (this.hotelCost.ProductId == item.ProductID) {
                        this.hotelCost.ProductName = item.ProductName
                    }
                })
            },
            commitHotelCost(params) {
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        if((this.isMeeting==true&&this.companyId==1002621)&&(this.hotelCost.Customers.length==0&&this.hotelCost.Companys.length==0)){
                          this.$message.error(this.$t('message.ad_InputCustomerCompany'));
                          return
                        }
                        this.OrderCostcenterList.forEach((item,index)=>{
                                if(item.CostCenterID== this.hotelTable[this.editHotelIndex].CostCenterID){
                                    this.OrderCostcenterList.splice(index,1)
                                    return
                                }
                        })
                        this.hotelCost.CustomerNames=''
                        this.hotelCost.EmployeeNames=''
                        if(this.isMeeting==true&&this.companyId==1002621){
                            this.companyListCopy.forEach((item, index) => {
                                   this.hotelCost.Companys.forEach((item2, index2) => {
                                       if(item2==item.EmployeeID){
                                           if(this.hotelCost.EmployeeNames==''){
                                               this.hotelCost.EmployeeNames+=item.EmployeeName
                                           }
                                           else{
                                               this.hotelCost.EmployeeNames+=','+item.EmployeeName.toString()
                                           }
                                          
                                       }
                                   })
                            });
                            this.customerListCopy.forEach((item, index) => {
                                     this.hotelCost.Customers.forEach((item2, index2) => {
                                       if(item2==item.CustomerID){
                                           if(this.hotelCost.CustomerNames==''){
                                               this.hotelCost.CustomerNames+=item.CustomerName
                                           }
                                           else{
                                               this.hotelCost.CustomerNames+=','+item.CustomerName.toString()
                                           }
                                          
                                       }
                                     })
                                  })
                        }
                           
                             
                            this.hotelCost.CustomerIDs=this.hotelCost.Customers.toString();
                            this.hotelCost.EmployeeIDs=this.hotelCost.Companys.toString();
                        let params2 = this.hotelCost;
                        SavePlaneHotelDetail(params2).then(response => {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
                            });
                            this.getAmex();
                        }).catch(function (error) {
                        })
                        this.hotelShow = false;
                        this.hotelShowAll = false;
                        this.hotelCost = {
                            DetailId: '',
                            ExpenseItemID: '',
                            ExpenseItem: '',
                            SubExpenseItemID: "",
                            SubExpenseItem: "",
                            CostCenterID: "",
                            CostCenter: "",
                            SumMoney: '',
                            Remark: '',
                            ProductId:'',
                            ProductName:'',
                            Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                
                        };
                        this.editCostIndex = null;
                    } else {
                        return false;
                    }
                });
            },
            CancelHotelCost() {
                this.hotelCost = {
                    DetailId: '',
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.hotelShow = false;
            },
            CancelHotelCostAll() {
                this.hotelCost = {
                    DetailId: '',
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.hotelShowAll = false;
            },
            showHotelCost(index, row) {
                this.editHotelIndex = index;
                this.hotelShow = true;
                this.selectListSub = [];
                this.ProductList = [];
                this.dialotitle = this.$t('message.Edit');
                this.selectList.forEach((item, index2) => {
                    if (this.hotelTable[index].ExpenseItemID == item.ExpenseItemID) {
                        this.selectListSub = this.selectList[index2].SubExpenseItemList;
                    }
                })
                this.costCenterList.forEach((item2, index3) => {
                    if (this.hotelTable[index].CostCenterID == item2.CostCenterID) {
                        this.ProductList = this.costCenterList[index3].ProductList;
                    }
                })
                
                this.$nextTick(() => {
                    this.$refs['hotelCost'].resetFields();
                     let Cus=[]
                    let Emp=[]
                    if(this.hotelTable[index].CustomerIDs==''&&this.hotelTable[index].EmployeeIDs==''){
                        Cus=[]
                    }
                    else{
                       this.hotelTable[index].CustomerIDs.split(",").forEach((item3,index4)=>{
                        item3=Number(item3)
                        if(item3!=0){
                            Cus.push(item3)
                        }
                     })
                    }
                    if(this.hotelTable[index].CustomerIDs==''&&this.hotelTable[index].EmployeeIDs==''){
                      Emp=[]
                    }else{
                    this.hotelTable[index].EmployeeIDs.split(",").forEach((item4,index5)=>{
                        item4=Number(item4)
                        if(item4!=0){
                            Emp.push(item4)
                        }
                        
                    })
                    }
                    let idList = [];
                    idList.push(this.hotelTable[index].Id)
                    this.hotelCost = {
                        DetailId: idList,
                        ExpenseItemID: this.hotelTable[index].ExpenseItemID,
                        ExpenseItem: this.hotelTable[index].ExpenseItem,
                        SubExpenseItemID: this.hotelTable[index].SubExpenseItemID,
                        SubExpenseItem: this.hotelTable[index].SubExpenseItem,
                        CostCenterID: this.hotelTable[index].CostCenterID,
                        CostCenter: this.hotelTable[index].CostCenter,
                        SumMoney: this.hotelTable[index].SumMoney,
                        Remark: this.hotelTable[index].Remark,
                        ProductId: this.hotelTable[index].ProductId,
                        ProductName: this.hotelTable[index].ProductName,
                        Customers:Cus,
                        Companys:Emp,
                        CustomerIDs:this.hotelTable[index].CustomerIDs,
                        CustomerNames:this.hotelTable[index].CustomerNames,
                        EmployeeIDs:this.hotelTable[index].EmployeeIDs,
                        EmployeeNames:this.hotelTable[index].EmployeeNames,
                    };
                })
            },
            getAmex() {
                this.$refs['topForm'].clearValidate();
                this.flashShow = false;
                this.tooltipShow = false;
                this.loadingAll = true;
                let params = {
                    OrderGuid: this.OrderGuid
                }
                let list=false
                JWTLoginRefresh(params).then(response => {
                    if(response.data.Flag){
                        this.OrderNo = response.data.Result.ApplyMain.OrderNo
                        this.ticketTable = response.data.Result.lstPlaneDetail;
                        this.hotelTable = response.data.Result.lstHotelDetail;
                        this.hasIntlAir = response.data.Result.hasIntlAir;
                        this.intlAirPushType = response.data.Result.intlAirPushType;
                        this.orderPushType = response.data.Result.orderPushType;
                        this.ticketTable.forEach((item, index) => {
                          list=false;
                          if(this.OrderCostcenterList.length>0){
                            this.OrderCostcenterList.forEach((item2, index2) => {
                                if(item.CostCenterID==item2.CostCenterID){
                                    list=true;
                                    return
                                }
                           })
                          if(list==false){this.OrderCostcenterList.push(item)}
                         }
                         else{
                             this.OrderCostcenterList.push(item)
                          }
                        
                          })
                    this.hotelTable.forEach((item, index) => {
                      list=false;
                        if(this.OrderCostcenterList.length>0){
                            this.OrderCostcenterList.forEach((item2, index2) => {
                                if(item.CostCenterID==item2.CostCenterID){
                                    list=true;
                                    return
                                }
                          })
                          if(list==false){this.OrderCostcenterList.push(item)}
                        }
                        else{
                             this.OrderCostcenterList.push(item)
                        }
                    })
                        this.loadingAll = false;
                    } else {
                        setTimeout(() => {
                            const that = this;
                            that.loadingAll = false;
                        }, 500);
                    }
                }).catch(function (error) {
                    this.loadingAll = false;
                })

            },
            changeDownloadList(val) {
                this.downloadList = [];
                val.forEach((item, index) => {
                    let str = item.Id.toString();
                    this.downloadList.push(str)
                })
            },
            downloadPackage() {
                this.downloadList.forEach((item, index) => {
                    let params = {
                        FileId: item
                    }
                    GetFileInfoByFileId(params).then(response => {
                        let token = response.data.Result.FilePath.split('=')
                        this.downloadTokenList.push(token[1])
                    }).catch(function (error) {
                    })
                })
                this.$nextTick(function () {
                    this.$confirm(this.$t('message.packageDownload'), this.$t('message.warning'), {
                        confirmButtonText: ' ',
                        cancelButtonText: ' ',
                        confirmButtonClass: 'iconfont icon-gou-wukuang',
                        cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                        type: 'warning'
                    }).then(() => {
                        this.sendFileToken()
                    }).catch(() => {
                        this.downloadList = [];
                        this.downloadTokenList = [];
                        this.$message({
                            type: 'info',
                            message: this.$t('message.DownloadCanceled')
                        });
                    });
                });

            },
            sendFileToken() {
                // let zipUrl = 'http://api.fresenius-kabi.com.cn/FileService/file/GetZipFileToken';
                let zipUrl = 'http://10.233.164.32:8076/file/GetZipFileToken';
                let params = {
                    fileTokeList: this.downloadList
                }
                ajax({
                    url: zipUrl,
                    type: "post",
                    data: JSON.stringify(params),//必要
                    dataType: "json",
                    contentType: "application/json",
                    success: function (res) {

                    },
                    error: function (res) {
                    }
                });
            },
            viewAttachment(index, row) {
                let params = {
                    FileId: row.Id
                }
                let url = ''
                GetFileInfoByFileId(params).then(response => {
                    url = response.data.Result.FilePath
                    //window.open('https://tmctest.fresenius-kabi-sspc.com//web/static/pdf/web/viewer.html?file=' + encodeURIComponent(url))
                    window.open('/Web/static/pdf/web/viewer.html?file=' + encodeURIComponent(url))
                    // this.getFlow(url);
                }).catch(function (error) {
                })
                // this.fileShow = true
            },
            getFlow(url) {
                let ele = this;
                axios.get(url).then(function (response) {
                    ele.fileFlowList.push(response)
                }).catch(function (error) {
                });
            },
            getObjectURL(file) {
                let url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    try {
                        url = window.webkitURL.createObjectURL(file);
                    } catch (error) {
                    }
                } else if (window.URL != undefined) { // mozilla(firefox)
                    try {
                        url = window.URL.createObjectURL(file);
                    } catch (error) {
                    }
                }
                return url;
            },

            downAttachment(index, row) {
                let params = {
                    FileId: row.Id
                }
                GetFileInfoByFileId(params).then(response => {
                    let elemIF = document.createElement("iframe");
                    elemIF.src = response.data.Result.FilePath;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }).catch(function (error) {
                })
            },
            getSanSelect(id1, id2, id3,id4) {
                let sanlian = JSON.parse(sessionStorage.getItem("sanlian"));
                sanlian.forEach((item, index) => {
                    if (item.CompanyID == id1) {
                        this.costCenterList = item.CostcenterList;
                        this.OrderList=item.InternalOrderList
                        if(this.OrderList.length>0){
                            this.Ordershow=true
                        }
                        item.ExpenseTypeList.forEach((item2, index2) => {
                            if (item2.ExpenseTypeID == id3) {
                                this.applyType = item2.ExpenseTypeName;
                                this.LockCostCenter = item2.LockCostCenter;
                                this.fixedId = item2.CostCenterID;
                                this.selectList = item2.ExpenseItemList;
                                if(item2.IsMeeting){
                                    this.isMeeting = true;
                                }
                                item2.ExpenseItemList.forEach((item3, index3) => {
                                    if(id4==item3.ExpenseItemID){
                                        this.costType=item3.ExpenseItemName;
                                        this.costTypeId=item3.ExpenseItemID;
                                        console.log(this.addCost.ExpenseItem)
                                    }

                                })
                                
                            }
                            
                        })
                    }
                })
            },
            getSanSelectOther(id1, id2, id3,id4) {
                let sanlian = JSON.parse(sessionStorage.getItem("sanlian"));
                this.CostOther=[]
                sanlian.forEach((item, index) => {
                    if (item.CompanyID == id1) {
                        this.costCenterList = item.CostcenterList;
                        this.OrderList=item.InternalOrderList;
                        if(this.OrderList.length>0){
                            this.Ordershow=true
                        }
                        item.ExpenseTypeList.forEach((item2, index2) => {
                            if (item2.ExpenseTypeID == id3) {
                                this.applyType = item2.ExpenseTypeName;
                                this.LockCostCenter = item2.LockCostCenter;
                                this.fixedId = item2.CostCenterID;
                                this.selectList = item2.ExpenseItemList;
                                if(item2.IsMeeting){
                                    this.isMeeting = true;
                                }
                                item2.ExpenseItemList.forEach((item3, index3) => {
                                    if(id4==item3.ExpenseItemID||id4==''){
                                        item3.SubExpenseItemList.forEach((item4, index4) => {
                                             if(item4.IsTMCShow==true){
                                             this.CostOther.push(item3.SubExpenseItemList[index4])
                                        }

                                         })
                                        
                                    }
                                    
                                })
                                
                            }
                            
                        })
                    }
                })
            },
            getAttachmentRes(response, file, fileList) {
                console.log(response);
                this.tableDataAttachment.push(response.Result)
                this.loadingAll = false;
            },
            getDetail() {
                this.loadingAll = true;
                let params = {
                    id: this.IdGuid
                }
                let list=false
                GetApplyOrderDetail(params).then(response => {
                    let applicationInfoCopy = response.data.Result.ApplyMain
                    // if (applicationInfoCopy.AreaType == 1) {
                    //     areaType = 2;
                    // } else {
                    //     areaType = 1;
                    // }
                    this.OrderCostcenterList=[]
                    this.ExpenseTypeID = response.data.Result.ApplyMain.ExpenseTypeID
                    this.OrderGuid = response.data.Result.ApplyMain.OrderGuid
                    this.OrderNo = response.data.Result.ApplyMain.OrderNo
                    this.applyTypeId = response.data.Result.ApplyMain.ExpenseTypeID;
                    this.applyType = response.data.Result.ApplyMain.ExpenseTypeName;
                    this.ApplyMainId = response.data.Result.ApplyMain.Id;
                    this.company = response.data.Result.ApplyMain.CompanyID;
                    this.TeamID = response.data.Result.ApplyMain.TeamID;
                    this.hasIntlAir = response.data.Result.hasIntlAir;
                    this.intlAirPushType = response.data.Result.intlAirPushType;
                    this.orderPushType = response.data.Result.orderPushType;
                    this.customerList = response.data.Result.lstCustomer;
                    this.customerListCopy = response.data.Result.lstCustomer;
                    this.companyList=response.data.Result.lstEmployee;
                    this.companyListCopy=response.data.Result.lstEmployee;
                    this.getSanSelect(this.company, this.TeamID, this.applyTypeId,this.CostId)
                    this.getSanSelectOther(this.company, this.TeamID, this.ExpenseTypeID,this.CostId);

                    this.applicationInfo = {
                        startData: new Date(applicationInfoCopy.ApplyDateStart),
                        endData: new Date(applicationInfoCopy.ApplyDateEnd),
                        overseaList: applicationInfoCopy.AreaType,
                        Purpose: applicationInfoCopy.TripPurpose,
                        Place: applicationInfoCopy.Place,
                        Currency: applicationInfoCopy.Currency,
                        Speaker:applicationInfoCopy.Speaker,
                        CustomerReason:applicationInfoCopy.ChooseCustomerReason,
                        OAnumber:applicationInfoCopy.OANo
                    };
                    this.OriginalMainId = applicationInfoCopy.OriginalMainId
                    // this.currencyTypeList.forEach((item, index) => {
                    //     if (item.CurrencyID == applicationInfoCopy.Currency) {
                    //         this.CurrencyText = item.CurrencyName;
                    //     }
                    // })
                    // if (this.applicationInfo.Currency == null) {
                    //     this.applicationInfo.Currency = this.currencyTypeList[0].CurrencyID;
                    // }
                    if (applicationInfoCopy.ApplyDateStart == null) {
                        this.applicationInfo.startData = ''
                    }
                    if (applicationInfoCopy.ApplyDateEnd == null) {
                        this.applicationInfo.endData = ''
                    }
                    this.ticketTable = response.data.Result.lstPlaneDetail
                    this.hotelTable = response.data.Result.lstHotelDetail
                    this.tableDataCost = response.data.Result.lstOtherDetail;
                    this.tableDataTrip = response.data.Result.lstTripDetail;
                    this.tableDataAttachment = response.data.Result.lstFile;
                    this.coverageData = response.data.Result.coverageData;
                    this.tableDataOrder=response.data.Result.lstInternalOrder;
                    this.tableDataOrder.forEach((item,index)=>{
                        this.OrderList.forEach((item2,index2)=>{
                            if(item2.InternalOrderID==item.InternalOrderID){
                                item.OrderName=item2.InternalOrderName;
                                return;
                            }
                        })
                    })
                    
                    this.ticketTable.forEach((item, index) => {
                      list=false;
                        if(this.OrderCostcenterList.length>0){
                            this.OrderCostcenterList.forEach((item2, index2) => {
                                if(item.CostCenterID==item2.CostCenterID){
                                    list=true;
                                    return
                                }
                          })
                          if(list==false){this.OrderCostcenterList.push(item)}
                        }
                        else{
                             this.OrderCostcenterList.push(item)
                        }
                        
                    })
                    this.hotelTable.forEach((item, index) => {
                      list=false;
                        if(this.OrderCostcenterList.length>0){
                            this.OrderCostcenterList.forEach((item2, index2) => {
                                if(item.CostCenterID==item2.CostCenterID){
                                    list=true;
                                    return
                                }
                          })
                          if(list==false){this.OrderCostcenterList.push(item)}
                        }
                        else{
                             this.OrderCostcenterList.push(item)
                        }
                    })
                    this.tableDataCost.forEach((item, index) => {
                      list=false;
                        if(this.OrderCostcenterList.length>0){
                            this.OrderCostcenterList.forEach((item2, index2) => {
                                if(item.CostCenterID==item2.CostCenterID){
                                    list=true;
                                    return
                                }
                          })
                        if(list==false){this.OrderCostcenterList.push(item)}
                        }
                        else{
                             this.OrderCostcenterList.push(item)
                        }    
                    })
                    this.tableDataOrder.forEach((item,index)=>{
                        this.costCenterList.forEach((item2,index2)=>{
                            if(item2.CostCenterID==item.CostCenterID){
                                item.OrderCostcenterName=item2.CostCenterName
                            }
                        })
                    })
                    this.loadingAll = false;
                })
            },
            handleEditCost(index, row) {
                this.dialogAddVisible = true;
                this.dialotitle = this.$t('message.Edit');
                this.editCostIndex = index;
                this.$nextTick(() => {
                    this.$refs['addCost'].clearValidate();
                    this.selectList.forEach((item, index2) => {
                        if (this.tableDataCost[index].ExpenseItemID == item.ExpenseItemID) {
                            this.selectListSub = this.selectList[index2].SubExpenseItemList;
                        }
                    })
                    this.costCenterList.forEach((item2, index3) => {
                        if (this.tableDataCost[index].CostCenterID == item2.CostCenterID) {
                            this.ProductList = this.costCenterList[index3].ProductList;
                        }
                    })
                    let Cus=[]
                    let Emp=[]
                    if(this.tableDataCost[index].Id==''){
                      Cus=this.addCost.Customers
                    }else{
                       this.tableDataCost[index].CustomerIDs.split(",").forEach((item3,index4)=>{
                        item3=Number(item3)
                        if(item3!=0){
                            Cus.push(item3)
                        }
                        
                    })
                    }
                    if(this.tableDataCost[index].Id==''){
                      Emp=this.addCost.Companys
                    }else{
                    this.tableDataCost[index].EmployeeIDs.split(",").forEach((item4,index5)=>{
                        item4=Number(item4)
                        if(item4!=0){
                            Emp.push(item4)
                        }
                        
                    })
                    }
                    this.addCost = {
                        InfoType: 3,
                        ExpenseItemID: this.tableDataCost[index].ExpenseItemID,
                        ExpenseItem: this.tableDataCost[index].ExpenseItem,
                        SubExpenseItemID: this.tableDataCost[index].SubExpenseItemID,
                        SubExpenseItem: this.tableDataCost[index].SubExpenseItem,
                        CostCenterID: this.tableDataCost[index].CostCenterID,
                        CostCenter: this.tableDataCost[index].CostCenter,
                        SumMoney: this.tableDataCost[index].SumMoney,
                        Remark: this.tableDataCost[index].Remark,
                        ProductId: this.tableDataCost[index].ProductId,
                        ProductName: this.tableDataCost[index].ProductName,
                        Customers:Cus,
                        Companys:Emp,
                        CustomerIDs:this.tableDataCost[index].CustomerIDs,
                        CustomerNames:this.tableDataCost[index].CustomerNames,
                        EmployeeIDs:this.tableDataCost[index].EmployeeIDs,
                        EmployeeNames:this.tableDataCost[index].EmployeeNames,
                    };
                })
            },
            handleEditTrip(index, row) {
                this.editTripIndex = index;
                this.addCost = this.tableDataTrip[index];
                this.addTripInfo = {
                    TripDate: this.tableDataTrip[index].TripDate,
                    TripTimeStart: this.tableDataTrip[index].TripTimeStart,
                    TripTimeEnd: this.tableDataTrip[index].TripTimeEnd,
                    WorkContent: this.tableDataTrip[index].WorkContent
                },
                    this.dialogAddVisible2 = true;
            },
            handleDeleteCost(index, row) {
                this.delectShow = true;
                this.delectIndex = index;
            },
            handleDeletePeer(index, row){
                this.delectShow2 = true;
                this.delectIndex2 = index;
            },
            handleDeletePeer2(index, row){
                this.delectShow3 = true;
                this.delectIndex3 = index;
            },
            delectCost() {
                this.delectShow = false;
                this.tableDataCost.splice(this.delectIndex, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('message.Success')
                });
            },
            delectPeer(){
                this.delectShow2 = false;
                this.customerList.splice(this.delectIndex2, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('message.Success')
                });
                this.customerListCopy = [];
                this.customerList.forEach((item, index) => {
                    this.customerListCopy.push(item)
                })
            },
            delectPeercom(){
                this.delectShow3 = false;
                this.companyList.splice(this.delectIndex3, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('message.Success')
                });
                this.companyListCopy = [];
                this.companyList.forEach((item, index) => {
                    this.companyListCopy.push(item)
                })
            },
            delectCancel() {
                this.delectShow = false
                this.$message({
                    type: 'info',
                    message: this.$t('message.DeleteCanceled')
                });
            },
            delectCancel2() {
                this.delectShow2 = false
                this.$message({
                    type: 'info',
                    message: this.$t('message.DeleteCanceled')
                });
            },
            delectCancel3() {
                this.delectShow3 = false
                this.$message({
                    type: 'info',
                    message: this.$t('message.DeleteCanceled')
                });
            },
            handleDeleteAttachment(index, row) {
                this.$confirm(this.$t('message.deleteIt'), this.$t('message.warning'), {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    this.tableDataAttachment.splice(index, 1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
                });
            },
            handleDeleteTrip(index, row) {
                this.$confirm(this.$t('message.deleteIt'), this.$t('message.warning'), {
                    confirmButtonText: ' ',
                    cancelButtonText: ' ',
                    confirmButtonClass: 'iconfont icon-gou-wukuang',
                    cancelButtonClass: 'iconfont icon-guanbi-wukuang',
                    type: 'warning'
                }).then(() => {
                    this.tableDataTrip.splice(index, 1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.DeleteCanceled')
                    });
                });
            },
            commitNewTrip(params) {
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        if (this.editTripIndex == null) {
                            this.tableDataTrip.push(this.addTripInfo)
                        } else {
                            this.tableDataTrip[this.editTripIndex] = this.addTripInfo;
                        }
                        this.dialogAddVisible2 = false;
                        this.$nextTick(() => {
                            this.$refs['addTrip'].resetFields();
                        })
                        this.addTripInfo = {
                            TripDate: '',
                            TripTimeStart: '',
                            TripTimeEnd: '',
                            WorkContent: ''
                        };
                    } else {
                        return false;
                    }
                });
                // this.addTripInfo = {
                //     TripDate: '',
                //     TripTimeStart: '',
                //     TripTimeEnd: '',
                //     WorkContent: ''
                // };
            },
            getTime(val) {
                const d = new Date(val);
                this.addTripInfo.TripDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            },
            commitNewCost(params) {
                let list=false
                this.$refs[params].validate((valid) => {
                    
                    if (valid) {
                        if((this.isMeeting==true&&this.companyId==1002621)&&(this.addCost.Customers.length==0&&this.addCost.Companys.length==0)){
                        this.$message.error(this.$t('message.ad_InputCustomerCompany'));
                        return
                    }
                        if (this.editCostIndex == null) {
                            if(this.isMeeting==true&&this.companyId==1002621){
                                 this.addCost.CustomerNames=''
                                 this.addCost.EmployeeNames=''
                                 this.customerListCopy.forEach((item, index) => {
                                   this.addCost.Customers.forEach((item2, index2) => {
                                       if(item2==item.CustomerID){
                                           if(this.addCost.CustomerNames==''){
                                               this.addCost.CustomerNames+=item.CustomerName
                                           }
                                           else{
                                               this.addCost.CustomerNames+=','+item.CustomerName.toString()
                                           }
                                          
                                          
                                       }
                                   })
                                 })
                                  this.companyListCopy.forEach((item, index) => {
                                   this.addCost.Companys.forEach((item2, index2) => {
                                       if(item2==item.EmployeeID){
                                           if(this.addCost.EmployeeNames==''){
                                               this.addCost.EmployeeNames+=item.EmployeeName
                                           }
                                           else{
                                               this.addCost.EmployeeNames+=','+item.EmployeeName.toString()
                                           }
                                          
                                          
                                       }
                                   })
                                 })
                                 this.addCost.CustomerIDs=this.addCost.Customers.toString();
                                 this.addCost.EmployeeIDs=this.addCost.Companys.toString();
                            }
                            if(this.OrderCostcenterList.length>0){
                                this.OrderCostcenterList.forEach((item2, index2) => {
                                    if(this.addCost.CostCenterID==item2.CostCenterID){
                                        list=true;
                                        return
                                    }
                                })
                                if(list==false){
                                     this.OrderCostcenterList.push(this.addCost)
                                }
                              }
                            else{
                                     this.OrderCostcenterList.push(this.addCost)
                                }
                            this.tableDataCost.push(this.addCost);
                        } else {
                            this.OrderCostcenterList.forEach((item,index)=>{
                                if(item.CostCenterID== this.tableDataCost[this.editCostIndex].CostCenterID){
                                    this.OrderCostcenterList.splice(index,1)
                                }
                            })
                            if(this.OrderCostcenterList.length>0){
                                this.OrderCostcenterList.forEach((item2, index2) => {
                                    if(this.addCost.CostCenterID==item2.CostCenterID){
                                        list=true;
                                        return
                                    }
                                })
                                if(list==false){
                                     this.OrderCostcenterList.push(this.addCost)
                                }
                              }
                            else{
                                     this.OrderCostcenterList.push(this.addCost)
                                }
                            this.tableDataCost[this.editCostIndex] = this.addCost;
                            if(this.isMeeting==true&&this.companyId==1002621){
                                  this.addCost.CustomerNames='';
                                  this.addCost.EmployeeNames='';
                                  this.customerListCopy.forEach((item, index) => {
                                   this.addCost.Customers.forEach((item2, index2) => {
                                       if(item2==item.CustomerID){
                                           if(this.addCost.CustomerNames==''){
                                               this.addCost.CustomerNames+=item.CustomerName
                                           }
                                           else{
                                               this.addCost.CustomerNames+=','+item.CustomerName.toString()
                                           }
                                          
                                       }
                                   })
                                  })
                                   this.companyListCopy.forEach((item, index) => {
                                   this.addCost.Companys.forEach((item2, index2) => {
                                       if(item2==item.EmployeeID){
                                           if(this.addCost.EmployeeNames==''){
                                               this.addCost.EmployeeNames+=item.EmployeeName
                                           }
                                           else{
                                               this.addCost.EmployeeNames+=','+item.EmployeeName.toString()
                                           }
                                          
                                       }
                                   })
                                  });
                                  this.addCost.CustomerIDs=this.addCost.Customers.toString();
                                  this.addCost.EmployeeIDs=this.addCost.Companys.toString();
                            }

                            this.tableDataCost[this.editCostIndex] = this.addCost;
                            this.otherSum();
                        }
                        this.dialogAddVisible = false;
                        this.addCost = {
                            InfoType: 3,
                            ExpenseItemID: '',
                            ExpenseItem: '',
                            SubExpenseItemID: "",
                            SubExpenseItem: "",
                            CostCenterID: "",
                            CostCenter: "",
                            SumMoney: '',
                            Remark: '',
                            ProductId:'',
                            ProductName:'',
                            Customers:'',
                            Companys:'',
                            CustomerIDs:'',
                            CustomerNames:'',
                            EmployeeIDs:'',
                            EmployeeNames:'',
                        };
                        this.editCostIndex = null;
                    } else {
                        return false;
                    }
                });
            },
            CanceladdNewCost() {
                this.addCost = {
                    InfoType: 3,
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:"",
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.dialogAddVisible = false;
            },
            saveAll(num,num2) {
                this.loadingAll = true;
                let ids = [];
                this.tableDataAttachment.forEach((item, index) => {
                    ids.push(item.Id)
                })
                let start = '';
                let end = '';
                if (this.applicationInfo.startData) {
                    start = this.applicationInfo.startData.getFullYear() + '-' + (this.applicationInfo.startData.getMonth() + 1) + '-' + this.applicationInfo.startData.getDate();
                } else {
                    start = null;
                }
                if (this.applicationInfo.endData) {
                    end = this.applicationInfo.endData.getFullYear() + '-' + (this.applicationInfo.endData.getMonth() + 1) + '-' + this.applicationInfo.endData.getDate();
                } else {
                    end = null;
                }
                if (!this.applicationInfo.overseaList) {
                    this.applicationInfo.overseaList = null;
                }
                let transferL = [];
                let transferC = [];
                if(this.isMeeting==true&&this.companyId==1002621){
                       if (this.companyList.length) {
                           this.companyList.forEach((item, index) => {
                               let item2 = {
                                   EmployeeID: item.EmployeeID
                               }
                               transferC.push(item2)
                           })
                       }
                       if (this.customerList.length) {
                           this.customerList.forEach((item, index) => {
                               let item2 = {
                                   CustomerId: item.CustomerID
                               }
                               transferL.push(item2)
                           })
                       }
                }
                if(this.isMeeting==false){
                        this.tableDataCost.forEach((item, index) => {
                     //   if(item.ProductId=='10'){
                            item.ProductId=null
                      //  }
                      //  if(item.ProductName=="DEFAULT"){
                            item.ProductName=null
                       // }
                    })
                }
                if(this.costTypeId==''){
                    this.costTypeId=null
                }
                if(this.costType==''){
                    this.costType=null
                }
                let params = {
                    ApplyMainViewModel: {
                        CompanyID: this.company,
                        TeamID: this.TeamID,
                        id: this.IdGuid,
                        AreaType: this.applicationInfo.overseaList,
                        Place: this.applicationInfo.Place,
                        ApplyDateStart: start,
                        ApplyDateEnd: end,
                        TripPurpose: this.applicationInfo.Purpose,
                        Currency: this.applicationInfo.Currency,
                        OriginalMainId:this.OriginalMainId,
                        ExpenseItemID: this.costTypeId,
                        ExpenseItem: this.costType,
                        Speaker:this.applicationInfo.Speaker,
                        ChooseCustomerReason:this.applicationInfo.CustomerReason,
                        OANo:this.applicationInfo.OAnumber
                    },
                    lstApplyInternalOrderViewModel:this.tableDataOrder,
                    lstCustomerViewModel: transferL,
                    lstEmployeeViewModel:transferC,
                    lstApplyDetailViewModel: this.tableDataCost,
                    lstTripDetailViewModel: this.tableDataTrip,
                    SaveType: 1,
                    FileIds: ids,
                    ExpenseTypeID: this.ExpenseTypeID,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                    ExpenseTypeName: this.applyType,
                    CultureCode: getStore('CultureCode'),
                    coverageData:this.coverageData,
                }
                SaveApplyOrder(params).then(response => {
                    if (response.data.Flag) {
                        if(num != 1 || num2 !=1){
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
                            });
                        }
                        if(num == 0 && num2 == 0){
                            this.$router.push("travelApplication");
                        }
                        else if(num == 1 && num2 == 1){
                            this.IdGuid = response.data.Result.applyMainId;
                            this.beforeSave('topForm')
                        }else {
                            this.loadingAll = false;
                             return false;
                        }
                    } else {
                        this.loadingAll = false;
                        this.$message({
                            type: 'error',
                            message: this.$t('message.saveFail')
                        });
                    }
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
            changeSub() {
                this.addCost.SubExpenseItemID = null;
                 this.CostOther = []
                if (this.addCost.ExpenseItemID == '') {
                    this.CostOther = [];
                } else {
                    this.selectList.forEach((item, index) => {
                        if (this.addCost.ExpenseItemID == item.ExpenseItemID) {
                            this.addCost.ExpenseItem = item.ExpenseItemName;
                            
                            item.SubExpenseItemList.forEach((item2, index2) => {
                                
                                    if(item2.IsTMCShow==true){
                                        this.CostOther.push(item2)
                                    }
                             })
                           // this.CostOther = this.selectList[index].SubExpenseItemList;
                        }
                    })
                }
            },
            changeSub2() {
                this.CostOther.forEach((item, index) => {
                    if (this.addCost.SubExpenseItemID == item.ExpenseItemID) {
                        this.addCost.SubExpenseItem = item.ExpenseItemName
                    }
                })
            },
            changeSub3() {
                this.addCost.ProductId = null;
                if (this.addCost.CostCenterID == '') {
                    this.ProductList = [];
                } else {
                    this.costCenterList.forEach((item, index) => {
                        if (this.addCost.CostCenterID == item.CostCenterID) {
                            this.addCost.CostCenter = item.CostCenterName
                            this.ProductList = item.ProductList;
                            if(this.ProductList.length == 1){
                                this.addCost.ProductId = this.ProductList[0].ProductID
                                this.addCost.ProductName = this.ProductList[0].ProductName
                            }
                        }
                    })
                }
            },
            changeSub4(){
                this.ProductList.forEach((item, index) => {
                    if (this.addCost.ProductId == item.ProductID) {
                        this.addCost.ProductName = item.ProductName
                    }
                })
            },
            addTrip() {
                this.dialogAddVisible2 = true;
                this.dialotitle = this.$t('message.Add');
            },
            CanceladdTrip() {
                this.dialogAddVisible2 = false;
                this.$nextTick(() => {
                    this.$refs['addTrip'].resetFields();
                })
                this.addTripInfo = {
                    TripDate: '',
                    TripTimeStart: '',
                    TripTimeEnd: '',
                    WorkContent: ''
                };
            },
            addNewCost() {
                this.addCost = {
                    InfoType: 3,
                    ExpenseItemID:'',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:'',
                    Customers:'',
                    Companys:'',
                    CustomerIDs:'',
                    CustomerNames:'',
                    EmployeeIDs:'',
                    EmployeeNames:'',
                };
                this.editCostIndex=null
                console.log(this.customerListCopy)
                if(this.CostId!=''){
                    let sanlian = JSON.parse(sessionStorage.getItem("sanlian"));
                    sanlian.forEach((item, index) => {
                        item.ExpenseTypeList.forEach((item2, index2) => {
                            item2.ExpenseItemList.forEach((item3, index3) => {
                                  if(this.CostId==item3.ExpenseItemID){
                                      this.addCost.ExpenseItemID=item3.ExpenseItemID;
                                      this.addCost.ExpenseItem=item3.ExpenseItemName;
                                      this.selectListSub=item3.SubExpenseItemList
                                  }
                        })
                    })
                })
                }else{
                    this.CostOther=[]
                }
                
              //  this.selectListSub = [];
                this.ProductList = [];
                this.dialogAddVisible = true;
                this.$nextTick(() => {
                    this.$refs['addCost'].resetFields();
                })
                this.addCost.CostCenterID = this.fixedId;
                this.costCenterList.forEach((item,index)=>{
                    if(item.CostCenterID == this.fixedId){
                        this.addCost.CostCenter = item.CostCenterName;
                        this.ProductList = item.ProductList;
                        if(this.ProductList.length == 1){
                            this.addCost.ProductId = this.ProductList[0].ProductID
                            this.addCost.ProductName = this.ProductList[0].ProductName
                        }
                    }
                })
                this.dialotitle = this.$t('message.Add');
            },

            booking() {
                this.tooltipShow = true;
                if (!this.OrderGuid) {
                    this.OrderGuid = this.newGuid();
                }
                // if(!this.OrderGuid){
                //     GetGuid().then(response => {
                //         this.OrderGuid = response.data.Result;
                //     }).catch(error => {
                //     })
                // }
                this.amexLogin();
            },
            amexLogin() {
                if(this.costTypeId==''){
                    this.costTypeId=null
                }
                if(this.costType==''){
                    this.costType=null
                }
                let params = {
                    ApplyMainId: this.ApplyMainId,
                    loginExternalOrderNo: this.OrderGuid,
                    ExpenseTypeID: this.ExpenseTypeID,
                    ExpenseTypeName: this.applyType,
                    user: null,
                    CompanyID: this.company,
                    TeamID: this.$route.query.team,
                    CultureCode: getStore('CultureCode'),
                    ExpenseItemID: this.costTypeId,
                    ExpenseItem: this.costType,
                }
                JWTLogin(params).then(response => {
                    window.open(response.data.Result.url)
                    this.OrderNo = response.data.Result.OrderNo;
                    this.IdGuid = response.data.Result.applyMainId;
                    setStore('OrderNo',response.data.Result.OrderNo);
                    setStore('IdGuid',response.data.Result.applyMainId);
                    this.flashShow = true;
                    this.saveAll(0,1);
                }).catch(error => {
                })
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 50;
                        let allBox =  document.getElementsByClassName("all")[0];
                        allBox.style.height = widowHeight +"px";
                    };
                }, 1);
            },
            detailChangeSize() {
                this.resetLabelWidth();
                this.$nextTick(() => {
                    this.$refs['topForm'].clearValidate();
                })
            },
            resetLabelWidth() {
                if (getStore('CultureCode') == 'en-US') {
                    this.nameW = 120 + 'px';
                    this.dataW = 120 + 'px';
                    this.reasonW = 120 + 'px';
                    this.labelWidth = 100 + 'px';
                    this.labelWidth2 = 120 + 'px';
                    this.dialogOneW = 100 + 'px';
                } else {
                    this.nameW = 120 + 'px';
                    this.dataW = 120 + 'px';
                    if(this.companyId==1002621){
                        this.reasonW = 120 + 'px';
                    }
                    else{
                        this.reasonW = 120 + 'px';
                    }
                    
                    this.labelWidth = 70 + 'px';
                    this.labelWidth2 = 70 + 'px';
                    this.dialogOneW = 90 + 'px';
                }
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
                this.getRoleList();
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
            Cancel() {
                this.dialogAddVisible = false;
                this.$refs['addForm'].resetFields();
            },
            getCurrencyType() {
                let params = {
                    user: null,
                    CompanyCode: getStore("CompanyCode"),
                }
                GetCurrencyType(params).then(response => {
                    if (response.data.Flag) {
                        this.currencyTypeList = response.data.Result;
                        this.applicationInfo.Currency = response.data.Result[0].CurrencyID;
                        this.CurrencyText = response.data.Result[0].CurrencyName;
                    }
                })
            },
            changeCtext() {
                this.currencyTypeList.forEach((item, index) => {
                    if (item.CurrencyID == this.applicationInfo.Currency) {
                        this.CurrencyText = item.CurrencyName;
                    }
                })
            },
            async getConfigInfo() {
              const crs = await getConfigInfo({
                })
                if (crs.Flag) {
                    // this.dialogAddVisible=false;
                    if(crs.Result==1){
                        this.OArequire = true
                    }else{
                        this.OArequire = false
                    }
                    
                };
            },
            addInternalOrder(){
                this.dialogAddVisibleTr3=true;
                this.editOrderIndex=null
                this.Inertnal={
                          Order:'',
                          remark:'',
                          OrderCostcenter:''
                     }
                
            },
            saveOrder(params){
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        if(this.editOrderIndex==null){
                        this.addorder.Remark=this.Inertnal.remark;
                        this.addorder.CostCenterID=this.Inertnal.OrderCostcenter
                        this.addorder.InternalOrderID=this.Inertnal.Order
                        this.OrderCostcenterList.forEach((item, index) => {
                                if (this.addorder.CostCenterID == item.CostCenterID) {
                                    this.addorder.OrderCostcenterName = item.CostCenter
                                }
                            })
                        this.OrderList.forEach((item,index)=>{
                            if(this.addorder.InternalOrderID==item.InternalOrderID){
                                this.addorder.OrderName = item.InternalOrderName
                            }
                        })
                        this.tableDataOrder.push(this.addorder)
                        this.addorder={}
                        this.Inertnal={}
                        this.dialogAddVisibleTr3=false;
        
                          }
                        else{
                        this.addorder.Remark=this.Inertnal.remark;
                        this.addorder.CostCenterID=this.Inertnal.OrderCostcenter
                        this.addorder.InternalOrderID=this.Inertnal.Order
                        this.OrderCostcenterList.forEach((item, index) => {
                                if (this.addorder.CostCenterID == item.CostCenterID) {
                                    this.addorder.OrderCostcenterName = item.CostCenter
                                }
                            })
                        this.OrderList.forEach((item,index)=>{
                            if(this.addorder.InternalOrderID==item.InternalOrderID){
                                this.addorder.OrderName = item.InternalOrderName
                            }
                        })
                        this.tableDataOrder[this.editOrderIndex]=this.addorder;
                        this.addorder={}
                        this.Inertnal={}
                        this.dialogAddVisibleTr3=false;
                        this.editOrderIndex=null
                         }

                    }})
            },
            editorder(index, row){
            this.dialogAddVisibleTr3=true;
            this.addorder={};
            this.editOrderIndex=index;
            let id='';
            let orderid=''
            this.OrderCostcenterList.forEach((item, index2) => {
                        if (this.tableDataOrder[index].OrderCostcenterName == item.CostCenter) {
                            id= item.CostCenterID
                        }
                    })
            this.OrderList.forEach((item, index2) => {
                        if (this.tableDataOrder[index].OrderName == item.InternalOrderName) {
                            orderid= item.InternalOrderID
                        }
                    })
           this.Inertnal={
               remark:this.tableDataOrder[index].Remark,
               OrderCostcenter:id,
               Order:orderid
           }
           },
           CancelOrder(){
               this.dialogAddVisibleTr3=false;
               this.Inertnal={
               remark:'',
               OrderCostcenter:'',
               Order:''
           }
           },
           deleteorder(index, row){
                this.delectShow4 = true;
                this.delectIndex4 = index;
           },
           delectOrder(){
               this.tableDataOrder.splice(this.delectIndex4, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('message.Success')
                });
                this.delectShow4 = false;
           },
           delectCancel4(){
               this.delectShow4 = false;
           }
        },
        
    };
</script>
