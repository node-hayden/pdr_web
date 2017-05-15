<template>
    <div>
        <!-- 步骤条 -->
        <div class="pf-top-container">
            <el-steps center :space="120" :active="dActive" finish-status="success" style="clear: both;">
                <el-step title="基础信息"></el-step>
                <el-step title="Target"></el-step>
                <el-step title="分层信息"></el-step>
                <el-step title="依赖列表"></el-step>
            </el-steps>
            <el-button-group style="position: absolute; top: 36px;right: 15px">
                <el-button size="small" icon="arrow-left"
                           :disabled="dActive<=0"
                           @click="onPrevious">上一步</el-button>
                <el-button size="small" @click="onNext" v-if="dActive<3">
                    下一步<i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
                <el-button size="small" @click="onSave" v-else>
                    提交
                </el-button>
            </el-button-group>
        </div>

        <div class="pf-split-line"></div>

        <!-- 内容 -->
        <div class="pf-content-container">
            <!-- 步骤一 -->
            <div v-if="dActive==0">
                <el-form label-width="120px">
                    <el-form-item label="">
                        {{dBase.team}}-{{dBase.proj}}
                        <span style="margin-left: 15px;">
                            {{dBase.baseOn==null?"基于版本：无":(dBase.baseOn==0 ? "新建":"基于版本："+dBase.baseOn)}}
                        </span>
                    </el-form-item>
                    <el-form-item label="基础公共框架:">
                        <el-select v-model="dBase.bh"
                                   :loading="dOptions.bh.loading"
                                   style="width: 240px"
                                   @change="onBHChange"
                                   placeholder="请选择基础公共框架版本">
                            <el-option
                                    v-for="item in dOptions.bh.bhs"
                                    :key="item.version"
                                    :label="item.version"
                                    :value="item.version">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="头部信息:">
                        <el-input type="textarea" autosize v-model="dBase.header"></el-input>
                    </el-form-item>
                    <el-form-item label="尾部信息:">
                        <el-input type="textarea" autosize v-model="dBase.footer"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 步骤二 -->
            <div v-if="dActive==1">
                <el-table :data="dTargets" style="width: 100%" stripe>
                    <el-table-column  label="名称" width="240">
                        <template scope="scope">
                            <el-input size="mini" v-if="scope.row.isEditor"
                                      v-model="scope.row.name"></el-input>
                            <span v-else>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="基础公共框架" width="140" align="center">
                        <template scope="scope">
                            <input v-if="scope.row.isEditor" type="checkbox" v-model="scope.row.use_base" />
                            <span v-else>{{scope.row.use_base ? 'ON' : 'OFF'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" align="center">
                        <template scope="scope">
                            <i class="el-icon-plus"
                               style="color: green; cursor: pointer"
                               @click="onTargetAdd(scope.row)"
                               v-if="scope.row.isEditor"></i>
                            <i class="el-icon-delete"
                               style="color: red; cursor: pointer"
                               @click="onTargetDel(scope.$index)"
                               v-else></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 步骤三 -->
            <div v-if="dActive==2">
                <el-tabs>
                    <el-tab-pane v-for="(target, idx) in dTargets" v-if="!target.isEditor" :label="target.name">
                        <el-table :data="target.hierarchies" style="width: 100%" stripe>
                            <el-table-column  label="层级名称" width="240">
                                <template scope="scope">
                                    <el-input size="mini" v-if="scope.row.isEditor"
                                              v-model="scope.row.name">
                                    </el-input>
                                    <span v-else>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="相互依赖" width="140" align="center">
                                <template scope="scope">
                                    <el-switch v-if="scope.row.isEditor"
                                               on-color="#13ce66"
                                               v-model="scope.row.interdepend"
                                               off-color="#ff4949">
                                    </el-switch>
                                    <span v-else>{{scope.row.interdepend ? 'ON' : 'OFF'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100" align="center">
                                <template scope="scope">
                                    <i class="el-icon-plus"
                                       style="color: green; cursor: pointer"
                                       @click="onHierarchyAdd(idx, scope.row)"
                                       v-if="scope.row.isEditor"></i>
                                    <i class="el-icon-delete"
                                       style="color: red; cursor: pointer"
                                       @click="onHierarchyDel(idx, scope.$index)"
                                       v-else></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- 步骤四 -->
            <div v-if="dActive==3">
                <el-tabs>
                    <el-tab-pane v-for="(target, ti) in dTargets" v-if="!target.isEditor" :label="target.name">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-collapse>
                                    <el-collapse-item v-for="(h, hi) in target.hierarchies" v-if="!h.isEditor">
                                        <template slot="title">
                                            {{h.name}}
                                        </template>
                                        <el-table :data="h.modules" style="width: 100%" stripe>
                                            <el-table-column  label="模块名称">
                                                <template scope="scope">
                                                    <span>{{scope.row.name}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="版本/路径" align="left">
                                                <template scope="scope">
                                                    <span>{{scope.row.constraint}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="类型" width="100" align="center">
                                                <template scope="scope">
                                                    <span>{{scope.row.type == "" ? "version" : scope.row.type}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" width="100" align="center">
                                                <template scope="scope">
                                                    <i class="el-icon-edit"
                                                       style="cursor: pointer"
                                                       @click="onModuleEdit(ti, hi, scope.$index, scope.row)"></i>
                                                    <i class="el-icon-delete"
                                                       style="cursor: pointer; margin-left: 10px;"
                                                       @click="onModuleDel(ti, hi, scope.$index, scope.row)"></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>

                                        <el-button size="small"
                                                   style="width: 100%; margin-top: 10px"
                                                   @click="onModuleAdd(ti, hi)">添加</el-button>
                                    </el-collapse-item>
                                </el-collapse>
                                <el-collapse style="margin-top: 10px;" v-if="target.use_base">
                                    <el-collapse-item>
                                        <template slot="title">
                                            <span style="color: blue">
                                                基础公共框架
                                            </span>
                                        </template>
                                        <el-table :data="dOptions.bhm" style="width: 100%" stripe>
                                            <el-table-column  label="模块名称">
                                                <template scope="scope">
                                                    <span>{{scope.row.name}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="版本" align="left">
                                                <template scope="scope">
                                                    <span>{{scope.row.constraint}}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-col>

                            <el-col :span="12">
                                <div v-if="target.issue">
                                    <el-tabs type="card">
                                        <el-tab-pane v-if="target.issue.implicit.length>0"
                                                label="间接依赖" name="0">
                                            <el-table :data="target.issue.implicit" style="width: 100%" stripe>
                                                <el-table-column  label="名称">
                                                    <template scope="scope">
                                                        <span>{{scope.row.name}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column  label="版本条件">
                                                    <template scope="scope">
                                                        <span>{{scope.row.constraint}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="操作" width="100" align="center">
                                                    <template scope="scope">
                                                        <el-dropdown @command="onIssueAdd">
                                                            <el-button size="mini">
                                                                添加至<i class="el-icon-caret-bottom el-icon--right"></i>
                                                            </el-button>
                                                            <el-dropdown-menu slot="dropdown">
                                                                <el-dropdown-item v-for="val in scope.row._addList"
                                                                                  :command="ti+','+val+','+scope.$index">{{val}}</el-dropdown-item>
                                                            </el-dropdown-menu>
                                                        </el-dropdown>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane v-if="target.issue.dissatisfy.length>0"
                                                label="依赖冲突" name="1">
                                            <el-table :data="target.issue.dissatisfy" style="width: 100%" stripe>
                                                <el-table-column  label="名称">
                                                    <template scope="scope">
                                                        <span>{{scope.row.name}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column  label="版本条件">
                                                    <template scope="scope">
                                                        <span>
                                                            {{scope.row.addition && scope.row.addition.constraints ? scope.row.addition.constraints.join(', ') : ''}}
                                                        </span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane v-if="target.issue.not_found&&target.issue.not_found.length>0"
                                                label="未知依赖" name="2">
                                            <el-table :data="target.issue.not_found" style="width: 100%" stripe>
                                                <el-table-column  label="详情">
                                                    <template scope="scope">
                                                        <span>{{scope.row}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane v-if="target.issue.interdependence&&target.issue.interdependence.length>0"
                                                label="互相依赖" name="3">
                                            <el-table :data="target.issue.interdependence" style="width: 100%" stripe>
                                                <el-table-column  label="详情">
                                                    <template scope="scope">
                                                        <span>{{scope.row}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                        <el-tab-pane v-if="target.issue.duplicate&&target.issue.duplicate.length>0"
                                                label="重复依赖" name="4">
                                            <el-table :data="target.issue.duplicate" style="width: 100%" stripe>
                                                <el-table-column  label="详情">
                                                    <template scope="scope">
                                                        <span>{{scope.row}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </el-col>
                        </el-row>

                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <m-editor v-if="dEditor.open"
                  :mode="dEditor.mode" :vo="dEditor.vo"
                  :module="dEditor.module"
                  :options="dEditor.options"
                  @close="onEditorClose"
                  @del="onEditorDel"
                  @modify="onEditorModify"
                  @add="onEditorAdd"></m-editor>
    </div>
</template>

<script>
    import MyEditor from '../../comp/module_editor.vue'
    export default {
        created(){
            this.dBase.team = this.$route.params.team
            this.dBase.proj = this.$route.params.project
            this.getPodfile()
            this.getBH()
        },
        data(){
            return {
                dActive:0,
                dOrigin:null,
                dBase:{
                    team:"",
                    proj:"",
                    baseOn:null,
                    bh:null,
                    header:"",
                    footer:"",
                },
                dTargets:null,
                dOptions:{
                    bh:{
                        bhs:[],
                        loading:false,
                    },
                    bhm:null,
                },
                dEditor:{
                    mode:1,
                    vo:false,
                    module:null,
                    options:null,
                    open:false,
                },
            }
        },
        components:{
            "m-editor":MyEditor
        },
        methods:{
            // Top methods
            onPrevious:function () {
                this.dActive --
            },
            onNext:function () {
                var msg = ""
                switch (this.dActive) {
                    case 0:
                        msg = this.onSwitchTwo();
                        break;
                    case 1:
                        msg = this.onSwitchThree()
                        break;
                    case 2:
                        msg = this.onSwitchFour()
                        break;
                    default:
                        msg = "无法进入下一步！"
                }
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                this.dActive ++
            },

            // Setp 1 methods
            onBHChange:function (val) {
                for (var i in this.dOptions.bh.bhs) {
                    var m = this.dOptions.bh.bhs[i]
                    if (m.version == val) {
                        var bhm = []
                        for (var key in m.modules) {
                            bhm.push(m.modules[key])
                        }
                        this.dOptions.bhm = bhm
                        return
                    }
                }
            },
            onSwitchTwo:function () {
                if (this.dBase.team == "" || this.dBase.proj=="" || this.dBase.baseOn == null) {
                    return "无法获取信息，请刷新该页面后重试！"
                }
                if (this.dBase.bh == "") {

                }
                if (this.dTargets == null) {
                    if (this.dOrigin != null && this.dOrigin.targets) {
                        this.dTargets = this.$util.deepCopy(this.dOrigin.targets)
                    } else {
                        this.dTargets = []
                    }
                }
                var len = this.dTargets.length
                if (len == 0 || !this.dTargets[len -1].isEditor) {
                    this.dTargets.push(this.__funcTargetEditor())
                }
                return ""
            },

            // Step 2 methods
            onTargetAdd:function (row) {
                row.name = row.name.replace(/\s+/g, "")
                if (!/^[a-zA-Z]+$/.test(row.name)){
                    return
                }
                for (var i in this.dTargets) {
                    var target = this.dTargets[i]
                    if (target.isEditor) continue
                    if (target.name == row.name) {
                        this.$pdr.toastError("存在名称为"+row.name+"的Target!")
                        return
                    }
                }
                if (row.use_base) {
                    for (var i in this.dTargets) {
                        var target = this.dTargets[i]
                        if (target.isEditor) continue
                        target.use_base = false
                    }
                }
                row.isEditor = false
                this.dTargets.push(this.__funcTargetEditor())
            },
            onTargetDel:function (idx) {
                var target = this.dTargets[idx]
                this.$confirm('删除Target会丢失该Target所有信息，确定删除名称为'+target.name+'的Target吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dTargets.splice(idx, 1)
                }).catch(() => {
                });
            },
            onSwitchThree:function () {
                if (this.dTargets.length < 2) {
                    return "请至少创建一个Target"
                }
                var use_base = 0
                for (var i in this.dTargets) {
                    var target = this.dTargets[i]
                    if (target.use_base) use_base ++
                    if (use_base > 1) break
                }
                if (use_base > 1) return "最多只能有一个Target使用基础公共框架！"

                for (var i in this.dTargets) {
                    var target = this.dTargets[i]
                    if (!target.hierarchies) {
                        target.hierarchies = []
                    }
                    var len = target.hierarchies.length
                    if ( len == 0 ||
                        !target.hierarchies[len -1].isEditor) {
                        target.hierarchies.push(this.__funcHierarchyEditor())
                    }
                }
                return ""
            },

            // Step 3 methods
            onHierarchyAdd:function (ti, row) {
                row.name = row.name.replace(/\s+/g, "")
                if (row.name == "") return
                var target = this.dTargets[ti]
                for (var i in target.hierarchies) {
                    var h = target.hierarchies[i]
                    if (h.isEditor) continue
                    if (h.name == row.name) {
                        this.$pdr.toastError("已存在名为"+row.name+"的层级！")
                        return
                    }
                }
                row.isEditor = false
                target.hierarchies.push(this.__funcHierarchyEditor())
            },
            onHierarchyDel:function (ti, hi) {
                var t = this.dTargets[ti]
                var h = t.hierarchies[hi]
                this.$confirm('删除层级会丢失该层级所有信息，确定删除'+t.name+'下名称为'+h.name+'的层级吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.hierarchies.splice(hi, 1)
                }).catch(() => {
                });
            },
            onSwitchFour:function () {
                for (var i in this.dTargets) {
                    var target = this.dTargets[i]
                    if (target.isEditor) continue
                    for (var j in target.hierarchies) {
                        var h = target.hierarchies[j]
                        if (h.isEditor) continue
                        if (!h.modules) {
                            h.modules = []
                        } else if (!(h.modules instanceof Array)) {
                            var temp = h.modules
                            h.modules = []
                            for (var key in temp) {
                                h.modules.push(temp[key])
                            }
                        }
                    }
                }
                return ""
            },

            // Step 4 methods
            onModuleAdd:function (ti, hi) {
                this.dEditor.mode = 0
                this.dEditor.vo = false
                this.dEditor.module = {}
                this.dEditor.options = {ti, hi}
                this.dEditor.open = true
            },
            onModuleEdit:function (ti, hi, mi, obj) {
                obj = this.$util.deepCopy(obj)
                this.dEditor.mode = 1
                this.dEditor.vo = false
                this.dEditor.module = obj
                this.dEditor.options = {ti, hi, mi}
                this.dEditor.open = true
            },
            onModuleDel:function (ti, hi, mi, obj) {
                this.$confirm('确定要删除模块'+obj.name+'吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var t = this.dTargets[ti]
                    var h = t.hierarchies[hi]
                    h.modules.splice(mi, 1)
                    this.dEditor.open = false
                }).catch(() => {

                });
            },
            onEditorModify:function (module, options) {
                var t = this.dTargets[options.ti]
                var h = t.hierarchies[options.hi]
                var m = h.modules[options.mi]
                m.type = module.type
                m.constraint = module.constraint
                this.dEditor.open = false
            },
            onEditorAdd:function (module, options) {
                var target = this.dTargets[options.ti]
                var msg = this.__funcCheckModule(target, module, true)
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }

                if (target.use_base && this.dOptions.bhm != null) {
                    for (var i in this.dOptions.bhm) {
                        var m = this.dOptions.bhm[i]
                        if (m.name == module.name) {
                            this.$pdr.toastError("基础公共框架存在名称为"+module.name+"的模块！")
                            return
                        }
                    }
                }

                var h = target.hierarchies[options.hi]
                h.modules.push(module)
                this.dEditor.open = false
            },
            onEditorDel:function (module, options) {
                this.onModuleDel(options.ti, options.hi, options.mi, module)
            },
            onEditorClose:function () {
                this.dEditor.open = false
            },
            onSave:function () {
                this.$confirm('确定要提交信息吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postData()
                }).catch(() => {

                });
            },

            // Issue methods
            onIssueAdd:function (obj) {
                var arr = obj.split(",")
                var ti = this.$util.intify(arr[0], -1)
                var hn = arr[1]
                if (ti < 0) return
                var target = this.dTargets[ti]
                var h = null
                var hi = -1
                for (var i in target.hierarchies) {
                    var ht = target.hierarchies[i]
                    if (ht.name == hn) {
                        h = ht
                        hi = i
                        break
                    }
                }
                if (h == null) return

                var ii = this.$util.intify(arr[2], -1)
                if (ii < 0) return

                var issue = target.issue.implicit[ii]
                var addObj = {name:issue.name, constraint:issue.constraint}
                var msg = this.__funcCheckModule(target, addObj, true)
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                h.modules.push(addObj)
                target.issue.implicit.splice(ii, 1)
            },

            // Network
            getBH:function () {
                this.$pdr.GET("/api/bh/list", {team:this.dBase.team}, false).success((data) => {
                    if (data.hierarchies) {
                        this.dOptions.bh.bhs = data.hierarchies
                    } else {
                        this.dOptions.bh.bhs = []
                    }
                }).failure(() => {
                    this.dOptions.bh.bhs = []
                }).before(() => {
                    this.dOptions.bh.loading = true
                }).complete(() => {
                    this.dOptions.bh.loading = false
                }).go()
            },
            getPodfile: function () {
                var param = {
                    team:this.dBase.team,
                    project:this.dBase.proj
                }
                this.$pdr.GET("/api/podfile/latest", param, true).success((data) => {
                    console.log(data)
                    if (data.podfile) {
                        this.dOrigin = data.podfile
                        this.dBase.baseOn = this.dOrigin.version
                        this.dBase.bh = this.dOrigin.bhierarchy_version
                    } else {
                        this.dOrigin = {}
                        this.dBase.baseOn = 0
                    }
                }).failure(() => {
                    this.dOrigin = null
                    this.dBase.baseOn = null
                }).go()
            },
            postData:function () {
                var param = this.__funcBuildParam()
                this.$pdr.POST("/api/podfile/add", param, true, "保存Podfile").success((data) => {
                    this.$confirm('成功生成新版本Podfile，请前往Podfile管理界面进行发布！', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton:false,
                        type: 'warning'
                    }).then(() => {
                        this.$pdr.goto("/proj/pdofile")
                    }).catch(() => {

                    });
                }).fault((data) => {
                    this.$pdr.toastError("存在问题，请修复问题后重新提交！")
                    this.__funcDispatchIssue(data.issue)
                }).go()
            },

            // For private
            __funcTargetEditor() {
                return {isEditor:true, name:"", use_base:false, issue:null}
            },
            __funcHierarchyEditor() {
                return {isEditor:true, name:"", interdepend:false}
            },
            __funcCheckModule(target, module, checkDup) {
                module.name = module.name.replace(/\s+/g, "")
                if (module.name == "") return "模块名不能为空!"
                if (!checkDup) return ""
                for (var i in target.hierarchies) {
                    var h = target.hierarchies[i]
                    if (h.isEditor) continue
                    for (var j in h.modules) {
                        var m = h.modules[j]
                        if (m.name == module.name) {
                            return "层"+h.name+"已存在模块"+module.name+"!"
                        }
                    }
                }
                return ""
            },
            __funcBuildParam:function () {
                var param = {}
                param.team = this.dBase.team
                param.project = this.dBase.proj
                param.base_on = this.dBase.baseOn
                param.header = this.dBase.header
                param.footer = this.dBase.footer
                param.bhierarchy_version = this.dBase.bh
                param.targets = []
                for (var i in this.dTargets) {
                    var t = this.dTargets[i]
                    if (t.isEditor) continue
                    var target = {name:t.name, use_base:t.use_base}
                    target.hierarchies = []
                    for (var j in t.hierarchies) {
                        var h = t.hierarchies[j]
                        if (h.isEditor) continue
                        var hierarchy = {name:h.name, interdepend:h.interdepend}
                        hierarchy.modules = {}
                        for (var k in h.modules) {
                            var module = h.modules[k]
                            hierarchy.modules[module.name] = module
                        }
                        target.hierarchies.push(hierarchy)
                    }
                    param.targets.push(target)
                }
                return param
            },
            __funcDispatchIssue(issue) {
                for (var ti in this.dTargets) {
                    var t = this.dTargets[ti]
                    if (t.isEditor) continue
                    t.issue = null
                }
                for (var i in issue) {
                    var aIssue = issue[i]
                    var list = this.__funcGetAddList(aIssue.target, aIssue.hierarchy_name)
                    var aIssueResult = aIssue.module_result
                    var implicit = []
                    var dissatisfy = []
                    for (var key in aIssueResult.implicit) {
                        var impl = aIssueResult.implicit[key]
                        impl._addList = list
                        implicit.push(impl)
                    }
                    for (var key in aIssueResult.dissatisfy) {
                        dissatisfy.push(aIssueResult.dissatisfy[key])
                    }
                    aIssueResult.implicit = implicit
                    aIssueResult.dissatisfy = dissatisfy
                    for (var ti in this.dTargets) {
                        var t = this.dTargets[ti]
                        if (t.isEditor) continue
                        if (t.name == aIssue.target) {
                            t.issue = aIssueResult
                            break
                        }
                    }
                }
            },
            __funcGetAddList:function (target, hierarchy) {
                var list = []
                for (var i in this.dTargets) {
                    var t = this.dTargets[i]
                    if (t.isEditor || t.name != target) continue
                    for (var j in t.hierarchies) {
                        var h = t.hierarchies[j]
                        if (h.isEditor || h.name != hierarchy) continue

                        for (var x = j; x < t.hierarchies.length; x ++) {
                            var hh = t.hierarchies[x]
                            if (hh.isEditor) continue
                            list.push(hh.name)
                        }
                        break
                    }
                    break
                }
                if (list.length == 0) {
                    list.push("无法添加")
                }
                return list
            }
        }
    }
</script>

<style lang="css">
    .pf-top-container {
        height: 74px;
        line-height: 74px;
        padding: 0px 10px;
        margin: 10px;
    }

    .pf-split-line {
        height: 6px;
        border-bottom: 1px solid #cccccc;
        margin: 10px;
    }

    .pf-content-container {
        padding: 0px;
        margin: 10px;
    }
</style>