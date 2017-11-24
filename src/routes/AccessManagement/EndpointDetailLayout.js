import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import asyncComponent from './../../AsyncComponent'
import { Link, Route, Redirect, Switch,routerRedux } from 'dva/router';
import {connect} from 'dva';
const DeviceManage = asyncComponent(() =>
import(/* webpackChunkName: "DeviceManage" */ "./DeviceManage")
)
const StrategyManage = asyncComponent(() =>
import(/* webpackChunkName: "StrategyManage" */ "./StrategyManage")
)
const IdentifyManage = asyncComponent(() =>
import(/* webpackChunkName: "IdentifyManage" */ "./IdentifyManage")
)
const RuleManage = asyncComponent(() =>
import(/* webpackChunkName: "RuleManage" */ "./RuleManage")
)
const AddOrEditRule = asyncComponent(() =>
import(/* webpackChunkName: "AddOrEditRule" */ "./addOrEditRule")
)
@connect(state => ({
  endpoints:state.endpoints,
}))
export default class Manage extends PureComponent {
  state = {
    tabList :[{
    key: 'device',
    tab: '设备管理',
  }, {
    key: 'identify',
    tab: '身份管理',
  }, {
    key: 'strategy',
    tab: '策略管理',
  }, {
    key: 'rule',
    tab: '规则引擎',
  }],
    activeTitle:{key:this.props.location.pathname.split('/')[4], label: ``}
  };

  componentDidMount() {
    const that=this;
    const {dispatch} = this.props;
    const endpoint_id=this.props.match.params.id;
    dispatch({
      type: 'endpoints/fetchName',
      payload: {
        endpoint_id,
      },
      callback:function () {
        const {endpoints} = that.props;
        const name=that.state.tabList.filter(item => item.key===that.state.activeTitle.key)[0].tab
        that.setState({
          activeTitle:{key:that.props.location.pathname.split('/')[4], label: endpoints.name+name}
        })
      }
    });

  }
  handleTabChange = (key) => {
    const { dispatch,endpoints } = this.props;
    switch (key) {
      case 'device':
        this.setState({
          activeTitle:{key:key, label: `${endpoints.name}设备管理`}
        })
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/device`));
        break;
      case 'identify':
        this.setState({
          activeTitle:{key:key, label: `${endpoints.name}身份管理`}
        })
        if(this.props.location.pathname.split('/')[4]!== key){
          dispatch({
            type: 'identify/reset',
          });
        }

        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/identify`));
        break;
      case 'strategy':
        this.setState({
          activeTitle:{key:key, label: `${endpoints.name}策略管理`}
        })
        if(this.props.location.pathname.split('/')[4] !== key){
          dispatch({
            type: 'strategy/reset',
          });
        }

        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/strategy`));
        break;
      case 'rule':
        this.setState({
          activeTitle:{key:key, label: `${endpoints.name}规则引擎`}
        })
        if(this.props.location.pathname.split('/')[4] !== key){
          dispatch({
            type: 'rule/reset',
          });
        }
        dispatch(routerRedux.push(`/access-management/endpoints/${this.props.match.params.id}/rule`));
        break;
      default:
        break;
    }
  }
  render() {
    const name=this.state.tabList.filter(item => item.key===this.state.activeTitle.key)[0].tab
    return (
      <PageHeaderLayout title={this.state.activeTitle} breadcrumb={[{name: '接入管理'}, {
        name: '实例列表',
        link: '/access-management/endpoints'
      }, {name: name}]}
                        tabList={this.state.tabList}
                        onTabChange={this.handleTabChange}>
          <Route
            path='/access-management/endpoints/:id/device'
            component={DeviceManage}
          />
          <Route
            path='/access-management/endpoints/:id/identify'
            component={IdentifyManage}
          />
          <Route
            path='/access-management/endpoints/:id/strategy'
            component={StrategyManage}
          />
          <Route
            exact
            path='/access-management/endpoints/:id/rule'
            component={RuleManage}
          />
        <Route
          exact
          path='/access-management/endpoints/:id/rule/:ruleId'
          component={AddOrEditRule}
        />
      </PageHeaderLayout>
    );
  }
}
