/**
 * menus.js负责菜单相关的路由配置，此出的菜单不要配置任何access：
 * 如下所示：假如我们有系统功能，以及子功能菜单一览和角色管理
 */
import Main from '@/components/main'

export default [
    {
        path: '/system',
        name: 'system',
        meta: {
            showAlways: true,
            icon: 'md-menu',
            title: '系统功能'
        },
        component: Main,
        children: [
            {
                path: 'menuManage',
                name: 'menuManage',
                meta: {
                    icon: 'md-funnel',
                    title: '菜单管理'
                },
                component: () => import('@/views/system/menuManage/index.vue')
            },
            {
                path: 'roleManage',
                name: 'roleManage',
                meta: {
                    icon: 'md-contact',
                    title: '角色管理'
                },
                component: () => import('@/views/system/roleManage/index.vue')
            },
            {
                path: 'userManage',
                name: 'userManage',
                meta: {
                    icon: 'md-contact',
                    title: '用户管理'
                },
                component: () => import('@/views/system/userManage/index.vue')
            },
            {
              path: '/sub-app1',
              name: 'subApp1',
              meta: {
                icon: 'md-menu',
                title: '子应用1'
              },
            },
            {
              path: '/sub-app2',
              name: 'subApp2',
              meta: {
                icon: 'md-menu',
                title: '子应用2'
              },
            },
        ]
    },
    {
        path: '/dataManage',
        name: 'dataManage',
        meta: {
            showAlways: true,
            icon: 'md-menu',
            title: '数据管理'
        },
        component: Main,
        children: [
            {
                path: 'damand',
                name: '数据需求',
                meta: {
                    icon: 'md-funnel',
                    title: '数据需求'
                },
                component: () => import('@/views/data-manage/damand/index')
            },
            {
                path: 'dataAnalysis',
                name: '数据分析',
                meta: {
                    icon: 'md-funnel',
                    title: '数据分析'
                },
                component: () => import('@/views/data-manage/analysis/index')
            }
        ]
    }
]
