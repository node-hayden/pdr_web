// 引用模板
import index from '../page/index.vue'
import setting_menu from '../page/setting/menu.vue'
import ref_manage from '../page/ref/manage.vue'
import user_login from '../page/user/login.vue'

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
    {
        path: '/ref/manage',
        component:ref_manage,
    },
    {
        path: '/user/login',
        component:user_login,
    }
]