import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import LiquidAnalysis from './LiquidAnalysis'
import ValveAnalysis from './ValveAnalysis'
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
            <Switch>
              <Route
                path={`/${company_code}/main/real_time_data/liquid_valve_analysis/liquid_sensors_analysis`}
                component={LiquidAnalysis}
              />
              <Route
                exact
                path={`/${company_code}/main/real_time_data/liquid_valve_analysis/valve_sensors_analysis`}
                component={ValveAnalysis}
              />
              <Redirect  from={`/${company_code}/main/real_time_data/liquid_valve_analysis`} to={`/${company_code}/main/real_time_data/liquid_valve_analysis/liquid_sensors_analysis`} />
            </Switch>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
