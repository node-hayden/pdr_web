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
                                        :label="item.cap"
                                        :value="item.val">
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
                          @cell-dblclick="onSearchDBClick"
                          :show-header=false>
                    <el-table-column prop="account" label="帐号">
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        created(){

        },
        props: ["members", "agent"],
        data() {
            return {
                dMembers: this.members,
                dAgent: this.agent,
                dSearch: "",
                dUsers: [],
                dRoles:[
                    {
                        cap:"Admin",
                        val:3
                    },
                    {
                        cap:"Developer",
                        val:2
                    },
                    {
                        cap:"Viewer",
                        val:1
                    }
                ]
            }
        },
        components: {},
        watch: {
            members(curr, old) {
                if (curr) {
                    var arr = []
                    for (var i in curr) {
                        var item = curr[i]
                        item = this.$util.deepCopy(item)
                        arr.push(item)
                    }
                    this.dMembers = arr
                } else {
                    this.dMembers = [];
                }
            },
            agent(curr, old) {
                this.dAgent = curr
            }
        },
        computed: {},
        methods: {
            onSearch: function () {
                var v = this
                var vp = this.$root.$children[0]
                vp.getApi("/api/user/search", {account:this.dSearch}, false, function (data) {
                    if (data && data.errno == 0) {
                        v.dUsers = data.users
                    } else {
                        console.log(data)
                        v.dUsers=[]
                    }
                }, function (status, msg) {

                })
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
            onSearchDBClick:function (row) {
                if (!row) return
                var vp = this.$root.$children[0]
                if (row.account == this.dAgent) {
                    if (vp) {
                        vp.onToast("提示", "该用户是超级管理员，不能添加!", "red")
                    }
                    return
                }
                for (var i in this.dMembers) {
                    var member = this.dMembers[i]
                    if (member.account == row.account) {
                        if (vp) {
                            vp.onToast("提示", "该用户已存在!", "red")
                        }
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
                }).catch(() => {

                });
            }
        }
    }
</script>