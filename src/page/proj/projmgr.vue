<template>
    <div style="padding: 10px">
        <el-card class="box-card">
            <div slot="header">
                团队：
                <el-select v-model="dSelTeam"
                           :loading="dTeamLoading"
                           filterable
                           style="width: 150px; margin-right: 15px"
                           placeholder="请选择团队"
                           @change="onTeamChange">
                    <el-option
                            v-for="item in dTeams"
                            :label="item.name"
                            :value="item.name">
                    </el-option>
                </el-select>
                项目：
                <el-select v-model="dSelProj" filterable
                           :disabled="cProjSelDisable"
                           :loading="dTeamLoading"
                           style="width: 150px"
                           placeholder="请选择项目" @change="onProjChange">
                    <el-option
                            v-for="item in dProjs"
                            :label="item.name"
                            :value="item.name">
                    </el-option>
                </el-select>
                <el-button style="float: right"
                           :disabled="cProjSelDisable"
                           @click="onAdd">新建项目</el-button>
            </div>

            <m-proj-editor :mode=1
                           :proj="dSelProjItem"
                           @onModify="onSubmit"
                           v-if="cHasSelProj"></m-proj-editor>

            <div style="height: 100px; line-height: 100px; font-size: 18px; color: #aaaaaa; text-align: center"
                 v-else>
                请选择项目
            </div>
        </el-card>
    </div>
</template>

<script>
    import MyProjEditor from './comp/proj_edit.vue'
    export default {
        created(){
            this.getTeams()
        },
        data() {
            return {
                dTeamLoading: false,
                dTeams:[],
                dSelTeam:"",

                dProjs:[],
                dSelProj:"",
                dProjLoading: false,
                dSelProjItem:{}
            }
        },
        components: {
            "m-proj-editor": MyProjEditor
        },
        computed:{
            cProjSelDisable:function () {
                return this.dSelTeam == ""
            },
            cHasSelProj:function () {
                return this.dSelProj != ""
            }
        },
        methods:{
            onTeamChange:function (obj) {
                if (obj) {
                    this.dSelProj = ""
                    this.dProjs = []
                    this.dSelProjItem = {}
                    this.getProj()
                }
            },
            onProjChange: function (obj) {
                var selProj = null
                for (var i in this.dProjs) {
                    var proj = this.dProjs[i]
                    if (proj.name == obj) {
                        selProj = proj
                        break
                    }
                }
                if (selProj != null) {
                    this.dSelProjItem = this.$util.deepCopy(selProj)
                }
            },

            // Submit
            onSubmit:function (obj) {
                if (!obj) return
                var v = this
                var vp = this.$parent
                vp.postApi("/api/project/update", obj, true, function (data) {
                    if (data && data.errno == 0) {
                        vp.onToast("提示", "修改项目信息成功！")
                    } else if (data && data.msg) {
                        vp.onToast("提示", "修改项目信息失败："+data.msg, "red")
                    } else {
                        vp.onToast("提示", "修改项目信息失败！", "red")
                    }
                }, function (status, msg) {
                    vp.onToast("提示", "修改项目信息失败！Status:"+status+" message:"+msg, "red")
                })
            },

            // Request
            getTeams:function () {
                var v = this
                var vp = this.$parent
                v.dTeamLoading = true
                vp.getApi("/api/team/list", null, false, function (data) {
                    if (data && data.errno==0){
                        v.dTeams = data.teams
                    } else {
                        v.dTeams = []
                    }
                    v.dTeamLoading = false
                }, function (status, msg) {
                    v.dTeams = []
                    v.dTeamLoading = false
                })
            },
            getProj:function () {
                var v = this
                var vp = this.$parent
                var param = {team:v.dSelTeam}
                v.dProjLoading = true
                vp.getApi("/api/project/list", param, false, function (data) {
                    if (data && data.errno == 0) {
                        v.dProjs = data.projects
                    } else {
                        v.dProjs = []
                    }
                    v.dProjLoading = false
                }, function (status, msg) {
                    v.dProjLoading = false
                    v.dProjs = []
                })
            },
            onAdd:function () {
                this.$parent.onGoto("/proj/projadd/"+this.dSelTeam)
            }
        }
    }
</script>