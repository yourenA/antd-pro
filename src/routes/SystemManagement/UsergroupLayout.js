import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import asyncComponent from './../../AsyncComponent'
import {Link, Route, Redirect, Switch, Router} from 'dva/router';
const UsergroupManage = asyncComponent(() =>
import
(/* webpackChunkName: "UsergroupManage" */ "./UsergroupManage")
)
const AddOrEditUsergroup = asyncComponent(() =>
import
(/* webpackChunkName: "AddOrEditUsergroup" */ "./addOrEditUsergroup")
)
export default class Manage extends PureComponent {
  state = {};

  componentDidMount() {
  }

  render() {
    return (
      <PageHeaderLayout title={{label: '用户组管理'}} breadcrumb={[{name: '系统管理'}, {name: '用户组管理'}]}>
        <Switch>
          <Route
            exact
            path='/system-management/usergroup'
            component={UsergroupManage}
          />
          <Route
            path='/system-management/usergroup/:id'
            component={AddOrEditUsergroup}
          />
        </Switch>
      </PageHeaderLayout>
    );
  }
}
