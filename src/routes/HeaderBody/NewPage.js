import React, { PureComponent } from 'react';
import { connect } from 'dva';
import DynamicData from './../Application/DynamicData'
import Proportion from './../Application/Proportion'
import ConcentratorOnlife from './ConcentratorOnlife'
import Guage from './Guage'
import { Row, Col, Card, Table, Icon, Divider } from 'antd';
import styles from './main.less'

class Dashboard extends PureComponent {
  componentDidMount() {
  }
  render() {
    return (
      <div className={styles.main}>
        <Row gutter={24}>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem1}`}></div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem2}`}></div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem3}`}></div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem4}`}></div>
          </Col>
        </Row>
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
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="集中器在线情况统计"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <ConcentratorOnlife />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="完成率"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Guage />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard
