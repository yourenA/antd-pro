import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './index.less'
import Locations from './../Locations/Index'
import MeterImagesManage from './../MeterImagesManage/Index'
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
                path={`/${company_code}/main/system_manage/locations_manage/router_manage`}
                component={Locations}
              />
             <Route
                exact
                path={`/${company_code}/main/system_manage/locations_manage/meter_images_manage`}
                component={MeterImagesManage}
              />
              <Redirect  from={`/${company_code}/main/system_manage/locations_manage`} to={`/${company_code}/main/system_manage/locations_manage/router_manage`} />
            </Switch>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
