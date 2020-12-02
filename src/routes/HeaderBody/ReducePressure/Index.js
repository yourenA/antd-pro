import React, {PureComponent} from 'react';
import {Layout} from 'antd';
import Sider from './Sider'
import {connect} from 'dva';
import { Link, Route, Redirect, Switch,} from 'dva/router';
import './../StatisticsDaily/index.less'
import List from './PressManage'
import Task from './PressTask'
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
                path={`/${company_code}/main/run_manage/reduce_pressure_manage/reduce_pressure_list`}
                component={List}
              />
              <Route
                path={`/${company_code}/main/run_manage/reduce_pressure_manage/reduce_pressure_task`}
                component={Task}
              />
              <Redirect  from={`/${company_code}/main/run_manage/reduce_pressure_manage`} to={`/${company_code}/main/run_manage/reduce_pressure_manage/reduce_pressure_list`} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserMeterLife
