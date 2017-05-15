<template>
    <div v-loading.fullscreen.lock="showLoading">
        <!-- 顶部导航栏 -->
        <m-topbar :refreshData="refreshTopbar"></m-topbar>
        <!-- 路由容器 -->
        <div class="index-body">
            <router-view
                    class="view"
                    keep-alive
                    transition
                    transition-mode="out-in">
            </router-view>
        </div>
    </div>
</template>

<script>
    import MyTopBar from './comp/topbar.vue'
    export default {
        created(){
            this.$pdr.registerRoot(this)
        },
        data: function () {
            return {
                "requestCount": 0,
                "showLogin": false,
                "refreshTopbar": false,
                dLoginCallback: null
            }
        },
        components: {
            "m-topbar":MyTopBar
        },
        computed: {
            showLoading: function () {
                return this.requestCount > 0
            }
        },
        methods: {
            onGoto:function (path) {
                this.$router.push({path:path})
            },
            onRefreshTopbar: function () {
                var v = this
                var aDate = new Date();
                v.refreshTopbar = aDate.getTime()
            },
            getApi: function (url, params, showLoader, success, failure) {
                var v = this
                if (showLoader) {
                    v.$api.get(url, params, v.__packingSuccess(success, url), failure, v.__before, v.__complete)
                } else {
                    v.$api.get(url, params, v.__packingSuccess(success, url), failure)
                }
            },
            postApi: function (url, params, showLoader, success, failure) {
                var v = this
                if (showLoader) {
                    v.$api.post(url, params, v.__packingSuccess(success, url), failure, v.__before, v.__complete)
                } else {
                    v.$api.post(url, params, v.__packingSuccess(success, url), failure)
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

            // Private
            __before: function () {
                this.requestCount ++
            },
            __complete: function () {
                this.requestCount --
            },
            __packingSuccess: function (success, url) {
                var v = this
                return function (data) {
                    if (data && data.errno == 200 && url!="/api/user" && url!="/api/menu")  {
                        v.onGoto("/")
                        v.onRefreshTopbar()
                    } else if (success) {
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
</style>