import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@/views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

export const orderPrint = {
    path: '/order-print/:order_id',
    name: 'order-print',
    component: resolve => { require(['@/views/orders/component/order-print.vue'], resolve); }     
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    title: '首页',
    redirect: '/home',
    component: Main,
    children: [
        { 
            path: 'home', 
            title: '首页', 
            name: 'home_index', 
            component: resolve => { require(['@/views/home/home.vue'], resolve); } 
        },
        { 
            path: 'ownspace', 
            title: '个人中心', 
            name: 'ownspace_index', 
            component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } 
        },
        { 
            path: 'message', 
            title: '消息中心', 
            name: 'message_index', 
            component: resolve => { require(['@/views/message/message.vue'], resolve); } 
        },
        { 
            path: 'attribute-value', 
            title: '商品属性', 
            name: 'attribute_value', 
            component: resolve => { require(['@/views/products/attribute-value.vue'], resolve); } 
        },
        { 
            path: 'account-category', 
            title: '分类管理', 
            name: 'account_category', 
            component: resolve => { require(['@/views/system/account-category.vue'], resolve); } 
        },
        { 
            path: 'order/:order_id', 
            title: '订单详情', 
            name: 'order-info', 
            component: resolve => { require(['@/views/orders/component/order-info.vue'], resolve); } 
        },
        { 
            path: 'return-order/:order_id', 
            title: '退货退款单详情', 
            name: 'return-order-info', 
            component: resolve => { require(['@/views/after-sale/component/return-order-info.vue'], resolve); } 
        },    
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/finance',
        icon: 'key',
        name: 'finance',
        title: '财务中心',
        component: Main,
        children: [
            {
                path: 'finance-payment',
                icon: 'document',
                name: 'finance-payment',
                title: '应付单',
                component: resolve => { require(['@/views/finance/payment.vue'], resolve); }
            },
            {
                path: 'finance-income',
                icon: 'document',
                name: 'finance-income',
                title: '应收单',
                component: resolve => { require(['@/views/finance/income.vue'], resolve); }
            },
        ]
    },
    {
        path: '/products',
        icon: 'social-buffer',
        name: 'products',
        title: '商品管理',
        component: Main,
        children: [
            {
                path: 'category',
                icon: 'compose',
                name: 'category',
                title: '分类管理',
                component: resolve => { require(['@/views/products/category.vue'], resolve); }
            },
            {
                path: 'attribute',
                icon: 'compose',
                name: 'attribute',
                title: '属性管理',
                component: resolve => { require(['@/views/products/attribute.vue'], resolve); }
            },
            {
                path: 'product',
                icon: 'compose',
                name: 'product',
                title: '产品管理',
                component: resolve => { require(['@/views/products/product.vue'], resolve); }
            }
        ]
    },
    {
        path: '/orders',
        icon: 'android-checkbox',
        name: 'order',
        title: '订单管理',
        component: Main,
        children: [
            {
                path: 'create-order',
                title: '新建订单',
                name: 'create-order',
                icon: 'compose',
                component: resolve => { require(['@/views/orders/create.vue'], resolve); }
            },
            {
                path: 'order-list',
                title: '订单查询',
                name: 'order-list',
                icon: 'compose',
                component: resolve => { require(['@/views/orders/list.vue'], resolve); }
            }
        ]
    },
    {
        path: '/warehouse',
        icon: 'ios-grid-view',
        name: 'warehouse',
        title: '仓储管理',
        component: Main,
        children: [
            {
                path: 'purchase-order',
                icon: 'ios-cart',
                name: 'purchase-order',
                title: '进货入库单',
                component: resolve => { require(['@/views/stock/purchase-order.vue'], resolve); }
            },
            {
                path: 'purchase-return-order',
                icon: 'document',
                name: 'purchase-return-order',
                title: '进货退货单',
                component: resolve => { require(['@/views/stock/purchase-return-order.vue'], resolve); }
            },
            {
                path: 'purchase-swap-order',
                icon: 'document',
                name: 'purchase-swap-order',
                title: '进货换货单',
                component: resolve => { require(['@/views/stock/purchase-swap-order.vue'], resolve); }
            },
        ]
    },
    {
        path: '/after-sale',
        icon: 'android-people',
        name: 'after-sale',
        title: '售后服务',
        component: Main,
        children: [
            {
                path: 'return-order',
                icon: 'arrow-return-right',
                name: 'return-order',
                title: '添加退货单',
                component: resolve => { require(['@/views/after-sale/return-order.vue'], resolve); }                
            },
            {
                path: 'return-money',
                icon: 'arrow-return-right',
                name: 'return-money',
                title: '添加退款单',
                component: resolve => { require(['@/views/after-sale/return-money.vue'], resolve); }                
            },
            {
                path: 'return-order-list',
                icon: 'arrow-return-right',
                name: 'return-order-list',
                title: '退货单查询',
                component: resolve => { require(['@/views/after-sale/return-order-list.vue'], resolve); }                
            },
        ]
    },
    {
        path: '/report',
        icon: 'ios-infinite',
        name: 'report',
        title: '报表中心',
        component: Main,
        children: [
            { 
                path: 'channel-sale-report', 
                title: '渠道销售报表', 
                name: 'channel-sale-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/channel-sale-report.vue'], resolve); } 
            },
            { 
                path: 'sale-report', 
                title: '经营日月报表', 
                name: 'sale-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/sale-report.vue'], resolve); } 
            },
            { 
                path: 'staff-report', 
                title: '客服业绩报表', 
                name: 'staff-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/staff-report.vue'], resolve); } 
            },
            { 
                path: 'order-report', 
                title: '订单统计报表', 
                name: 'order-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/order-report.vue'], resolve); } 
            },
            { 
                path: 'product-report', 
                title: '商品销售报表', 
                name: 'product-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/product-report.vue'], resolve); } 
            },
            { 
                path: 'color-size-report', 
                title: '商品颜色尺码对比', 
                name: 'color-size-report', 
                icon: 'stats-bars', 
                component: resolve => { require(['@/views/report/color-size-report.vue'], resolve); } 
            },
            
        ]
    },
    {
        path: '/user',
        icon: 'ios-infinite',
        name: 'user',
        title: '用户管理',
        component: Main,
        children: [
            { 
                path: 'users-manager', 
                title: '用户管理', 
                name: 'users-manager', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/users.vue'], resolve); } 
            },
        ]
    },
    {
        path: '/system',
        icon: 'android-sad',
        name: 'system',
        title: '系统设置',
        component: Main,
        children: [
            { 
                path: 'client-manager', 
                title: '客户管理', 
                name: 'client-manager', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/client.vue'], resolve); }
            },
            { 
                path: 'supplier-manager', 
                title: '供应商管理', 
                name: 'supplier-manager', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/supplier.vue'], resolve); }
            },
            { 
                path: 'delivery', 
                title: '快递公司管理', 
                name: 'delivery', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/delivery.vue'], resolve); }
            },            
            { 
                path: 'channel-manager', 
                title: '订单来源', 
                name: 'channel-manager', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/channel.vue'], resolve); }
            },            
            { 
                path: 'cash', 
                title: '现金银行', 
                name: 'cash', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/cash.vue'], resolve); }
            },
            { 
                path: 'cost', 
                title: '费用支出', 
                name: 'cost', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/cost.vue'], resolve); }
            },      
            { 
                path: 'income', 
                title: '其他收入', 
                name: 'income', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/income.vue'], resolve); }
            },
            { 
                path: 'invoice-type', 
                title: '票据类型', 
                name: 'invoice-type', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/invoice-type.vue'], resolve); }
            },
            { 
                path: 'printshop-1', 
                title: '印刷厂管理', 
                name: 'printshop-1', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/printshop-1.vue'], resolve); }
            },            
            { 
                path: 'printshop-2', 
                title: '热印厂管理', 
                name: 'printshop-2', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/printshop-2.vue'], resolve); }
            },            
            { 
                path: 'printshop-3', 
                title: '刺绣厂管理', 
                name: 'printshop-3', 
                icon: 'ios-infinite', 
                component: resolve => { require(['@/views/system/printshop-3.vue'], resolve); }
            },                                 
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    orderPrint,
    ...appRouter,
    page500,
    page403,
    page404
];
