<template>
    <div>
        <div class="comm-content p-repo-editor">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form label-width="120px">
                        <el-form-item label="仓库名称">
                            <el-input size="small"
                                      :readonly="dMode==2"
                                      v-model="dRepo.repo_name" style="width: 260px"></el-input>
                        </el-form-item>
                        <el-form-item label="服务端路径">
                            <el-input size="small"
                                      :readonly="true"
                                      v-model="dRepo.path" style="width: 260px"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <el-form label-width="120px">
                        <el-form-item label="仓库地址">
                            <el-input size="small"
                                      :readonly="dMode==2"
                                      v-model="dRepo.git" style="width: 260px"></el-input>
                        </el-form-item>
                        <el-form-item label="同步周期(h)">
                            <el-input-number v-model="dRepo.cycle" :min="1" :max="24"></el-input-number>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-form label-width="120px">
                <el-form-item label="仓库描述">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 6}"
                            placeholder="请输入内容"
                            v-model="dRepo.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="排除模块(JSON)">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 20}"
                            placeholder="请输入排除的模块，key:模块名，value:版本条件"
                            v-model="dRepo.exclude">
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
            var reponame = this.$route.params.reponame
            if (reponame && reponame != "") {
                this.dMode = 2
                this.dRepo.repo_name = reponame
                this.getRepo()
            } else {
                this.dMode = 1
            }
        },
        data() {
            return {
                dMode: 1,  //0:view  1:add  2:modify:
                dRepo: {
                    repo_name:"",
                    git:"",
                    path:"",
                    cycle:12,
                    description:"",
                    exclude:""
                }
            }
        },
        methods:{
            onSubmit:function () {
                var msg = this.__funcCheckParam()
                if (msg != "") {
                    this.$pdr.toastError(msg)
                    return
                }
                var param = this.$util.deepCopy(this.dRepo)
                if (param.exclude != "") {
                    param.exclude = JSON.parse(param.exclude)
                } else {
                    param.exclude = null
                }
                this.postData(param)
            },

            postData:function (param) {
                var op = this.dMode == 2 ? '修改仓库' : '添加仓库'
                var path = this.dMode == 2 ? '/api/repo/update' : '/api/repo/add'
                this.$pdr.POST(path, param, true, op).success(() => {
                    this.$confirm(op +'成功，点击确定前往仓库管理界面!', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'success'
                    }).then(() => {
                        this.$pdr.goto('/repo/manage')
                    }).catch(() => {
                    });
                }).go()
            },
            getRepo:function () {
                this.$pdr.POST("/api/repo/one", {repo_name:this.dRepo.repo_name}, true, "获取仓库列表").success((data) => {
                    if (data.repo) {
                        this.dRepo.repo_name = data.repo.repo_name
                        this.dRepo.git = data.repo.git
                        this.dRepo.path = data.repo.path ? data.repo.path : ""
                        this.dRepo.cycle = data.repo.cycle
                        this.dRepo.description = data.repo.description ? data.repo.description : ""
                        if (data.repo.exclude) {
                            this.dRepo.exclude = this.$util.obj2Json(data.repo.exclude, 4)
                        } else {
                            this.dRepo.exclude = ""
                        }
                    }
                }).go()
            },

            // Private
            __funcCheckParam:function () {
                if (this.dRepo.repo_name == "") {
                    return "仓库名称不能为空!"
                }
                if (this.dRepo.git == "") {
                    return "仓库地址不能为空"
                }
                if (!/^[a-zA-Z\-_]+$/.test(this.dRepo.repo_name)) {
                    return "仓库名称只能包含英文字母、英文横线和英文下横线!"
                }

                this.dRepo.exclude = this.dRepo.exclude.replace(/(^\s+)|(\s+$)/g, "")
                if (this.dRepo.exclude != "") {
                    var obj = null
                    try {
                        obj = JSON.parse(this.dRepo.exclude)
                    } catch (e) {
                        return "排除模块的JSON格式错误："+e.message
                    }
                    if (obj == null) {
                        return "排除模块的JSON格式错误!"
                    } else if ((typeof obj) != 'object' || (obj instanceof Array)) {
                        return "排除模块的JSON格式错误!"
                    } else {
                        for (var key in obj) {
                            var val = obj[key]
                            if (typeof val != 'string') {
                                return "排除模块的JSON格式错误!"
                            }
                        }
                    }
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