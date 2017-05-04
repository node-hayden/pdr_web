<template>
    <div class="comp-mask-parent comp-mask-show">
        <div class="comp-mask-module">
            <div class="team-h-module-title">
                <div class="el-icon-close team-h-module-close"
                     @click="onClose">
                </div>
                {{cTtile}}
            </div>
            <div class="team-h-module-item team-h-module-top">
                <el-input :value="moduleData.name"
                          placeholder="模块名"
                          :disabled="cNameDisable"
                          v-model="moduleData.name"></el-input>
            </div>
            <div class="team-h-module-item">
                <el-input :value="moduleData.constraint"
                          placeholder="版本号"
                          v-model="moduleData.constraint"></el-input>
            </div>
            <div class="team-h-module-item">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-button type="primary"
                                   style="width: 100%"
                                   @click="onSubmit">确定</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button style="width: 100%"
                                   :disabled="cDelBtnDisable"
                                   @click="onDel">删除</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:["moduleData"],
        data() {
            return {

            }
        },
        computed:{
            cTtile:function () {
                if (this.moduleData && this.moduleData.title) {
                    return this.moduleData.title
                } else if (this.moduleData && this.moduleData.mode == 1) {
                    return "修改"
                } else if (this.moduleData && this.moduleData.mode == 0) {
                    return "新增"
                } else {
                    return ""
                }
            },
            cNameDisable:function () {
                return this.moduleData.mode == 1
            },
            cDelBtnDisable:function () {
                return this.moduleData.mode == 0
            }
        },
        methods:{
            onSubmit:function () {
                this.$emit("submit", this.moduleData)
            },
            onClose:function () {
                this.$emit("close")
            },
            onDel:function () {
                this.$emit("del", this.moduleData)
            }
        }
    }
</script>

<style lang="scss">
    .team-h-module-title {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #dddddd;
    }
    .team-h-module-top {
        margin-top: 15px;
    }
    .team-h-module-item {
        margin-top:20px;
        padding: 0px 15px;
    }
    .team-h-module-close{
        margin-top: 14px;
        margin-right: 10px;
        cursor: pointer;
        color: #cccccc;
        float: right;
    }
</style>