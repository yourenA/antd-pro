import React, { PureComponent } from 'react';
import DynamicData from './DynamicData'
import Proportion from './Proportion'
import ConcentratorOnlife from './ConcentratorOnlife'
import Guage from './Guage'
import { Row, Col, Card,  Icon } from 'antd';
import styles from './main.less'
import moment from 'moment'
import GlobalFooter from './../../components/GlobalFooter';
import request from './../../utils/request'
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
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="昨日集中器在线情况统计"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <ConcentratorOnlife concentrator={this.state.concentrator}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="昨日水表状态统计"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Proportion meter={this.state.meter}/>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="平台统计"
              style={{ marginBottom: 24, minHeight: 509  }}
            >
              <DynamicData />
            </Card>
          </Col>

          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="厂商综合对比"
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 24, minHeight: 509 }}
            >
              <Guage />
            </Card>
          </Col>
        </Row>
        <GlobalFooter
          copyright={
            <div>
              Copyright <Icon type="copyright" /> 2018珠华远传水表监控系统
            </div>
          }
        />
      </div>
    );
  }
}

export default Main
