<template>
    <div style="padding: 8px">
        <el-row :gutter="10">
            <el-col :span="12">
                <div class="team_h_operate">
                    <el-select v-model="dSelTeam"
                               filterable placeholder="请选择团队"
                               :loading="dSelTeamReqing"
                               @change="onChange"
                               :disabled="cSelTeamDisable"
                               style="width: 200px">
                        <el-option
                                v-for="item in dTeams"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                    <el-button size="small"
                               :disabled="cAddBtnDisable"
                               @click="onAdd"
                               style="float: right; margin-top: 12px">+</el-button>
                    <el-button size="small"
                               type="primary"
                               @click="postHierarchy"
                               style="float: right; margin-top: 12px; margin-right: 10px">
                        提交
                    </el-button>
                </div>
                <div class="team_h_left">
                    <el-table :data="dModules" border style="width: 100%" @cell-dblclick="onDBClick"
                              v-loading.body="dReqing">
                        <el-table-column prop="name" label="模块名">
                        </el-table-column>
                        <el-table-column prop="constraint" label="版本" with="100">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12"><div style="background-color: aquamarine">
                {{dResult}}
            </div></el-col>
        </el-row>
        <m-module v-if="cShowOperate"
                  @submit="onModuleChange"
                  @close="onModuleClose"
                  @del="onModuleDel"
                  :moduleData="dSelModule"></m-module>
    </div>
</template>

<script>
    import MyModule from "./comp/module.vue"
    export default {
        created(){
            this.getTeam()
        },
        data() {
            return {
                dSelTeam: "",
                dSelTeamReqing: false,
                dReqing: false,
                dTeams:[],
                dModules:[],
                dHierarcyh:{},
                dSelModule: null,
                dResult:null
            }
        },
        components: {
            "m-module":MyModule
        },
        computed:{
            cSelTeamDisable:function () {
                return this.dReqing
            },
            cAddBtnDisable:function () {
                return this.dSelTeam == "" || this.dReqing
            },
            cShowOperate:function () {
                return this.dSelModule != null
            }
        },
        methods:{
            onChange:function (val) {
                this.getBHierarchy()
            },
            onAdd:function () {
                var obj = {}
                obj.mode = 0
                obj.title = "新增模块"
                this.__funcShowOperate(obj)
            },
            onDBClick: function (row, column, cell, event) {
                if (row) {
                    var obj = {}
                    obj.name = row.name
                    obj.constraint = row.constraint
                    obj.mode = 1
                    obj.title = "模块修改"
                    this.__funcShowOperate(obj)
                }
            },
            onModuleChange:function (module) {
                var exists = null
                for (var idx in this.dModules) {
                    var aModule = this.dModules[idx]
                    if (aModule.name == module.name) {
                        exists = aModule
                        break
                    }
                }
                if (module.mode == 1) {
                    if (exists != null) {
                        exists.constraint = module.constraint
                    }
                } else if (module.mode == 0) {
                    if (exists != null) {
                        this.$parent.onToast("提示", "存在"+module.name, "red")
                        return
                    }
                    if (this.dModules) {
                        this.dModules.push(this.$util.deepCopy(module))
                    }
                }
                this.dSelModule = null
            },
            onModuleClose:function () {
                this.dSelModule = null
            },
            onModuleDel:function (module) {
                console.log(module)
            },
            postHierarchy:function () {
                var v = this
                var vp = this.$parent
                var param = this.dHierarchy
                param.modules = v.__funcConvertModeuls()
                vp.postApi("/api/bh/add", param, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", data.msg)
                        v.dResult = null
                    } else if (data && data.info) {
                        vp.onToast("提示", data.msg, "red")
                        v.dResult = data.info
                    } else {
                        vp.onToast("提示", data.msg, "red")
                    }
                }, function (status, msg) {
                    console.log(status+" "+msg)
                })
            },
            getTeam:function () {
                var v = this
                var vp = this.$parent
                v.dSelTeamReqing = true
                vp.getApi("/api/team/list", null, false, function (data) {
                    if (data && data.errno == 0 && data.teams) {
                        v.dTeams = data.teams
                    } else {
                        v.dTeams = []
                    }
                    v.dSelTeamReqing = false
                }, function (status, msg) {
                    v.dTeams = []
                    v.dSelTeamReqing = false
                })
            },
            getBHierarchy:function () {
                var v = this
                var vp = this.$parent
                if (v.dSelTeam=="") {
                    vp.onToast("提示", "未选择团队！", "red")
                    return
                }
                v.dReqing = true
                vp.getApi("/api/bh/latest", {team: v.dSelTeam}, false, function (data) {
                    if (data && data.hierarchy) {
                        v.dHierarchy = data.hierarchy
                        var arr = []
                        if (v.dHierarchy.modules) {
                            for (var key in v.dHierarchy.modules) {
                                var aModule = v.dHierarchy.modules[key]
                                arr.push(aModule)
                            }
                        }
                        v.dModules = arr
                        v.dHierarchy.modules = null
                    } else {
                        v.dModules = []
                        v.dHierarchy = {}
                    }
                    v.dReqing = false
                }, function (status, msg) {
                    v.dReqing = false
                    v.dHierarchy = {}
                    v.dModules = []
                })
            },
            __funcShowOperate:function (obj) {
                this.dSelModule = obj
            },
            __funcConvertModeuls() {
                var obj = {}
                for (var idx in this.dModules) {
                    var aModule = this.dModules[idx]
                    obj[aModule.name] = aModule
                }
                return obj
            }
        }
    }
</script>