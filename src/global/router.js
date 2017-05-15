// 引用模板
import index from '../page/index.vue'
import setting_menu from '../page/setting/menu.vue'
import ref_manage from '../page/ref/manage.vue'
import user_login from '../page/user/login.vue'
import user_register from '../page/user/register.vue'
import team_hierarchy from '../page/team/hierarchy.vue'
import team_mgr from '../page/team/team.vue'
import team_add from '../page/team/teamadd.vue'
import proj_mgr from '../page/proj/projmgr.vue'
import proj_add from '../page/proj/projadd.vue'
import podfile from '../page/proj/podfile.vue'
import podfile_editor from '../page/proj/podfile_editor.vue'
import bh_list from '../page/team/bhlist.vue'

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
    },
    {
        path: '/user/register',
        component:user_register,
    },
    {
        path: '/team/hierarchy',
        component:team_hierarchy,
    },
    {
        path: '/team/team',
        component:team_mgr,
    },
    {
        path: '/team/teamadd',
        component:team_add,
    },
    {
        path: '/proj/projmgr',
        component:proj_mgr,
    },
    {
        path: '/proj/projadd/:team',
        component:proj_add,
    },
    {
        path: '/proj/podfile',
        component:podfile,
    },
    {
        path: '/proj/podfile/view/:team/:project',
        component:podfile_editor,
    },
    {
        path: '/team/bhlist',
        component:bh_list
    }
]