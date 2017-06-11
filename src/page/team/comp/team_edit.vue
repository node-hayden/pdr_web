<template>
    <div>
        <el-form label-width="120px">
            <el-form-item label="团队名称:">
                <el-input size="small" style="width: 90%"
                          :readonly="mode==2"
                          v-model="dTeam.name"></el-input>
            </el-form-item>
            <el-form-item label="参照选择:">
                <el-select v-model="dTeam.ref_git"
                           :loading="dRef.loading"
                           style="width: 90%">
                    <el-option
                            v-for="item in dRef.refs"
                            :key="item.name"
                            :label="item.name"
                            :value="item.git">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="超级管理员:">
                <span style="color: #666666">{{dTeam.agent}}</span>
            </el-form-item>
            <el-form-item label="团队描述:">
                <el-input type="textarea"
                          :rows="4"
                          placeholder="请输入团队描述"
                          style="width: 90%"
                          v-model="dTeam.description">
                </el-input>
            </el-form-item>
            <el-form-item label="">
                <div v-if="mode==2">
                    <el-button type="primary" size="samll" @click="onModify">修改</el-button>
                    <el-button type="danger" size="samll" @click="onDel">删除</el-button>
                </div>
                <el-button type="primary" size="samll" @click="onAdd" v-else>立即添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        created(){
            this.__funcSetTeam()
            this.getRefs()
        },
        props:["team", "mode"],
        data() {
            return {
                dTeam:{
                    name:"",
                    agent:"",
                    ref_git:"",
                    description:""
                },
                dRef:{
                    loading:false,
                    refs:[]
                }
            }
        },
        watch:{
            team() {
                this.__funcSetTeam()
            }
        },
        methods:{
            // Event handler
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
            },

            // Network
            getRefs:function () {
                this.$pdr.GET('/api/ref/list', null, false, '').success((data) => {
                    if (data.refs) {
                        this.dRef.refs = data.refs
                    }
                }).before(() => {
                    this.dRef.loading = true
                }).complete(() => {
                    this.dRef.loading = false
                }).go()
            },

            // Private
            __funcSetTeam() {
                if (this.team) {
                    this.dTeam.name = this.team.name
                    this.dTeam.agent = this.team.agent
                    this.dTeam.ref_git = this.team.ref_git
                    this.dTeam.description = this.team.description
                } else {
                    this.dTeam.name = ""
                    this.dTeam.agent = ""
                    this.dTeam.ref_git = ""
                    this.dTeam.description = ""
                }
            }
        }
    }
</script>