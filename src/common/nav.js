import BasicLayout from '../layouts/BasicLayout';
// import UserLayout from '../layouts/UserLayout';
// import BlankLayout from '../layouts/BlankLayout';
import HeaderBodyLayout from '../layouts/HeaderBodyLayout';
import TestLayout from '../layouts/TestLayout';
import {prefix} from './config'
// import Login from '../routes/User/Login';
// import asyncComponent from './../AsyncComponent'
// const Endpoints = asyncComponent(() =>
// import(/* webpackChunkName: "Endpoints" */ "../routes/AccessManagement/Endpoints")
// )
// import Test from '../routes/HeaderBody/Test/RowSpan'
// import Demo from '../routes/HeaderBody/Demo'
import UserInfo from './../routes/UserInfo/Index'
// const OrganizationManage = asyncComponent(() =>
// import(/* webpackChunkName: "OrganizationManage" */ "./../routes/PlatformManagement/OrganizationManage")
// )
import OrganizationManage from './../routes/PlatformManagement/OrganizationManage'

// const PlatformSetting = asyncComponent(() =>
// import(/* webpackChunkName: "PlatformSetting" */ "./../routes/PlatformManagement/PlatformSetting")
// )
// import PlatformSetting from './../routes/PlatformManagement/PlatformSetting'

// const UserManage = asyncComponent(() =>
// import(/* webpackChunkName: "UserManage" */ "./../routes/SystemManagement/UserManage")
// )
// import UserManage from './../routes/SystemManagement/UserManage'

// const UsergroupManage = asyncComponent(() =>
// import(/* webpackChunkName: "UsergroupManage" */ "./../routes/SystemManagement/UsergroupLayout")
// )

// import UsergroupManage from './../routes/SystemManagement/UsergroupLayout'

// const DataStatistics = asyncComponent(() =>
// import(/* webpackChunkName: "DataStatistics" */ "./../routes/Application/DataStatistics")
// )
// import DataStatistics from './../routes/Application/DataStatistics'

// const DistributionGraph = asyncComponent(() =>
// import(/* webpackChunkName: "DistributionGraph" */ "./../routes/Application/DistributionGraph")
// )
// import DistributionGraph from './../routes/Application/DistributionGraph'

// const CommunityAnalysis = asyncComponent(() =>
// import(/* webpackChunkName: "CommunityAnalysis" */ "./../routes/HeaderBody/CommunityAnalysis/Index")
// )
import CommunityAnalysis from './../routes/HeaderBody/CommunityAnalysis/Index'
import HYCommunityAnalysis from './../routes/HeaderBody/HYCommunityAnalysis/Index'
import ManuallyCommunityAnalysis from './../routes/HeaderBody/ManuallyCommunityAnalysis/Index'
import MapDemo from './../routes/HeaderBody/MapDemo/Index'
import ConcentratorMaps from './../routes/HeaderBody/ConcentratorMaps/Index'
import BigMeterAnalysis from './../routes/HeaderBody/BigMeterAnalysis/Index'
import MonitoringMeterManage from './../routes/HeaderBody/MonitoringMeterManage/Index'
import ManuallyMeterManage from './../routes/HeaderBody/ManuallyMeterManage/Index'

// const UserMeterAnalysis = asyncComponent(() =>
// import(/* webpackChunkName: "UserMeterAnalysis" */ "./../routes/HeaderBody/UserMeterAnalysis/Index")
// )
import UserMeterAnalysis from './../routes/HeaderBody/UserMeterAnalysis/Index'
import PressureAnalysis from './../routes/HeaderBody/MYSPressureAnalysis/Index'
import MYSBigMeterAnalysis from './../routes/HeaderBody/MYSBigMeterAnalysis/Index'
// import TemperatureAnalysis from './../routes/HeaderBody/PressureAnalysis/Index'
import MemberConsumption from './../routes/HeaderBody/MemberConsumption/Index'

// const UserMeterLife = asyncComponent(() =>
// import(/* webpackChunkName: "UserMeterLife" */ "./../routes/HeaderBody/MeterStatus/Index")
// )
// import UserMeterLife from './../routes/HeaderBody/MeterStatus/Index'
import CompleteRealData from './../routes/HeaderBody/CompleteRealData/Index'

// const ProductionMarketingAnalysis = asyncComponent(() =>
// import(/* webpackChunkName: "ProductionMarketingAnalysis" */ "./../routes/HeaderBody/ProductionMarketingAnalysis/Index")
// )
// import ProductionMarketingAnalysis from './../routes/HeaderBody/ProductionMarketingAnalysis/Index'

// const ImportConcentrator = asyncComponent(() =>
// import(/* webpackChunkName: "ImportConcentrator" */ "./../routes/HeaderBody/ImportConcentrator/Index")
// )
// import ImportConcentrator from './../routes/HeaderBody/ImportConcentrator/Index'

// const ConcentratorManage = asyncComponent(() =>
// import(/* webpackChunkName: "ConcentratorManage" */ "./../routes/HeaderBody/ConcentratorManage/Index")
// )
import ConcentratorManage from './../routes/HeaderBody/ConcentratorManage/Index'

// const VendorConcentrator = asyncComponent(() =>
// import(/* webpackChunkName: "VendorConcentrator" */ "./../routes/HeaderBody/VendorConcentrator/Index")
// )
import VendorConcentrator from './../routes/HeaderBody/VendorConcentrator/Index'


// const DMAManage = asyncComponent(() =>
// import(/* webpackChunkName: "DMAManage" */ "./../routes/HeaderBody/DMAManage/Index")
// )
import DMA from '../routes/HeaderBody/DMA/Index'
import FlowMeters from './../routes/HeaderBody/FlowMeters/Index'

// const Servers = asyncComponent(() =>
// import(/* webpackChunkName: "Servers" */ "./../routes/HeaderBody/Servers/Index")
// )
import Servers from './../routes/HeaderBody/Servers/Index'
import Locations from './../routes/HeaderBody/LocationsManage/Index'

// const StatusCheck = asyncComponent(() =>
// import(/* webpackChunkName: "StatusCheck" */ "./../routes/HeaderBody/StatusCheck/Index")
// )
// import StatusCheck from './../routes/HeaderBody/StatusCheck/Index'

// const UserArchives = asyncComponent(() =>
// import(/* webpackChunkName: "UserArchives" */ "./../routes/HeaderBody/UserArchives/Index")
// )
import UserArchives from './../routes/HeaderBody/UserArchives/Index'

// const VendorMange = asyncComponent(() =>
// import(/* webpackChunkName: "VendorMange" */ "./../routes/HeaderBody/VendorMange/Index")
// )
import VendorMange from './../routes/HeaderBody/VendorMange/Index'

// const MeterModels = asyncComponent(() =>
// import(/* webpackChunkName: "MeterModels" */ "./../routes/HeaderBody/MeterModels/Index")
// )
import MeterModels from './../routes/HeaderBody/MeterModels/Index'
import LiquidSensors from './../routes/HeaderBody/LiquidSensors/Index'
import ValveSensors from './../routes/HeaderBody/ValveSensors/Index'
import LiquidValveAnalysis from './../routes/HeaderBody/LiquidValveAnalysis/Index'

// const Meters = asyncComponent(() =>
// import(/* webpackChunkName: "Meters" */ "./../routes/HeaderBody/Meters/Index")
// )
import Meters from './../routes/HeaderBody/Meters/Index'
import Pressure from './../routes/HeaderBody/Pressure/Index'
import Temperature from './../routes/HeaderBody/Temperature/Index'

// const ConcentratorModels = asyncComponent(() =>
// import(/* webpackChunkName: "ConcentratorModels" */ "./../routes/HeaderBody/ConcentratorModels/Index")
// )
import ConcentratorModels from './../routes/HeaderBody/ConcentratorModels/Index'

// const UsersManage = asyncComponent(() =>
// import(/* webpackChunkName: "UsersManage" */ "./../routes/HeaderBody/UsersManage/Index")
// )


// import UsersManage from './../routes/HeaderBody/UsersManage/Index'


// const AccountManage = asyncComponent(() =>
// import(/* webpackChunkName: "AccountManage" */ "./../routes/HeaderBody/AccountManage/Index")
// )
import AccountManage from './../routes/HeaderBody/AccountManage/Index'

// const AreaManage = asyncComponent(() =>
// import(/* webpackChunkName: "AreaManage" */ "./../routes/HeaderBody/AreaManage/Index")
// )
import AreaManage from './../routes/HeaderBody/AreaManage/Index'
import DataImportProcess from './../routes/HeaderBody/DataImportProcess/Index'

// const SystemSetup = asyncComponent(() =>
// import(/* webpackChunkName: "SystemSetup" */ "./../routes/HeaderBody/SystemSetup/Index")
// )
import SystemSetup from './../routes/HeaderBody/SystemSetup/Index'

// const ConcentratorErrorAnalysis = asyncComponent(() =>
// import(/* webpackChunkName: "ConcentratorErrorAnalysis" */ "./../routes/HeaderBody/ConcentratorErrorAnalysis/Index")
// )
import ConcentratorErrorAnalysis from './../routes/HeaderBody/ConcentratorErrorAnalysis/Index'

// const MeterErrorAnalysis = asyncComponent(() =>
// import(/* webpackChunkName: "MeterErrorAnalysis" */ "./../routes/HeaderBody/MeterErrorAnalysis/Index")
// )
import MeterErrorAnalysis from './../routes/HeaderBody/MeterErrorAnalysis/Index'

import Consumption_abnormality from '../routes/HeaderBody/Consumption_abnormality/Index'
import Leak_abnormality from '../routes/HeaderBody/Leak_abnormality/Index'
import ValveStatusAbnormality from '../routes/HeaderBody/Valve_status_abnormality/Index'
import VoltageStatusAbnormality from '../routes/HeaderBody/VoltageStatusAbnormality/Index'

// const StatisticsDaily = asyncComponent(() =>
// import(/* webpackChunkName: "StatisticsDaily" */ "./../routes/HeaderBody/StatisticsDaily/Index")
// )
import StatisticsDaily from './../routes/HeaderBody/StatisticsDaily/Index'

// const NewPage = asyncComponent(() =>
// import(/* webpackChunkName: "NewPage" */ "./../routes/NewPage")
// )
import NewPage from './../routes/NewPage'

// const  Test1= asyncComponent(() =>
// import(/* webpackChunkName: "NewPage" */ "./../routes/Test/Test1/Index")
// )
import Test1 from './../routes/Test/Test1/Index'

import NightAbnormality from './../routes/HeaderBody/NightAbnormality/Index'
import ZeroAbnormality from './../routes/HeaderBody/ZeroAbnormality/Index'

import Working from '../routes/Exception/working';
const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [
    {
      name: 'home',            // 页面名称，会展示在菜单栏中
      path: 'home',   // 匹配的路由
      icon: 'home',              // 页面图标，会展示在菜单栏中
      component: NewPage,
    },
    {
      name: '个人中心',            // 页面名称，会展示在菜单栏中
      path: 'user-info',   // 匹配的路由
      icon: 'user',              // 页面图标，会展示在菜单栏中
      component: UserInfo,
      noshowInSibar: true
    },
    {
      name: '平台管理',            // 页面名称，会展示在菜单栏中
      path: 'platform-management',   // 匹配的路由
      icon: 'api',              // 页面图标，会展示在菜单栏中
      permissions: ['company_add_and_edit', 'company_status_edit', 'company_delete'],
      children: [{
        name: '机构管理',
        path: 'organization',
        component: OrganizationManage,
        permissions: ['company_add_and_edit', 'company_status_edit', 'company_delete'],
      }
      // , {
      //   name: '平台设置',
      //   path: 'setting',
      //   component: PlatformSetting,
      //   permissions: ['company_add_and_edit', 'company_status_edit', 'company_delete'],
      // }
      ],
    },
    /* {
     name: '接入管理',            // 页面名称，会展示在菜单栏中
     path: 'access-management',   // 匹配的路由
     icon: 'tool',              // 页面图标，会展示在菜单栏中
     permissions:['iot_hub_management'],
     children: [{
     name: '实例列表',
     path: 'endpoints',
     component: Endpoints,
     icon: 'tool',
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
     }*/],
}, {
  component: HeaderBodyLayout,
  layout: 'HeaderBodyLayout',
  name: 'home', // for breadcrumb
  path: 'main',
  children: [
    {
      name: 'data_analysis',            // 页面名称，会展示在菜单栏中
      path: 'real_time_data',   // 匹配的路由
      icon: 'area-chart',              // 页面图标，会展示在菜单栏中
      permissions: ['village_difference_consumption', 'meter_status','concentrator_real_time_data','pressure_sensor_historical_data', 'village_meter_data', 'member_meter_data'],
      children: [
        {
          name: 'village_meter_data',
          path: 'community_analysis',
          component: CommunityAnalysis,
          permissions: ['village_meter_data',],
          noShowCompany: ['hy','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'village_meter_data',
          path: 'hy_community_analysis',
          component: HYCommunityAnalysis,
          permissions: ['village_meter_data',],
          showCompany: ['hy','amwares','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'village_meter_data_manual',
          path: 'manually_community_analysis',
          component: ManuallyCommunityAnalysis,
          permissions: ['village_meter_data',],
          showCompany: ['hy','amwares','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        }, {
          name: 'meter_volume_data',
          path: 'user_meter_analysis',
          component: UserMeterAnalysis,
          permissions: ['member_meter_data'],
        },
        {
          name: 'big_meter_volume',
          path: 'big_meter_analysis',
          component: BigMeterAnalysis,
          permissions: ['member_meter_data'],
          showCompany: ['hy','amwares']
        },{
          name: 'user_meter_volume',
          path: 'member_consumption',
          component: MemberConsumption,
          permissions: ['member_consumption'],
          noShowCompany: ['hy','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'pressure/temperature_map',
          path: 'map_demo',
          component: MapDemo,
          permissions: ['concentrator_real_time_data',],
          showCompany: ['zhsgy','amwares']
        },
        {
          name: 'big_meter_analysis_map',
          path: 'big_meter_map',
          component: ConcentratorMaps,
          permissions: ['concentrator_maps',],
          showCompany: ['mys','gxcz','amwares']
        },
        {
          name: 'mys_big_meter_analysis',
          path: 'mys_big_meter_analysis',
          component: MYSBigMeterAnalysis,
          showCompany: ['mys','gxcz','amwares','zhsgy','hngydx']
        },
        {
          name: 'pressure_history',
          path: 'pressure_analysis',
          component: PressureAnalysis,
          permissions: ['pressure_sensor_historical_data'],
          showCompany: ['zhsgy','amwares','mys','gxcz','test','hngydx']
        },
        // {
        //   name: '温度传感器历史分析',
        //   path: 'temperature_analysis',
        //   component: TemperatureAnalysis,
        //   permissions: ['pressure_sensor_historical_data'],
        //   showCompany: ['amwares','zhsgy']
        //
        // },
        // {
        //   name: '户表使用年限',
        //   path: 'user_meter_life',
        //   component: UserMeterLife,
        //   permissions: ['meter_status'],
        // },
        {
          name: 'real_time_data',
          path: 'complete_realData',
          component: CompleteRealData,
          permissions: ['complete_meter_data'],
          noShowCompany: ['hy','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'vendor_concentrator_statistics',
          path: 'vendor_concentrator',
          component: VendorConcentrator,
          permissions: ['manufacturer_status'],
        },
        {
          name: 'liquid/valve_analysis',
          path: 'liquid_valve_analysis',
          component: LiquidValveAnalysis,
          permissions: ['company_visit',],
          showCompany: ['mys','gxcz','test','amwares','hngydx']
        }
        // ,{
        //   name: '产销差分析',
        //   path: 'production_marketing__analysis',
        //   component: ProductionMarketingAnalysis,
        //   permissions:['village_difference_consumption'],
        // },
      ],
    }, {
      name: 'device',            // 页面名称，会展示在菜单栏中
      path: 'run_manage',   // 匹配的路由
      icon: 'dashboard',              // 页面图标，会展示在菜单栏中
      permissions: [ 'valve_sensor_add_and_edit','valve_sensor_delete','liquid_sensor_add_and_edit','liquid_sensor_delete',
        'temperature_sensor_add_and_edit', 'temperature_sensor_delete', 'pressure_sensor_add_and_edit',
        'manually_monitoring_meter_add_and_edit','manually_monitoring_meter_delete','pressure_sensor_delete', 'concentrator_model_delete', 'concentrator_model_add_and_edit', 'meter_model_delete', 'meter_model_add_and_edit', 'meter_add_and_edit', 'meter_delete', 'concentrator_add_and_edit', 'concentrator_delete', 'flow_meter_add_and_edit', 'flow_meter_delete'],
      children: [

        //   ,
        //   {
        //   name: '导入集中器',
        //   path: 'import_concentrator',
        //   component: ImportConcentrator,
        //   permissions:['iot_hub_management'],
        // }
        // ,
        {
          name: 'concentrator_manage',
          path: 'concentrator_manage',
          component: ConcentratorManage,
          permissions: [ 'concentrator_add_and_edit', 'concentrator_delete'],
        },
        {
          name: 'concentrator_type_manage',
          path: 'concentrator_type_search',
          component: ConcentratorModels,
          permissions: [ 'concentrator_model_delete', 'concentrator_model_add_and_edit'],
        }, {
          name: 'meter_manage',
          path: 'water_meter_manage',
          component: Meters,
          permissions: [ 'meter_add_and_edit', 'meter_delete'],
        },
        {
          name: 'meter_type_manage',
          path: 'water_meter_search',
          component: MeterModels,
          permissions: [ 'meter_model_delete', 'meter_model_add_and_edit'],
        },
        {
          name: 'liquid_sensors_manage',
          path: 'liquid_sensors_manage',
          component: LiquidSensors,
          permissions: [ 'liquid_sensor_add_and_edit','liquid_sensor_delete'],
          showCompany: ['mys','gxcz','test','amwares','hngydx']
        },
        {
          name: 'valve_sensors_manage',
          path: 'valve_sensors_manage',
          component: ValveSensors,
          permissions: [ 'valve_sensor_add_and_edit','valve_sensor_delete'],
          showCompany: ['mys','gxcz','test','amwares','hngydx']
        },
        {
          name: 'monitor_meter_manage',
          path: 'monitor_meter_manage',
          component: MonitoringMeterManage,
          permissions: [ 'monitoring_meter_edit'],
          showCompany: ['hy','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'manually_meter_manage',
          path: 'manually_meter_manage',
          component: ManuallyMeterManage,
          permissions: [ 'manually_monitoring_meter_add_and_edit','manually_monitoring_meter_delete'],
          showCompany: ['hy','amwares','hz_test','wm_test','sc_test','hz_test_8409','wm_test_8410','sc_test_8411']
        },
        {
          name: 'pressure_sensors_manage',
          path: 'pressure_sensors',
          component: Pressure,
          permissions: [ 'pressure_sensor_add_and_edit', 'pressure_sensor_delete'],
          showCompany: ['zhsgy','amwares','mys','gxcz','zhsgy','test','hngydx']
        },
        {
          name: 'temperature_sensors_manage',
          path: 'temperature_sensors',
          component: Temperature,
          permissions: [ 'temperature_sensor_add_and_edit', 'temperature_sensor_delete'],
          showCompany: ['zhsgy','amwares']
        },
        //   {
        //   name: '指令和状态查看',
        //   path: 'status_check',
        //   component: StatusCheck,
        //   permissions:['company_visit'],
        // },
        {
          name: 'flow_meters_manage',
          path: 'flow_meters',
          component: FlowMeters,
          permissions: [ 'flow_meter_add_and_edit', 'flow_meter_delete'],
          showCompany: ['hy','amwares']
        }

      ],
    }, {
      name: 'system',            // 页面名称，会展示在菜单栏中
      path: 'system_manage',   // 匹配的路由
      icon: 'setting',              // 页面图标，会展示在菜单栏中
      permissions: ['config_edit', 'area_add_and_edit', 'area_delete', 'server_add_and_edit', 'server_status_edit', 'server_delete', 'member_add_and_edit', 'member_delete', 'concentrator_add_and_edit', 'role_add_and_edit', 'role_status_edit', 'role_delete', 'user_add_and_edit', 'user_delete', 'manufacturer_delete', 'manufacturer_add_and_edit'],
      children: [
        {
          name: 'system_setting',
          path: 'system_setup',
          component: SystemSetup,
          permissions: ['config_edit'],
        },
        {
          name: 'user_profile',
          path: 'user_archives',
          component: UserArchives,
          permissions: ['member_add_and_edit', 'member_delete'],
        },
        {
          name: 'vendor_manage',
          path: 'vendor_manage',
          component: VendorMange,
          permissions: [ 'manufacturer_delete', 'manufacturer_add_and_edit'],
        },
        {
          name: 'village_manage',
          path: 'area_manage',
          component: AreaManage,
          permissions: [ 'village_add_and_edit', 'village_delete'],
        },

        {
          name: 'servers_manage',
          path: 'servers_manage',
          component: Servers,
          permissions: [ 'server_add_and_edit', 'server_status_edit', 'server_delete'],
        },
        {
          name: 'dma',
          path: 'DMA',
          component: DMA,
          permissions: [ 'area_add_and_edit', 'area_delete'],
          showCompany: ['hy','amwares']
        },
        {
          name: 'meter_reading_path',
          path: 'locations_manage',
          component: Locations,
          permissions: [ 'location_edit'],
          showCompany: ['amwares']
        },

        {
          name: 'account_manage',
          path: 'account_manage',
          component: AccountManage,
          permissions: ['user_add_and_edit', 'user_delete', 'role_add_and_edit', 'role_status_edit', 'role_delete'],
        }, {
          name: 'add_data_at_one_stop',
          path: 'data_import_process',
          component: DataImportProcess,
          permissions: ['member_add_and_edit', 'concentrator_add_and_edit', 'meter_model_delete', 'meter_add_and_edit', 'village_add_and_edit', 'concentrator_model_add_and_edit', 'manufacturer_add_and_edit'],
        }],
    }, {
      name: 'abnormal_analysis',            // 页面名称，会展示在菜单栏中
      path: 'unusual_analysis',   // 匹配的路由
      icon: 'pie-chart',              // 页面图标，会展示在菜单栏中
      permissions: ['concentrator_error_analysis', 'meter_error_analysis', 'daily_error', 'consumption_abnormality', 'zero_abnormality', 'leak_abnormality', 'night_abnormality'],
      children: [{
        name: 'concentrator_abnormal_analysis',
        path: 'concentrator_unusual_analysis',
        component: ConcentratorErrorAnalysis,
        permissions: ['concentrator_error_analysis'],
      }, {
        name: 'water_meter_abnormal_analysis',
        path: 'meter_unusual_analysis',
        component: MeterErrorAnalysis,
        permissions: ['meter_error_analysis'],
      }, {
        name: 'Statistical_daily',
        path: 'statistics_daily',
        component: StatisticsDaily,
        permissions: ['daily_error'],
      }, {
        name: 'water_consumption_abnormal_analysis',
        path: 'consumption_abnormality',
        component: Consumption_abnormality,
        permissions: ['consumption_abnormality'],
      }, {
        name: 'zero_consumption_abnormal_analysis',
        path: 'zero_abnormality',
        component: ZeroAbnormality,
        permissions: ['zero_abnormality'],
      }, {
        name: 'water_leak_abnormal_analysis',
        path: 'leak_abnormality',
        component: Leak_abnormality,
        permissions: ['leak_abnormality'],
      }, {
        name: 'night_consumption_abnormal_analysis',
        path: 'night_abnormality',
        component: NightAbnormality,
        permissions: ['night_abnormality'],
      }, {
        name: 'valve_status_abnormal_analysis',
        path: 'valve_status_abnormality',
        component: ValveStatusAbnormality,
        permissions: ['valve_status_abnormality'],
      }
        , {
          name: 'voltage_status_abnormal_analysis',
          path: 'voltage_status_abnormality',
          component: VoltageStatusAbnormality,
          permissions: ['voltage_status_abnormality'],
        }],
    }],
},
  {
    component: TestLayout,
    layout: 'TestLayout',
    name: '测试', // for breadcrumb
    path: 'test',
    children: [
      {
        name: '测试1',
        path: '1',
        component: Test1,
      }
    ]
  }, /*{
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
   children: [{
   name: '珠华远传',
   path: '/main',
   target: '_self',
   icon: 'table',
   },{
   name: 'API使用文档',
   path: 'http://api.water.test.com/doc/',
   target: '_blank',
   icon: 'book',
   }],
   }*/];

export function getNavData() {
  return data;
}

export default data;
