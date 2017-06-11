<template>
    <div style="padding: 10px">
        <el-card class="box-card">
            <div slot="header">
                <el-button style="float: right;"
                           type="text"
                           @click="onProjMgr">返回项目管理</el-button>
                <div style="font-size: 17px; text-align: center; clear: right">新增项目</div>
            </div>

            <m-proj-editor :mode=0
                           :proj="dProj"
                           @onAdd="onSubmit"
                           v-if="dHasTeam"></m-proj-editor>

            <div style="height: 100px; line-height: 100px; font-size: 18px; color: #aaaaaa; text-align: center"
                 v-else>
                参数错误
            </div>
        </el-card>
    </div>
</template>

<script>
    import MyProjEditor from './comp/proj_edit.vue'
    export default {
        created(){
            var team = this.$route.params.team
            if (team && team != "") {
                this.dProj = {team: team}
                this.dHasTeam = true
            }
        },
        data() {
            return {
                dProj:{},
                dHasTeam: false,
            }
        },
        components: {
            "m-proj-editor": MyProjEditor
        },
        methods:{
            // Submit
            onSubmit:function (obj) {
                var v = this
                var vp = this.$parent
                var msg = this.__funcCheckParam(obj)
                if (msg != "") {
                    vp.onToast("提示", msg, "red")
                    return
                }
                vp.postApi("/api/project/add", obj, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", "新增项目成功！")
                        v.onProjMgr()
                    } else if (data && data.msg) {
                        vp.onToast("提示", "新增项目失败："+data.msg, "red")
                    } else {
                        vp.onToast("提示", "新增项目失败！", "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "新增项目失败！Status:"+status+" message:"+msg, "red")
                })
            },
            onProjMgr:function () {
                this.$parent.onGoto("/proj/projmgr")
            },
            __funcCheckParam(param) {
                if (!param) return "请输入项目信息！"
                var reg = /^[0-9a-zA-Z\-\._]+$/
                if (!param.name || !reg.test(param.name))
                    return "项目名称必须由字母、数字以及-_.组成!"
                return ""
            }
        }
    }
</script>