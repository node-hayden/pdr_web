<template>
    <div>
        <div class="p_login_container">
            <el-card class="box-card">
                <div slot="header" class="" style="height: 20px;text-align: center;padding: 0px">
                    <span style="font-size: 16px;">注册</span>
                </div>
                <div>
                    <el-input placeholder="帐号（邮箱）"
                              v-model="dUser.account">
                    </el-input>
                </div>
                <div style="margin-top: 15px">
                    <el-input placeholder="显示名称（不可用于登录）"
                              v-model="dUser.name">
                    </el-input>
                </div>
                <div style="margin-top: 15px">
                    <el-input type="password" placeholder="密码（6-20位字母和数字）"
                              v-model="dUser.password">
                    </el-input>
                </div>
                <div style="margin-top: 15px">
                    <el-input type="password" placeholder="重复密码"
                              v-model="dUser.repeat">
                    </el-input>
                </div>
                <div style="margin-top: 20px">
                    <el-button type="primary" style="width: 100%" @click="onRegister">注册</el-button>
                </div>
                <div style="height: 30px">
                    <el-button type="text" style="float: right" @click="onLogin">返回登录</el-button>
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
                var v = this
                var vp = this.$parent
                var msg = v.__funcCheckParam()
                if (msg != "") {
                    vp.onToast("提示", msg, "red")
                    return
                }
                var param = v.$util.deepCopy(v.dUser)
                param.password = v.$util.md5(param.password)
                vp.postApi("/api/user/register", param, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", "注册成功!")
                        v.onLogin()
                    } else {
                        vp.onToast("提示", data.msg, "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "status:"+status + " message:"+msg, "red")
                })
            },
            onLogin:function () {
                this.$parent.onGoto("/user/login")
            },
            __funcCheckParam: function () {
                this.$util.trimObj(this.dUser)
                var aUser = this.dUser
                if (!aUser || !aUser.account || !aUser.password) {
                    return "请正确输入帐号和密码!"
                }
                if (!aUser.name || aUser.name == "") {
                    return "请输入显示名称！"
                }

                var regAccount = /^\S+@\S+(\.\S+)+$/
                var regPassword = /^[a-zA-Z0-9]{6,20}$/
                if (!regAccount.test(aUser.account)) {
                    return "帐号输入错误！"
                }
                if (!regPassword.test(aUser.password)){
                    return "密码输入错误！"
                }

                if (aUser.password != aUser.repeat) {
                    return "两次输入的密码不匹配！"
                }
                return ""
            }
        }
    }
</script>