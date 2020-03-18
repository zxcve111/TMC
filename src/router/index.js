import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const login1 = r => require.ensure([], () => r(require('@/page/login1')), 'login1');
const login2 = r => require.ensure([], () => r(require('@/page/login2')), 'login2');
const emLogin = r => require.ensure([], () => r(require('@/page/emLogin')), 'emLogin');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
/**公司管理*/
const companyManage = r => require.ensure([], () => r(require('@/page/system/companyManage')), 'companyManage');
const companyManageSys = r => require.ensure([], () => r(require('@/page/system/companyManageSys')), 'companyManageSys');
/**配置管理 */
const ConfigManage = r => require.ensure([], () => r(require('@/page/system/ConfigManage')), 'ConfigManage');

/**人员管理 */
const personManage = r => require.ensure([], () => r(require('@/page/system/personManage')), 'personManage');

/**角色管理 */
const roleManage = r => require.ensure([], () => r(require('@/page/system/roleManage')), 'roleManage');
/**语言管理 */
const LanguageManage = r => require.ensure([], () => r(require('@/page/system/LanguageManage')), 'LanguageManage');

/**差旅申请*/
const TravelApplication = r => require.ensure([], () => r(require('@/page/system/travelApplication')), 'TravelApplication');

/**机票管理*/
const TicketManage = r => require.ensure([], () => r(require('@/page/system/ticketManage')), 'TicketManage');

/**差旅申请信息*/
const ApplicationDetail = r => require.ensure([], () => r(require('@/page/system/applicationDetail')), 'ApplicationDetail');

/**差旅申请信息*/
const ApplicationDetailCopy = r => require.ensure([], () => r(require('@/page/system/applicationDetailCopy')), 'ApplicationDetailCopy');

/**订单管理页面*/
const OrderManage = r => require.ensure([], () => r(require('@/page/system/orderManage')), 'ApplicationDetail');

/**账单管理页面*/
const BillManage = r => require.ensure([], () => r(require('@/page/system/BillManage')), 'BillManage');

/**交易明细页面*/
const TransactionDetail = r => require.ensure([], () => r(require('@/page/system/TransactionDetail')), 'TransactionDetail');

/**交易明细页面*/
const PeerManage = r => require.ensure([], () => r(require('@/page/system/PeerManage')), 'PeerManage');

const routes = [
	{
		path: '/',
		component: login
	},
    {
        path: '/SSOLogin',
        component: login1
    },
    {
        path: '/UnLogin',
        component: login2
    },
    {
        path: '/emLogin',
        component: emLogin
    },
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '/companyManage',
			component: companyManage,
			meta: ['title_SystemManage', 'title_DepartmentManagement'],
        },
        {
			path: '/ConfigManage',
			component: ConfigManage,
			meta: ['title_SystemManage', 'title_ConfigManagement'],
		},
		{
			path: '/companyManageSys',
			component: companyManageSys,
			meta: ['PageName_1', 'PageName_26'],
		},{
			path: '/personManage',
			component: personManage,
			meta: ['title_SystemManage', 'title_PersonManage'],
		},{
			path: '/roleManage',
			component: roleManage,
			meta: ['title_SystemManage', 'title_RoleManage'],
		},{
			path: '/LanguageManage',
			component: LanguageManage,
			meta: ['title_SystemManage', 'title_LanguageManage'],
		}, {
             path: '/TravelApplication',
             name:"TravelApplication",
             component: TravelApplication,
             meta: ['title_TravelApplication'],
         }, {
                path: '/ApplicationDetailCopy',
                name:"ApplicationDetailCopy",
                component: ApplicationDetailCopy,
                meta: ['title_TravelApplication','title_ApplicationDetail'],
            },
            {
                path: '/TicketManage',
                name:"TicketManage",
                component: TicketManage,
                meta: ['title_TicketManage'],
            },
            {
                path: '/ApplicationDetail',
                name:"ApplicationDetail",
                component: ApplicationDetail,
                meta: ['title_TravelApplication','title_ApplicationDetail'],
            },
            {
                path: '/OrderManage',
                name:"OrderManage",
                component: OrderManage,
                meta: ['title_OrderManage'],
            },
            {
                path: '/BillManage',
                name:"BillManage",
                component: BillManage,
                meta: ['title_billManage'],
            },
            {
                path: '/TransactionDetail',
                name:"TransactionDetail",
                component: TransactionDetail,
                meta: ['title_TransactionDetail'],
            },
            {
                path: '/PeerManage',
                name:"PeerManage",
                component: PeerManage,
                meta: ['title_PeerManage'],
            },
	]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
