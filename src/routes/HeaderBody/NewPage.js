import React, { PureComponent } from 'react';
import DynamicData from './HomePage/DynamicData'
import MapData from './HomePage/MapData'
import Proportion from './HomePage/Proportion'
import ConcentratorOnlife from './HomePage/ConcentratorOnlife'
import AreaSupplyList from './HomePage/AreaSupplyList'
import DMArate from './HomePage/DMArate'
import VendorConcentrator from './HomePage/VendorConcentrator'
import DMADate from './HomePage/DMADate'
import Guage from './HomePage/Guage'
import { Row, Col, Card,  Icon } from 'antd';
import { routerRedux} from 'dva/router';
import styles from './main.less'
import moment from 'moment'
import GlobalFooter from './../../components/GlobalFooter';
import request from './../../utils/request'
import {prefix,projectName,poweredBy} from './../../common/config'
import {connect} from 'dva';
@connect(state => ({
}))
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
    const dispatch = this.props.dispatch;
    const company_code = sessionStorage.getItem('company_code');
    return (
      <div className={styles.main}>
        <Row gutter={16}>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem1}`}>
              <div className={styles.count}>{this.state.concentrator.total_count}</div>
              <div className={styles.explain}>集中器总数量</div>
            </div>
          </Col>
          <Col  xl={6} lg={6} md={12} sm={24} >
            <div  className={`${styles.topItem} ${styles.topItem3}`}>
              <div className={styles.count}>{this.state.concentrator.yesterday_excellent_rate}</div>
              <div className={styles.explain}>昨天集中器在线率</div>
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
        <Row gutter={16}>
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
                title={<span><Icon type='pie-chart' style={{marginRight:'5px',color:'#1890ff'}} />五大区供水一览</span>}
                bodyStyle={{ padding: 24 }}
                style={{ marginBottom: 16, minHeight: 509 }}
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
                title={<span><Icon type='area-chart' style={{marginRight:'5px',color:'#1890ff'}} />每天用水总量与漏损率</span>}
                bodyStyle={{ padding: 24 }}
                style={{ marginBottom: 16, minHeight: 509 }}
              >
                <DMArate/>
              </Card>
            </Col>
          }
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='bar-chart' style={{marginRight:'5px',color:'#1890ff'}} />昨日集中器在线情况统计</span>}
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 16, minHeight: 509 }}
            >
              <ConcentratorOnlife concentrator={this.state.concentrator}/>
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='pie-chart' style={{marginRight:'5px',color:'#1890ff'}} />昨日水表状态统计</span>}
              bodyStyle={{ padding: 24 }}
              style={{ marginBottom: 16, minHeight: 509 }}
            >
              <Proportion meter={this.state.meter}/>
            </Card>
          </Col>

          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='pie-chart' style={{marginRight:'5px',color:'#1890ff'}} />厂商-集中器/水表个数</span>}
              style={{ marginBottom: 16, minHeight: 509  }}
            >
              <VendorConcentrator />
            </Card>
          </Col>
          {
            company_code==='hy'&&<Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                extra={<a href="javascript:;" onClick={()=>{
                  dispatch(routerRedux.push(`/${company_code}/main/run_manage/DMA/DMA_data`));
                }}>查看详情</a>}
                bordered={false}
                title={<span><Icon type='area-chart' style={{marginRight:'5px',color:'#1890ff'}} />五大DMA分区每小时用水量</span>}
                style={{ marginBottom: 16, minHeight: 509  }}
              >
                <DMADate />
              </Card>
            </Col>
          }
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
