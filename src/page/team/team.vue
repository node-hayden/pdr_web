<template>
    <div style="padding: 10px">
        <el-card class="box-card">
            <div slot="header">
                <el-select v-model="dSelTeam" filterable placeholder="请选择团队" @change="onTeamChange">
                    <el-option
                            v-for="item in dTeams"
                            :label="item.name"
                            :value="item.name">
                    </el-option>
                </el-select>
                <el-button-group style="float: right">
                    <el-button @click="onRefresh">刷新</el-button>
                    <el-button icon="plus" @click="onAdd"></el-button>
                </el-button-group>
            </div>
            <el-tabs v-if="cShow" v-model="dSelTab">
                <el-tab-pane label="信息修改" name="first">
                    <m-team-editor :refs="dRefs" mode="1"
                                   @onModify="onTeamModify"
                                   :team="dSelTeamItem"></m-team-editor>
                </el-tab-pane>
                <el-tab-pane label="成员管理" name="second">
                    <m-team-member :members="dSelTeamItem.member"
                                   :agent="dSelTeamItem.agent"
                                   @onSubmit="onMemSubmit"></m-team-member>
                </el-tab-pane>
            </el-tabs>
            <div style="height: 100px; line-height: 100px; font-size: 18px; color: #aaaaaa; text-align: center" v-else>
                未选择团队
            </div>
        </el-card>
    </div>
</template>

<script>
    import MyTeamEditor from './comp/team_edit.vue'
    import MyTeamMember from './comp/team_member.vue'
    export default {
        created(){
            this.getRefs()
            this.getTeams()
        },
        data() {
            return {
                dTeams:[],
                dRefs:[],
                dSelTeam:"",
                dSelTab:"first",
                dSelTeamItem:{},
            }
        },
        components: {
            "m-team-editor":MyTeamEditor,
            "m-team-member":MyTeamMember
        },
        computed:{
            cShow:function () {
                return this.dSelTeam && this.dSelTeam != ""
            }
        },
        methods:{
            onTeamChange:function (obj) {
                if (obj) {
                    for (var i in this.dTeams) {
                        var team = this.dTeams[i]
                        if (team.name == obj) {
                            this.dSelTeamItem = this.$util.deepCopy(team)
                        }
                    }
                }
            },
            onMemSubmit:function (val) {
                var v = this
                var vp = this.$parent
                var param = {}
                param.name = v.dSelTeamItem.name
                param.member = val
                vp.postApi("/api/team/update/member/force", param, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", "修改团队成员成功！")
                    } else if (data && data.msg) {
                        vp.onToast("提示", "修改团队成员失败："+data.msg, "red")
                    } else {
                        vp.onToast("提示", "修改团队成员失败！", "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "修改团队成员失败！Status:"+status+" message:"+msg, "red")
                })
            },
            onTeamModify:function (val) {
                if (!val) {
                    return
                }
                var vp = this.$parent
                vp.postApi("/api/team/update", val, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", "修改成功！")
                    } else if (data && data.msg) {
                        vp.onToast("提示", "修改失败："+data.msg, "red")
                    } else {
                        vp.onToast("提示", "修改失败!", "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "修改失败, status:"+status + " message:"+msg, "red")
                })
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
            getTeams:function () {
                var v = this
                var vp = this.$parent
                vp.getApi("/api/team/list", null, false, function (data) {
                    console.log(data)
                    if (data && data.errno==0){
                        v.dTeams = data.teams
                    } else {
                        v.dTeams = []
                    }
                }, function (status, msg) {
                    v.dTeams = []
                })
            },
            onRefresh:function () {
                this.getTeams()
                this.getRefs()
                this.dSelTeamItem = {}
                this.dSelTeam = ""
            },
            onAdd:function () {
                this.$parent.onGoto("/team/teamadd")
            }
        }
    }
</script>