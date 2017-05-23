<template>
    <div v-loading.body="dLoading">
        <div class="comm-operation">
            <span style="font: 24px">仓库列表</span>
            <el-button size="small" type="primary" style="float: right; margin-top: 20px;" @click="onAdd">添加仓库</el-button>
            <el-button size="small" style="float: right; margin-top: 20px; margin-right: 10px" @click="syncLocal">同步</el-button>
            <el-button size="small" style="float: right; margin-top: 20px; margin-right: 10px" @click="getRepos">刷新</el-button>
        </div>
        <div class="comm-content">
            <el-table :data="dRepos" style="width: 100%">
                <el-table-column label="仓库名称">
                    <template scope="scope">
                        <span style="font-size: 14px;">{{scope.row.repo_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="同步时间" width="160" align="center">
                    <template scope="scope">
                        <span style="font-size: 10px;color: #666666">{{scope.row.sync_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120" align="center">
                    <template scope="scope">
                        <i class="el-icon-loading" v-if="scope.row.addition && scope.row.addition>0"></i>
                        <span style="font-size: 10px; color: #666666" v-else>静默</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template scope="scope">
                        <el-button size="mini" type="primary"
                                   :disabled="scope.row.repo_name=='master'"
                                   @click="onSync(scope.row)">同步</el-button>
                        <el-button size="mini" type="primary"
                                   :disabled="scope.row.repo_name=='master'"
                                   @click="onModify(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger"
                                   :disabled="scope.row.repo_name=='master'"
                                   @click="onDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            this.getRepos()
        },
        data() {
            return {
                dRepos: null,
                dLoading: false
            }
        },
        methods:{
            onAdd:function () {
                this.$pdr.goto('/repo/add')
            },
            onSync:function (row) {
                if (row.addition == 1) {
                    this.$pdr.toast("仓库"+row.repo_name+"已在同步，不能重复提交!")
                    return
                }
                var param = [row.repo_name]
                this.$confirm('确定要同步仓库' + row.repo_name + '模块吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.syncRepoModule(param)
                })
            },
            onDel:function (row) {
                var param = {repo: row.repo_name}
                this.$confirm('确定要删除仓库' + param.repo + '吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delRepo(param)
                })
            },
            onModify:function (row) {
                this.$pdr.goto('/repo/edit/'+row.repo_name)
            },

            // Network
            delRepo:function (param) {
                this.$pdr.GET('/api/repo/del', param, true, '删除仓库').success(() => {
                    this.$pdr.toast("成功删除仓库!")
                    this.getRepos()
                }).go()
            },
            syncLocal:function () {
                this.$pdr.GET("/api/repo/sync", null, false, "同步服务端仓库").success(() => {
                    this.getRepos()
                }).before(() => {
                    this.dLoading = true
                }).complete(() => {
                    this.dLoading = false
                }).go()
            },
            syncRepoModule:function (param) {
                this.$pdr.POST('/api/repo/module/sync', param, true, '同步仓库模块').success(() => {
                    this.$pdr.toast("已启动后端同步，可刷新查看状态！")
                }).complete(() => {
                    this.getRepos()
                }).go()
            },
            getRepos:function () {
                this.$pdr.GET("/api/repo", null, false, "获取仓库列表").success((data) => {
                    this.dRepos = data.repos
                }).before(() => {
                    this.dLoading = true
                }).complete(() => {
                    this.dLoading = false
                }).go()
            }
        }
    }
</script>