<template>
    <div class="login_page fillcontain">
        <div class="fullpage">
            <div class="innerLoading">
                <div class="bigLogo"></div>
                <div v-loading="loading"></div>
                <div class="loadingText" v-if="!error">{{$t('message.loadingText')}}</div>
                <div class="loadingText" v-else>{{$t('message.contact')}}</div>
            </div>
        </div>
    </div>
</template>



<script>
    import en from './../i18n/langs/en';
    import cn from './../i18n/langs/cn';
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
                error:false
            };
        },
        created() {
            this.getlanguage();
            if(this.$route.query.language == "zh-cn"){
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
                    cn.message = Object.assign(cn.message, ele.enTranslate);
                })
                setTimeout(() => {
                    this.getInfo();
                }, 1000);
            },
            getInfo(){
                let elem = this;
                if(elem.$route.query.language == "zh-cn"){
                    setStore("CultureCode", "zh-CN");
                    this.$i18n.locale = "cn";
                }else {
                    setStore("CultureCode", "en-US");
                    this.$i18n.locale = "en";
                }
                let BaseUrl = baseUrl;
                let signUrl = BaseUrl + "/api/Login/SignIn"
                let parm = {
                    Code: elem.$route.query.code,
                    State: elem.$route.query.state,
                    CompanyCode: elem.$route.query.company,
                    Language: elem.$route.query.language,
                    RedirectUrl: "https://tmctest.fresenius-kabi-sspc.com//web/#/SSOLogin",
                }
                axios.post(signUrl, parm,{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function (response) {
                    console.log(response);
                    setStore("LoginName", response.data.Result.Result.ChineseName);
                    setStore("LoginID", response.data.Result.Result.ADAccount);
                    setStore("CompanyCode", response.data.Result.Result.CompanyCode);
                    elem.getCompany();
                }).catch(function (error) {
                    elem.loading = false;
                    elem.error = true;
                });
            },
            getCompany(){
                    this.companyOptions = [];
                    let BaseUrl = baseUrl;
                    let companyurl = BaseUrl + "/api/Apply/GetCompany"
                    let elem = this;
                    let parm={ADName : getStore("LoginID"),
                        Culture : getStore("CultureCode")};
                    axios.post(companyurl, parm).then(function (response) {
                        if(response.data.Result.CompanyInfo.length != 0){
                            setStore("companyOptions",response.data.Result.CompanyInfo);
                            let companyed = false;
                            response.data.Result.CompanyInfo.forEach((item ,index) => {
                                if(!companyed){
                                    if(getStore("CompanyCode") == item.CompanyCode){
                                        setStore("CompanyID",item.CompanyID);
                                        companyed = true;
                                        elem.getToken();
                                    }
                                }
                            })
                        }
                        //elem.IsAuth = response.data.Result.CompanyInfo.IsAuth;
                    }).catch(function (error) {
                        elem.loading = false;
                        elem.error = true;
                    });
                },
            getToken(){
                let BaseUrl = baseUrl;
                let tokenurl = BaseUrl + "/token"
                let elem = this;
                let parm = "&grant_type=password&username=" + getStore("LoginID")+"&password="+elem.$route.query.code+"&AuthType=code";
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
                            elem.$router.push('/TravelApplication');
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
            }
        },
        watch: {

        }
    };

</script>

