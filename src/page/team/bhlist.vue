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
                       @click="onAdd">新版本</el-button>
            <el-button style="float: right; margin-top: 13px; margin-right: 10px"
                       size="small"
                       :disabled="dTeam.selected==''"
                       @click="onRefresh">刷新</el-button>
        </div>

        <div class="content-body">
            <el-table
                    v-loading.body="dBH.loading"
                    :data="dBH.bhs"
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
                        label="状态"
                        width="120">
                    <template scope="scope">
                        {{scope.row.release ? '已发布' : '未发布'}}
                    </template>
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

                dBH:{
                    bhs:[],
                    loading:false
                }
            }
        },
        methods:{
            // Operation event
            onTeamChange:function () {
                this.dBH.bhs = []
                this.getBH()
            },

            onStatusChange:function () {
                this.dBH.bhs = []
                if (this.dTeam.selected == '') return
                this.getBH()
            },

            onAdd:function () {
                this.$pdr.goto('/team/hierarchy')
            },
            onRefresh:function () {
                this.getBH()
            },
            onRelease: function (version) {
                this.$confirm('确定要发布版本为' + version + '的公共基础框架吗？', '提示', {
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
            getBH:function () {
                var param = {
                    team:this.dTeam.selected,
                    type:this.dSelStatus
                }
                this.$pdr.GET("/api/bh/list", param, false).success((data) => {
                    this.dBH.bhs = data.hierarchies
                }).failure(() => {
                    this.dBH.bhs = []
                }).before(() => {
                    this.dBH.loading = true
                }).complete(() => {
                    this.dBH.loading = false
                }).go()
            },
            releasePodfile:function (version) {
                var param = {
                    team:this.dTeam.selected,
                    version:version
                }
                this.$pdr.POST("/api/bh/release", param, true, "发布公共基础框架").success(() => {
                    this.$pdr.toast("发布公共基础框架成功！")
                    this.getBH()
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