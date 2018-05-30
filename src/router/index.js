import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: resolve => require(['../components/common/login.vue'], resolve)
        },
        {
            path: '/welcome',
            component: resolve => require(['../components/page/Welcome.vue'], resolve)
        },
        {
            path: '/auth/:agentkey/:href', props: true,
            component: resolve => require(['../components/common/authpc.vue'], resolve)
        },
        {
            path: '/home',            
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                   	redirect: '/md/welcome'
                    //component: resolve => require(['../components/page/Welcome.vue'], resolve)
                },
		        {
		            path: '/md/:filename', props: true,
		            component: resolve => require(['../components/common/markdown.vue'], resolve)
		        },
                {
                    path: '/rScatter',
                    component: resolve => require(['../components/page/rScatter.vue'], resolve)
                } ,{
                    path: '/query_barcode',
                    component: resolve => require(['../components/page/query_barcode.vue'], resolve)
                } ,
                {
                    path: '/query_balance',
                    component: resolve => require(['../components/page/query_balance.vue'], resolve)
                } 
                ,{
                    path: '/addbarcode',
                    component: resolve => require(['../components/page/addbarcode.vue'], resolve)
                },
                {
                    path: '/Cashier',
                    component: resolve => require(['../components/pos/test.vue'], resolve)
                },
                {
                    path: '/stock',
                    component: resolve => require(['../components/page/stock.vue'], resolve)
                } ,{
                    path: '/retail_detail',
                    component: resolve => require(['../components/page/retail_detail.vue'], resolve)
                }  ,
				{
                    path: '/stock_out',
                    component: resolve => require(['../components/page/stock_out.vue'], resolve)
                }
                ,{
                    path: '/stock_in',
                    component: resolve => require(['../components/page/stock_in1.vue'], resolve)
                }
                ,{
                    path: '/sys_menu',
                    component: resolve => require(['../components/sys/sys_menu.vue'], resolve)
                }
                ,{
                    path: '/sys_user',
                    component: resolve => require(['../components/sys/sys_user.vue'], resolve)
                }
                 ,{
                    path: '/sys_group',
                    component: resolve => require(['../components/sys/sys_group.vue'], resolve)
                }
                 ,{
                    path: '/sys_user_group',
                    component: resolve => require(['../components/sys/sys_user_group.vue'], resolve)
                },
                {
                    path: '/basic_style',
                    component: resolve => require(['../components/basic/style.vue'], resolve)
                },
                {
                    path: '/basic_size',
                    component: resolve => require(['../components/basic/size.vue'], resolve)
                },
                {
                    path: '/basic_size_group',
                    component: resolve => require(['../components/basic/size_group.vue'], resolve)
                },
                {
                    path: '/basic_color',
                    component: resolve => require(['../components/basic/color.vue'], resolve)
                },
                {
                    path: '/basic_company',
                    component: resolve => require(['../components/basic/company.vue'], resolve)
                },
                {
                    path: '/basic_brand',
                    component: resolve => require(['../components/basic/brand.vue'], resolve)
                },
                {
                    path: '/basic_entity',
                    component: resolve => require(['../components/basic/entity.vue'], resolve)
                },
                {
                    path: '/basic_staff',
                    component: resolve => require(['../components/basic/staff.vue'], resolve)
                },
            ]
        },
        {
            path: '/home01',            
            component: resolve => require(['../components/common/Home01.vue'], resolve),
            children:[
		        {
		            path: '/md01/:filename', props: true,
		            component: resolve => require(['../components/common/markdown.vue'], resolve)
		        },
                {
                    path: '/rScatter',
                    component: resolve => require(['../components/page/rScatter.vue'], resolve)
                } 
                ,{
                    path: '/query_barcode',
                    component: resolve => require(['../components/page/query_barcode.vue'], resolve)
                } ,
                {
                    path: '/query_balance',
                    component: resolve => require(['../components/page/query_balance.vue'], resolve)
                } 
                ,{
                    path: '/addbarcode',
                    component: resolve => require(['../components/page/addbarcode.vue'], resolve)
                } ,{
                    path: '/stock',
                    component: resolve => require(['../components/page/stock.vue'], resolve)
                } ,{
                    path: '/retail_detail',
                    component: resolve => require(['../components/page/retail_detail.vue'], resolve)
                }  ,
                
            ]
        },
        {
            path: '/t1',
            component: resolve => require(['../components/page/t1.vue'], resolve)
        },
    ]
})
