<template>
    <div>
        <div class="comm-operation">
            名称：
            <el-select size="small"
                       v-model="dModule.selected"
                       filterable
                       remote
                       placeholder="请输入模块名称关键词"
                       :remote-method="onSearch"
                       style="width: 240px"
                       @change="onModuleChange"
                       :loading="dModule.loading">
                <el-option
                        v-for="item in dModule.modules"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <span style="margin-left: 20px">版本：</span>
            <el-select size="small" v-model="dVersion.selected"
                       :loading="dVersion.loading"
                       placeholder="请选择版本" style="width: 160px">
                <el-option
                        v-for="item in dVersion.versions"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>

            <el-button type="primary"
                       size="small"
                       :disabled="dModule.selected==''||dVersion.selected==''"
                       style="margin-left: 15px" @click="onGo">Go</el-button>
        </div>
        <div class="comm-content" style="background-color: #eeeeee; padding: 15px" v-if="dModule.detail!=null">
            <pre>{{dModule.detail}}</pre>
        </div>
    </div>
</template>

<script>
    export default {
        created(){

        },
        data() {
            return {
                dModule:{
                    selected:"",
                    modules:[],
                    detail:null,
                    loading:false,
                },

                dVersion:{
                    selected:"",
                    versions:[],
                    loading:false
                },

                dTimer:null,
            }
        },
        methods:{
            onGo:function () {
                if (this.dModule.selected == '' || this.dVersion.selected == '') {
                    this.$pdr.toastError('输入模块名和版本！')
                    return
                }
                this.getDetail()
            },
            onSearch: function (keyword) {
                if (!keyword || keyword.length < 2) return
                this.dModule.loading = true
                if (this.dTimer != null) {
                    clearTimeout(this.dTimer)
                }
                this.dTimer = setTimeout(() => {
                    this.search(keyword)
                    this.dTimer = null
                }, 1000)
            },
            onModuleChange: function (val) {
                this.dVersion.selected = ''
                this.dVersion.versions = []
                this.getVersion()
            },

            // request
            search: function (keyword) {
                this.$pdr.GET("/api/repo/module/search/simple", {module:keyword}, false).success((data) => {
                    if (data.modules) {
                        this.dModule.modules = data.modules
                    } else {
                        this.dModule.modules = []
                    }
                }).failure(() => {
                    this.dModule.modules = []
                }).complete(() => {
                    this.dModule.loading = false
                }).go()
            },
            getVersion:function () {
                if (this.dModule.name == "") {
                    this.dTemp.versions = []
                    return
                }
                this.$pdr.GET("/api/repo/module/versions", {module:this.dModule.selected}, false).success((data) => {
                    if (data.versions) {
                        this.dVersion.versions = data.versions
                    } else {
                        this.dVersion.versions = []
                    }
                }).failure(() => {
                    this.dVersion.versions = []
                }).before(() => {
                    this.dVersion.loading = true
                }).complete(() => {
                    this.dVersion.loading = false
                }).go()
            },
            getDetail:function () {
                var param = {
                    module_name:this.dModule.selected,
                    version:this.dVersion.selected
                }
                this.$pdr.GET('/api/repo/module/one', param, true, '获取模块详情').success((data) => {
                    if (data.module && data.module.spec) {
                        this.dModule.detail = this.$util.obj2Json(data.module.spec, 4)
                    } else {
                        this.dModule.detail = '暂无模块详情！'
                    }
                }).go()
            }
        }
    }
</script>