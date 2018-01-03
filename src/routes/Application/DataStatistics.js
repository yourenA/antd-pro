import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Col,
  Row
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import './DataStatistics.less'
import DynamicData from './DynamicData'
import Proportion from './Proportion'
@connect(state => ({
  endpoints: state.endpoints,
}))
@Form.create()
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }
  render() {
    return (
      <PageHeaderLayout title={{label: '数据统计'}} breadcrumb={[{name: '应用'}, {name: '数据统计'}]}>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="动态数据"
              style={{ marginBottom: 24 }}
            >
              <DynamicData />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="销售额类别占比"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Proportion />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
