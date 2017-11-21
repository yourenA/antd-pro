import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Icon, Divider } from 'antd';


class Dashboard extends PureComponent {
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard
