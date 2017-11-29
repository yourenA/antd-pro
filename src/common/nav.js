import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';

// import Analysis from '../routes/Dashboard/Analysis';
// import Monitor from '../routes/Dashboard/Monitor';
// import Workplace from '../routes/Dashboard/Workplace';
//
// import TableList from '../routes/List/TableList';
// import CoverCardList from '../routes/List/CoverCardList';
// import CardList from '../routes/List/CardList';
// import FilterCardList from '../routes/List/FilterCardList';
// import SearchList from '../routes/List/SearchList';
// import BasicList from '../routes/List/BasicList';
//
// import BasicProfile from '../routes/Profile/BasicProfile';
// import AdvancedProfile from '../routes/Profile/AdvancedProfile';
//
// import BasicForm from '../routes/Forms/BasicForm';
// import AdvancedForm from '../routes/Forms/AdvancedForm';
// import StepForm from '../routes/Forms/StepForm';
// import Step2 from '../routes/Forms/StepForm/Step2';
// import Step3 from '../routes/Forms/StepForm/Step3';
//
// import Exception403 from '../routes/Exception/403';
// import Exception404 from '../routes/Exception/404';
// import Exception500 from '../routes/Exception/500';
//
// import Success from '../routes/Result/Success';
// import Error from '../routes/Result/Error';
// import NewPage from '../routes/NewPage';

import Login from '../routes/User/Login';
// import Register from '../routes/User/Register';
// import RegisterResult from '../routes/User/RegisterResult';

// import Endpoints from '../routes/AccessManagement/Endpoints';
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
    children: [{
      name: '实例列表',
      path: 'endpoints',
      component: Endpoints,
    }],
  },   {
      name: '平台管理',            // 页面名称，会展示在菜单栏中
      path: 'platform-management',   // 匹配的路由
      icon: 'api',              // 页面图标，会展示在菜单栏中
      children: [{
        name: '机构管理',
        path: 'organization',
        component:OrganizationManage,
      },{
        name: '平台设置',
        path: 'setting',
        component:PlatformSetting,
      }],
    },
    {
      name: '系统管理',            // 页面名称，会展示在菜单栏中
      path: 'system-management',   // 匹配的路由
      icon: 'setting',              // 页面图标，会展示在菜单栏中
      children: [{
        name: '用户管理',
        path: 'user',
        component:UserManage,
        exact:true
      },{
        name: '用户组管理',
        path: 'usergroup',
        component:UsergroupManage,
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
