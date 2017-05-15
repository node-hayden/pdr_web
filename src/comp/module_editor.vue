<template>
    <div class="comp-mask-parent comp-mask-show">
        <div class="comp-mask-module comp-me-height">
            <div class="team-h-module-title">
                <div class="el-icon-close team-h-module-close"
                     @click="onClose">
                </div>
                {{mode==1?'修改模块':'新增模块'}}
            </div>
            <!-- form -->
            <div style="padding: 15px">
                <el-form label-width="50px">
                    <el-form-item label="类型:">
                        <el-select size="small" v-model="dModule.type"
                                   :disabled="vo"
                                   placeholder="请选择模块类型" style="width: 100%">
                            <el-option key="type1"
                                    label="version"
                                    value="">
                            </el-option>
                            <el-option key="type2"
                                       label="podspec"
                                       value="podspec">
                            </el-option>
                            <el-option key="type3"
                                       label="path"
                                       value="path">
                            </el-option>
                            <el-option key="type4"
                                       label="git"
                                       value="git">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称:">
                        <el-select v-if="dModule.type==''"
                                size="small"
                                v-model="dModule.name"
                                filterable
                                remote
                                :disabled="mode==1"
                                placeholder="请输入模块名称关键词"
                                :remote-method="onSearch"
                                style="width: 100%"
                                @change="onModuleChange"
                                :loading="dTemp.mloading">
                            <el-option
                                    v-for="item in dTemp.modules"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-input v-else size="small"
                                  style="width: 100%"
                                  placeholder="请输入模块名称"
                                  :disabled="mode==1"
                                  v-model="dModule.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="dModule.type==''?'版本:':'路径:'">
                        <el-select size="small" v-model="dModule.constraint"
                                   :loading="dTemp.vloading"
                                   v-if="dModule.type==''"
                                   placeholder="请选择版本" style="width: 100%">
                            <el-option
                                    v-for="item in dTemp.versions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-input v-else size="small"
                                  style="width: 100%"
                                  placeholder="请输入路径"
                                  v-model="dModule.constraint"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <div v-if="mode==1">
                            <el-button type="primary" size="small" @click="onModify">修改</el-button>
                            <el-button size="small" @click="onDel">删除</el-button>
                        </div>
                        <el-button v-else type="primary" size="small"
                                   :disabled="dModule.name==''"
                                   style="width: 100%"
                                   @click="onAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            this.__funcInitData()
            if (this.dModule.name != "") {
                this.getVersion()
            }
        },
        props:["module", "options", "mode", "vo"],
        data() {
            return {
                dModule:{
                    type:"",
                    name:"",
                    constraint:"",
                },

                dTemp:{
                    modules:[],
                    versions:[],
                    mloading:false,
                    vloading:false,
                },

                dTimer: null,
            }
        },
        watch:{
        },
        methods:{
            onSearch: function (keyword) {
                if (!keyword || keyword.length < 2) return
                this.dTemp.mloading = true
                if (this.dTimer != null) {
                    clearTimeout(this.dTimer)
                }
                this.dTimer = setTimeout(() => {
                    this.search(keyword)
                    this.dTimer = null
                }, 1000)
            },
            onTypeChange:function (val) {
                this.dTemp.modules = []
                this.dModule.constraint = ''
                this.dTemp.versions = []
            },
            onModuleChange: function (val) {
                console.log(this.dModule)
                this.dModule.constraint = ''
                this.dTemp.versions = []
                this.getVersion()
            },
            onClose: function () {
                this.$emit("close")
            },
            onAdd:function () {
                this.$emit("add", this.__funcModule(), this.options)
            },
            onDel:function () {
                this.$emit("del", this.__funcModule(), this.options)
            },
            onModify:function () {
                this.$emit("modify", this.__funcModule(), this.options)
            },

            // request
            search: function (keyword) {
                this.$pdr.GET("/api/repo/module/search/simple", {module:keyword}, false).success((data) => {
                    if (data.modules) {
                        this.dTemp.modules = data.modules
                    } else {
                        this.dTemp.modules = []
                    }
                }).failure(() => {
                    this.dTemp.modules = []
                }).complete(() => {
                    this.dTemp.mloading = false
                }).go()
            },
            getVersion:function () {
                if (!this.dModule.name || this.dModule.name == "") {
                    this.dTemp.versions = []
                    return
                }
                this.$pdr.GET("/api/repo/module/versions", {module:this.dModule.name}, false).success((data) => {
                    if (data.versions) {
                        data.versions.splice(0, 0, "空版本")
                        this.dTemp.versions = data.versions
                    } else {
                        this.dTemp.versions = []
                    }
                }).failure(() => {
                    this.dTemp.versions = []
                }).before(() => {
                    this.dTemp.vloading = true
                }).complete(() => {
                    this.dTemp.vloading = false
                }).go()
            },

            // private
            __funcInitData() {
                if (this.module && (typeof this.module) == 'object') {
                    this.dModule.name = this.module.name
                    this.dModule.type = this.module.type ? this.module.type : ""
                    this.dModule.constraint = this.module.constraint
                } else {
                    this.dModule.name = ""
                    this.dModule.type = ""
                    this.dModule.constraint = ""
                }
            },
            __funcModule() {
                var obj = this.$util.deepCopy(this.dModule)
                if (obj.constraint == "空版本") obj.constraint = ""
                return obj
            }
        }
    }
</script>

<style lang="scss">
    .team-h-module-title {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #dddddd;
    }
    .team-h-module-close{
        margin-top: 14px;
        margin-right: 10px;
        cursor: pointer;
        color: #cccccc;
        float: right;
    }
    .comp-me-height {
        height: 300px;
    }
</style>