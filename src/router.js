import Vue from 'vue'
import Router from 'vue-router'
// NavigationDuplicated的错误处理
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
import display from './views/Diplay.vue'
import regcompany from './views/regcompany.vue'


Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    
    { path: "/", redirect: '/login' },
    { path: "/login",meta: { keepAlive: false}, component: () => import('./views/Login.vue') },
    { path: "/reguer",meta: { keepAlive: false}, component: () => import('./views/reguser.vue') },
    { path: "/choose",meta: { keepAlive: false}, component: () => import('./views/Choose.vue') },
    { path: "/regcompany",meta: { keepAlive: false},name:'regcompany', component:regcompany  },
    {
      path: "/display", component: display, name: "home", meta: { title: '#' ,keepAlive: false}, redirect: "/home", children: [
        // 二级路由
        { path: "/home", name: "home", meta: { title: '首页' ,keepAlive: false}, component: () => import('./views/Home.vue') },
        { path: "/personal", name: "personal", meta: { title: '个人中心',keepAlive: false }, component: () => import('./components/Personal.vue') },
        { path: "/driver", name: "driver", meta: { title: '引导' ,keepAlive: false}, component: () => import('./components/driver/Driver.vue') },
        { path: "/complain", name: "complain", meta: { title: '意见反馈' ,keepAlive: false}, component: () => import('./views/complain.vue') },
        
        //组织架构管理
        { path: "/company", name: "company", meta: { title: '我的企业',keepAlive: true }, component: () => import('./components/organization/company.vue') },
        { path: "/employee", name: "employee", meta: { title: '我的员工',keepAlive: true }, component: () => import('./components/organization/employee.vue') },
        { path: "/customer", name: "customer", meta: { title: '我的会员' }, component: () => import('./components/organization/customer.vue') },

        { path: "/companyadd", name:"companyadd", meta: { title: '企业编辑',keepAlive: true }, component: () => import('./components/organization/company-info.vue') },
        { path: "/employeeadd", name: "employeeadd", meta: { title: '员工编辑' ,keepAlive: true}, component: () => import('./components/organization/employee-add.vue') },

        { path: "/audit", name: "audit", meta: { title: '企业审核',keepAlive: true }, component: () => import('./components/organization/auditcompany.vue') },

        //商品管理
        { path: "/good", name: "good", meta: { title: '商品列表' ,keepAlive: true}, component: () => import('./components/good/good.vue') },
        { path: "/goodadd" , name: "goodadd", meta: { title: '商品编辑',keepAlive: true }, component: () => import('./components/good/good-add.vue') },
        // 商品预售重写样式
        { path: "/goodpresell", name: "goodpresell", meta: { title: '预约管理',keepAlive: true }, component: () => import('./components/good/good-presell.vue') },
        { path: "/goodpreselldetail", name: "goodpreselldetail", meta: { title: '预约编辑' ,keepAlive: false}, component: () => import('./components/good/good-preselldetail.vue') },

        //订单管理
        { path: "/order", name: "order", meta: { title: '订单列表',keepAlive: true }, component: () => import('./components/order/order-list.vue') },
        { path: "/orderdetail", name: "orderdetail" , meta: { title: '订单详情',keepAlive: false }, component: () => import('./components/order/order-detail.vue') },
        // 预约订单
        { path: "/preorder", name: "preorder", meta: { title: '预约订单',keepAlive: true }, component: () => import('./components/order/pre-order.vue') },
        { path: "/preorderdetail", name: "preorderdetail", meta: { title: '预约订单详情',keepAlive: false }, component: () => import('./components/order/preorder-details.vue') },
        // 预约商品统计汇总
        { path: "/count", name: "count", meta: { title: '预约产品统计汇总' ,keepAlive: false}, component: () => import('./components/order/count.vue') },
        { path: "/refund", name: "refund", meta: { title: '退款管理',keepAlive: false }, component: () => import('./components/order/refund.vue') },

        // 营销活动   限时抢购
        { path: "/timelimited", name: "timelimited", meta: { title: '限时抢购',keepAlive: true }, component: () => import('./components/activity/timeLimited.vue') },
        { path: "/limiteddetail", name: "limiteddetail", meta: { title: '限时抢购详情',keepAlive: false }, component: () => import('./components/activity/limiteddetail.vue') },
        // 优惠券
        { path: "/fulldiscount", name: "fulldiscount", meta: { title: '优惠券管理' ,keepAlive: true}, component: () => import('./components/activity/fulldiscount.vue') },
        { path: "/fulldetail", name: "fulldetail", meta: { title: '优惠券设置',keepAlive: false }, component: () => import('./components/activity/fulldetail.vue') },
        // 满减满赠
        { path: "/reduce", name: "reduce", meta: { title: '满减满赠',keepAlive: true }, component: () => import('./components/activity/reduce.vue') },
        { path: "/reducedetail", name: "reducedetail", meta: { title: '满减满赠详情',keepAlive: true }, component: () => import('./components/activity/reducedetail.vue') },

        // 基础设置   运费管理
        { path: "/freight", name: "freight", meta: { title: '运费管理' ,keepAlive: true}, component: () => import('./components/set/freight.vue') },
        { path: "/roleset", name: "roleset", meta: { title: '角色管理' ,keepAlive: true}, component: () => import('./components/set/roleset.vue') },
        { path: "/classify", name: "classify", meta: { title: '商品分类' ,keepAlive: true}, component: () => import('./components/set/classify.vue') },
        { path: "/markset", name: "markset", meta: { title: '标签管理' ,keepAlive: true}, component: () => import('./components/set/mark.vue') },
        { path: "/bannerlist", name: "bannerlist", meta: { title: '广告管理' ,keepAlive: true}, component: () => import('./components/set/bannerList.vue') },
        { path: "/adfloor", name: "adfloor", meta: { title: '广告楼层编辑',keepAlive: false }, component: () => import('./components/set/adfloor.vue') },
        { path: "/newslist", name: "newslist", meta: { title: '公告管理' ,keepAlive: true}, component: () => import('./components/set/newsSet.vue') },
        { path: "/addnews", name: "addnews", meta: { title: '公告编辑' ,keepAlive: false}, component: () => import('./components/set/addnews.vue') },
        { path: "/floortype", name: "floortype", meta: { title: '楼层类型' ,keepAlive: false}, component: () => import('./components/set/floorType.vue') },

        //积分设置
        { path: "/integralset", name: "integralset", meta: { title: '积分设置' ,keepAlive: false}, component: () => import('./components/integral//integralset.vue') },
        //积分商品
        { path: "/integralgood", name: "integralgood", meta: { title: '积分兑换商品列表' ,keepAlive: false}, component: () => import('./components/integral/integralgood.vue') },
        { path: "/integoodadd", name: "integoodadd", meta: { title: '积分兑换商品编辑' ,keepAlive: false}, component: () => import('./components/integral/integoodadd.vue') },
        //会员列表
        { path: "/customlist", name: "customlist", meta: { title: '会员列表',keepAlive: false }, component: () => import('./components/integral/customlist.vue') },
        { path: "/customdetial", name: "customdetial", meta: { title: '会员详情' ,keepAlive: false}, component: () => import('./components/integral/customdetial.vue') },
        
        //合伙人
        { path: "/rebateset", name: "rebateset", meta: { title: '返利设置',keepAlive: false }, component: () => import('./components/partner/rebateset.vue') },
        { path: "/rebatelist", name: "rebatelist", meta: { title: '返利明细' ,keepAlive: false}, component: () => import('./components/partner/rebatelist.vue') },
        { path: "/partnerlist", name: "partnerlist", meta: { title: '合伙人列表',keepAlive: false }, component: () => import('./components/partner/partnerlist.vue') },
        { path: "/recordlist", name: "recordlist", meta: { title: '提现记录' ,keepAlive: false}, component: () => import('./components/partner/recordlist.vue') },
      ]
    },
    { path: "/header", component: () => import('./components/Header.vue') },
    { path: "/error", component: () => import('./views/Error.vue') },
    {
      path: "/sidebar", component: () => import('./components/Sidebar.vue')
    },
    {
      path: "/topbar", component: () => import('./components/Topbar.vue')
    },
    { path: "*", redirect: "/error", hidden: true }
  ],
  // 
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})
// 判断进入其他页面有没有先登录
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.loginToken ? true : false;
  if (to.path == "/login") {
    next();
  } else {
    isLogin ? next() : next('/login')
  }
  //判断是否需要缓存
  // 商品编辑->商品列表
  if(to.path === '/good' && from.path === '/goodadd'){
    to.meta.keepAlive = true;  // 让 列表页 缓存，即不刷新
    next();
  }else {
    to.meta.keepAlive = false;  // 让 列表页 即不缓存，刷新
    next();
  }
  // 企业编辑->企业列表
  // if(to.path === '/company' && from.path === '/companyadd'){
  //   to.meta.keepAlive = true;  // 让 列表页 缓存，即不刷新
  //   next();
  // }else {
  //   to.meta.keepAlive = false;  // 让 列表页 即不缓存，刷新
  //   next();
  // }


})

export default router
