import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';
import HeaderBodyLayout from '../layouts/HeaderBodyLayout';

import Login from '../routes/User/Login';
import asyncComponent from './../AsyncComponent'
const Endpoints = asyncComponent(() =>
import(/* webpackChunkName: "Endpoints" */ "../routes/AccessManagement/Endpoints")
)
const OrganizationManage = asyncComponent(() =>
import(/* webpackChunkName: "OrganizationManage" */ "./../routes/PlatformManagement/OrganizationManage")
)
const PlatformSetting = asyncComponent(() =>
import(/* webpackChunkName: "PlatformSetting" */ "./../routes/PlatformManagement/PlatformSetting")
)
const UserManage = asyncComponent(() =>
import(/* webpackChunkName: "UserManage" */ "./../routes/SystemManagement/UserManage")
)
const UsergroupManage = asyncComponent(() =>
import(/* webpackChunkName: "UsergroupManage" */ "./../routes/SystemManagement/UsergroupLayout")
)
const DataStatistics = asyncComponent(() =>
import(/* webpackChunkName: "DataStatistics" */ "./../routes/Application/DataStatistics")
)
const DistributionGraph = asyncComponent(() =>
import(/* webpackChunkName: "DistributionGraph" */ "./../routes/Application/DistributionGraph")
)

const CommunityAnalysis = asyncComponent(() =>
import(/* webpackChunkName: "CommunityAnalysis" */ "./../routes/HeaderBody/CommunityAnalysis/Index")
)

const UserMeterAnalysis = asyncComponent(() =>
import(/* webpackChunkName: "UserMeterAnalysis" */ "./../routes/HeaderBody/UserMeterAnalysis/Index")
)

const UserMeterLife = asyncComponent(() =>
import(/* webpackChunkName: "UserMeterLife" */ "./../routes/HeaderBody/UserMeterLife/Index")
)

const ImportConcentrator = asyncComponent(() =>
import(/* webpackChunkName: "ImportConcentrator" */ "./../routes/HeaderBody/ImportConcentrator/Index")
)

const ConcentratorManage = asyncComponent(() =>
import(/* webpackChunkName: "ConcentratorManage" */ "./../routes/HeaderBody/ConcentratorManage/Index")
)

const StatusCheck = asyncComponent(() =>
import(/* webpackChunkName: "StatusCheck" */ "./../routes/HeaderBody/StatusCheck/Index")
)

const UserArchives = asyncComponent(() =>
import(/* webpackChunkName: "UserArchives" */ "./../routes/HeaderBody/UserArchives/Index")
)
const VendorMange = asyncComponent(() =>
import(/* webpackChunkName: "VendorMange" */ "./../routes/HeaderBody/VendorMange/Index")
)
const NewPage = asyncComponent(() =>
import(/* webpackChunkName: "NewPage" */ "./../routes/NewPage")
)
const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [
  //   {
  //   name: 'Dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [{
  //     name: '分析页',
  //     path: 'analysis',
  //     component: Analysis,
  //   }, {
  //     name: '监控页',
  //     path: 'monitor',
  //     component: Monitor,
  //   }, {
  //     name: '工作台',
  //     path: 'workplace',
  //     component: Workplace,
  //   }],
  // }, {
  //   name: '表单页',
  //   path: 'form',
  //   icon: 'form',
  //   children: [{
  //     name: '基础表单',
  //     path: 'basic-form',
  //     component: BasicForm,
  //   }, {
  //     name: '分步表单',
  //     path: 'step-form',
  //     component: StepForm,
  //     children: [{
  //       path: 'confirm',
  //       component: Step2,
  //     }, {
  //       path: 'result',
  //       component: Step3,
  //     }],
  //   }, {
  //     name: '高级表单',
  //     path: 'advanced-form',
  //     component: AdvancedForm,
  //   }],
  // },
    {
    name: '接入管理',            // 页面名称，会展示在菜单栏中
    path: 'access-management',   // 匹配的路由
    icon: 'tool',              // 页面图标，会展示在菜单栏中
    permissions:['iot_hub_management'],
    children: [{
      name: '实例列表',
      path: 'endpoints',
      component: Endpoints,
      permissions:['iot_hub_management'],
    }],
  },   {
      name: '平台管理',            // 页面名称，会展示在菜单栏中
      path: 'platform-management',   // 匹配的路由
      icon: 'api',              // 页面图标，会展示在菜单栏中
      permissions:['company_add_and_edit','company_status_edit','company_delete'],
      children: [{
        name: '机构管理',
        path: 'organization',
        component:OrganizationManage,
        permissions:['company_add_and_edit','company_status_edit','company_delete'],
      },{
        name: '平台设置',
        path: 'setting',
        component:PlatformSetting,
        permissions:['company_add_and_edit','company_status_edit','company_delete'],
      }],
    },
    {
      name: '系统管理',            // 页面名称，会展示在菜单栏中
      path: 'system-management',   // 匹配的路由
      icon: 'setting',              // 页面图标，会展示在菜单栏中
      permissions:['user_add_and_edit','user_add_and_edit','user_add_and_edit','user_delete','role_add_and_edit','role_add_and_edit','role_delete'],
      children: [{
        name: '用户管理',
        path: 'user',
        component:UserManage,
        permissions:['user_add_and_edit','user_default_password_edit','user_status_edit','user_delete'],
        exact:true
      },{
        name: '用户组管理',
        path: 'usergroup',
        component:UsergroupManage,
        permissions:['role_add_and_edit','role_add_and_edit','role_delete'],

      }],
    },
    {
      name: '应用',            // 页面名称，会展示在菜单栏中
      path: 'application',   // 匹配的路由
      icon: 'appstore-o',              // 页面图标，会展示在菜单栏中
      children: [{
        name: '数据统计',
        path: 'dataStatistics',
        component:DataStatistics,
      },{
        name: '分布图',
        path: 'DistributionGraph',
        component:DistributionGraph,
      }],
    }],
},{
  component: HeaderBodyLayout,
  layout: 'HeaderBodyLayout',
  name: '首页', // for breadcrumb
  path: 'main',
  children: [
    {
      name: '实时数据分析',            // 页面名称，会展示在菜单栏中
      path: 'real_time_data',   // 匹配的路由
      icon: 'area-chart',              // 页面图标，会展示在菜单栏中
      permissions:['iot_hub_management'],
      children: [{
        name: '小区水量分析',
        path: 'community_analysis',
        component: CommunityAnalysis,
        permissions:['iot_hub_management'],
      },{
        name: '户表水量分析',
        path: 'user_meter_analysis',
        component: UserMeterAnalysis,
        permissions:['iot_hub_management'],
      },{
        name: '户表使用年限',
        path: 'user_meter_life',
        component: UserMeterLife,
        permissions:['iot_hub_management'],
      }],
    },  {
      name: '运行管理',            // 页面名称，会展示在菜单栏中
      path: 'run_manage',   // 匹配的路由
      icon: 'dashboard',              // 页面图标，会展示在菜单栏中
      permissions:['iot_hub_management'],
      children: [{
        name: '导入集中器',
        path: 'import_concentrator',
        component: ImportConcentrator,
        permissions:['iot_hub_management'],
      },{
        name: '集中器管理',
        path: 'concentrator_manage',
        component: ConcentratorManage,
        permissions:['iot_hub_management'],
      },{
        name: '指令和状态查看',
        path: 'status_check',
        component: StatusCheck,
        permissions:['iot_hub_management'],
      },{
        name: '用户档案',
        path: 'user_archives',
        component: UserArchives,
        permissions:['iot_hub_management'],
      }],
    },{
      name: '系统管理',            // 页面名称，会展示在菜单栏中
      path: 'system_manage',   // 匹配的路由
      icon: 'setting',              // 页面图标，会展示在菜单栏中
      permissions:['iot_hub_management'],
      children: [{
        name: '厂商管理',
        path: 'vendor_manage',
        component: VendorMange,
        permissions:['iot_hub_management'],
      },{
        name: '水表类型查询',
        path: 'water_meter_search',
        component: NewPage,
        permissions:['iot_hub_management'],
      },{
        name: '集中器类型查询',
        path: 'concentrator_type_search',
        component: NewPage,
        permissions:['iot_hub_management'],
      },{
        name: '交换数据库设置',
        path: 'change_dbase_setting',
        component: NewPage,
        permissions:['iot_hub_management'],
      }],
    },{
      name: '异常分析',            // 页面名称，会展示在菜单栏中
      path: 'unusual_analysis',   // 匹配的路由
      icon: 'pie-chart',              // 页面图标，会展示在菜单栏中
      permissions:['iot_hub_management'],
      children: [{
        name: '集中器异常分析',
        path: 'concentrator_unusual_analysis',
        component: NewPage,
        permissions:['iot_hub_management'],
      },{
        name: '水表异常分析',
        path: 'meter_unusual_analysis',
        component: NewPage,
        permissions:['iot_hub_management'],
      },{
        name: '统计日报',
        path: 'statistics_daily',
        component: NewPage,
        permissions:['iot_hub_management'],
      }],
    }],
}, {
  component: UserLayout,
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }],
  }],
}, {
  component: BlankLayout,
  layout: 'BlankLayout',
  children: {
    name: 'API使用文档',
    path: 'http://api.water.test.com/doc/',
    target: '_blank',
    icon: 'book',
  },
}];

export function getNavData() {
  return data;
}

export default data;
