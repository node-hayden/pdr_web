<template>
    <div>
        <topbar></topbar>
        <div class="index-body">
            <router-view
                    class="view"
                    keep-alive
                    transition
                    transition-mode="out-in">
            </router-view>
        </div>
        <login-view v-if=showLogin></login-view>
        <loader-view v-if=showLoader></loader-view>
    </div>
</template>

<script>
    import Topbar from './comp/topbar.vue'
    import LoderView from './comp/loader.vue'
    import LoginView from './comp/login.vue'
    export default {
        created(){

        },
        data: function () {
            return {
                "requestCount": 0,
                "showLogin": false,
                dLoginCallback: null
            }
        },
        components: {
            "topbar":Topbar,
            "loader-view": LoderView,
            "login-view": LoginView
        },
        computed: {
            showLoader: function () {
                return this.requestCount > 0
            }
        },
        methods: {
            onGoto:function (path) {
                this.$router.push({path:path})
            },
            onCloseLogin:function (user) {
                this.showLogin = false
                if (user && this.dLoginCallback != null) {
                    var t = typeof this.dLoginCallback
                    if (t == 'function'){
                        this.dLoginCallback(user)
                    }
                }
                this.dLoginCallback = null
            },
            onShowLogin:function (callback) {
                this.showLogin = true
                this.dLoginCallback = callback
            },
            getApi: function (url, params, showLoader, success, failure) {
                var v = this
                if (showLoader) {
                    v.$api.get(url, params, v.__packingSuccess(success), failure, v.__before, v.__complete)
                } else {
                    v.$api.get(url, params, v.__packingSuccess(success), failure)
                }
            },
            postApi: function (url, params, showLoader, success, failure) {
                var v = this
                if (showLoader) {
                    v.$api.post(url, params, v.__packingSuccess(success), failure, v.__before, v.__complete)
                } else {
                    v.$api.post(url, params, v.__packingSuccess(success), failure)
                }
            },
            onToast:function (title, detail, color) {
                const h = this.$createElement;
                var colorNew = color ? color : "#aaaaaa"
                this.$notify({
                    title: title,
                    message: h('p', { style: 'color: '+colorNew}, detail)
                });
            },
            __before: function () {
                this.requestCount ++
            },
            __complete: function () {
                this.requestCount --
            },
            __packingSuccess: function (success) {
                var v = this
                return function (data) {
                    if (data.errno == 200) {
                        v.onGoto("/")
                    }
                    if (success) {
                        success(data)
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "./style/style";
</style>

<style lang="css">
    @import "./style/css/base.css";
    @import "./style/css/page/index.css";
</style>