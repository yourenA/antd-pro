import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import Working from '../../Exception/working';
import NightWarningSetup from './NightWarningSetup'
import ZeroWarningSetup from './ZeroWarningSetup'
import ExchangeDatabase from './ExchangeDatabase'
import SystemName from './SystemName'
import SmsNotice from './SmsNotice'
import EmailNotice from './EmailNotice'
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
          <div className="content">
            <Switch>
              <Route
                path='/main/system_manage/system_setup/night_warning_setup'
                component={Working}
              />
              <Route
                path='/main/system_manage/system_setup/zero_warning_setup'
                component={Working}
              />
              <Route
                path='/main/system_manage/system_setup/exchange_database'
                component={Working}
              />
              <Route
                path='/main/system_manage/system_setup/system_name'
                component={Working}
              />
              <Route
                path='/main/system_manage/system_setup/sms_notice'
                component={Working}
              />
              <Route
                path='/main/system_manage/system_setup/email_notice'
                component={Working}
              />
              <Redirect  from="/main/system_manage/system_setup" to="/main/system_manage/system_setup/night_warning_setup" />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
