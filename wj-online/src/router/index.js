import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

// 页面懒加载
const Home = () => import('@/views/Home/Home')
const LclList = () => import('@/views/LclList/LclList')
const ILclList = () => import('@/views/ILclList/ILclList')
const FclList = () => import('@/views/FclList/FclList')
const LandList = () => import('@/views/LandList/LandList')
const TruckList = () => import('@/views/TruckList/TruckList')
const AirList = () => import('@/views/AirList/AirList')

const Login = ()=> import('@/views/Login/Login')
const Schedule = ()=> import('@/views/Schedule/Schedule')
const Business = ()=> import('@/views/Business/Business')
const PdfTemplate = ()=> import('@/views/PdfTemplate/PdfTemplate')
const FclPdfTemplate = () => import('@/views/PdfTemplate/FclPdfTemplate')
const Agreement = () => import('@/views/Agreement/Agreement')
const NotFound = () => import('@/views/NotFound/NotFound')

const Profile = () => import('@/views/Profile/Profile')
const MyOrder = () => import('@/views/Profile/MyOrder/MyOrder')
const MyOrderImport = () => import('@/views/Profile/MyOrder/MyOrderImport')
const MyOrderFcl = () => import('@/views/Profile/MyOrder/MyOrderFcl')
const Subscribe = () => import('@/views/Profile/Subscribe/Subscribe')
const MyInfo = () => import('@/views/Profile/MyInfo/MyInfo')

const routes = [{
  path: '/',
  redirect: '/Home'
}, {
  path: '/Home',
  component: Home
}, {
  path: '/LclList',
  name: '/LclList',
  component: LclList
}, {
  path: '/ILclList',
  name: '/ILclList',
  component: ILclList
}, {
  path: '/FclList',
  name: '/FclList',
  component: FclList
}, {
  path: '/LandList',
  name: '/LandList',
  component: LandList
}, {
  path: '/TruckList',
  name: '/TruckList',
  component: TruckList
}, {
  path: '/AirList',
  name: '/AirList',
  component: AirList
}, {
  path: '/Agreement',
  component: Agreement
}, {
  path: '/Profile',
  component: Profile,
  children: [{
    path: '/',
    redirect: '/MyOrder'
  }, {
    path: '/MyOrder',
    component: MyOrder
  }, {
    path: '/MyOrderImport',
    component: MyOrderImport
  }, {
    path: '/MyOrderFcl',
    component: MyOrderFcl
  }, {
    path: '/Subscribe',
    component: Subscribe
  }, {
    path: '/MyInfo',
    component: MyInfo
  }]
}, {
  path: '/Login',
  component: Login
}, {
  path: '/Schedule',
  component: Schedule
}, {
  path: '/Business',
  name: '/Business',
  component: Business
}, {
  path: '/PdfTemplate',
  name: 'PdfTemplate',
  component: PdfTemplate
}, {
  path: '/FclPdfTemplate',
  name: 'FclPdfTemplate',
  component: FclPdfTemplate
}, {
  path: '/NotFound',
  component: NotFound
}, {
  path: '*',
  redirect: '/NotFound'
}]

const router = new VueRouter({
  routes
})

export default router