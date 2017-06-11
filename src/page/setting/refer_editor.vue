<template>
    <div>
        <div class="comm-content p-repo-editor">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form label-width="120px">
                        <el-form-item label="参照名称:">
                            <el-input size="small"
                                      v-model="dRefer.name" style="width: 260px"></el-input>
                        </el-form-item>
                        <el-form-item label="Git地址:">
                            <el-input size="small"
                                      :readonly="dMode==2"
                                      v-model="dRefer.git" style="width: 260px"></el-input>
                        </el-form-item>

                        <el-form-item label="分支正则:">
                            <el-input size="small"
                                      v-model="dRefer.branch_reg" style="width: 260px"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-form label-width="120px">
                        <el-form-item label="Target:">
                            <el-input size="small"
                                      v-model="dRefer.target" style="width: 260px"></el-input>
                        </el-form-item>
                        <el-form-item label="同步周期(s)">
                            <el-input-number v-model="dRefer.cycle" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="分支偏移:">
                            <el-input-number v-model="dRefer.branch_offset" :min="0"></el-input-number>
                        </el-form-item>
                    </el-form>

                </el-col>
            </el-row>
            <el-form label-width="120px">
                <el-form-item label="Podfile路径:">
                    <el-input size="small"
                              v-model="dRefer.podfile_relpath" style="width: 90%"></el-input>
                </el-form-item>
                <el-form-item label="参照描述:">
                    <el-input
                            type="textarea"
                            style="width: 90%"
                            :autosize="{ minRows: 2, maxRows: 6}"
                            placeholder="请输入内容"
                            v-model="dRefer.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="" v-if="dMode>0">
                    <el-button type="primary" @click="onSubmit">
                        {{dMode==1?'立即创建':"提交修改"}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        created(){
            var refid = this.$route.params.refid
            if (refid && refid != "") {
                this.dMode = 2
                this.dReferId = refid
                this.getRefer()
            } else {
                this.dMode = 1
            }
        },
        data() {
            return {
                dMode: 1,  //0:view  1:add  2:modify:
                dRefer: {
                    name:"",
                    git:"",
                    podfile_relpath:"",
                    cycle:12,
                    branch_reg:"",
                    branch_offset:1,
                    target:"",
                    description:""
                },
                dReferId:"",
            }
        },
        methods:{
            onSubmit:function () {
                var msg = this.__funcCheckParam()
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                var param = this.$util.deepCopy(this.dRefer)
                var op = this.dMode == 2 ? '修改' : '增加'
                this.$confirm('确定要' + op + '参照吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
            },

            postData:function (param) {
                var path = this.dMode == 2 ? '' : '/api/ref/add'
                var op = this.dMode == 2 ? '修改参照' : '增加参照'
                this.$pdr.POST(path, param, true, op).success(() => {
                    this.
                })
            },

            getRefer:function () {
                this.$pdr.GET("/api/ref/one", {id:this.dReferId}, true, "获取参照详情").success((data) => {
                    if (data.reference) {
                        this.$util.copyObj2Obj(data.reference, this.dRefer)
                    }
                }).go()
            },

            // Private
            __funcCheckParam:function () {
                this.dRefer.name = this.dRefer.name.replace(/\s+/g, "")
                this.dRefer.git = this.dRefer.git.replace(/\s+/g, "")
                if (this.dRefer.name == "") {
                    return "参照名称不能为空!"
                }
                if (this.dRefer.git == "") {
                    return "仓库地址不能为空"
                }
                return ""
            }
        }
    }
</script>

<style lang="scss">
    .p-repo-editor {
        border: 1px solid #cccccc;
        padding: 20px 10px 10px 10px;
        margin: 15px 10px 10px 10px;
    }
</style>