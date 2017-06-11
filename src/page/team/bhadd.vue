<template>
    <div style="padding: 8px">
        <el-row :gutter="10">
            <el-col :span="12">
                <!-- 操作框 -->
                <div class="team_h_operate">
                    <el-select v-model="dTeam.selected"
                               filterable placeholder="请选择团队"
                               :loading="dTeam.loading"
                               @change="onTeamChange"
                               :disabled="dHierarchy.loading"
                               style="width: 200px">
                        <el-option
                                v-for="item in dTeam.teams"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                    <span v-if="dHierarchy && dHierarchy.hierarchy"
                            style="font-size: 12px; color: blue">
                        当前版本:{{dHierarchy.hierarchy.version}}
                    </span>
                    <el-button size="small"
                               :disabled="dTeam.selected == '' || dHierarchy.loading"
                               @click="onAddModule"
                               style="float: right; margin-top: 12px">添加</el-button>
                    <el-button size="small"
                               type="primary"
                               @click="postHierarchy"
                               style="float: right; margin-top: 12px; margin-right: 10px">
                        提交
                    </el-button>
                </div>
                <div class="team_h_left">
                    <el-table :data="dHierarchy.modules" border
                              style="width: 100%"
                              v-loading.body="dHierarchy.loading">
                        <el-table-column prop="name" label="模块名">
                        </el-table-column>
                        <el-table-column prop="constraint" label="版本" with="100">
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template scope="scope">
                                <i class="el-icon-edit"
                                   style="cursor: pointer"
                                   @click="onEditModule(scope.$index, scope.row)"></i>
                                <i class="el-icon-delete"
                                   style="cursor: pointer; margin-left: 10px;"
                                   @click="onDelModule(scope.$index, scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
                <el-tabs type="border-card" v-if="dIssue.has">
                    <el-tab-pane label="间接依赖" v-if="dIssue.implicit.length > 0">
                        <el-table :data="dIssue.implicit"
                                  border style="width: 100%">
                            <el-table-column type="expand">
                                <template scope="props">
                                    <div style="font-size: 12px; color: #888888">{{props.row._detail}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="模块"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    label="版本条件"
                                    prop="_constraints">
                            </el-table-column>
                            <el-table-column label="操作" width="100" align="center">
                                <template scope="scope">
                                    <el-button size="mini" @click="onImplicitAdd(scope.$index, scope.row)">
                                        添加
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="依赖冲突" v-if="dIssue.dissatisfy.length > 0">
                        <el-table :data="dIssue.dissatisfy"
                                  border style="width: 100%">
                            <el-table-column type="expand">
                                <template scope="props">
                                    <div style="font-size: 12px; color: #888888">{{props.row._detail}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="模块"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    label="版本条件"
                                    prop="_constraints">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="不存在" v-if="dIssue.notfound.length > 0">
                        <el-table :data="dIssue.notfound"
                                  border style="width: 100%">
                            <el-table-column
                                    label="模块"
                                    prop="name">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="同层依赖" v-if="dIssue.interdependence.length > 0">
                        <el-table :data="dIssue.notfound"
                                  border style="width: 100%">
                            <el-table-column
                                    label="模块"
                                    prop="name">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <m-editor v-if="dEditor.open"
                  :mode="dEditor.mode" :vo="dEditor.vo"
                  :module="dEditor.module"
                  :options="dEditor.options"
                  @close="onModuleClose"
                  @del="onModuleDel"
                  @modify="onModuleModify"
                  @add="onModuleAdd"></m-editor>
    </div>
</template>

<script>
    import MyEditor from '../../comp/module_editor.vue'
    export default {
        created(){
            this.getTeam()
        },
        data() {
            return {
                dTeam:{
                    selected:"",
                    teams:[],
                    loading:false,
                },

                dHierarchy:{
                    hierarchy:null,
                    baseon: 0,
                    modules:[],
                    loading:false,
                },

                dIssue:{
                    has: false,
                    implicit: [],
                    dissatisfy: [],
                    notfound: [],
                    interdependence: []
                },

                dEditor:{
                    mode:1,
                    vo:true,
                    module:null,
                    options:null,
                    open:false,
                },
            }
        },
        components: {
            "m-editor":MyEditor,
        },
        computed:{
        },
        methods:{
            // Team event
            onTeamChange:function (val) {
                this.getBHierarchy()
            },

            // Hierarchy event
            onAddModule:function () {
                this.dEditor.mode = 0
                this.dEditor.module = null
                this.dEditor.vo = true
                this.dEditor.options = null
                this.dEditor.open = true
            },
            onEditModule:function (idx, row) {
                this.dEditor.mode = 1
                this.dEditor.module = row
                this.dEditor.vo = true
                this.dEditor.options = {idx:idx}
                this.dEditor.open = true
            },
            onDelModule:function (idx, row) {
                this.onModuleDel(row, {idx})
            },

            // Issue handler
            onImplicitAdd: function (idx, row) {
                var m = {name:row.name, constraint:row.constraint}
                var msg = this.__funcCheckModule(m)
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                this.dHierarchy.modules.push(m)
                this.dIssue.implicit.splice(idx, 1)
            },

            // Editor handler
            onModuleClose:function () {
                this.dEditor.open = false
            },
            onModuleDel:function (module, options) {
                var idx = -1
                if (options) {
                    idx = options.idx
                }
                if (idx < 0 ) return
                this.$confirm('确定要删除模块'+module.name+'吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dHierarchy.modules.splice(idx, 1)
                    this.dEditor.open = false
                }).catch(() => {
                });
            },
            onModuleModify:function (module, options) {
                var idx = -1
                if (options) {
                    idx = options.idx
                }
                if (idx < 0 ) return
                var m = this.dHierarchy.modules[idx]
                m.name = module.name
                m.constraint = module.constraint
                this.dEditor.open = false
            },
            onModuleAdd:function (module, options) {
                var msg = this.__funcCheckModule(module)
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                this.dHierarchy.modules.push(module)
                this.dEditor.open = false
            },

            // Request
            postHierarchy:function () {
                var param = {}
                param.team = this.dTeam.selected
                param.base_on = this.dHierarchy.hierarchy && this.dHierarchy.hierarchy.version ? this.dHierarchy.hierarchy.version : 0
                param.modules = this.__funcConvertModeuls()
                this.$pdr.POST("/api/bh/add", param, true, "提交").success(() => {
                    this.__funcClearIssue()
                    this.$confirm('提交成功，点击确定前往发布页面', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'success'
                    }).then(() => {
                        this.$pdr.goto("/team/bhmgr")
                    })
                }).fault((data) =>{
                    this.$pdr.toastError("有需待解决的问题！")
                    this.__funcDispatchIssue(data.info)
                }).go()
            },
            getTeam:function () {
                this.$pdr.GET("/api/team/list", null, false, "获取团队").success((data)=>{
                    this.dTeam.teams = data.teams
                }).before(() => {
                    this.dTeam.loading = true
                }).complete(()=>{
                    this.dTeam.loading = false
                }).failure((msg)=>{
                    this.dTeam.teams = []
                }).go()
            },
            getBHierarchy:function () {
                if (this.dTeam.selected=="") {
                    this.$pdr.toastError("未选择团队！")
                    return
                }

                this.$pdr.GET("/api/bh/latest", {team: this.dTeam.selected}, false, "获取").success((data) => {
                    if (data.hierarchy) {
                        this.dHierarchy.hierarchy = data.hierarchy
                        var arr = []
                        if (this.dHierarchy.modules) {
                            for (var key in data.hierarchy.modules) {
                                var aModule = data.hierarchy.modules[key]
                                arr.push(aModule)
                            }
                        }
                        this.dHierarchy.modules = arr
                        this.dHierarchy.hierarchy.modules = null
                    } else {
                        this.dHierarchy.modules = []
                        this.dHierarchy.hierarchy = {}
                    }
                }).failure(() => {
                    this.dHierarchy.modules = []
                    this.dHierarchy.hierarchy = {}
                }).before(() => {
                    this.dHierarchy.loading = true
                }).complete(() => {
                    this.dHierarchy.loading = false
                }).go()
            },

            // Private
            __funcConvertModeuls() {
                var obj = {}
                for (var idx in this.dHierarchy.modules) {
                    var aModule = this.dHierarchy.modules[idx]
                    obj[aModule.name] = aModule
                }
                return obj
            },
            __funcDispatchIssue(result) {
                if (!result) {
                    return
                }
                if (result.implicit) {
                    var implicit = []
                    for (var key in result.implicit) {
                        var impl = result.implicit[key]
                        if (impl.addition) {
                            if (impl.addition.detail) {
                                impl._detail = impl.addition.detail.join(", ")
                            }
                            if (impl.addition.constraints) {
                                impl._constraints = impl.addition.constraints.join(", ")
                            }
                        }
                        implicit.push(impl)
                    }
                    this.dIssue.implicit = implicit
                } else {
                    this.dIssue.implicit = []
                }

                if (result.dissatisfy && result.dissatisfy.length > 0) {
                    var dissatisfy = []
                    for (var i in result.dissatisfy) {
                        var dis = result.dissatisfy[i]
                        if (dis.cnostraints) dis._constraints = dis.constraints.join(", ")
                        if (dis.detail) dis._detail = dis.detail.join(", ")
                        dissatisfy.push(dis)
                    }
                    this.dIssue.dissatisfy = dissatisfy
                } else {
                    this.dIssue.dissatisfy = []
                }

                if (result.not_found && result.not_found.length > 0) {
                    var notfound = []
                    for (var i in result.not_found) {
                        var nf = result.not_found[i]
                        notfound.push({name:nf})
                    }
                    this.dIssue.notfound = notfound
                } else {
                    this.dIssue.notfound = []
                }

                if (result.interdependence && result.interdependence.length > 0) {
                    var interdependence = []
                    for (var i in result.interdependence) {
                        var nf = result.interdependence[i]
                        interdependence.push({name:nf})
                    }
                    this.dIssue.interdependence = interdependence
                } else {
                    this.dIssue.interdependence = []
                }

                this.dIssue.has = this.dIssue.implicit.length > 0 ||
                        this.dIssue.dissatisfy.length > 0 ||
                        this.dIssue.notfound.length > 0 ||
                        this.dIssue.interdependence.length > 0
            },
            __funcClearIssue() {
                this.dIssue.implicit = []
            },
            __funcCheckModule(m) {
                m.name = m.name.replace(/\s+/g, "")
                if (m.name == "") return "模块名不能为空！"
                for (var i in this.dHierarchy.modules) {
                    var md = this.dHierarchy.modules[i]
                    if (md.name == m.name) {
                        return "已存在名称为"+m.name+"的模块！"
                    }
                }
                return ""
            }
        }
    }
</script>