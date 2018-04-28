import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import ConcentratorError from './ConcentratorError'
import UserMeterError from './UserMeterError'
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
                path={`/${company_code}/main/unusual_analysis/statistics_daily/concentrator_error`}
                component={ConcentratorError}
              />
              <Route
                path={`/${company_code}/main/unusual_analysis/statistics_daily/user_meter_error`}
                component={UserMeterError}
              />
              <Redirect  from={`/${company_code}/main/unusual_analysis/statistics_daily`} to={`/${company_code}/main/unusual_analysis/statistics_daily/concentrator_error`} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
