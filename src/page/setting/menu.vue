<template>
    <div>
        <div class="st_menu_tree">
            <div class="st_menu_tree_content">
                <el-tree :data="tree"
                         :props="defaultProps"
                         @node-click="onMenuClick"
                         empty-text="暂无菜单数据"
                         node-key="node_key"
                         :highlight-current=true>

                </el-tree>
            </div>
            <div class="st_menu_tree_bc">
                <el-button type="primary" style="width: 110px" @click="onAddMenu">新增菜单</el-button>
                <el-button :disabled="!dSelected" style="width: 110px">删除菜单</el-button>
            </div>
        </div>
        <div class="st_menu_detail">
            <el-card class="st_menu_detail_card">
                <div slot="header">
                    <span style="line-height: 24px; font-size: 17px">菜单设置{{cTitle}}</span>
                    <el-button style="float: right; margin-top: 0px" type="primary" @click="onSubmit">提交</el-button>
                </div>
                <fieldset>
                    <legend><span style="font-size: 16px; color: blue">一级菜单</span></legend>
                    <div style="color: #777777">
                        <span>名称：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedFirst.name" v-model="dSelectedFirst.name"></el-input>
                        <span style="margin-left: 20px">显示：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedFirst.caption" v-model="dSelectedFirst.caption"></el-input>
                    </div>
                    <div style="margin-top: 15px; height: 40px; line-height: 40px;color: #777777">
                        <span>排序：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedFirst.order" v-model="dSelectedFirst.order"></el-input>
                    </div>

                    <legend style="margin-top: 15px"><span style="font-size: 16px; color: blue">二级菜单</span></legend>
                    <div style="color: #777777">
                        <span>名称：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedSecond.name" v-model="dSelectedSecond.name"></el-input>
                        <span style="margin-left: 20px">显示：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedSecond.caption" v-model="dSelectedSecond.caption"></el-input>
                    </div>
                    <div style="margin-top: 15px;color: #777777">
                        <span>排序：</span>
                        <el-input type="text" style="width: 150px" :value="dSelectedSecond.order" v-model="dSelectedSecond.order"></el-input>
                        <span style="margin-left: 20px">角色：</span>
                        <el-select v-model="dSelectedRole" placeholder="请选择" style="width: 150px">
                            <el-option
                                    v-for="item in dRole"
                                    :label="item.role_name"
                                    :value="item.role_value">
                            </el-option>
                        </el-select>
                    </div>
                </fieldset>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            this.getRoles()
            this.getMenuData()
        },
        data() {
            return {
                tree: [],
                dRole: [],
                defaultProps: {
                    children: 'sub_menus',
                    label: 'caption'
                },
                dSelectedFirst: {},
                dSelectedSecond: {},
                dSelected: false,
                dAddMode: false,
                dSelectedRole: ''
            };
        },
        computed: {
            cTitle:function () {
                var v = this
                if (v.dAddMode) {
                    return "-新增"
                }
                var title = ""
                if (v.dSelectedFirst && v.dSelectedFirst.caption) {
                    title += ("-"+v.dSelectedFirst.caption)
                }
                if (v.dSelectedSecond && v.dSelectedSecond.caption) {
                    title += ("-"+v.dSelectedSecond.caption)
                }
                return title
            }
        },
        methods: {
            onMenuClick(data) {
                this.__funcSetCurrentMenu(data.node_key)
            },
            onAddMenu:function () {
                this.dSelected = false
                this.dAddMode = true
                this.dSelectedFirst = {}
                this.dSelectedSecond = {}
                this.dSelectedRole = ''
            },
            onSubmit:function () {
                console.log(this.dSelectedFirst)
                var v = this
                var vp = this.$parent
                var path = "/api/menu/"
                path += v.dAddMode ? "add" : "update"
                var operate = v.dAddMode ? "增加" : "修改"
                var param = v.dSelectedFirst
                v.dSelectedSecond.role = parseInt(v.dSelectedRole)
                param.sub_menus = [v.dSelectedSecond]
                vp.postApi(path, param, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", operate+"菜单成功!")
                        v.getMenuData()
                    }
                }, function (status, msg) {

                })
            },
            getRoles: function () {
                var v = this
                var vp = this.$parent
                vp.getApi("/api/user/roles", {}, true, function (data) {
                    if (data && data.errno == 0 && data.role) {
                        v.dRole = data.role
                        console.log(data)
                    }
                }, function (status, msg) {

                })
            },
            getMenuData:function () {
                var v = this
                var vp = this.$parent
                vp.getApi("/api/menu/all", {}, true, function (data) {
                    if (data && data.errno == 0 && data.menu) {
                        v.__funcFillNodeKey(data.menu)
                    }
                }, function (status, msg) {

                })
            },
            __funcFillNodeKey:function (menus) {
                var v = this
                menus.forEach(function (first) {
                    first.node_key = "1_"+first.name
                    if (!first.sub_menus) {
                        return
                    }
                    first.sub_menus.forEach(function (second) {
                        second.node_key = "2_"+first.name+"_"+second.name
                    })
                })
                v.tree = menus
            },
            __funcSetCurrentMenu: function (key) {
                var v = this
                if (!key || key.indexOf("2") != 0){
                    v.dSelected = false
                    return
                }
                v.dSelected = true
                var menus = v.tree
                if (!menus) return
                var arr = key.split("_")
                var firstName = arr[1]
                var secondName = arr[2]
                for (var i in menus) {
                    var first = menus[i]
                    if (first.name != firstName || !first.sub_menus) {
                        continue
                    }
                    for (var j in first.sub_menus) {
                        var second = first.sub_menus[j]
                        if (second.name != secondName) {
                            continue
                        }
                        v.dSelectedFirst = v.$util.deepCopy(first, ["sub_menus"])
                        v.dSelectedSecond = v.$util.deepCopy(second)
                        v.dAddMode = false
                        v.dSelected = true
                        v.dSelectedRole = v.dSelectedSecond.role
                        return
                    }
                }
            },
        }
    };
</script>