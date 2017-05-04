<template>
    <div>
        <table width="100%" cellpadding="0" boder="0px">
            <tr height="44px">
                <td width="100" align="right" valign="middle">
                    <span style="color: #888888; margin-right: 10px">团队名称:</span>
                </td>
                <td align="left" valign="middle">
                    <el-input size="small" style="width: 220px" :disabled="cIsModify" v-model="dTeam.name"></el-input>
                </td>
            </tr>
            <tr height="44px">
                <td width="100" align="right" valign="top">
                    <span style="color: #888888; margin-right: 10px; ">团队描述:</span>
                </td>
                <td align="left" valign="middle">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入内容"
                              style="width: 220px"
                              v-model="dTeam.description">
                    </el-input>
                </td>
            </tr>
            <tr height="44px">
                <td width="100" align="right" valign="middle">
                    <span style="color: #888888; margin-right: 10px">参照设置:</span>
                </td>
                <td align="left" valign="middle">
                    <el-select v-model="dTeam.ref_git" placeholder="不使用参照" style="width: 220px">
                        <el-option
                                v-for="item in cRefs"
                                :label="item.caption"
                                :value="item.git">
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr height="44px" v-if=cIsModify>
                <td width="100" align="right" valign="middle">
                    <span style="color: #888888; margin-right: 10px">超级管理员:</span>
                </td>
                <td align="left" valign="middle">
                    <span>{{dTeam.agent}}</span>
                </td>
            </tr>
            <tr height="44px">
                <td width="100" align="right" valign="middle">

                </td>
                <td align="left" valign="middle">
                    <div v-if="cIsModify">
                        <el-button type="primary" size="samll" @click="onModify">修改</el-button>
                        <el-button size="samll" @click="onDel">删除</el-button>
                    </div>
                    <el-button size="samll" @click="onAdd" style="width: 220px" v-else>添加</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        created(){

        },
        props:["team", "mode", "refs"],
        data() {
            return {
                dTeam:this.team,
                dRef:this.refs,
            }
        },
        computed:{
            cIsModify: function () {
                if (this.mode && this.mode == 1) {
                    return true
                }
                return false
            },
            cRefs: function () {
                if (!this.dRef) {
                    return []
                }
                var hasNone = false
                var options = []
                for (var i in this.dRef) {
                    var item = this.dRef[i]
                    if (item.git == "") {
                        hasNone = true
                    }
                    item.caption = item.name+"("+item.git+")"
                    options.push(item)
                }
                if (!hasNone) {
                    options.push({git:"", caption:"不使用参照"})
                }
                return options
            }
        },
        watch:{
            team(curr, old) {
                if (curr) {
                    this.dTeam = this.$util.deepCopy(curr)
                } else {
                    this.dTeam = {}
                }
            },
            refs(curr, old) {
                if (curr) {
                    this.dRef = curr
                } else {
                    this.dRef = []
                }
            }
        },
        methods:{
            onAdd:function () {
                this.$confirm('确定要新增团队吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onAdd", this.dTeam)
                }).catch(() => {

                });
            },
            onModify:function () {
                this.$confirm('确定要提交对团队信息修改吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onModify", this.dTeam)
                }).catch(() => {

                });
            },
            onDel:function () {
                this.$confirm('确定要删除团队吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onDel", this.dTeam)
                }).catch(() => {

                });
            }
        }
    }
</script>