<template>
    <div>
        <div class="proj_editor_row">
            <div class="proj_editor_caption">
                团队名称：
            </div>
            <div class="proj-editor-form">
                {{dProj.team}}
            </div>
        </div>

        <div class="proj_editor_row">
            <div class="proj_editor_caption">
                项目名称：
            </div>
            <div class="proj-editor-form">
                <el-input size="small" v-model="dProj.name" :disabled="cIsModifyMode"></el-input>
            </div>
        </div>

        <div class="proj_editor_row">
            <div class="proj_editor_caption">
                Git地址：
            </div>
            <div class="proj-editor-form">
                <el-input size="small" v-model="dProj.git"></el-input>
            </div>
        </div>

        <div class="proj_editor_row">
            <div class="proj_editor_caption">
                项目描述：
            </div>
            <div class="proj-editor-area">
                <el-input type="textarea" row="4" v-model="dProj.description"></el-input>
            </div>
        </div>

        <div class="proj_editor_row">
            <div class="proj-editor-form" v-if="cIsModifyMode">
                <el-button size="small" type="primary" @click="onModify">修改</el-button>
                <el-button size="small" @click="onDel">删除</el-button>
            </div>
            <div class="proj-editor-form" v-else>
                <el-button size="small" type="primary" @click="onAdd">添加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
        },
        props:["mode", "proj"],
        data() {
            return {
                dProj:this.proj
            }
        },
        watch:{
            proj(curr, old) {
                this.dProj = curr
            }
        },
        components: {

        },
        computed:{
            cIsModifyMode: function () {
                if (this.mode == 1) {
                    return true
                }
                return false
            }
        },
        methods:{
            onAdd:function () {
                this.$confirm('确定要新增项目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onAdd", this.dProj)
                }).catch(() => {

                });
            },
            onModify:function () {
                this.$confirm('确定要提交对项目信息的修改吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onModify", this.dProj)
                }).catch(() => {

                });
            },
            onDel:function () {
                this.$confirm('确定要删除项目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("onDel", this.dProj)
                }).catch(() => {

                });
            }
        }
    }
</script>

<style lang="css">
    .proj_editor_row {
        margin: auto;
        width: 360px;
        clear: both;
    }
    .proj_editor_caption {
        text-align: right;
        font-size: 14px;
        color: #888888;
        height: 54px;
        line-height: 54px;
        width: 120px;
        float: left;
    }
    .proj-editor-form {
        height: 54px;
        line-height: 54px;
        float: right;
        width: 240px;
        float: right;
    }
    .proj-editor-area {
        margin-top: 15px;
        width: 240px;
        float: right;
    }
    .proj-editor-clear{
        clear: both;
    }
</style>