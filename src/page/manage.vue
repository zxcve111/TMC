<template>
    <el-container>
        <div class="menu-btn iconfont" :class="isShowMenu=='true'?'icon-caidan-shousuo':'icon-caidan-dakai'"
             @click="hideMenu()"></div>
        <el-aside :class="isShowMenu == 'true' ? 'opened' : 'unopen'">
            <el-menu :default-active="$route.path" style="min-height: 100%;" background-color="#1d2b36" text-color="#fff"
                     active-text-color="#3890df"  :collapse="isShowMenu=='false'">
                <div class="logo" :class="isShowMenu=='true'?'logo':'smallLogo'"></div>
                <template v-for="(menu,index) in menuList">
                    <el-menu-item v-if="menu.children.length == []" :key="index" :index="menu.pageurl" @click="toPage(menu.pageurl)">
                            <i class="iconfont" :class="'icon-'+menu.label" style="font-size: 22px;margin-right: 5px"></i>
                        <span slot="title">{{$t('message.'+menu.label)}}</span>
                    </el-menu-item>
                    <el-submenu v-else :key="index" :index="index+''">
                        <template slot="title">
                            <i class="iconfont" :class="'icon-'+menu.label" style="font-size: 22px;margin-right: 5px"></i>
                            <span slot="title">{{$t('message.'+menu.label)}}</span>
                        </template>
                        <template v-for="sub in menu.children">
                            <el-menu-item :index="sub.pageurl" @click="toPage(sub.pageurl)">
                                <span class="menuText">{{$t('message.'+sub.label)}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    import {GetUserMenuJurisdiction,GetLanguageResource,Login2Amex} from '../apiNew/api.js'
    import {getPageByUser} from '../api/getData';
    import {getLocal, getStore, setStore,removeStore} from '../config/mUtils';
    import en from './../i18n/langs/en';
    import cn from './../i18n/langs/cn';
    export default {
        data() {
            return {
                langs:[],
                menuList: [],
                isShowMenu: 'true',
                isCollapse: false,
                cnTranslate:{},
                enTranslate:{},
            }
        },
        computed: {
            // defaultActive: function(){
            //
            //     return this.$route.path.replace('/TravelApplication', '');
            // }
        },
        created() {
            this.GetLanguage();
            if (getStore('isShowMenu') && getStore('isShowMenu') != null && getStore('isShowMenu') != "") {
                this.isShowMenu = getStore('isShowMenu')
            } else {
                this.isShowMenu = 'true'
            }
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
            GetLanguage(){
                let params ={
                    CultureCode:"zh-CN",
                    ItemId:'',
                    ItemContent:'',
                    pageIndex:1,
                    pageSize:999999
                }
                GetLanguageResource(params).then(response => {
                    response.data.Result.languageResource.forEach((item,index)=>{
                        this.cnTranslate[item.ItemID] = item.ItemContent;
                    })
                    cn.message = Object.assign(cn.message, this.cnTranslate);
                }).catch(error => {
                })
                let params2 ={
                    CultureCode:"en-US",
                    ItemId:'',
                    ItemContent:'',
                    pageIndex:1,
                    pageSize:999999
                }
                GetLanguageResource(params2).then(response => {
                    response.data.Result.languageResource.forEach((item,index)=>{
                        this.enTranslate[item.ItemID] = item.ItemContent;
                    })
                    en.message = Object.assign(en.message, this.enTranslate);
                }).catch(error => {
                })
                    if (getStore('CultureCode') == 'en-US') {
                        this.$i18n.locale = "en";
                        this.langs=en.message;
                        // this.rules.username[0].message = en.message.username;
                        // this.rules.password[0].message = en.message.password;

                    } else {
                        this.$i18n.locale = "cn";
                        this.langs=cn.message;
                    }
                setTimeout(() => {
                    this.getMeunByUser();
                }, 2000);

            },
            getMeunByUser(){
                let params ={
                    user : null
                }
                let part2={
                    children: [],
                    id: "1",
                    label: "lang_AMexLogin",
                    modularSort: 99,
                    pageurl: "openAmex"
                }
                GetUserMenuJurisdiction(params).then(response => {
                    let list = response.data.Result;
                    list.splice(1,0,part2);
                    this.menuList = list;
                }).catch(error => {
                })
            },
            async getMenu() {
                const crs = await getPageByUser({
                    userId: getStore('Id')
                })
                // if(crs.Flag){
                //     crs.Result.pageList.forEach((item,index) => {
                //         if(item.ParentPageId==0){
                //             this.menuList.push(item);
                //         }
                //     });
                //     // console.log(this.menuList);
                //     let submenuList=[];
                //      this.menuList.forEach((k,key)=>{
                //          let submenu=[];
                //         crs.Result.pageList.forEach((item,index) => {
                //             if(item.ParentPageId==k.Id){
                //                 submenu.push(item);
                //                 submenuList.push(item);
                //             }
                //         });
                //         k.submenu=submenu;
                //
                //     });
                //     let buttonPermission = [];
                //     console.log(submenuList);
                //     submenuList.forEach(item=>{
                //         var permissionObj = {
                //             parentPageUrl:item.PageUrl,
                //             Permission:[]
                //         }
                //         crs.Result.pageList.forEach(j=>{
                //             if(j.ParentPageId==item.Id){
                //                permissionObj.Permission.push(j);
                //             }
                //         });
                //         if(permissionObj.Permission.length>0){
                //             buttonPermission.push(permissionObj);
                //         }
                //
                //     });
                //     setStore('Permission',buttonPermission);
                //
                //     console.log(this.menuList);
                this.getLanguageResource();
            },
            hideMenu(){
                if(this.isShowMenu=='true'){
                    this.isShowMenu='false';
                    this.isCollapse = true;
                }
                else{
                    this.isShowMenu='true';
                    this.isCollapse = false;
                }
                setStore('isShowMenu',this.isShowMenu)
                if(this.isShowMenu=='true'){
                    setTimeout(function()  {
                        document.getElementsByClassName('breadcrumb')[0].style.left = '212px';
                        document.getElementsByClassName('menu-btn')[0].style.left = '230px';
                        document.getElementsByClassName('el-main')[0].style.marginLeft = '200px';
                        document.getElementsByClassName('top-head')[0].style.marginLeft = '200px';
                        document.getElementsByClassName('el-dropdown')[0].style.marginRight = '226px';
                        document.getElementsByClassName('el-aside')[0].style.maxWidth = '200px';
                    }, 280);
                }
                else{
                    document.getElementsByClassName('breadcrumb')[0].style.left = '55px'
                    document.getElementsByClassName('menu-btn')[0].style.left = '60px';
                    document.getElementsByClassName('el-main')[0].style.marginLeft = '44px';
                    document.getElementsByClassName('top-head')[0].style.marginLeft = '44px';
                    document.getElementsByClassName('el-dropdown')[0].style.marginRight = '70px';
                    document.getElementsByClassName('el-aside')[0].style.maxWidth = '44px';
                }
            },
            toPage(url){
                if(url == 'openAmex'){
                    this.Login2Amex();
                }else {
                    this.$router.push({
                        path: url,
                    });
                }
            },
        },


    }

</script>
