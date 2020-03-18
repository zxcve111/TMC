import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
// import global_ from './global/global'//引用文件

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fontIcon/iconfont.css'
import 'babel-polyfill';
require('es6-promise').polyfill();
import 'fetch-detector';
import 'fetch-ie8';
import i18n from './i18n/i18n';
import en from './i18n/langs/en';
import cn from './i18n/langs/cn';

import {getJsonResource,} from "@/api/getData";
import { getLocal,getStore } from '@/config/mUtils';

let Base64 = require('js-base64').Base64;
Vue.config.productionTip = false;

//获取语言资源包
Vue.prototype.getLanguageResource = async function (){
    const crs = await getJsonResource();
    if(crs.Flag){
        cn.message = Object.assign({},cn.message, crs.Result.zh-cn);
        en.message = Object.assign({},en.message, crs.Result.en-US);
        
        if (getLocal('language') == 'zh-cn') {
            this.$i18n.locale = "cn";
        }
        if (getLocal('language') == 'en-US') {
            this.$i18n.locale = "en";
            
        } else {
            this.$i18n.locale = "cn";
        }
    }
}

Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: { App }
})
