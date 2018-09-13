import React, {PureComponent} from 'react';
import {Row,Col,Card,Layout} from 'antd';
import Pressure from './Pressure'
import Temperature from './Temperature'
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";

const {Content} = Layout;
// import MemberMeterSetup from './MemberMeterSetup/Index'
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
      <Content style={{background: '#fff'}}>
        <div className="content">
          <PageHeaderLayout title="系统管理" breadcrumb={[{name: '系统管理'}, {name: '系统设置'}, {name: '集中器离线异常报警设置'}]}>
            <div>
              <Row  gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Card title="压力传感器异常设置">
                    <Pressure />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card title="温度传感器异常设置">
                    <Temperature />
                  </Card>
                </Col>
              </Row>
            </div>
          </PageHeaderLayout>
        </div>
      </Content>
    </Layout>

    );
  }
}

export default UserMeterLife
