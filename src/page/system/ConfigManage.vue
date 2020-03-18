<template>
    <div class="fillcontain">
        <head-top  @changeLan='resetLabelWidth'></head-top>
        <div id="searchBox" class="search-box" style="padding-top:20px">
               <el-form ref="form" :model="config" label-width="120px">
                    <el-form-item label="OA单号是否必填">
                           <el-select v-model="config.OAno" placeholder="请选择">
                               <el-option
                                 v-for="item in OAlist"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                               </el-option>
                             </el-select>
                    </el-form-item>
  
                  </el-form>
                  <div class="button-line">
                <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                    <el-button type="primary"  @click='save()' icon="iconfont icon-baocun"></el-button>
                </el-tooltip>

            </div>
        </div>
    </div>
</template>


<script>
    import headTop from "../../components/headTop";
    import { baseUrl, baseImgPath } from "@/config/env";
    import {getStore, getLocal} from "../../config/mUtils";
    import {getConfigInfo} from "@/api/getData";
    import {
          SetConfig
} from '../../apiNew/api.js'
    export default {
        data() {
            return {
                config:{
                     OAno:'',
                },
                 OAlist: [{value:1,label: '是'},{value:2,label: '否'}],
                configparme:[],
            };
        },
        created() {
            this.watchHeight();
            this.resetLabelWidth();
            this.getConfigInfo();
        },
        computed: {},
        components: {
            headTop
        },
        mounted() {
            setTimeout(() => {
                let widowHeight = document.documentElement.clientHeight - 245;
                let h = document.getElementById('searchBox').clientHeight;
                this.tableHeight = widowHeight - h;
            }, 1);
        },
        methods: {
            resetLabelWidth() {
                if (getStore('CultureCode') == 'en-US') {
                    this.nameW = 90 + 'px';
                    this.companyW = 125 + 'px';
                    this.labelWidth = 140 + 'px';
                    this.dialogOneW = 100 + 'px';
                } else {
                    this.nameW = 90 + 'px';
                    this.companyW = 85 + 'px';
                    this.labelWidth = 70 + 'px';
                    this.dialogOneW = 90 + 'px';
                }
            },
             watchHeight() {
                setTimeout(() => {
                    const that = this;
                    window.onresize = function temp() {
                        let widowHeight = document.documentElement.clientHeight - 245;
                        let h = document.getElementById('searchBox').clientHeight;
                        that.tableHeight = widowHeight - h;
                    };
                }, 1);
            },
            async getConfigInfo() {
              const crs = await getConfigInfo({
                })
                if (crs.Flag) {
                    // this.dialogAddVisible=false;
                    this.config.OAno=crs.Result
                };
            },
            save(){
                let params2={
                    ConfigContent: "OrderNo",
                    IsRequired: this.config.OAno
                    }
               SetConfig(params2).then(response => {
                            this.$message({
                                type: 'success',
                                message: this.$t('message.Success')
                            })
                        })
            }
        }
    };
</script>
