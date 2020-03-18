<template>
    <div class="fillcontain">
        <head-top @changeLan='resetLabelWidth'></head-top>
        <div class="search-box" id="searchBox">
            <el-collapse v-model="activeNames" @change="topSearch">
                <el-collapse-item :title="$t('message.Search')" name="1">
            <el-form :model="ruleForm" ref="ruleForm"  @submit.native.prevent>
            <el-form-item :label="$t('message.rm_RoleName')" prop="RoleName" :label-width="nameW">
               <el-input clearable v-model="ruleForm.RoleName" :maxlength=50></el-input>
            </el-form-item>
             <div class="button-line">
              <el-form-item>
                  <el-tooltip class="item" effect="dark" :content="$t('message.Search')" placement="top">
                      <el-button type="primary" @click="searchRole" icon="iconfont icon-sousuo"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('message.Reset')" placement="top">
                      <el-button type="info" @click="resetForm('ruleForm')" icon="iconfont icon-zhongzhi"></el-button>
                  </el-tooltip>
              </el-form-item>
             </div>
            </el-form>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="table_container"  v-loading='isloading'>
            <el-tooltip class="item" effect="dark" :content="$t('message.Add')" placement="top">
                <el-button class="addBtn" type="primary" @click="openNewRole()" icon="iconfont icon-xinzeng-wubiankuang"></el-button>
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
                <el-table-column :label="$t('message.rm_RoleName')" prop="RoleName"></el-table-column>
                <el-table-column :label="$t('message.rm_EnglishName')" prop="RoleEnName"></el-table-column>
                <el-table-column :label="$t('message.rm_Description')" prop="Description" ></el-table-column>
                <el-table-column :label="$t('message.Operation')" width="150">
                  <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="$t('message.Edit')" placement="top">
                          <el-button icon="iconfont icon-bianji-kong" class="hoverBtn" @click="editRole(scope.row)"></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="$t('message.rm_ConfigAuth')" placement="top">
                          <el-button icon="iconfont icon-renyuanguanli" class="hoverBtn" @click="configAuth(scope.row.RoleID)"></el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" :content="$t('message.Delete')" placement="top">
                          <el-button icon="iconfont icon-shanchu-kong" class="hoverBtn" @click="openDelectRole(scope.row.RoleID)"></el-button>
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
            <el-dialog :title="$t('message.rm_DeleteRole')" :modal-append-to-body="false" :visible.sync="dialogAddVisible3"  width="600px" :close-on-click-modal='false' @close="DelectRoleCannel">
                <span>{{$t('message.rm_DeleteRoleMessage')}}</span>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="DelectRoleCannel" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="deleteRole()" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="dialotitle" :modal-append-to-body="false" :visible.sync="dialogAddVisible2"  width="600px" :close-on-click-modal='false' @close="CancelNewRole">
                <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">
                    <el-form-item :label="$t('message.rm_RoleName')"  prop="RoleName">
                        <el-input v-model="addForm.RoleName" auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.rm_EnglishName')"  prop="EnglishName">
                        <el-input v-model="addForm.EnglishName" auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.rm_Description')"  prop="Description" style="margin-top: 18px">
                        <el-input type="textarea" v-model="addForm.Description" auto-complete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                        <el-button @click="CancelNewRole" icon="iconfont icon-guanbi-wukuang"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                        <el-button type="primary" @click="addNewRole('addForm')" icon="iconfont icon-gou-wukuang"></el-button>
                    </el-tooltip>
                </div>
            </el-dialog>
            <el-dialog :title="$t('message.rm_ConfigAuth')" :modal-append-to-body="false" :visible.sync="dialogAddVisible"  width="600px" :close-on-click-modal='false' @close="cancelConfig">
                <el-tree
                    :default-expanded-keys="expanedNodes"
                    :default-checked-keys='checkNodes'
                    :props="props"
                    :data="treeData"
                    show-checkbox
                    ref="tree"
                    node-key="id"
                >
                </el-tree>
              <div slot="footer" class="dialog-footer">
                  <el-tooltip class="item" effect="dark" :content="$t('message.Cancel')" placement="top">
                      <el-button @click="cancelConfig" icon="iconfont icon-guanbi-wukuang"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('message.Save')" placement="top">
                      <el-button type="primary" @click="commitAuth" icon="iconfont icon-gou-wukuang"></el-button>
                  </el-tooltip>
              </div>
            </el-dialog>
        </div>
    </div>
</template>


<script>
import headTop from "../../components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";
import { exportPDFfunGet } from "@/config/fetch";
import {GetRolesList,CreateUpdRoles,DelRoleById,GetAllPages,GetPagePression,SetPagePression} from '../../apiNew/api.js'
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
      activeNames: ['1'],
      expanedNodes:[],
      checkNodes:[],
      checkNodesCopy:[],
      authId:'',
      delectID: '',
      baseUrl,
      baseImgPath,
      PageIndex: 1,
      PageSize: 10,
      count: 0,
      tableData: [],
      currentPage: 1,
      dialogFormVisible: false,
      dialogAddVisible2:false,
      dialogAddVisible3:false,
      dialogAddVisible: false,
        isloading: true,
      companys:[],
        tableHeight: 0,
      addForm: {
        RoleId:'',
        RoleName: "",
        Description:'',
        EnglishName:'',
      },
      ruleForm:{
        RoleName: ""
      },
      rules: {
        RoleName: [{ required: true, message: this.$t('message.Input')+' '+ this.$t('message.rm_RoleName'), trigger: "blur" }],
        EnglishName: [{ required: true, message: this.$t('message.Input')+' '+this.$t('message.rm_EnglishName'), trigger: "blur" }],
        Description: [{ required: true, message: this.$t('message.Input')+' '+this.$t('message.rm_Description'), trigger: "blur" }],
      },
      treeData:[],
       props: {
         children: 'children',
         label: 'label'
        },
        dialotitle:this.$t('message.Add'),
        nameW: 0+'px',
        companyW : 0+'px',
        labelWidth : 0+'px'
    };
  },
  created() {
    this.watchHeight();
    this.initData();
    this.resetLabelWidth();
  },
  computed: {},
  components: {
    headTop
  },
    mounted() {
        setTimeout(() => {
            let widowHeight = document.documentElement.clientHeight-295;
            let h = document.getElementById('searchBox').clientHeight;
            this.tableHeight = widowHeight - h;
        }, 1);
    },
  methods: {
      topSearch(){
          console.log(this.activeNames);
          if(this.activeNames.length == 0){
              this.tableHeight = this.tableHeight + 128;
          } else {
              this.tableHeight = this.tableHeight - 128;
          }
      },
      watchHeight() {
          setTimeout(() => {
              const that = this;
              window.onresize = function temp() {
                  let widowHeight = document.documentElement.clientHeight-295;
                  let h = document.getElementById('searchBox').clientHeight;
                  that.tableHeight = widowHeight - h;
              };
          }, 1);
      },
      resetLabelWidth() {
          if (getLocal('CultureCode') == 'en-US') {
              this.nameW = 80+'px';
              this.companyW = 125+'px';
              this.labelWidth = 105+'px';
          } else {
              this.nameW = 65+'px';
              this.companyW = 85+'px';
              this.labelWidth = 70+'px';
          }
      },
    async initData() {
      /**获取用户列表 */
      try {
        // this.getLanguageResource();
        // this.getCompanys();
        //   this.getPageData();
        this.getRoleList();
        // this.getPermission();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
      // mm
      openNewRole(){
          this.dialotitle = this.$t('message.Add');
          this.dialogAddVisible2 = true;
      },
      CancelNewRole(){
          this.dialogAddVisible2 = false;
          this.$refs['addForm'].resetFields();
      },
      openDelectRole(id){
          this.delectID = id;
          this.dialogAddVisible3 = true;
      },
      DelectRoleCannel(){
          this.dialogAddVisible3 = false;
      },
      getRoleList() {
        this.isloading = true;
        let params = {
             searchCondition:this.ruleForm.RoleName,
             pageSize: this.PageSize,
             pageIndex: this.PageIndex
        }
        GetRolesList(params).then(response => {
            this.isloading = false;
            this.tableData = response.data.Result.lstRole;
            this.count = response.data.Result.TotalCount
        }).catch(error => {
        })
    },
      addNewRole(params){
        this.$refs[params].validate((valid) => {
            if (valid) {
                let roleInfo = {
                    RoleId:this.addForm.RoleId,
                    RoleName:this.addForm.RoleName,
                    RoleEnName:this.addForm.EnglishName,
                    Description:this.addForm.Description,
                    user:null
                }
                CreateUpdRoles(roleInfo).then(response => {
                    if(response.data.Flag){
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
      deleteRole(){
        let params ={
            roleId: this.delectID,
        }
        DelRoleById(params).then(response => {
            if(response.data.Flag){
                this.$message({
                    type: "success",
                    message: this.$t('message.Success')
                });
            }else {
                this.$message({
                    type: "error",
                    message: this.$t('message.Fail')
                });
            }
            this.dialogAddVisible3 = false;
            this.searchRole();
        }).catch(error => {
        })
    },
      editRole(row){
          this.dialotitle = this.$t('message.Edit');
          this.addForm ={
              RoleName: row.RoleName,
              Description: row.Description,
              EnglishName: row.RoleEnName,
              RoleId: row.RoleID
          }
          this.dialogAddVisible2 = true;
      },
      configAuth(id){
          this.authId = id;
          let params = {
              roleId : id
          }
          GetPagePression(params).then(response => {
              response.data.Result.forEach((item,index)=>{
                  this.checkNodes.push(item.PageID)
              })
              this.getPageData();
          }).catch(error => {
          })
          this.dialogAddVisible = true;
      },
      commitAuth(){
          console.log(this.$refs.tree.getCheckedKeys());
          let params = {
              pageIds : this.$refs.tree.getCheckedKeys(),
              roleId : this.authId
          }
          SetPagePression(params).then(response => {
              if(response.data.Flag){
                  this.$message({
                      type: "success",
                      message: this.$t('message.Success')
                  });
              } else {
                  this.$message({
                      type: "error",
                      message: this.$t('message.Fail')
                  });
              }
          }).catch(error => {
          })
          this.authId = ''
          this.checkNodes = [];
          this.dialogAddVisible = false;
      },
      cancelConfig(){
          this.dialogAddVisible = false;
          this.authId = '';
          this.checkNodes = []
      },
      getPageData(){
          GetAllPages().then(response => {
              let that = this;
              if(response.data.Flag){
                  this.treeData = response.data.Result;
                  this.treeData.forEach((item,index)=>{
                      if(item.label == 'lang_SystemManage'){
                          this.expanedNodes.push(response.data.Result[index].id);
                      }
                  })
                  this.treeData.forEach((item,index)=>{
                      item.label = that.$t('message.'+item.label)
                      item.children.forEach((itemJ,index)=>{
                          itemJ.label = that.$t('message.'+itemJ.label)
                      })
                  })

              }else {
              }
              console.log(this.treeData);
          }).catch(error => {
          })
      },
      searchRole(){
          this.isloading = true;
          this.currentPage = 1;
          this.PageIndex = 1;
          let params = {
              searchCondition: this.ruleForm.RoleName,
              pageIndex: this.PageIndex,
              pageSize: this.PageSize
          };
          GetRolesList(params).then(response => {
              this.isloading = false;
              this.tableData = response.data.Result.lstRole;
              this.count = response.data.Result.TotalCount
          }).catch(error => {
          })
      },
      resetForm(formName) {
          this.$refs[formName].resetFields();
          this.searchRole();
      },
    async getCompanys() {
                const crs = await getCompanys({
                    CompanyCode:getStore('CompanyCode'),
                    CompanyName: "",
                    UserId:getStore('Id'),
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
      this.getRoleList();
    },

    handleAdd() {
      this.dialogAddVisible = true;
      this.dialotitle = this.$t('message.Add');
      this.addForm.Id=0;
      this.addForm.RoleName="";
      this.addForm.CompanyCode=getStore('CompanyCode');
      this.treeData=[];
      this.getPermission();
    },
    handleEdit(index, row) {
      this.addForm = Object.assign({}, row);
      this.dialogAddVisible = true;
      this.dialotitle = this.$t('message.Edit');
      // alert(row.RolePermission);
      let setNodes=[];
      let setIds = row.RolePermission.split(',');
      console.log(setIds);
      setIds.forEach((item,index)=>{

        this.treeData.forEach((node,k)=>{

          if(node.children.length>0){
          for( let i in node.children){
            // if(node.children[i].id==item){
            //   setNodes.push(node.children[i]);
            // }
            if(node.children[i].children.length>0){
              for(let m=0; m<node.children[i].children.length;m++){
                  if(node.children[i].children[m].id==item){
                  setNodes.push(node.children[i].children[m]);
                  }
             }
            }
            else{
                  if(node.children[i].id==item){
                    setNodes.push(node.children[i]);
                  }
                  // else{
                  //   break;
                  // }
                }
          }
           }
           else{
             if(node.Id==item){
               setNodes.push(node);
             }
             else{
               return;
             }
           }
        });
      });
      console.log(setNodes)
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

    Cancel(){
      this.dialogAddVisible=false;
      this.$refs['addForm'].resetFields();
    },
    addRole(formName) {
      let selectNodes = this.$refs.tree.getCheckedNodes();
      let NodeIDs =[];
      selectNodes.forEach((item,index) =>{
        NodeIDs.push(item.id);
      });
      let halfcheckedNode = this.$refs.tree.getHalfCheckedNodes();
      halfcheckedNode.forEach(item=>{
        NodeIDs.push(item.id)
      })

      this.addForm.RolePermission=NodeIDs.join(',');
      console.log(this.addForm.permissions)

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
     handleDelete(index,row){
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
