import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Button, Layout,message} from 'antd';
import Sider from './Sider'
import Heartbeat from './Heartbeat'
import FunctionContent from './Function'
import Timing from './Timing'
import {connect} from 'dva';
import moment from 'moment'
import { Link, Route, Redirect, Switch,} from 'dva/router';
import Working from '../../Exception/working';
import './index.less'
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
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <Switch>
              <Route
                path={`/${company_code}/main/run_manage/status_check/heartbeat`}
                component={ Working}
              />
              <Route
                path={`/${company_code}/main/run_manage/status_check/function`}
                component={Working}
              />
              <Route
                path={`/${company_code}/main/run_manage/status_check/timing`}
                component={  Working}
              />
              <Redirect  from={`/${company_code}/main/run_manage/status_check`} to={`/${company_code}/main/run_manage/status_check/heartbeat`} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
