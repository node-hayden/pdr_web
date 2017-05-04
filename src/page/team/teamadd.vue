<template>
    <div>
        <el-card class="team-add-container">
            <div slot="header" style="text-align: center">
                <span style="font-size: 17px; line-height: 36px">新增团队</span>
                <el-button type="text"
                           style="float: right"
                           @click="onTeamMgr">团队管理</el-button>
            </div>
            <div>
                <m-team-editor mode="0"
                               :team="dTeam"
                               @onAdd="onSubmit"
                               :refs="dRefs"></m-team-editor>
            </div>
        </el-card>
    </div>
</template>

<script>
    import MyTeamEditor from './comp/team_edit.vue'
    export default {
        created(){
            this.getRefs()
        },
        data() {
            return {
                dRefs:[],
                dTeam:{name:"", description:"", ref_git:""}
            }
        },
        components: {
            "m-team-editor":MyTeamEditor,
        },
        methods:{
            onSubmit:function (val) {
                var v = this
                var vp = this.$parent
                var msg = this.__funcCheckParam(val)
                if (msg != "") {
                    vp.onToast("提示", msg, "red")
                    return
                }
                vp.postApi("/api/team/add", val, true, function (data) {
                    if (data && data.errno == 0) {
                        v.$confirm('添加团队成功！', '提示', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'success'
                        }).then(() => {
                            v.onTeamMgr()
                        })
                    } else if (data && data.msg) {
                        vp.onToast("提示", "添加团队失败："+data.msg, "red")
                    } else {
                        vp.onToast("提示", "添加团队失败!", "red")
                    }
                })
            },
            onTeamMgr:function () {
                this.$parent.onGoto("/team/team")
            },
            getRefs:function () {
                var v = this
                var vp = this.$parent
                vp.getApi("/api/ref/list", null, false, function (data) {
                    if (data && data.errno == 0) {
                        v.dRefs = data.refs
                    } else {
                        v.dRefs = []
                    }
                }, function (status, msg) {
                    v.dRefs=[]
                })
            },

            __funcCheckParam(param) {
                if (!param) return "请输入团队信息！"
                var reg = /^[0-9a-zA-Z\-\._]+$/
                if (!param.name || !reg.test(param.name))
                    return "团队名称必须由字母、数字以及-_.组成!"
                return ""
            }
        }
    }
</script>

<style lang="scss">
    .team-add-container{
        width:400px;
        height:400px;
        margin: auto;
        position: absolute;
        z-index:3;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color:rgba(0,0,0,0);
        display:block;
    }
</style>