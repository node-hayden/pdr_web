<template>
    <div>
        <el-card class="ref_mgr">
            <div slot="header">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button-group style="float: right">
                    <el-button>新增</el-button>
                    <el-button>启动</el-button>
                    <el-button>同步</el-button>
                    <el-button>删除</el-button>
                </el-button-group>
            </div>
            <div class="ref_mgr_context">
                <div style="height: 45px; line-height: 45px;">
                    <span style="font-size: 13px;">名称：</span>
                    <span style="font-size: 13px; color: #888888">测试</span>
                    <span style="font-size: 13px; margin-left: 20px;">Git：</span>
                    <span style="font-size: 13px; color: #888888">http://wwww.baidu.com</span>
                </div>
                <div style="height: 45px; line-height: 45px;">
                    <span style="font-size: 13px;">当前分支：</span>
                    <span style="font-size: 13px; color: #888888">测试</span>
                    <span style="font-size: 13px; margin-left: 20px;">同步时间：</span>
                    <span style="font-size: 13px; color: #888888">http://wwww.baidu.com</span>
                    <span style="font-size: 13px; margin-left: 20px;">状态：</span>
                    <span style="font-size: 13px; color: #888888">运行中</span>
                </div>
                <div style="height: 45px; line-height: 45px;">
                    <span style="font-size: 13px;">分支正则：</span>
                    <el-input type="text" style="width: 150px"
                              ></el-input>
                    <span style="font-size: 13px; margin-left: 20px;">分支偏移：</span>
                    <el-input type="text" style="width: 150px"></el-input>
                </div>

            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        created(){

        },
        data: function () {
            return {
                dShow: true
            }
        },
    }
</script>