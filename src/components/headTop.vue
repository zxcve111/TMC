<template>
    <div class="header_container">
		<div class="top-head">
			 <el-dropdown @command="handleCommand" trigger="click" class="navdash">
            <span class="el-dropdown-link">
            	<span >{{userName}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
             </span>
			<el-dropdown-menu slot="dropdown">
                <el-dropdown-item  command="singout">{{$t('message.LoginExit')}}</el-dropdown-item>
			</el-dropdown-menu>
			</el-dropdown>
            <el-select v-model="curCompany" placeholder=" " class="checkCompany" @change="setCompany">
                <el-option v-for="item in CompanyOptions" :key="item.CompanyID" :label="item.CompanyName"
                           :value="item.CompanyID">
                </el-option>
            </el-select>
            <el-select v-model="curLanguage" placeholder=" " class="checkLanguage" @change="setLanguage">
                <el-option v-for="item in languageOptions" :key="item.CultureCode" :label="item.CultureName"
                           :value="item.CultureCode">
                </el-option>
            </el-select>
		</div>
   <el-dialog class="changePW"
    :title="$t('message.ModifyPW')"
    :visible.sync="dialogVisible"
    width="570px">
    <el-form :label-width="labelW" :model="ruleForm" ref="ruleForm" :rules="rules">
       <el-form-item :label="$t('message.NewPassword')" prop="newPassword">
          <el-input clearable type="password" v-model="ruleForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item :label="$t('message.ConfirmNewPassword')" prop="newPasswordagain">
          <el-input clearable type="password" v-model="ruleForm.newPasswordagain"></el-input>
      </el-form-item>
      <el-alert  :title="$t('message.FirstLogin')" type="error" style="width:98%;margin-left:2%"> </el-alert>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
            <el-button @click="cancel" icon="iconfont icon-guanbi-wukuang"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('message.Modify')" placement="top">
            <el-button type="primary" icon="iconfont icon-gou-wukuang" @click="modify('ruleForm')"></el-button>
        </el-tooltip>
    </span>
  </el-dialog>
		<div class="breadcrumb">
			<el-breadcrumb separator="/">
				<!-- <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item> -->
				<el-breadcrumb-item v-for="(item, index) in $route.meta" separator="/"   v-bind:key="index">{{$t('message.'+item)}}</el-breadcrumb-item>
			</el-breadcrumb>
			<!-- <div class="backbtn">
				<el-button type="primary" icon="el-icon-arrow-left" v-if="isShowBack" @click="goback()">返回</el-button>
			</div> -->
		</div>
    </div>
</template>

<script>
import { signout, login, ModPassword, getlanguage } from "@/api/getData";
import { baseUrl,baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";
import { getStore, setStore, getLocal, setLocal,removeStore } from "../config/mUtils";
import { Loading } from "element-ui";
import en from '../i18n/langs/en';
import cn from '../i18n/langs/cn';
export default {
  data() {
     var validatePass2 = (rule, value, callback) => {
      if (value === '') {
          callback(new Error(this.$t('message.PasswordAgain')));
        } else
         if (value !== this.ruleForm.newPassword) {
          callback(new Error(this.$t('message.PasswordDifferent')));
        } else {
          callback();
        }
      };
    return {
      baseImgPath,
      userName: "",
      companydata: [],
      nowCompanyCode: "",
      nowCompany: "",
      isShowBack:true,
      dialogVisible:false,
        labelW: 0+'px',
      ruleForm:{
        newPassword:"",
        newPasswordagain:""
      },
      rules:{
        newPassword: [{ required: true, message:this.$t('message.Input')+this.$t('message.NewPassword'), trigger: "change" }],
        newPasswordagain: [{required: true, validator: validatePass2, trigger: 'change' }],
        // oldPassword: [{ required: true, message: "请输入旧密码", trigger: "change" }],
        // userEmail: [{ required: true, message: "请输入邮箱", trigger: "change" }],
        // userPhone: [{ required: true, message: "请输入手机", trigger: "change" }],
      },
      IsSystemAdmin:getStore('IsSystemAdmin'),
        languageOptions: [{CultureCode:'en-US',CultureName:'English'},{CultureCode:'zh-CN',CultureName:'中文'}],
        CompanyOptions: JSON.parse(getStore('companyOptions')),
        isShowMenu:getStore('isShowMenu'),
        curLanguage: getStore('CultureCode'),
        curCompany: getStore('CompanyID'),

    };
  },
  created() {
    // this.getLanguageResource();
      this.resetLabelWidth();
      // this.languageList();
      if(getStore('CultureCode') == 'zh-CN'){
          this.curLanguage = '中文'
      }else {
          this.curLanguage = 'English'
      }
    if (!this.adminInfo.id) {
      this.getAdminData();
      this.userName = getStore("LoginName");
      this.nowCompanyCode=getStore("CompanyCode");
      this.nowCompany=getStore("CompanyName");
      var hometPath ='/' + getStore('homePage');
      if( hometPath == this.$route.path)
      {
        this.isShowBack=false;
      }
    }
  },
  computed: {
    ...mapState(["adminInfo"])
  },
   watch:{
            cn:function(){
              //this.getLanguageResource();
            },
            en:function(){
             // this.getLanguageResource();
            },
            deep:true
        },
    mounted() {
        this.getMenuStatus(this.isShowMenu);
    },
  methods: {
    ...mapActions(["getAdminData"]),
      resetLabelWidth() {
          if (getLocal('CultureCode') == 'en-US') {
              this.labelW = 160+'px';
          } else {
              this.labelW = 85+'px';
          }
      },
      async languageList() {
          // debugger;
          const crs = await getlanguage({})
          if (crs.Flag) {
              this.languageOptions = crs.Result;
          }
      },
      getMenuStatus(isShowMenu){
          if(isShowMenu=='true'||isShowMenu==null){
              setTimeout(function()  {
                  document.getElementsByClassName('breadcrumb')[0].style.left = '212px';
                  document.getElementsByClassName('menu-btn')[0].style.left = '230px';
                  document.getElementsByClassName('el-main')[0].style.marginLeft = '200px';
                  document.getElementsByClassName('top-head')[0].style.marginLeft = '200px';
                  document.getElementsByClassName('el-dropdown')[0].style.marginRight = '226px';
                  document.getElementsByClassName('el-aside')[0].style.maxWidth = '200px';
              }, 280);
          } else{
              document.getElementsByClassName('breadcrumb')[0].style.left = '55px'
              document.getElementsByClassName('menu-btn')[0].style.left = '60px';
              document.getElementsByClassName('el-main')[0].style.marginLeft = '44px';
              document.getElementsByClassName('top-head')[0].style.marginLeft = '44px';
              document.getElementsByClassName('el-dropdown')[0].style.marginRight = '70px';
              document.getElementsByClassName('el-aside')[0].style.maxWidth = '44px';
          }
      },
    async handleCommand(command) {
      if (command == "singout") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("sanlian");
        this.$message({
          type: "success",
          message: this.$t('message.Success')
        });
          let BaseUrl = baseUrl;
          let signUrl = BaseUrl + "/api/Login/LogOut";
          window.location.href = signUrl
        //this.$router.push("/");
      }
      else if(command == "changePW"){
        this.dialogVisible=true;
      } else {
        sessionStorage.removeItem("token");
        let userName = sessionStorage.getItem("LoginName");
        let password = sessionStorage.getItem("password");
        sessionStorage.setItem("CompanyCode", command);
        const res = await login({
          parm:
            "grant_type=password&username=" +
            userName +
            "&password=" +
            password,
          url: command
        });
        if (res.access_token) {
          setStore("token", res.access_token);
          setStore("LoginName", res.LoginName);
          setStore("UserName", res.UserName);
          setStore("UserPhone", res.UserPhone);
          setStore("CompanyCode", res.CompanyCode);
          Loading.service({ fullscreen: true });
          this.$router.go(0);
          //this.$router.push('manage')
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      }
    },
    modify(formname){
     this.$refs[formname].validate((valid) => {
          if (valid) {
            this.dialogVisible = false;
            this.changePwd(formname);
          } else {
            console.log('error submit!!');
            return false;
          }
        });

    },
      setCompany(){
          this.$confirm(this.$t('message.changeCompany'), this.$t('message.warning'), {
              confirmButtonText: ' ',
              cancelButtonText: ' ',
              confirmButtonClass: 'iconfont icon-gou-wukuang',
              cancelButtonClass: 'iconfont icon-guanbi-wukuang',
              type: 'warning'
          }).then(() => {
              setStore('CompanyID', this.curCompany);
              this.CompanyOptions.forEach((item,index)=>{
                  if(item.CompanyID == this.curCompany){
                      setStore("CompanyCode",item.CompanyCode)
                  }
              });
              removeStore('sanlian');
              console.log(this.$route.path);
              if(this.$route.path == '/TravelApplication'){
                  console.log(222);
                  location.reload();
              }else {
                  this.$router.push("/TravelApplication")
              }


          }).catch(() => {
             this.curCompany = getStore('CompanyID');
          });

      },
      setLanguage() {
          setStore('CultureCode', this.curLanguage);
          setLocal('CultureCode', this.curLanguage);
          if (getStore('CultureCode') == 'zh-CN') {
              this.$i18n.locale = "cn";
          }else {
              this.$i18n.locale = "en";
          }
          this.$emit("changeLan")
      },
    async changePwd(formname){
      const res = await ModPassword({
        userId:sessionStorage.getItem("Id"),
        password:this.ruleForm.newPassword
      })
      if(res.Flag){
        this.$message({
                  type: "success",
                  message: this.$t('message.Success')
                });
      this.$nextTick(function () {
        this.$refs[formname].resetFields();
        });
      }
      // var elem=this;
      // var linkurl="/api/systems/user/ChangePwd?password="+this.ruleForm.newPassword+"&userName="+encodeURIComponent(sessionStorage.getItem('UserName'))
      // +"&oldPwd="+this.ruleForm.oldPassword

      //     ajax({
      //       url: baseUrl+linkurl,
      //       type: "POST",
      //       async: false,
      //       contentType: "application/json;",//;text/plain;
      //       //accept: "text/plain",
      //       data: "",
      //       success: function (res) {
      //          if (res.success==1) {
      //            elem.$message({
      //             type: "success",
      //             message: "修改成功"
      //           });
      //           // sessionStorage.setItem('UserPhone',this.ruleForm.userPhone);
      //           // sessionStorage.setItem('userEmail',this.ruleForm.userEmail);
      //           //this.$router.push('manage')
      //         } else {
      //           elem.$message({
      //             type: "error",
      //             message: res.msg
      //           });
      //         }
      //       }
      //   });

    },
    cancel(){
      this.dialogVisible = false;
      this.$nextTick(function () {
          this.$refs[formname].resetFields();
      });
    },
    goback() {

      this.$router.go(-1);
      // if(this.$router.go(-1)==undefined){
      //   this.$router.push('/');
      // }
      // else if(this.$router.go(-1)=='/manage'){
      //   this.$router.push('/');
      // }
      // else{
      //   this.$router.go(-1);
      // }

    }
  }
};
</script>
