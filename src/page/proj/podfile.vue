<template>
    <div>
        <div class="operation-container">
            团队：
            <el-select v-model="dTeam.selected"
                       filterable
                       size="small"
                       style="width: 150px; margin-right: 15px"
                       :loading="dTeam.loading"
                       placeholder="请选择团队"
                       @change="onTeamChange">
                <el-option
                        v-for="item in dTeam.teams"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            项目：
            <el-select v-model="dProj.selected" filterable
                       :disabled="dTeam.selected ==''"
                       :loading="dProj.loading"
                       style="width: 150px; margin-right: 15px"
                       size="small"
                       placeholder="请选择项目" @change="onProjChange">
                <el-option
                        v-for="item in dProj.projs"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
            状态：
            <el-select v-model="dSelStatus" filterable
                       style="width: 100px"
                       size="small"
                       placeholder="请选择状态" @change="onStatusChange">
                <el-option label="全部" value="0"></el-option>
                <el-option label="未发布" value="2"></el-option>
                <el-option label="已发布" value="1"></el-option>
            </el-select>
            <el-button style="float: right; margin-top: 13px; margin-right: 10px"
                       size="small"
                       type="primary"
                       :disabled="dProj.selected==''"
                       @click="onAdd">新版本</el-button>
            <el-button style="float: right; margin-top: 13px; margin-right: 10px"
                       size="small"
                       :disabled="dProj.selected==''"
                       @click="onRefresh">刷新</el-button>
        </div>

        <div class="content-body">
            <el-table
                    v-loading.body="dPodfile.loading"
                    :data="dPodfile.podfiles"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="version"
                        label="版本"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="base_on"
                        label="基于版本"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="_status"
                        label="状态"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="create_user"
                        label="创建者">
                </el-table-column>
                <el-table-column
                        prop="create_time"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="release_user"
                        label="发布者">
                </el-table-column>
                <el-table-column
                        prop="release_time"
                        label="发布时间">
                </el-table-column>
                <el-table-column
                        width="150"
                        label="操作">
                    <template scope="scope">
                        <el-button size="mini" type="primary">查看</el-button>
                        <el-button size="mini" type="primary"
                                   v-if="!scope.row.release"
                                   @click="onRelease(scope.row.version)">发布</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            this.getTeam()
        },
        data(){
            return {
                dSelStatus: "1",

                dTeam:{
                    selected:"",
                    teams:[],
                    loading:false
                },

                dProj:{
                    selected:"",
                    projs:[],
                    loading:false
                },

                dPodfile:{
                    podfiles:[],
                    loading:false,
                }
            }
        },
        methods:{
            // Operation event
            onTeamChange:function () {
                this.dProj.projs = []
                this.dProj.selected = ""
                this.dPodfile.podfiles = []
                this.getProj()
            },
            onProjChange:function () {
                this.dPodfile.podfiles = []
                this.getPodfile()
            },
            onStatusChange:function () {
                this.dPodfile.podfiles = []
                this.getPodfile()
            },
            onAdd:function () {
                if (this.dTeam.selected != "" && this.dProj.selected != "") {
                    var path = "/proj/podfile/view/"+this.dTeam.selected+"/"+this.dProj.selected
                    this.$pdr.goto(path)
                }
            },
            onRefresh:function () {
                this.getPodfile()
            },
            onRelease: function (version) {
                this.$confirm('确定要发布版本为' + version + '的Podfile吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.releasePodfile(version)
                }).catch(() => {

                });
            },


            // Request
            getTeam:function () {
                this.$pdr.GET("/api/team/list", null, false).success((data) => {
                    this.dTeam.teams = data.teams
                }).failure(() => {
                    this.dTeam.teams = []
                }).before(() => {
                    this.dTeam.loading = true
                }).complete(() => {
                    this.dTeam.loading = false
                }).go()
            },
            getProj:function () {
                this.$pdr.GET("/api/project/list", {team:this.dTeam.selected}, false).success((data) => {
                    this.dProj.projs = data.projects
                }).failure(() => {
                    this.dProj.projs = []
                }).before(() => {
                    this.dProj.loading = true
                }).complete(() => {
                    this.dProj.loading = false
                }).go()
            },
            getPodfile:function () {
                var param = {}
                param.team = this.dTeam.selected
                param.project = this.dProj.selected
                param.type = this.dSelStatus
                this.$pdr.GET("/api/podfile/list", param, false, "查询Podfile").success((data) => {
                    if (data.podfiles) {
                        this.dPodfile.podfiles = data.podfiles
                        for (var i in this.dPodfile.podfiles) {
                            var obj = this.dPodfile.podfiles[i]
                            obj._status = obj.release ? "已发布" : "未发布"
                        }
                    } else {
                        this.dPodfile.podfiles = []
                    }
                }).failure(() => {
                    this.dPodfile.podfiles = []
                }).before(() => {
                    this.dPodfile.loading = true
                }).complete(() => {
                    this.dPodfile.loading = false
                }).go()
            },
            releasePodfile:function (version) {
                var param = {
                    team:this.dTeam.selected,
                    project:this.dProj.selected,
                    version:version
                }
                console.log(param)
                this.$pdr.POST("/api/podfile/release", param, true, "发布Podfile").success(() => {
                    this.$pdr.toast("发布Podfile成功！")
                    this.getPodfile()
                }).go()
            }
        }
    }
</script>

<style lang="css">
    .operation-container {
        height: 54px;
        line-height: 54px;
        border: 1px solid #cccccc;
        padding: 0px 10px;
        border-radius: 4px;
        margin: 10px;
    }

    .content-body {
        margin: 0px 10px;
    }
</style>