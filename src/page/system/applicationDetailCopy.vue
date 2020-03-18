<template>
    <div class="fillcontain" v-loading="loadingAll">
        <div class="search-box-long" id="searchBox"  style="margin: 0;padding: 0;overflow: hidden">
            <div class="applyTitle" style="padding-left: 10px;margin: 0">{{$t('message.ad_ApplicationInfo')}}</div>
            <el-form :model="applicationInfo" ref="topForm" :disabled="disabledType" :rules="toprules">
                <el-form-item :label="$t('message.ta_ApplicationNumber')" prop="to" :label-width="reasonW">
                    <el-input v-model="OrderNo" disabled style="width: 163px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ta_ApplyType')" prop="to" :label-width="reasonW">
                    <el-input v-model="applyType" disabled style="width: 163px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ad_Oversea')" prop="overseaList" :label-width="nameW">
                    <el-select clearable v-model="applicationInfo.overseaList" placeholder=" " filterable
                               style="width: 163px;">
                        <el-option v-for="item in overseaList" :key="item.overseaCode" :label="item.overseaName"
                                   :value="item.overseaCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.ad_EstimatedStartDate')" prop="startData" :label-width="nameW">
                    <el-date-picker v-model="applicationInfo.startData" type="date" :picker-options="pickerOptions0"
                                    class="dateStyle"></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('message.ad_EstimatedCloseDate')" prop="endData" :label-width="nameW">
                    <el-date-picker v-model="applicationInfo.endData" type="date"
                                    class="dateStyle" :picker-options="pickerOptions1"
                                    style="width: 178px;"></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('message.ad_loaction')" prop="Place" :label-width="reasonW">
                    <el-input v-model="applicationInfo.Place" auto-complete="off" style="width: 163px;"
                              :maxlength=50 clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.ad_TripPurpose')" prop="Purpose" :label-width="reasonW">
                    <el-input v-model="applicationInfo.Purpose" auto-complete="off" style="width: 163px;"
                              :maxlength=100 clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.lang_currency')" prop="Currency" :label-width="nameW">
                    <el-select clearable v-model="applicationInfo.Currency" placeholder=" " filterable
                               @change="changeCtext"
                               style="width: 163px;">
                        <el-option v-for="item in currencyTypeList" :key="item.CurrencyID" :label="item.CurrencyName"
                                   :value="item.CurrencyID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="all" style="margin-bottom: 20px">
            <div class="table_container" v-if="orderShow" style="margin: 0;padding: 0;overflow: hidden">
                <div class="applyTitle" style="padding-left: 10px;margin: 0">{{$t('message.ad_OrderCost')}}</div>
                <div class="amex" style="width: 95%;margin: 0 auto">
                    <p>{{$t('message.ad_TicketCost')}}
                        <el-tooltip class="item" effect="dark" :content="$t('message.ad_moreEdit')" placement="top">
                            <el-button class="addBtn" type="primary" @click="openAirAll"
                                       v-if="!disabledType"
                                       :disabled="ticketAllList.length == 0"
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
                        <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting" prop="ProductName"></el-table-column>
                        <el-table-column :label="$t('message.ad_Cost')">
                            <template slot-scope="scope">
                                {{scope.row.SumMoney | NumFormat}}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                    </el-table>
                </div>
                <div class="amex" style="width: 95%;margin: 0 auto 20px">
                    <p>{{$t('message.ad_HotelCost')}}
                        <el-tooltip class="item" effect="dark" :content="$t('message.ad_moreEdit')" placement="top">
                            <el-button class="addBtn" type="primary" @click="openHotelAll"
                                       v-if="!disabledType"
                                       :disabled="hotelAllList.length == 0"
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
                        <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting"  prop="ProductName"></el-table-column>
                        <el-table-column :label="$t('message.ad_Cost')">
                            <template slot-scope="scope">
                                {{scope.row.SumMoney | NumFormat}}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('message.ad_Remarks')" prop="Remark"></el-table-column>
                    </el-table>
                </div>
                <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="airShow" width="600px"
                           :close-on-click-modal='false'
                           @close="CancelAirCost">
                    <el-form :model="airCost" :rules="airrules" ref="airCost" :label-width="dialogOneW">
                        <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                            <el-select clearable v-model="airCost.ExpenseItemID" placeholder=" " filterable
                                       @change="changeAirSub">
                                <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                            <el-select clearable v-model="airCost.SubExpenseItemID" placeholder="" filterable
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
                        <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting">
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
                            <el-select clearable v-model="airCost.ExpenseItemID" placeholder=" " filterable
                                       @change="changeAirSub">
                                <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                            <el-select clearable v-model="airCost.SubExpenseItemID" placeholder="" filterable
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
                        <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting">
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
                            <el-select clearable v-model="hotelCost.ExpenseItemID" placeholder=" " filterable
                                       @change="changeHotelSub">
                                <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                            <el-select clearable v-model="hotelCost.SubExpenseItemID" placeholder="" filterable
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
                        <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting">
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
                            <el-select clearable v-model="hotelCost.ExpenseItemID" placeholder=" " filterable
                                       @change="changeHotelSub">
                                <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                            <el-select clearable v-model="hotelCost.SubExpenseItemID" placeholder="" filterable
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
                        <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting">
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
            <div class="table_container" v-loading='isloading' style="margin: 0;padding: 0;overflow: hidden">
                <div class="applyTitle" style="padding-left: 10px;margin: 0">{{$t('message.ad_OtherCost')}}</div>
                <!-- <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="baseUrl+'/api/Manage/UploadLanguageExcel'"
                  :on-success="handleAttachmentScucess"
                  :show-file-list=false
                  :multiple=true
                  >
                  <el-button type="primary">导入Excel</el-button>
                </el-upload>
                <el-button type="primary" @click="exportPDF()">导出模板</el-button> -->
                <el-table
                    ref="multipleTable"
                    :data="tableDataCost"
                    :row-key="row => row.index"
                    style="width: 95%;margin: 20px auto 20px;"
                    class="tableStyle"
                    :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                    <el-table-column :label="$t('message.ad_CostType')" prop="ExpenseItem"></el-table-column>
                    <el-table-column :label="$t('message.ad_SubCostType')" prop="SubExpenseItem"></el-table-column>
                    <el-table-column :label="$t('message.ad_CostCenter')" prop="CostCenter"></el-table-column>
                    <el-table-column :label="$t('message.ad_Product')" v-if="isMeeting">
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
                </el-table>
                <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisible"
                           width="600px" :close-on-click-modal='false'
                           @close="CanceladdNewCost">
                    <el-form :model="addCost" :rules="rules" ref="addCost" :label-width="dialogOneW">
                        <el-form-item :label="$t('message.ad_CostType')" prop="ExpenseItemID">
                            <el-select clearable v-model="addCost.ExpenseItemID" placeholder=" " filterable
                                       @change="changeSub">
                                <el-option v-for="item in selectList" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_SubCostType')" prop="SubExpenseItemID">
                            <el-select clearable v-model="addCost.SubExpenseItemID" placeholder="" filterable
                                       @change="changeSub2">
                                <el-option v-for="item in selectListSub" :key="item.ExpenseItemID"
                                           :label="item.ExpenseItemName"
                                           :value="item.ExpenseItemID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_CostCenter')" prop="CostCenterID">
                            <el-select clearable v-model="addCost.CostCenterID" placeholder=" " filterable
                                       @change="changeSub3">
                                <el-option v-for="item in costCenterList" :key="item.CostCenterID"
                                           :label="item.CostCenterName"
                                           :value="item.CostCenterID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('message.ad_Product')" prop="ProductId" v-if="isMeeting && ProductList.length !=0">
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
            <div class="table_container" v-loading='isloading' v-if="isMeeting" style="margin: 0;padding: 0;overflow: hidden">
                <div class="applyTitle" style="padding-left: 10px;">{{$t('message.ad_PeerCustomers')}}</div>
                <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                    <el-button class="addBtn" type="primary" v-if="!disabledType" @click="addPeer"
                               icon="iconfont icon-xinzeng-wubiankuang"></el-button>
                </el-tooltip>
                <el-table
                    ref="multipleTable2"
                    :data="customerList"
                    :row-key="row => row.index"
                    style="width: 95%;margin: 20px auto 20px;"
                    class="tableStyle"
                    :header-cell-style="{
                            'background-color': '#f8f8f9',
                        }">
                    <el-table-column :label="$t('message.ad_name')" prop="CustomerName"></el-table-column>
                    <el-table-column :label="$t('message.ad_company')" prop="Company"></el-table-column>
                    <el-table-column :label="$t('message.ad_department')" prop="Department"></el-table-column>
                    <el-table-column :label="$t('message.ad_level')" prop="CustomerLevel"></el-table-column>
                </el-table>
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

            </div>
            <!--<div class="table_container" v-loading='isloading'>-->
            <!--<div class="applyTitle">{{$t('message.ad_TripDetails')}}</div>-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">-->
            <!--<el-button class="addBtn" type="primary" @click="addTrip()"-->
            <!--icon="iconfont icon-xinzeng-wubiankuang"></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-table-->
            <!--ref="multipleTable"-->
            <!--:data="tableDataTrip"-->
            <!--:row-key="row => row.index"-->
            <!--style="width: 100%;"-->
            <!--class="tableStyle"-->
            <!--:header-cell-style="{-->
            <!--'background-color': '#f8f8f9',-->
            <!--}">-->
            <!--<el-table-column :label="$t('message.ad_TripTime')" prop="TripDate"></el-table-column>-->
            <!--<el-table-column :label="$t('message.ad_StartTime')" prop="TripTimeStart"></el-table-column>-->
            <!--<el-table-column :label="$t('message.ad_EndTime')" prop="TripTimeEnd"></el-table-column>-->
            <!--<el-table-column :label="$t('message.ad_JobContent')" prop="WorkContent"></el-table-column>-->
            <!--<el-table-column :label="$t('message.Operation')" width="150">-->
            <!--<template slot-scope="scope">-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">-->
            <!--<el-button icon="iconfont icon-bianji-kong" class="hoverBtn"-->
            <!--@click="handleEditTrip(scope.$index, scope.row)"></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">-->
            <!--<el-button icon="iconfont icon-shanchu-kong" class="hoverBtn"-->
            <!--@click="handleDeleteTrip(scope.$index, scope.row)"></el-button>-->
            <!--</el-tooltip>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--</el-table>-->
            <!--<el-dialog :title="dialotitle" :visible.sync="dialogAddVisible2" width="600px" :close-on-click-modal='false'-->
            <!--@close="CanceladdTrip">-->
            <!--<el-form :model="addTripInfo" :rules="rules" ref="addTrip" :label-width="labelWidth">-->
            <!--<el-form-item :label="$t('message.ad_TripTime')" prop="TripDate">-->
            <!--<el-date-picker v-model="addTripInfo.TripDate" @change="getTime" type="date"></el-date-picker>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('message.ad_StartTime')" prop="TripTimeStart">-->
            <!--<el-time-select-->
            <!--v-model="addTripInfo.TripTimeStart"-->
            <!--:picker-options="{start: '00:00',step: '00:30',end: '23:30',maxTime: addTripInfo.TripTimeEnd}">-->
            <!--</el-time-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('message.ad_EndTime')" prop="TripTimeEnd">-->
            <!--<el-time-select-->
            <!--v-model="addTripInfo.TripTimeEnd"-->
            <!--:picker-options="{start: '00:00',step: '00:30',end: '23:30',minTime: addTripInfo.TripTimeStart}">-->
            <!--</el-time-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('message.ad_JobContent')" prop="WorkContent">-->
            <!--<el-input type="textarea" v-model="addTripInfo.WorkContent" auto-complete="off"></el-input>-->
            <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">-->
            <!--<el-button @click="CanceladdTrip" icon="iconfont icon-guanbi-wukuang"></el-button>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">-->
            <!--<el-button type="primary" @click="commitNewTrip('addTrip')"-->
            <!--icon="iconfont icon-gou-wukuang"></el-button>-->
            <!--</el-tooltip>-->
            <!--</div>-->
            <!--</el-dialog>-->
            <!--</div>-->
            <div class="table_container" v-loading='isloading' style="margin: 0;padding: 0;overflow: hidden">
                <div class="applyTitle" style="padding-left: 10px;margin: 0">{{$t('message.ad_AttachmentInfo')}}</div>
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
                    style="width: 95%;margin: 20px auto 20px;"
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
                </el-table>
                <el-dialog :title="$t('message.ad_ViewAttachment')" :modal-append-to-body="false"
                           :visible.sync="fileShow" width="900px"
                           :close-on-click-modal='false'
                           @close="fileShow = false">
                    <iframe class="prism-player" :src="previewUrl" width="100%" height="100%"></iframe>
                </el-dialog>
            </div>
            <div class="table_container" v-loading='isloading' v-if="tableDataApprove.length > 0" style="margin: 0;padding: 0;overflow: hidden">
                <div class="applyTitle" style="padding-left: 10px;margin: 0">{{$t('message.ta_ApprovalStatus')}}</div>
                <el-table
                    ref="multipleTable"
                    :data="tableDataApprove"
                    :row-key="row => row.index"
                    style="width: 95%;margin: 20px auto 20px;"
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
            <div class="table_container" v-loading='isloading' style="margin: 0;padding: 0 20px;overflow: hidden">
                <div class="applyTitle" style="text-align: right;color: red;font-weight: bold;padding-right: 20px;margin-bottom: 0">
                    {{$t('message.ad_totalMoney')}}: {{CurrencyText}} {{totalMoney | NumFormat}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import {
        ajax, AjaxPOST
    } from "@/config/fetch";
    import headTop from "../../components/headTop";
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
        GetCurrencyType
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
                changeStart:new Date(),
                changeEnd:new Date(),
                mainPlanshow:false,
                OriginalMainId:null,
                ProductList:[],
                isMeeting:false,
                ticketAllList:[],
                hotelAllList:[],
                CurrencyText: '',
                tableHeight2: 389,
                searchName: {
                    customName: '',
                },
                transferLoading: false,
                customerList: [],
                customerListCopy: [],
                currentPage: 1,
                PageSize: 10,
                count: 0,
                filterMethod(query, item) {
                    return item.CustomerName.indexOf(query) > -1;
                },
                transferData: [],
                transferValue: [3],
                tooltipShow: false,
                delectIndex: 0,
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
                hotelCheck: true,
                infoLoading: true,
                ApplyMainId: '',
                editAirIndex: null,
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
                    ProductName:''
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
                    ProductName:''
                },
                airShow: false,
                airShowAll: false,
                airInfoShow: false,
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
                costID: '',
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
                    ProductName:''
                },
                applicationInfo: {
                    Place: '',
                    type: [],
                    startData: '',
                    endData: '',
                    team: '',
                    overseas: '',
                    Purpose: '',
                    Currency: ""
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
                dialotitle:this.$t('message.Add')
            };
        },
        props:{
            OriginalMainId:{
                type:String,
                required:true
            }
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
            // if(this.$route.query.OriginalMainId){
            //     this.OriginalMainId = this.$route.query.OriginalMainId;
            // }
            // if(this.$route.query.isMeeting){
            //     this.isMeeting = this.$route.query.isMeeting;
            // }
            // if (this.$route.query.company) {
            //     this.company = this.$route.query.company;
            // }
            // if (this.$route.query.team) {
            //     this.TeamID = this.$route.query.team;
            // }
            // if (this.$route.query.ExpenseTypeID) {
            //     this.ExpenseTypeID = this.$route.query.ExpenseTypeID;
            // }
            // if (this.ExpenseTypeID) {
            //     this.getSanSelect(this.company, this.TeamID, this.ExpenseTypeID);
            // }
            // if (this.$route.query.OrderNo) {
            //     this.IdGuid = this.$route.query.OrderNo;
            //     this.getDetail()
            // }
            // if (this.$route.query.ApproveStatus == 8211) {
            //     if (this.$route.query.AccountStatus == 8206) {
            //         this.disabledType2 = false;
            //     } else {
            //         this.disabledType = false;
            //         this.disabledType2 = false;
            //     }
            // }
            // if (!this.$route.query.ApproveStatus) {
            //     this.disabledType = false;
            //     this.disabledType2 = false;
            // }
            this.getDetail()
            this.watchHeight();
            this.resetLabelWidth();
            this.getApproveHistory();
            this.getCurrencyType();

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
                if (this.ExpenseTypeID) {
                    this.getSanSelect(this.company, this.TeamID, this.ExpenseTypeID);
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
                this.getCurrencyType();
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
            hotelTitle: function () {
                return this.$t('message.HotelTitle')
            },
            AirTitle: function () {
                return this.$t('message.AirTitle')
            },
            FlashTitle: function () {
                return this.$t('message.warning')
            },
            overseaList() {
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
                        trigger: "blur"
                    }],
                    SubExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_SubCostType'),
                        trigger: "blur"
                    }],
                    CostCenterID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostCenter'),
                        trigger: "blur"
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
                        trigger: "blur"
                    }],
                    SubExpenseItemID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_SubCostType'),
                        trigger: "blur"
                    }],
                    CostCenterID: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_CostCenter'),
                        trigger: "blur"
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
                    }]
                }
            },
            toprules: function () {
                return {
                    overseaList: [{
                        required: true,
                        message: this.$t('message.Select') + ' ' + this.$t('message.ad_Oversea'),
                        trigger: "blur"
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
                        trigger: "blur"
                    }],
                    Place: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.ad_loaction'),
                        trigger: "blur"
                    }],
                    Currency: [{
                        required: true,
                        message: this.$t('message.Input') + ' ' + this.$t('message.lang_currency'),
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
                let widowHeight = document.documentElement.clientHeight - 305;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {

            toMainPlan(){
                this.mainPlanshow = true;
            },
            openAirAll() {
                this.airShowAll = true;
                this.selectListSub = [];
                this.ProductList = [];
                this.airCost.DetailId = this.ticketAllList;
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
                console.log(this.customerListCopy);
            },
            commitCustom() {
                let hash = {};
                // let hash2 = {};
                this.customerListCopy = this.customerListCopy.reduce((preVal, curVal) => {
                    hash[curVal.CustomerID] ? '' : hash[curVal.CustomerID] = true && preVal.push(curVal);
                    return preVal
                }, [])
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
            searchMan() {
                this.currentPage = 1;
                this.getCustomer(1)
            },
            handleSelectionChange(selection) {
                selection.forEach((item, index) => {
                    this.customerListCopy.push(item);
                })
                console.log(this.customerListCopy);
            },
            handleCurrentChange2(val) {
                this.currentPage = val;
                this.getCustomer(val)
            },
            addPeer() {
                this.dialogAddVisibleTr = true;
                this.currentPage = 1;
                this.getCustomer(this.currentPage)
                this.customerList.forEach((item, index) => {
                    this.customerListCopy.push(item);
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
                        type: 'warning'
                    }).then(() => {
                        this.saveAll(0);
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
            getApproveHistory() {
                let params = {
                    mainId: this.OriginalMainId,
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
                            ProductName:''
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
                    ProductName:''
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
                    ProductName:''
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
                        ProductName:this.ticketTable[index].ProductName
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
                            ProductName:''
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
                    ProductName:''
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
                    ProductName:''
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
                        ProductName: this.hotelTable[index].ProductName
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
                JWTLoginRefresh(params).then(response => {
                    if(response.data.Flag){
                        this.OrderNo = response.data.Result.ApplyMain.OrderNo
                        this.ticketTable = response.data.Result.lstPlaneDetail;
                        this.hotelTable = response.data.Result.lstHotelDetail;
                        this.hasIntlAir = response.data.Result.hasIntlAir;
                        this.intlAirPushType = response.data.Result.intlAirPushType;
                        this.orderPushType = response.data.Result.orderPushType;
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
                    window.open('/static/pdf/web/viewer.html?file=' + encodeURIComponent(url))
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
                    // window.open(response.data.Result.FilePath)
                    let elemIF = document.createElement("iframe");
                    elemIF.src = response.data.Result.FilePath;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }).catch(function (error) {
                })
            },
            getSanSelect(id1, id2, id3) {
                let sanlian = JSON.parse(sessionStorage.getItem("sanlian"));
                sanlian.forEach((item, index) => {
                    if (item.CompanyID == id1) {
                        this.costCenterList = item.CostcenterList;
                        item.ExpenseTypeList.forEach((item2, index2) => {
                            if (item2.ExpenseTypeID == id3) {
                                this.applyType = item2.ExpenseTypeName;
                                this.selectList = item2.ExpenseItemList;
                                if(item2.IsMeeting){
                                    this.isMeeting = true;
                                }
                            }
                        })
                    }
                })
            },
            uploadLoading() {
                this.loadingAll = true;
            },
            getAttachmentRes(response, file, fileList) {
                this.tableDataAttachment.push(response.Result)
                this.loadingAll = false;
            },
            getDetail() {
                this.loadingAll = true;
                let params = {
                    id: this.OriginalMainId
                }
                GetApplyOrderDetail(params).then(response => {
                    let applicationInfoCopy = response.data.Result.ApplyMain
                    // if (applicationInfoCopy.AreaType == 1) {
                    //     areaType = 2;
                    // } else {
                    //     areaType = 1;
                    // }
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
                    this.getSanSelect(this.company, this.TeamID, this.applyTypeId)
                    this.applicationInfo = {
                        startData: new Date(applicationInfoCopy.ApplyDateStart),
                        endData: new Date(applicationInfoCopy.ApplyDateEnd),
                        overseaList: applicationInfoCopy.AreaType,
                        Purpose: applicationInfoCopy.TripPurpose,
                        Place: applicationInfoCopy.Place,
                        Currency: applicationInfoCopy.Currency
                    };
                    this.OriginalMainId = applicationInfoCopy.OriginalMainId
                    this.currencyTypeList.forEach((item, index) => {
                        if (item.CurrencyID == applicationInfoCopy.Currency) {
                            this.CurrencyText = item.CurrencyName;
                        }
                    })
                    if (this.applicationInfo.Currency == null) {
                        this.applicationInfo.Currency = this.currencyTypeList[0].CurrencyID;
                    }
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
            delectCost() {
                this.delectShow = false;
                this.tableDataCost.splice(this.delectIndex, 1)
                this.$message({
                    type: 'success',
                    message: this.$t('message.Success')
                });
            },
            delectCancel() {
                this.delectShow = false
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
                this.$refs[params].validate((valid) => {
                    if (valid) {
                        if (this.editCostIndex == null) {
                            this.tableDataCost.push(this.addCost);
                        } else {
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
                            ProductName:''
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
                    ProductName:''
                };
                this.dialogAddVisible = false;
            },
            saveAll(num) {
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
                if (this.customerList.length) {
                    this.customerList.forEach((item, index) => {
                        let item2 = {
                            CustomerId: item.CustomerID
                        }
                        transferL.push(item2)
                    })
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
                        OriginalMainId:this.OriginalMainId
                    },
                    lstCustomerViewModel: transferL,
                    lstApplyDetailViewModel: this.tableDataCost,
                    lstTripDetailViewModel: this.tableDataTrip,
                    SaveType: 1,
                    FileIds: ids,
                    ExpenseTypeID: this.ExpenseTypeID,
                    ExpenseTypeName: this.applyType,
                    CultureCode: getStore('CultureCode'),
                }
                SaveApplyOrder(params).then(response => {
                    if (response.data.Flag) {
                        this.$message({
                            type: 'success',
                            message: this.$t('message.Success')
                        });
                        if(num == 0){
                            this.$router.push("travelApplication");
                        } else {
                            this.$router.push({
                                path: '/applicationDetail',
                                query: {OrderNo: this.OriginalMainId, ApproveStatus: 8213, AccountStatus: 8202}
                            });
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
            commitAll(ref) {
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.loadingAll = true;
                        if (this.tableDataCost.length == 0 && this.ticketTable.length == 0 && this.hotelTable.length == 0) {
                            this.$message({
                                type: 'error',
                                message: this.$t('message.inputText')
                            });
                            this.loadingAll = false;
                            return false
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
                        if (this.hotelCheck && this.ticketCheck) {
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
                                    OriginalMainId:this.OriginalMainId
                                },
                                lstApplyDetailViewModel: this.tableDataCost,
                                lstTripDetailViewModel: this.tableDataTrip,
                                SaveType: 2,
                                FileIds: ids,
                                ExpenseTypeID: this.ExpenseTypeID,
                                ExpenseTypeName: this.applyType,
                                CultureCode: getStore('CultureCode'),
                            }
                            SaveApplyOrder(params).then(response => {
                                if (response.data.Flag) {
                                    this.$message({
                                        type: 'success',
                                        message: this.$t('message.Success')
                                    });
                                    this.$router.push("travelApplication");

                                } else {
                                    this.loadingAll = false;
                                    this.$message({
                                        type: 'error',
                                        message: this.$t('message.commitFail')
                                    });
                                }
                            })
                        }
                    } else {
                        document.documentElement.scrollTop = 0;
                        return false;
                    }
                });
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
                if (this.addCost.ExpenseItemID == '') {
                    this.selectListSub = [];
                } else {
                    this.selectList.forEach((item, index) => {
                        if (this.addCost.ExpenseItemID == item.ExpenseItemID) {
                            this.addCost.ExpenseItem = item.ExpenseItemName
                            this.selectListSub = this.selectList[index].SubExpenseItemList;
                        }
                    })
                }
            },
            changeSub2() {
                this.selectListSub.forEach((item, index) => {
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
                    ExpenseItemID: '',
                    ExpenseItem: '',
                    SubExpenseItemID: "",
                    SubExpenseItem: "",
                    CostCenterID: "",
                    CostCenter: "",
                    SumMoney: '',
                    Remark: '',
                    ProductId:'',
                    ProductName:''
                };
                this.selectListSub = [];
                this.ProductList = [];
                this.dialogAddVisible = true;
                this.$nextTick(() => {
                    this.$refs['addCost'].resetFields();
                })
                this.dialotitle = this.$t('message.Add');
            },

            booking() {
                this.tooltipShow = true;
                if (!this.OrderGuid) {
                    this.OrderGuid = this.newGuid();
                }
                let params = {
                    Guid: this.OrderGuid
                }
                // GetGuid().then(response => {
                //     this.OrderGuid = response.data.Result;
                this.amexLogin();
                // }).catch(error => {
                // })
            },
            amexLogin() {
                let params = {
                    ApplyMainId: this.ApplyMainId,
                    loginExternalOrderNo: this.OrderGuid,
                    ExpenseTypeID: this.$route.query.ExpenseTypeID,
                    ExpenseTypeName: this.applyType,
                    user: null,
                    CompanyID: this.company,
                    TeamID: this.$route.query.team,
                    CultureCode: getStore('CultureCode'),
                }
                JWTLogin(params).then(response => {
                    window.open(response.data.Result.url)
                    this.order = response.data.Result.OrderNo;
                    this.IdGuid = response.data.Result.applyMainId
                    this.flashShow = true
                }).catch(error => {
                })
            },
            watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 305;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
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
                    this.nameW = 80 + 'px';
                    this.dataW = 120 + 'px';
                    this.reasonW = 80 + 'px';
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
            }
        },
    };
</script>
