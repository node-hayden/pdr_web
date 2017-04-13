// 引用模板
import index from '../page/index.vue'
import setting_menu from '../page/setting/menu.vue'
// 配置路由
export default [
    {
        path: '/',
        component: index
    },
    {
        path: '/setting/menu',
        component: setting_menu
    },
]