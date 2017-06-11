<template>
    <div v-loading.body="dLoading">
        <div class="comm-operation">
            <span style="font: 24px">参照列表</span>
            <el-button size="small" type="primary" style="float: right; margin-top: 20px;" @click="onAdd">添加参照</el-button>
            <el-button size="small" style="float: right; margin-top: 20px; margin-right: 10px" @click="getRefers">刷新</el-button>
        </div>
        <div class="comm-content">
            <el-table :data="dRefers" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="right" inline class="p-refer-form">
                            <el-form-item label="Git地址:">
                                <span>{{ props.row.git }}</span>
                            </el-form-item>
                            <el-form-item label="Target:">
                                <span>{{ props.row.target }}</span>
                            </el-form-item>
                            <el-form-item label="同步周期(s):">
                                <span>{{ props.row.cycle}}</span>
                            </el-form-item>
                            <el-form-item label="分支正则:">
                                <span>{{ props.row.branch_reg }}</span>
                            </el-form-item>
                            <el-form-item label="分支偏移:">
                                <span>{{ props.row.branch_offset}}</span>
                            </el-form-item>
                            <el-form-item label="Podfile路径:">
                                <span>{{ props.row.podfile_relpath }}</span>
                            </el-form-item>
                        </el-form>
                        <el-form class="p-refer-single-form">
                            <el-form-item label="参照描述:">
                                <span>{{ props.row.description}}</span>
                            </el-form-item>
                            <el-form-item label="参照模块:">
                                <el-tag type="danger"
                                        style="margin-left: 5px"
                                        v-for="(item,key) in props.row.modules" :key="key">{{key+(item.constraint?" : "+item.constraint : "")}}</el-tag>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="参照名称">
                    <template scope="scope">
                        <span style="font-size: 12px;">{{scope.row.name}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="当前分支" width="120">
                    <template scope="scope">
                        <span style="font-size: 12px;">{{scope.row.current_branch}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="同步时间" width="160" align="center">
                    <template scope="scope">
                        <span style="font-size: 10px;color: #666666">{{scope.row.last_sync_time}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="120" align="center">
                    <template scope="scope">
                        <i class="el-icon-loading" v-if="scope.row.addition==1"></i>
                        <span style="font-size: 10px; color: #666666" v-else>静默</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template scope="scope">
                        <el-button size="mini" type="primary"
                                   @click="onSync(scope.row)">同步</el-button>
                        <el-button size="mini" type="primary"
                                   @click="onModify(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger"
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
            this.getRefers()
        },
        data() {
            return {
                dRefers: null,
                dLoading: false
            }
        },
        methods:{
            onAdd:function () {
                this.$pdr.goto('/setting/refer/add')
            },
            onSync:function (row) {
                if (row.addition == 1) {
                    this.$pdr.toast("仓库"+row.name+"已在同步，不能重复提交!")
                    return
                }
                var param = [row.git]
                this.$confirm('确定要同步仓库' + row.name + '模块吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.syncRefer(param)
                })
            },
            onDel:function (row) {
                var param = {repo: row.name}
                this.$confirm('确定要删除仓库' + param.name + '吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delRefer(param)
                })
            },
            onModify:function (row) {
                this.$pdr.goto('/setting/refer/edit/'+row._id)
            },

            // Network
            delRefer:function (param) {

            },
            syncRefer:function (param) {

            },
            getRefers:function () {
                this.$pdr.GET('/api/ref/list', null, false, '获取参照列表').success((data) => {
                    if (data.refs) {
                        this.dRefers = data.refs
                    }
                }).go()
            }
        }
    }
</script>

<style lang="css">
    .p-refer-form {
        font-size: 0;
    }
    .p-refer-form label {
        width: 80px;
        color: #99a9bf;
        font-size: 10px;
    }
    .p-refer-form .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .p-refer-single-form {
        font-size: 0px;
    }
    .p-refer-single-form label {
        width: 80px;
        color: #99a9bf;
        font-size: 10px;
    }
</style>