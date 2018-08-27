import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import DMAShow from './DMAShow'
import DMAManage from './DMAManage/Index'
import DMAData from './DMAData/Index'
const { Content} = Layout;
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
              path={`/${company_code}/main/system_manage/DMA/DMA_show`}
              component={DMAShow}
            />
            <Route
              exact
              path={`/${company_code}/main/system_manage/DMA/DMA_manage`}
              component={DMAManage}
            />
            <Route
              exact
              path={`/${company_code}/main/system_manage/DMA/DMA_data`}
              component={DMAData}
            />
            <Redirect  from={`/${company_code}/main/system_manage/DMA`} to={`/${company_code}/main/system_manage/DMA/DMA_data`} />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
