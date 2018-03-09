import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import UsersManage from './../UsersManage/Index'
import UsergroupManage from './../UsergroupManage/Index'
import AddOrEditUsergroup from './../UsergroupManage/addOrEditUsergroup'
const { Content} = Layout;
@connect(state => ({
  endpoints: state.endpoints,
}))
class UserMeterLife extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content style={{background:'#fff'}}>
            <Switch>
              <Route
                path='/main/system_manage/account_manage/user_manage'
                component={UsersManage}
              />
              <Route
                exact
                path='/main/system_manage/account_manage/user_group_manage'
                component={UsergroupManage}
              />
              <Route
                path='/main/system_manage/account_manage/user_group_manage/:id'
                component={AddOrEditUsergroup}
              />
              <Redirect  from="/main/system_manage/account_manage" to="/main/system_manage/account_manage/user_manage" />
            </Switch>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
