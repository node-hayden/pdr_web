<template>
    <div class="comp-topbar">
        <div class="comp-topbar-logo">
            <span style="font-size: 24px; cursor: pointer;" v-on:click="onHome">
                <B>Pandora</B>
            </span>
        </div>
        <div class="comp-topbar-profile" v-if=cIsLogin>
            <ul class="nav nav-pills">
                <li>
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        {{dUserProfile.account}}
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a v-on:click="onLogout">注销</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <span>{{dUserProfile.account}}</span>
        </div>
        <div class="comp-topbar-profile" v-else>
            <button type="button" class="btn btn-primary" v-on:click="onLogin">登录</button>
            <button type="button" class="btn" style="right: 0px" v-on:click="onLogin">注册</button>
        </div>
        <div class="comp-topbar-menu">
            <ul class="nav nav-pills">
                <li v-for="menu in dMenu">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        {{menu.caption}}
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li v-for="submenu in menu.sub_menus">
                            <router-link :to="submenu.path">{{submenu.caption}}</router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        created () {
            this.getUser()
        },
        data: function () {
            return {
                dUserProfile: null,
                dMenu: null,
            }
        },
        computed: {
            cIsLogin: function () {
                return this.dUserProfile != null && this.dUserProfile.account != null
            }
        },
        methods: {
            getUser: function () {
                var v = this
                var pv = v.$parent
                pv.getApi("/api/user", null, true, function (data) {
                    if (data.errno == 0 && data.user) {
                        v.dUserProfile = data.user
                        v.getMenu()
                    }
                }, function (status, msg) {

                })
            },
            getMenu: function () {
                var v = this
                var pv = v.$parent
                pv.getApi("/api/menu", null, true, function (data) {
                    if (data.errno == 0 && data.menu) {
                        data.menu.forEach(function (item) {
                            item.sub_menus.forEach(function (subitem) {
                                subitem.path = v.$rmp.map(item.name, subitem.name)
                            })
                        })
                        v.dMenu = data.menu
                    }
                }, function (status, msg) {

                })
            },
            onLogin: function () {
                var v = this
                this.$parent.onShowLogin(function (user) {
                    if (user) {
                        v.dUserProfile = user
                        v.getMenu()
                    }
                })
            },
            onRegister: function () {

            },
            onLogout: function () {
            },
            onHome:function () {
                this.$parent.onGoto("/")
            }
        }
    }
</script>

<style lang="css">
    @import "../style/css/comp/topbar.css";
</style>