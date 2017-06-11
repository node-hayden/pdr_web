<template>
    <div style="margin: 0px 15px">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-table :data="dMembers" stripe
                          empty-text="暂无成员"
                          border style="width: 100%">
                    <el-table-column prop="account" label="帐号">
                    </el-table-column>
                    <el-table-column label="角色" width="150">
                        <template scope="scope">
                            <el-select size="mini" filterable v-model="scope.row.role" placeholder="选择角色">
                                <el-option
                                        v-for="item in dRoles"
                                        :key="item.role"
                                        :label="item.roleName"
                                        :value="item.role">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="70">
                        <template scope="scope">
                            <el-button type="text" @click="onDel(scope.$index)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%; margin-top: 10px;"
                           @click="onSubmit">提交</el-button>
            </el-col>
            <el-col :span="12">
                <el-input
                        placeholder="输入用户帐号进行搜索"
                        icon="search"
                        v-model="dSearch"
                        style="margin-bottom: 4px"
                        :on-icon-click="onSearch">
                </el-input>
                <el-table :data="dUsers" stripe
                          empty-text="暂无搜索结果"
                          border style="width: 100%"
                          v-loading.body="dLoading"
                          :show-header=false>
                    <el-table-column prop="account" label="帐号">
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="160" aligin="center">
                    </el-table-column>
                    <el-table-column width="80" aligin="center">
                        <template scope="scope">
                            <el-button type="primary" size="mini" @click="onAddUser(scope.row, scope.$index)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        created(){
            this.__funcSetData()
            this.dRoles = this.$util.roleList([0, 9])
        },
        props: ["team"],
        data() {
            return {
                dMembers: null,
                dAgent: null,
                dSearch: "",
                dUsers: [],
                dRoles:[],
                dLoading:false
            }
        },
        watch: {
            team() {
                this.__funcSetData()
            },
            agent(curr, old) {
                this.dAgent = curr
            }
        },
        methods: {
            onSearch: function () {
                this.$pdr.GET('/api/user/search', {account:this.dSearch}, false, '搜索用户').success((data) => {
                    if (data.users) {
                        this.dUsers = data.users
                    } else {
                        this.dUsers = []
                    }
                }).before(() => {
                    this.dLoading = true
                }).complete(() => {
                    this.dLoading = false
                }).go()
            },
            onSubmit:function () {
                this.$confirm('确定要提交对团队成员的修改吗?', '提示', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onSubmit", this.dMembers)
                }).catch(() => {

                });
            },
            onDel:function (idx) {
                if (idx > -1 && idx < this.dMembers.length) {
                    var member = this.dMembers[idx]
                    this.$confirm('确定要移除成员 '+member.account+' 吗?', '提示', {
                        confirmButtonText: '移除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.dMembers.splice(idx, 1)
                    }).catch(() => {

                    });
                }
            },
            onAddUser:function (row, idx) {
                if (!row) return
                if (row.account == this.dAgent) {
                    this.$pdr.toastError('该用户是超级管理员，不能添加!')
                    return
                }
                for (var i in this.dMembers) {
                    var member = this.dMembers[i]
                    if (member.account == row.account) {
                        this.$pdr.toastError('该用户已存在!')
                        return
                    }
                }
                this.$confirm('确定要添加用户 '+row.account+' 吗?', '提示', {
                    confirmButtonText: '添加',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.role = 1
                    this.dMembers.push(row)
                    this.dUsers.splice(idx, 1)
                }).catch(() => {

                });
            },

            __funcSetData() {
                if (this.team) {
                    this.dAgent = this.team.agent
                    var mems = []
                    for (var i in this.team.member) {
                        var aMem = this.team.member[i]
                        mems.push(this.$util.deepCopy(aMem))
                    }
                    this.dMembers = mems
                } else {
                    this.dMembers = null
                    this.dAgent = null
                }
            }
        }
    }
</script>