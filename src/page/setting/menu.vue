<template>
    <div>
        <div class="st_menu_opc">
            <div class="st_menu_op">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-dropdown style="width: 100%" @command="onAdd">
                            <el-button type="primary" size="small"
                                       style="width: 100%">
                                新增菜单<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">一级菜单</el-dropdown-item>
                                <el-dropdown-item command="2" :disabled="dFirst.selected==''">二级菜单</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="12">
                        <el-dropdown style="width: 100%" @command="onDel">
                            <el-button type="danger"
                                       size="small"
                                       style="width: 100%"
                                       :disabled="dAddMode">
                                删除选中<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1" :disabled="dFirst.selected==''">
                                    一级菜单:{{dFirst.sel!=null?dFirst.sel.caption:''}}
                                </el-dropdown-item>
                                <el-dropdown-item command="2" :disabled="dSecond.selected==''">
                                    二级菜单:{{dSecond.sel!=null?dSecond.sel.caption:''}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </div>
            <div style="margin-top: 10px">
                <el-tree :data="dMenu.menus" :props="dMenu.props" @node-click="onMenuClick"></el-tree>
            </div>
        </div>

        <div class="st_menu_cc">
            <el-row :gutter="10">
                <el-col :span="12">
                    <div class="st_menu_content" v-if="dFirst.show">
                        <div class="st_menu_content_title">
                            一级菜单
                        </div>
                        <div style="margin: 0px 10px">
                            <el-form label-width="80px">
                                <el-form-item label="显示名称">
                                    <el-input size="small"
                                              :disabled="!dFirst.edit"
                                              v-model="dFirst.sel.caption"></el-input>
                                </el-form-item>
                                <el-form-item label="菜单名称">
                                    <el-input size="small"
                                              :disabled="!dAddMode || !dFirst.edit"
                                              v-model="dFirst.sel.name"></el-input>
                                </el-form-item>
                                <el-form-item label="排序编码">
                                    <el-input-number size="small"
                                                     :min="1"
                                                     :disabled="!dFirst.edit"
                                                     v-model="dFirst.sel.order"></el-input-number>
                                </el-form-item>
                                <el-form-item label="" v-if="dFirst.edit">
                                    <el-button size="small"
                                               style="width: 100px"
                                               @click="onFirstChange"
                                               type="primary">
                                        {{dAddMode?'添加':'修改'}}
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="st_menu_content" v-if="dSecond.show">
                        <div class="st_menu_content_title">
                            二级菜单
                        </div>
                        <div style="margin: 0px 10px">
                            <el-form label-width="80px">
                                <el-form-item label="显示名称">
                                    <el-input size="small" v-model="dSecond.sel.caption"></el-input>
                                </el-form-item>
                                <el-form-item label="菜单名称">
                                    <el-input size="small" :disabled="!dAddMode" v-model="dSecond.sel.name"></el-input>
                                </el-form-item>
                                <el-form-item label="排序编码">
                                    <el-input-number size="small" :min="1" v-model="dSecond.sel.order"></el-input-number>
                                </el-form-item>
                                <el-form-item label="角色设置">
                                    <el-select v-model="dSecond.sel.role"
                                               style="width: 100%"
                                               placeholder="请选择角色">
                                        <el-option
                                                v-for="item in dRoles"
                                                :key="item.role"
                                                :label="item.roleName"
                                                :value="item.role">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="" v-if="dSecond.edit">
                                    <el-button size="small"
                                               style="width: 100px"
                                               @click="onSecondChange"
                                               type="primary">
                                        {{dAddMode?'添加':'修改'}}
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            this.getMenus()
            this.dRoles = this.$util.roleList([0])
        },
        data() {
            return {

                dRoles:null,

                dMenu:{
                    menus: [],
                    props:{
                        label:"caption",
                        children:"sub_menus"
                    },
                    loading:false
                },

                dFirst:{
                    selected:"",
                    sel:null,
                    edit: false,
                    show:false
                },

                dSecond:{
                    selected:"",
                    sel:null,
                    edit: false,
                    show:false
                },

                dAddMode:true,
            };
        },
        computed: {

        },
        methods: {
            onAdd:function (level) {
                if (level < 1 || level > 2) return
                this.dAddMode = true
                if (level == 1) {
                    this.dFirst.sel = {
                        name:'',
                        order:1,
                        caption:''
                    }
                    this.dFirst.selected = ''
                    this.dFirst.show = true
                    this.dFirst.edit = true

                    this.dSecond.selected = ''
                    this.dSecond.sel = null
                    this.dSecond.show = false
                    this.dSecond.edit = false
                } else {
                    this.dFirst.edit = false

                    this.dSecond.selected = ''
                    this.dSecond.sel = {
                        name:'',
                        caption:'',
                        order:1,
                        sync:false,
                        role:1
                    }
                    this.dSecond.show = true
                    this.dSecond.edit = true
                }


                if (level == 1) {


                } else {
                    this.dFirst.edit = false


                }
            },
            onDel:function (level) {
                var first = this.dFirst.selected
                var second = level == 2 ? this.dSecond.selected : null
                var msg = level == 1 ? '确定删除名称为“'+this.dFirst.sel.caption+'”的一级菜单吗？' :
                    '确定删除一级菜单“'+this.dFirst.sel.caption+'”下的二级菜单“'+this.dSecond.sel.caption+'”吗？'
                this.$confirm(msg, '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMenu(first, second)
                }).catch(() => {})
            },
            onMenuClick:function (data, node) {
                this.dAddMode = false
                var level = node.level
                if (level < 1 || level > 2 ) return
                var first = level == 1 ? data : node.parent.data

                this.dFirst.sel = {
                    name:first.name,
                    order:first.order,
                    caption:first.caption
                }
                this.dFirst.selected = first.name
                this.dFirst.show = true

                if (level == 1) {
                    this.dFirst.edit = true

                    this.dSecond.selected = ''
                    this.dSecond.sel = null
                    this.dSecond.show = false
                    this.dSecond.edit = false
                } else {
                    this.dFirst.edit = false

                    this.dSecond.selected = data.name
                    this.dSecond.sel = {
                        name:data.name,
                        caption:data.caption,
                        order:data.order,
                        sync:data.sync,
                        role:data.role
                    }
                    this.dSecond.show = true
                    this.dSecond.edit = true
                }
            },
            onFirstChange:function () {
                var msg = '确认'+(this.dAddMode ? '添加':'修改')+'菜单“'+this.dFirst.sel.caption+'”?'
                var param = {
                    caption:this.dFirst.sel.caption,
                    name:this.dFirst.sel.name,
                    order:this.dFirst.sel.order
                }
                this.$confirm(msg, '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.dAddMode) {
                        this.addMenu(param, 1)
                    } else {
                        this.modifyMenu(param, 1)
                    }
                }).catch(() => {})
            },
            onSecondChange:function () {
                var msg = '确认'+(this.dAddMode ? '添加':'修改')+'菜单“'+this.dFirst.sel.caption+'-'+this.dSecond.sel.caption+'”?'
                var param = {
                    name:this.dFirst.sel.name,
                    sub_menus:[{
                        name:this.dSecond.sel.name,
                        caption:this.dSecond.sel.caption,
                        order:this.dSecond.sel.order,
                        role:this.dSecond.sel.role,
                        sync:this.dSecond.sel.sync
                    }]
                }
                this.$confirm(msg, '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.dAddMode) {
                        this.addMenu(param, 2)
                    } else {
                        this.modifyMenu(param, 2)
                    }
                }).catch(() => {})
            },
            
            // Network
            getMenus:function () {
                this.$pdr.GET("/api/menu/all", null, true, "获取菜单").success((data) => {
                    this.dMenu.menus = data.menu
                }).failure(() => {
                    this.dMenu.menus = []
                }).go()
            },
            delMenu:function (first, second) {
                var param = {first:first}
                if (second) param.second = second
                this.$pdr.GET('/api/menu/del', param, true, '删除菜单').success(() => {
                    this.$pdr.toast("删除菜单成功")
                    this.getMenus()
                    this.__funcClearFirst()
                    this.__funcClearSecond()
                }).go()
            },
            addMenu:function (param, level) {
                var path = '/api/menu/add?level=' + level
                this.$pdr.POST(path, param, true, '添加菜单').success(() => {
                    this.$pdr.toast("添加菜单成功")
                    this.getMenus()
                    this.__funcClearFirst()
                    this.__funcClearSecond()
                }).go()
            },
            modifyMenu:function (param, level) {
                var path = '/api/menu/update?level=' + level
                this.$pdr.POST(path, param, true, '修改菜单').success(() => {
                    this.$pdr.toast("修改菜单成功")
                    this.getMenus()
                    this.__funcClearFirst()
                    this.__funcClearSecond()
                }).go()
            },

            // Private
            __funcClearFirst:function () {
                this.dFirst.selected = ''
                this.dFirst.sel = null
                this.dFirst.edit = false
                this.dFirst.show = false
            },
            __funcClearSecond:function () {
                this.dSecond.selected = ''
                this.dSecond.sel = null
                this.dSecond.edit = false
                this.dSecond.show = false
            }
        }
    };
</script>

<style lang="scss">
    .st_menu_opc {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 260px;
    }

    .st_menu_cc {
        position: absolute;
        top: 10px;
        left: 280px;
        right: 10px;
    }

    .st_menu_op {
        padding: 15px;
        border: 1px solid #cccccc;
        border-radius: 4px;
    }

    .st_menu_content {
        height: 360px;
        border: 1px solid #cccccc;
        border-radius: 4px;
    }

    .st_menu_content_title {
        border-bottom: 1px solid #cccccc;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 17px;
        color: #888888;
        margin-bottom: 10px;
    }

</style>