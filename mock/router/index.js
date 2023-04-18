import {getMenuList} from '@/api/url'
import Mock from 'mockjs'

export const adminRoutes = [{
		menuUrl: '/index',
		menuName: 'Dashborad',
		routeName: 'dashborad',
		icon: 'icon-dashboard',
		parentPath: '',
		children: [{
				parentPath: '/index',
				menuUrl: '/index/home',
				menuName: '主控台',
				routeName: 'home',
			},
			{
				parentPath: '/index',
				menuUrl: '/index/work-place',
				menuName: '工作台',
				routeName: 'workPlace',
				isRootPath: true,
			},
		],
	},
	{
		menuUrl: '/system',
		menuName: '系统管理',
		iconPrefix: 'iconfont',
		icon: 'setting',
		parentPath: '',
		children: [{
				parentPath: '/system',
				menuUrl: '/system/department',
				menuName: '部门管理',
				badge: 'new',
				localFilePath: '/system/local-path/department',
				routeName: 'my-department',
			},
			{
				parentPath: '/system',
				menuUrl: '/system/user',
				menuName: '用户管理',
				badge: 'dot',
			},
			{
				parentPath: '/system',
				menuUrl: '/system/role',
				menuName: '角色管理',
				badge: '12',
			},
			{
				parentPath: '/system',
				menuUrl: '/system/menu',
				menuName: '菜单管理',
			},
		],
	},
]
export const editorRoutes = []

Mock.mock(RegExp(getMenuList), 'post', function() {
	return Mock.mock({
		code: 200,
		data: adminRoutes,
		msg: '获取菜单列表成功'
	})
})
