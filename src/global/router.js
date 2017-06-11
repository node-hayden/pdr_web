// 引用模板
import index from '../page/index.vue'
// Setting
import setting_menu from '../page/setting/menu.vue'
import setting_refer from '../page/setting/refer.vue'
import setting_refer_editor from '../page/setting/refer_editor.vue'

// User
import user_login from '../page/user/login.vue'
import user_register from '../page/user/register.vue'

// Team
import team_mgr from '../page/team/teammgr.vue'
import team_add from '../page/team/teamadd.vue'
import team_bhadd from '../page/team/bhadd.vue'
import team_bhmgr from '../page/team/bhmgr.vue'

// Project
import proj_mgr from '../page/proj/projmgr.vue'
import proj_add from '../page/proj/projadd.vue'
import proj_podfile from '../page/proj/podfile.vue'
import proj_podfileadd from '../page/proj/podfile_editor.vue'

// Repo
import repo_manage from '../page/repo/manage.vue'
import repo_editor from '../page/repo/repo_editor.vue'
import repo_search from '../page/repo/search.vue'

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
        path: '/setting/refer',
        component:setting_refer,
    },
    {
        path:'setting/refer/add',
        component:setting_refer_editor,
    },
    {
        path:'/setting/refer/edit/:refid',
        component:setting_refer_editor
    },
    
    // User
    {
        path: '/user/login',
        component:user_login,
    },
    {
        path: '/user/register',
        component:user_register,
    },

    // Team
    {
        path: '/team/teammgr',
        component:team_mgr,
    },
    {
        path: '/team/teamadd',
        component:team_add,
    },
    {
        path: '/team/bhmgr',
        component:team_bhmgr,
    },
    {
        path: '/team/bhadd',
        component:team_bhadd
    },

    // Project
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
        component:proj_podfile,
    },
    {
        path: '/proj/podfile/view/:team/:project',
        component:proj_podfileadd,
    },

    // Repo
    {
        path: '/repo/manage',
        component: repo_manage
    },
    {
        path: '/repo/add',
        component: repo_editor
    },
    {
        path: '/repo/edit/:reponame',
        component: repo_editor
    },
    {
        path: '/repo/search',
        component: repo_search
    }
]