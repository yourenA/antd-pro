import React, { PureComponent } from 'react';
import DynamicData from './HomePage/DynamicData'
import MapData from './HomePage/MapData'
import Proportion from './HomePage/Proportion'
import ConcentratorOnlife from './HomePage/ConcentratorOnlife'
import AreaSupplyList from './HomePage/AreaSupplyList'
import DMArate from './HomePage/DMArate'
import VendorConcentrator from './HomePage/VendorConcentrator'
import Guage from './HomePage/Guage'
import { Row, Col, Card,  Icon } from 'antd';
import styles from './main.less'
import moment from 'moment'
import GlobalFooter from './../../components/GlobalFooter';
import request from './../../utils/request'
import {prefix,projectName,poweredBy} from './../../common/config'
class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time:moment().format('HH:mm:ss'),
      concentrator:{},
      meter:{},
      server:{}
    }
  }
  componentDidMount() {
    // setInterval(this.setTime,1000)
    const that=this;
    request(`/homepage`,{
      method:'GET',
    }).then((response)=>{
      console.log(response);
      that.setState({
        concentrator:response.data.concentrator,
        meter:response.data.meter,
        server:response.data.server
      })
    })
  }
  componentWillUnmount(){
    // clearInterval(this.setTime)
  }
  setTime=()=>{
    this.setState({
      time:moment().format('HH:mm:ss')
    })
  }
  render() {
    return (
      <div className={styles.main}>
        <Row gutter={24}>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem1}`}>
              <div className={styles.count}>{this.state.concentrator.total_count}</div>
              <div className={styles.explain}>集中器总数量</div>
            </div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem3}`}>
              <div className={styles.count}>{this.state.concentrator.yesterday_excellent_rate}</div>
              <div className={styles.explain}>昨天集中器优良率</div>
            </div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem2}`}>
              <div className={styles.count}>{this.state.meter.total_count}</div>
              <div className={styles.explain}>水表总数量</div>
            </div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem3}`}>
              <div className={styles.count}>{this.state.meter.yesterday_upload_rate}</div>
              <div className={styles.explain}>昨天水表上传率</div>
            </div>
          </Col>

          {/*<Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem4}`}>
              <div className={styles.count}>25%</div>
              <div className={styles.explain}>昨天总漏损率</div>
            </div>
          </Col>*/}
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem4}`}>
              <div className={styles.count}>{this.state.server.current_time}</div>
              <div className={styles.explain}>当前获取数据时间</div>
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
        {/*  {
            prefix==='http://api.water.test.com'&&
            <Col xl={18} lg={18} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title="集中器分布"
                bodyStyle={{ padding: 24 }}
                style={{ marginBottom: 24, minHeight: 609 }}
              >
                <MapData/>
              </Card>
            </Col>
          }*/}
          {
            prefix==='http://api.water.test.com'&&
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title="五大区供水一览"
                bodyStyle={{ padding: 24 }}
                style={{ marginBottom: 24, minHeight: 509 }}
              >
                <AreaSupplyList/>
              </Card>
            </Col>

          }
          {
            prefix==='http://api.water.test.com' &&
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title="DMA损漏率"
                bodyStyle={{ padding: 24 }}
                style={{ marginBottom: 24, minHeight: 509 }}
              >
                <DMArate/>
              </Card>
            </Col>
          }
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="昨日集中器在线情况统计"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <ConcentratorOnlife concentrator={this.state.concentrator}/>
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="昨日水表状态统计"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Proportion meter={this.state.meter}/>
            </Card>
          </Col>

          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="厂商-集中器/水表个数"
              style={{ marginBottom: 24, minHeight: 509  }}
            >
              <VendorConcentrator />
            </Card>
          </Col>
          {/*
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="厂商综合对比"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Guage />
            </Card>
          </Col>*/}
        </Row>
        <GlobalFooter
          copyright={
            <div>
               powered by {poweredBy}
            </div>
          }
        />
      </div>
    );
  }
}

export default Main
