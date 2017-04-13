<template>
    <div class="comp-mask-parent comp-mask-show">
        <div class="comp-mask-container comp-login">
            <div class="comp-login comp-login-content">
                <div class="comp-login-top">
                    <span style="font-size: 17px">{{caption}}</span>
                </div>
                <div class="comp-login-input">
                    <input type="text" class="form-control" placeholder="用户名(邮箱)" v-model="account"/>
                </div>
                <div class="comp-login-input">
                    <input type="password" class="form-control"  placeholder="密码(6-12位字母或数字)" v-model="password"/>
                </div>
                <div class="comp-login-input">
                    <button class="btn btn-primary" type="button" style="width: 180px;" v-on:click="onLogin">登录</button>
                    <button class="btn" type="button" style="width: 60px; margin-left: 10px" v-on:click="closeView">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                caption:"登录",
                account:"",
                password:""
            }
        },
        computed: {

        },
        methods:{
            onLogin: function () {
                var v = this
                var pv = this.$parent
                var regEx = /\s+/g;
                var account = v.account.replace(regEx, "")
                var password = v.password.replace(regEx, "")
                if (account == "" || password == "") {
                    alert("用户名和密码不能为空！")
                    return
                }
                password = v.$util.md5(password)
                var param = {
                    account:account,
                    password:password
                }
                pv.postApi("/api/user/login", param, true, function (data) {
                    if (data.errno == 0 && data.user) {
                        pv.onCloseLogin(data.user)
                        return
                    }
                    alert("用户名或密码错误！")
                }, function (status, msg) {
                    alert("登录失败！")
                })
            },
            closeView:function () {
                this.$parent.onCloseLogin()
            }
        }

    }
</script>

<style lang="css">
    @import "../style/css/comp/mask.css";
    @import "../style/css/comp/login.css";
</style>