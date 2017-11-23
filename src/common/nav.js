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

import Endpoints from '../routes/AccessManagement/Endpoints';
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
