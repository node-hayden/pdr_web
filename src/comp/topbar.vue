<template>
    <div class="comp-topbar">
        <div class="comp-topbar-logo">
            <span style="font-size: 26px; cursor: pointer;" v-on:click="onHome">
                <B>Pandora</B>
            </span>
        </div>
        <div class="comp-topbar-profile" v-if="cIsLogin">
            <el-dropdown @command="onDropdownCommand" trigger="click">
                <span class="el-dropdown-link" style="color: #888888; cursor: hand">
                    {{dUserProfile.name}}
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="account">帐号：{{dUserProfile.account}}</el-dropdown-item>
                    <el-dropdown-item command="role">角色：{{cRoleName}}</el-dropdown-item>
                    <el-dropdown-item command="logout" divided @click="onLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="comp-topbar-profile" v-else>
            <el-button type="primary" @click="onLogin">登录</el-button>
            <el-button style="margin-left: 2px" @click="onRegister">注册</el-button>
        </div>
        <div class="comp-topbar-menu">
            <el-menu :default-active="activeIndex"
                     style="background-color: #ffffff"
                     mode="horizontal"
                     :router=true
                     :unique-opened=true
                     @select="onHandleSelect">
                <el-submenu v-for="menu in dMenu" :index="menu.name">
                    <template slot="title">{{menu.caption}}</template>
                    <el-menu-item v-for="submenu in menu.sub_menus" :index="submenu.index">
                        {{submenu.caption}}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
    </div>
</template>

<script>
    export default {
        created () {
            this.getUser()
        },
        props: ['refreshData'],
        watch:{
            refreshData(){
                if (this.requesting) {
                    return
                }
                this.getUser()
            }
        },
        data: function () {
            return {
                dUserProfile: {},
                dMenu: {},
                activeIndex:"",
            }
        },
        computed: {
            cIsLogin: function () {
                return this.dUserProfile != null && this.dUserProfile.account != null
            },
            cRoleName: function () {
                if (!this.dUserProfile || ! this.dUserProfile.role) {
                    return "Unknown"
                }
                return this.$util.roleName(this.dUserProfile.role)
            }
        },
        methods: {
            getUser: function () {
                var v = this
                var pv = v.$parent
                v.requesting = true
                pv.getApi("/api/user", null, true, function (data) {
                    if (data.errno == 0 && data.user) {
                        v.dUserProfile = data.user
                        v.getMenu()
                    } else {
                        v.dUserProfile = {}
                        v.dMenu = {}
                        v.requesting = false
                    }
                }, function (status, msg) {
                    v.requesting = false
                })
            },
            getMenu: function () {
                var v = this
                var pv = v.$parent
                pv.getApi("/api/menu", null, true, function (data) {
                    if (data.errno == 0 && data.menu) {
                        data.menu.forEach(function (item) {
                            item.sub_menus.forEach(function (subitem) {
                                subitem.index = v.$rmp.map(item.name, subitem.name)
                            })
                        })
                        v.dMenu = data.menu
                    } else {
                        v.dMenu = {}
                    }
                    v.requesting = false
                }, function (status, msg) {
                    v.requesting = false
                })
            },
            onLogin: function () {
                this.$parent.onGoto("/user/login")
            },
            onDropdownCommand: function (cmd) {
                if (cmd && cmd == "logout") {
                    this.$confirm('确定退出当前帐号吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.onLogout()
                    }).catch(() => {

                    })
                }
            },
            onRegister: function () {
                this.$parent.onGoto("/user/register")
            },
            onLogout: function () {
                var v = this
                var vp = this.$parent
                vp.getApi("/api/user/logout", null, false, function (data) {
                    if (data && data.errno == 0) {
                        v.dUserProfile = {}
                        v.dMenu = {}
                        v.$parent.onGoto("/")
                    } else if (data && data.msg){
                        vp.onToast("提示", data.msg, "red")
                    } else {
                        vp.onToast("提示", "退出登录失败，请重试！", "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "退出登录失败，请重试！", "red")
                })
            },
            onHome: function () {
                this.$parent.onGoto("/")
            },
            onHandleSelect:function (key, keypath) {
                console.log(key+" "+keypath)
            }
        }
    }
</script>