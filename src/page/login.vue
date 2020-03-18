<template>
    <div class="login_page fillcontain" v-loading="loading">
        <div class="logo-title">
            <div class="mwidth"><img src="../assets/img/logokb.png" /></div>
        </div>
        <transition name="form-fade" mode="in-out">
            <div class="login-table">
                <div class="mainw1240">
                    <section class="form_contianer" v-show="showLogin">
                        <div class="manage_tip">
                            <!-- logo -->
                            <p style="color:#0063be;">{{$t('message.login_Title')}}</p>
                        </div>
                        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
                            <el-form-item prop="username">
                                <i class="login-icon icon-userName"></i>
                                <el-input v-model="loginForm.username" @blur="getCompany"></el-input><!-- 用户名 -->
                            </el-form-item>
                            <el-form-item prop="password">
                                <i class="login-icon icon-password"></i>
                                <el-input type="password" v-model="loginForm.password"  @keyup.enter.native="submitForm('loginForm')"></el-input><!-- 密码 -->
                            </el-form-item>
                            <el-form-item prop="company">
                                <i class="login-icon icon-5"></i>
                                <el-select v-model="loginForm.company" filterable placeholder=" ">
                                    <el-option v-for="item in companyOptions" :key="item.CompanyID" :label="item.CompanyName"
                                               :value="item.CompanyID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="language">
                                <i class="login-icon icon-6"></i>
                                <el-select v-model="loginForm.language" filterable @change="changeLanguage" placeholder="">
                                    <el-option v-for="item in languageOptions" :key="item.CultureCode" :label="item.CultureName"
                                               :value="item.CultureCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox v-model="checked" class="remember">{{$t('message.login_RememberMe')}}</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="warning" @click="submitForm('loginForm')" @keyup.enter="submitForm('loginForm')"
                                           class="submit_btn">{{$t('message.login_Login')}}</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                </div>
            </div>

        </transition>
    </div>
</template>



<script>
    import axios from 'axios'
    import {baseUrl} from "../config/env";
    import {
        login,
        getCompanys,
        getlanguage,
        getLanguageList,
    } from "@/api/getData";
    import {GetLanguageResource} from '../apiNew/api.js'
     import {
        baseImgPath
    } from "@/config/env";
    import {
        mapActions,
        mapState
    } from "vuex";
    import {
        ajax,AjaxPOST
    } from "@/config/fetch";
    import en from './../i18n/langs/en';
    import cn from './../i18n/langs/cn';
    import {
        setStore,
        getStore,
        setLocal,
        getLocal,
        removeStore,
        removeLocal
    } from "../config/mUtils";
    import "babel-polyfill";
    export default {
        data() {
            return {
                cnTranslate:{},
                enTranslate:{},
                IsAuth:0,
                loginForm: {
                    username: getLocal("username") ? getLocal("username") : "",
                    password: "",
                    company: "",
                    language: "English"
                },
                companyOptions: [],
                languageOptions: [{CultureCode:'en-US',CultureName:'English'},{CultureCode:'zh-CN',CultureName:'中文'}],
                showLogin: false,
                checked: getLocal("username") ? true : false,
                langs:[],
                loading:true,
                title:"",
                remember:"Remember Me"
            };
        },

        created() {
            this.getlanguage();
            // this.GetLanguage();
            // this.loginForm.language = getLocal('language')
            // this.getLanguageResource();
            // this.languageList();
            // this.getCompanyList();
            // this.GetLanguage();
            removeStore('sanlian')
            this.getLocalCultureCode()
            this.getCompany();
        },
        mounted() {
            this.showLogin = true;
            if (!this.adminInfo.id) {
                this.getAdminData();
            }

        },
        computed: {
            rules: function(){
                return{
                    username: [{
                        required: true,
                        message: this.$t('message.username'),
                        trigger: "change"
                    }],
                    password: [{
                        required: true,
                        message: this.$t('message.password'),
                        trigger: "change"
                    }]
                }
            },
            ...mapState(["adminInfo", "en"])
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
                    en.message = Object.assign(en.message, ele.enTranslate);
                })
            },
            getCompany(){
                if(this.loginForm.username){
                    this.companyOptions = [];
                    let BaseUrl = baseUrl;
                    let companyurl = BaseUrl + "/api/Apply/GetCompany"
                    let elem = this;
                    let language = '';
                    if(this.loginForm.language == 'en-US' || this.loginForm.language == 'English'){
                        language = 'en_US'
                    }else {
                        language = 'zh_CN'
                    }
                    let parm={ADName : this.loginForm.username,
                        Culture : language};
                    axios.post(companyurl, parm).then(function (response) {
                        if(response.data.Result.CompanyInfo.length != 0){
                            elem.companyOptions = response.data.Result.CompanyInfo;
                            elem.loginForm.company = elem.companyOptions[0].CompanyID;
                        } else {
                            elem.companyOptions = [];
                            elem.loginForm.company = ''
                        }
                        elem.IsAuth = response.data.Result.CompanyInfo.IsAuth;
                        elem.loading = false;
                    }).catch(function (error) {

                    });
                } else {
                    this.loading = false;
                }



            },
            ...mapActions(["getAdminData"]),
            login(){
                setStore("CompanyID", this.loginForm.company);
                setStore("companyOptions",this.companyOptions)
                this.companyOptions.forEach((item,index)=>{
                    if(item.CompanyID == this.loginForm.company ){
                        setStore("CompanyCode", item.CompanyCode);
                    }
                })
                if (this.checked) {
                    setLocal("username", this.loginForm.username);
                } else {
                    removeLocal("username");
                }
                let BaseUrl = baseUrl;
                let tokenurl = BaseUrl + "/token"
                let elem = this;
                let parm="&grant_type=password&username=" + this.loginForm.username+
                    "&password=" + this.loginForm.password;
                elem.loading = true;
                ajax({
                    url: tokenurl,
                    type: "post",
                    contentType: "application/x-www-form-urlencoded",
                    data: parm,
                    success: function (res) {
                        //elem.loading = false;
                        if (res.access_token) {
                            elem.$message({
                                type: "success",
                                message: elem.$t('message.LoginSuccess')
                            });
                            setStore("token", res.access_token);
                            setStore("LoginName", res.UserName);
                            setStore("LoginID", res.LoginID);
                            elem.$router.push('/TravelApplication');
                        }
                        else
                        {
                            elem.loading = false;
                            elem.$message({
                                type: "error",
                                message: res.Message
                            });

                        }
                    },
                    error:function(res) {
                        elem.$message({
                            type: "error",
                            message: elem.$t('message.LoginFail')
                        });
                        elem.loading = false;
                    }
                });
            },
            async submitForm(formName) {
                if(this.IsAuth == 0){
                    this.$alert(this.$t('message.IsAuth'), this.$t('message.warning'), {
                        confirmButtonText: ' ',
                        confirmButtonClass: 'iconfont icon-gou-wukuang',
                    })
                }
                else {
                    this.$refs[formName].validate(async valid => {
                        if (valid) {
                            let BaseUrl = baseUrl;
                            let signUrl = BaseUrl + "/api/System/CheckUserInfo"
                            let parm2 = {
                                ADName: this.loginForm.username
                            }
                            let ele = this;
                            axios.post(signUrl, parm2, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            }).then(function (response) {
                                if (response.data.Flag) {
                                    ele.login();
                                }else {
                                    ele.$message({
                                        type: 'error',
                                        duration: 5000,
                                        message: ele.$t('message.'+response.data.Message)
                                    });
                                }
                            })
                        }
                        else {
                                    this.loading = false;
                                    this.$message.error({
                                        title: "错误",
                                        message: elem.$t('message.LoginFail'),//"请输入正确的用户名密码",
                                        offset: 100
                                    });
                                    return false;
                                }
                        });
                    if (this.loginForm.language == 'English') {
                        this.loginForm.language = 'en-US'
                    }
                    if (this.loginForm.language == '中文') {
                        this.loginForm.language = 'zh-CN'
                    }
                    setLocal("CultureCode", this.loginForm.language);
                    setStore("CultureCode", this.loginForm.language);
                }
            },
            getLocalCultureCode(){
                if(getLocal('CultureCode') == undefined){
                    setLocal('CultureCode', 'en-US');
                    this.$i18n.locale = "en";
                    this.loginForm.language = 'English'
                } else {
                    if(getLocal('CultureCode') == 'zh-CN'){
                        this.$i18n.locale = "cn";
                        this.loginForm.language = '中文'
                    } else {
                        this.$i18n.locale = "en";
                        this.loginForm.language = 'English'
                    }
                }
            },
            changeLanguage() {
                setStore('CultureCode', this.loginForm.language);
                if (getStore('CultureCode') == 'zh-CN') {
                    this.$i18n.locale = "cn";
                } else {
                    this.$i18n.locale = "en";
                }
                this.getCompany();
            },
        },
        watch: {
            adminInfo: function (newValue) {
                if (newValue.id) {
                    this.$message({
                        type: "success",
                        message: "检测到您之前登录过，将自动登录"
                    });
                    this.$router.push("manage");
                }
            },

        }
    };

</script>

<style lang="less" scoped>
    .tip {
        font-size: 12px;
        color: red;
    }

    .form-fade-enter-active,
    .form-fade-leave-active {
        transition: all 1s;
    }

    .form-fade-enter,
    .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }

</style>
