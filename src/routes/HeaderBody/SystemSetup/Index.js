import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import Working from '../../Exception/working';
import NightWarningSetup from './NightWarningSetup'
import ZeroWarningSetup from './ZeroWarningSetup'
import Unusual_water from './Unusual_water'
// import MemberMeterSetup from './MemberMeterSetup/Index'
import LeakWarningSetup from './LeakWarningSetup'
import VoltageSetup from './VoltageSetup'
import ValveStatusSetup from './ValveStatusSetup'
import ExportSetup from './ExportSetup/Index'
import ConcentratorOfflineSetup from './ConcentratorOfflineSetup'
// import SystemName from './SystemName'
// import SmsNotice from './SmsNotice'
// import EmailNotice from './EmailNotice'
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
                path={`/${company_code}/main/system_manage/system_setup/night_warning_setup`}
                component={NightWarningSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/zero_warning_setup`}
                component={ZeroWarningSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/unusual_water`}
                component={Unusual_water}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/leak_warning_setup`}
                component={LeakWarningSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/voltage_status_setup`}
                component={VoltageSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/valve_status_setup`}
                component={ValveStatusSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/concentrator_offline_setup`}
                component={ConcentratorOfflineSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/export_setup`}
                component={ExportSetup}
              />
           {/*   <Route
                path={`/${company_code}/main/system_manage/system_setup/member_meter_setup`}
                component={MemberMeterSetup}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/system_name`}
                component={Working}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/sms_notice`}
                component={Working}
              />
              <Route
                path={`/${company_code}/main/system_manage/system_setup/email_notice`}
                component={Working}
              />*/}
              <Redirect  from={`/${company_code}/main/system_manage/system_setup`} to={`/${company_code}/main/system_manage/system_setup/night_warning_setup`} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
