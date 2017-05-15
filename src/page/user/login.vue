<template>
    <div>
        <div class="p_login_container">
            <el-card class="box-card">
                <div slot="header" class="" style="height: 20px;text-align: center;padding: 0px">
                    <span style="font-size: 16px;">登录</span>
                </div>
                <div>
                    <el-input placeholder="帐号（邮箱）"
                            v-model="dUser.account">
                    </el-input>
                </div>
                <div style="margin-top: 15px">
                    <el-input type="password" placeholder="密码（6-20位字母和数字）"
                              v-model="dUser.password">
                    </el-input>
                </div>
                <div style="margin-top: 20px">
                    <el-button type="primary" style="width: 100%" @click="onLogin">登录</el-button>
                </div>
                <div style="height: 30px">
                    <el-button type="text" style="float: left" @click="onRegister">注册帐号</el-button>
                    <el-button type="text" style="float: right" @click="onForget">忘记密码</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
        },
        data: function () {
            return {
                dUser: {}
            }
        },
        methods: {
            onRegister:function () {
                this.$pdr.goto("/user/register")
            },
            onForget:function () {
                alert("未实现")
            },
            onLogin:function () {
                var msg = this.__funcCheckParam()
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                var param={}
                param.account = this.dUser.account
                param.password = this.$util.md5(this.dUser.password)
                this.$pdr.POST("/api/user/login", param, true, "登录").success(()=>{
                    this.$pdr.ROOT().onRefreshTopbar()
                    this.$pdr.goto("/")
                }).go()
            },
            __funcCheckParam: function () {
                var aUser = this.dUser
                if (!aUser || !aUser.account || !aUser.password) {
                    return "请正确输入帐号和密码!"
                }
                var regAccount = /^\S+@\S+(\.\S+)+$/
                var regPassword = /^[a-zA-Z0-9]{6,20}$/
                if (!regAccount.test(aUser.account)) {
                    return "帐号输入错误！"
                }
                if (!regPassword.test(aUser.password)){
                    return "密码输入错误！"
                }
                return ""
            }
        }
    }
</script>