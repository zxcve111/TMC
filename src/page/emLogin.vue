<template>
    <div class="login_page fillcontain">
        <div class="fullpage">
            <div class="innerLoading">
                <div class="bigLogo"></div>
                <div v-loading="loading"></div>
                <div class="loadingText"  v-if="!error">{{$t('message.loadingText')}}</div>
                <div class="loadingText" v-else>{{$t('message.contact')}}</div>
            </div>
        </div>
    </div>
</template>



<script>
    import en from './../i18n/langs/en';
    import cn from './../i18n/langs/cn';
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
        JWTLogin,
        GetFileInfoByFileId,
        GetCurrencyType
    } from '../apiNew/api.js'
    import {
        baseUrl,
        baseImgPath
    } from "@/config/env";
    import {
        ajax,AjaxPOST
    } from "@/config/fetch";
    import {
        setStore,
        getStore,
        setLocal,
        getLocal,
        removeStore,
        removeLocal
    } from "../config/mUtils";
    import axios from 'axios'
    export default {
        data() {
            return {
                cnTranslate:{},
                enTranslate:{},
                loading:true,
                error:false,
                companyList:[],
                isMeeting:false
        };
        },
        created() {
            if (this.$route.query.Language == "zh-CN") {
                this.$i18n.locale = "cn";
                //this.langs=cn.message;
                // this.rules.username[0].message = en.message.username;
                // this.rules.password[0].message = en.message.password;

            } else {
                this.$i18n.locale = "en";
                //this.langs=en.message;
            }
            this.getlanguage();
            //this.getCompany();
            if(this.$route.query.Language == "zh-CN"){
                setStore("CultureCode","zh-CN");
                this.$i18n.locale = "cn";
            } else {
                setStore("CultureCode","en-US");
                this.$i18n.locale = "en";
            }
        },
        mounted() {

        },
        computed: {
        },
        watch:{

        },
        methods: {
            checkInfo(){
                let BaseUrl = baseUrl;
                let signUrl = BaseUrl + "/api/System/CheckUserInfo"
                let parm2 = {
                    ADName: this.$route.query.ADName
                }
                let ele = this;
                axios.post(signUrl, parm2, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function (response) {
                    if (response.data.Flag) {
                        ele.getCompany();
                    }else {
                        ele.$message({
                            type: 'error',
                            message: ele.$t('message.'+response.data.Message),
                            duration: 5000
                        });
                    }
                })
            },
            getlanguage(){
                let BaseUrl = baseUrl;
                let languageURL = BaseUrl + "/api/System/GetLanguageResource";
                let parm = {
                    CultureCode:"zh-CN",
                    ItemId:'',
                    ItemContent:'',
                    pageIndex:1,
                    pageSize:999999
                };
                let parm2 = {
                    CultureCode:"en-US",
                    ItemId:'',
                    ItemContent:'',
                    pageIndex:1,
                    pageSize:999999
                }
                let ele = this;
                axios.post(languageURL, parm, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function (response) {
                    response.data.Result.languageResource.forEach((item,index)=>{
                        ele.cnTranslate[item.ItemID] = item.ItemContent;
                    })
                    cn.message = Object.assign(cn.message, ele.cnTranslate);
                })
                axios.post(languageURL, parm2, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function (response) {
                    response.data.Result.languageResource.forEach((item,index)=>{
                        ele.enTranslate[item.ItemID] = item.ItemContent;
                    })
                    en.message = Object.assign(en.message, ele.enTranslate);
                })
                setTimeout(() => {
                    this.checkInfo();
                }, 2000);
            },
            getApplyList() {
                this.isloading = true;
                // let params = {
                //     searchCondition:this.ruleForm.RoleName,
                //     pageSize: this.PageSize,
                //     pageIndex: this.PageIndex
                // }
                let params = {
                    PageSize: 10,
                    PageIndex: 1,
                    searchCondition: this.$route.query.OrderNo,
                    CompanyID: getStore("CompanyID")
                }
                GetApplyOrderList(params).then(response => {
                    let applyInfo = response.data.Result.applyMain[0];
                    this.$router.push({
                        path: '/applicationDetail',
                        query: {OrderNo: applyInfo.Id, ApproveStatus: applyInfo.ApproveStatus, AccountStatus: applyInfo.AccountStatus}
                    });
                }).catch(error => {
                })
            },
            getCompany(){
                setStore("LoginID",this.$route.query.ADName);
                setStore("CompanyID",this.$route.query.CompanyID);
                this.companyOptions = [];
                let BaseUrl = baseUrl;
                let companyurl = BaseUrl + "/api/Apply/GetCompany"
                let elem = this;
                let parm={ADName : this.$route.query.ADName,
                    Culture : getStore("CultureCode")};
                axios.post(companyurl, parm).then(function (response) {
                    if(response.data.Result.CompanyInfo.length != 0){
                        setStore("companyOptions",response.data.Result.CompanyInfo);
                        response.data.Result.CompanyInfo.forEach((item ,index) => {
                                if(getStore("CompanyID") == item.CompanyID){
                                    setStore("CompanyCode",item.CompanyCode);
                                    elem.getToken();
                                }
                        })
                    }
                    //elem.IsAuth = response.data.Result.CompanyInfo.IsAuth;
                }).catch(function (error) {
                    elem.loading = false;
                    elem.error = true;
                })
            },
            getToken(){
                let BaseUrl = baseUrl;
                let tokenurl = BaseUrl + "/token"
                let elem = this;
                let emToken = encodeURIComponent(elem.$route.query.Token)
                let parm = "&grant_type=password&username=" + getStore("LoginID")+"&password="+emToken+"&AuthType=EMToken";
                elem.loading = true;
                ajax({
                    url: tokenurl,
                    type: "post",
                    contentType: "application/x-www-form-urlencoded",
                    data: parm,
                    success: function (res) {
                        if (res.access_token) {
                            elem.$message({
                                type: "success",
                                message: elem.$t('message.LoginSuccess')
                            });
                            setStore("token", res.access_token);
                            setStore("LoginName", res.UserName);
                            elem.getSanSelect();
                            //elem.$router.push('/TravelApplication');
                        }
                        else
                        {
                            elem.loading = false;
                            elem.error = true;
                        }
                    },
                    error:function(res)
                    {
                        elem.loading = false;
                        elem.error = true;
                    }
                });
            },
            getSanSelect() {
                let params = {
                    user: null
                }
                GetCostCenter(params).then(response => {
                    this.companyList = response.data.Result.Result;
                    window.sessionStorage.setItem('sanlian', JSON.stringify(response.data.Result.Result));
                    this.$nextTick(function(){
                        if(!this.$route.query.OrderNo){
                            this.getUrl();
                        }else {
                            this.getApplyList();
                        }
                    })
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: this.$t('message.Fail')
                    });
                })
            },
            getUrl(){
                this.companyList.forEach((item,index)=>{
                    if(item.CompanyID == this.$route.query.CompanyID){
                        item.ExpenseTypeList.forEach((item2,index2)=>{
                            if(item2.ExpenseTypeID == this.$route.query.ExpenseTypeID){
                                this.isMeeting = item2.IsMeeting;
                                this.$router.push({
                                 //   path: '/applicationDetail',
                                    path: '/TravelApplication',
                                    query:{emlogin:'1',company:getStore('CompanyID'),team:this.$route.query.TeamID,ExpenseTypeID: this.$route.query.ExpenseTypeID,isMeeting:this.isMeeting}
                                  //  query: {company:getStore('CompanyID'),team:this.$route.query.TeamID,ExpenseTypeID: this.$route.query.ExpenseTypeID,isMeeting:this.isMeeting}
                                });
                            }
                        })
                    }
                })
            }
        },
        watch: {

        }
    };

</script>

