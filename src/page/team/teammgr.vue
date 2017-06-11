<template>
    <div style="padding: 10px">
        <div class="comm-operation">
            团队:
            <el-select v-model="dTeam.selected"
                       filterable
                       placeholder="请选择团队"
                       size="small"
                       :loading="dTeam.loading"
                       @change="onTeamChange">
                <el-option
                        v-for="item in dTeam.teams"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>

            <el-button size="small"
                       style="float: right; margin-top: 20px"
                       @click="onAdd"
                       type="primary">新建团队</el-button>
            <el-button size="small"
                       :disabled="dTeam.selected==''"
                       style="float: right; margin-top: 20px; margin-right: 10px"
                       @click="onRefresh">刷新</el-button>
        </div>

        <div class="comm-content">
            <el-tabs v-if="dTeam.sel!=null" v-model="dTab" type="border-card">
                <el-tab-pane label="基本信息" name="first">
                    <div class="p-team-mgr-edit">
                        <m-team-editor :mode="2"
                                       :team="dTeam.sel"
                                       @onModify="onTeamModify"></m-team-editor>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="团队成员" name="second">
                    <m-team-member :team="dTeam.sel"
                                   @onSubmit="onMemSubmit"></m-team-member>
                </el-tab-pane>
            </el-tabs>
            <div style="height: 100px; line-height: 100px; font-size: 18px; color: #aaaaaa; text-align: center" v-else>
                未选择团队!
            </div>
        </div>
    </div>
</template>

<script>
    import MyTeamEditor from './comp/team_edit.vue'
    import MyTeamMember from './comp/team_member.vue'
    export default {
        created(){
            this.getTeams()
        },
        data() {
            return {
                dTeam:{
                    teams:[],
                    loading: false,
                    selected:'',
                    sel:null,
                },
                dTab:'first'
            }
        },
        components: {
            "m-team-editor":MyTeamEditor,
            "m-team-member":MyTeamMember
        },
        methods:{
            onTeamChange:function (obj) {
                if (obj) {
                    for (var i in this.dTeam.teams) {
                        var team = this.dTeam.teams[i]
                        if (team.name == obj) {
                            this.dTeam.sel = team
                            return true
                        }
                    }
                }
                return false
            },
            onMemSubmit:function (mems) {
                var team = {}
                team.name = this.dTeam.selected
                team.member = mems
                this.modifyTeamMem(team)
            },
            onTeamModify:function (team) {
                if (!team) {
                    return
                }
                this.modifyTeam(team)
            },
            onRefresh:function () {
                if (this.dTeam.selected == '') return
                this.getTeams(() => {
                    if (!this.onTeamChange(this.dTeam.selected)) {
                        this.dTeam.selected = ''
                        this.dTeam.sel = null
                    }
                })
            },
            onAdd:function () {
                this.$pdr.goto("/team/teamadd")
            },

            // Network
            getTeams:function (complete) {
                this.$pdr.GET('/api/team/list', null, false, '').success((data) => {
                    if (data.teams) {
                        this.dTeam.teams = data.teams
                    }
                }).before(() => {
                    this.dTeam.loading = true
                }).complete(() => {
                    this.dTeam.loading = false
                    if (complete) {
                        complete()
                    }
                }).go()
            },
            modifyTeam(team) {
                this.$pdr.POST('/api/team/update', team, true, '修改团队信息').success(() => {
                    this.$pdr.toast('修改团队信息成功！')
                    this.onRefresh()
                }).go()
            },
            modifyTeamMem(team) {
                this.$pdr.POST('/api/team/update/member/force', team, true, '修改团队成员').success(() => {
                    this.$pdr.toast('修改团队成员成功!')
                    this.onRefresh()
                }).go()
            }
        }
    }
</script>

<style lang="css">
    .p-team-mgr-edit {
        width: 400px;
        margin-top: 30px;
        margin-left: auto;
        margin-right: auto;
    }
</style>