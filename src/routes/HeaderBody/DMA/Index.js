import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import DMAShow from './DMAShow'
import DMAManage from './../AreaManage/Index'
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
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content style={{background:'#fff'}}>
          <Switch>
            <Route
              path='/main/run_manage/DMA/DMA_show'
              component={DMAShow}
            />
            <Route
              exact
              path='/main/run_manage/DMA/DMA_manage'
              component={null}
            />
            <Redirect  from="/main/run_manage/DMA" to="/main/run_manage/DMA/DMA_show" />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
