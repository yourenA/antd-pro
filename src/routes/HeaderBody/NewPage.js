import React, {PureComponent} from 'react';
// import DynamicData from './HomePage/DynamicData'
// import MapData from './HomePage/MapData'
import Proportion from './HomePage/Proportion'
import ConcentratorOnlife from './HomePage/ConcentratorOnlife'
import AreaSupplyList from './HomePage/AreaSupplyList'
import DMArate from './HomePage/DMArate'
import VendorConcentrator from './HomePage/VendorConcentrator'
import DMADate from './HomePage/DMADate'
import MYSHomepageChart from './HomePage/MYSHomepageChart'
import {Row, Col, Card, Icon, TreeSelect,Collapse,DatePicker} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './main.less'
import moment from 'moment'
import GlobalFooter from './../../components/GlobalFooter';
import request from './../../utils/request'
import {prefix, projectName, poweredBy} from './../../common/config'
import {fillZero,disabledPreDate} from './../../utils/utils'
const TreeNode = TreeSelect.TreeNode;
const Panel = Collapse.Panel;
import {connect} from 'dva';
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().format('HH:mm:ss'),
      concentrator: {},
      meter: {},
      server: {},
      last30day: [],
      last12month: [],
      initDate:moment().add(-1, 'days')
    }
  }

  componentDidMount() {
    // setInterval(this.setTime,1000)
    const that = this;
    this.getHomepage(this.state.initDate)
    const {dispatch} = this.props;
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all',
      },
      callback: ()=> {
        console.log('callback')
        const {sider_regions:{data}}=that.props;
        if(data.length>0){
          this.setState({value: data[0].id});
          that.onChangeArea(data[0].id)
        }

      }
    });
  }
  changeDate=(e,dateString)=>{
    console.log(dateString)
    this.setState({
      date:dateString,
    },function () {
      this.getHomepage(dateString)
    })
  }
  getHomepage=(date)=>{
    const that = this;
    request(`/homepage`, {
      method: 'GET',
      params:{
        date:moment(date).format("YYYY-MM-DD"),
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        concentrator: response.data.concentrator,
        meter: response.data.meter,
        server: response.data.server
      })
    })
  }
  onChangeArea = (value)=> {
    console.log(value)
    const that = this;
    request(`/meter_model_meter_data`, {
      method: 'GET',
      params: {
        village_id: value,
        interval: 'day',
        started_at: moment().add(-29, 'days').format('YYYY-MM-DD'),
        ended_at: moment(new Date()).format('YYYY-MM-DD')
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        last30day: response.data
      })
    })

    const date = new Date();
    const year = date.getFullYear(); //获取当前日期的年份
    const month = date.getMonth(); //获取当前日期的月份
    const day = date.getDate(); //获取当前日期的日
    const started_at = moment((year - 1) + '-' + fillZero(month + 1) + '-' + fillZero(day)).isBefore('2017-10-01') ? '2017-10-01' : moment((year - 1) + '-' + fillZero(month + 1) + '-' + fillZero(day)).format('YYYY-MM-DD')
    console.log(moment((year - 1) + '-' + fillZero(month + 1) + '-' + fillZero(day)).format('YYYY-MM-DD'))
    request(`/meter_model_meter_data`, {
      method: 'GET',
      params: {
        village_id: value,
        interval: 'month',
        started_at: started_at,
        ended_at: moment(new Date()).format('YYYY-MM-DD')
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        last12month: response.data
      })
    })
  }

  componentWillUnmount() {
    // clearInterval(this.setTime)
  }

  setTime = ()=> {
    this.setState({
      time: moment().format('HH:mm:ss')
    })
  }
  renderTreeNodes = (data)=> {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }

  render() {
    const dispatch = this.props.dispatch;
    const company_code = sessionStorage.getItem('company_code');
    const {sider_regions:{data}}=this.props;
    return (
      <div className={styles.main}>
        <Collapse activeKey={['1']} style={{marginBottom:'16px'}}>
          <Panel header={<h3 style={{fontSize:'18px'}}><DatePicker allowClear={false}  defaultValue={this.state.initDate} onChange={this.changeDate} disabledDate={disabledPreDate} />基本统计信息
          </h3>} key="1" showArrow={false}>
            <Row gutter={16}>
              <Col xl={6} lg={6} md={12} sm={24}>
                <div className={`${styles.topItem} ${styles.topItem1}`}>
                  <div className={styles.count}>{this.state.concentrator.total_count}</div>
                  <div className={styles.explain}>集中器总数量</div>
                </div>
              </Col>
              <Col xl={6} lg={6} md={12} sm={24}>
                <div className={`${styles.topItem} ${styles.topItem3}`}>
                  <div className={styles.count}>{this.state.concentrator.yesterday_excellent_rate}</div>
                  <div className={styles.explain}>集中器在线率</div>
                </div>
              </Col>
              <Col xl={6} lg={6} md={12} sm={24}>
                <div className={`${styles.topItem} ${styles.topItem2}`}>
                  <div className={styles.count}>{this.state.meter.total_count}</div>
                  <div className={styles.explain}>水表总数量</div>
                </div>
              </Col>
            <Col xl={6} lg={6} md={12} sm={24}>
                <div className={`${styles.topItem} ${styles.topItem3}`}>
                  <div className={styles.count}>{this.state.meter.yesterday_upload_rate}</div>
                  <div className={styles.explain}>水表上传率</div>
                </div>
              </Col>

              {/*<Col  xl={6} lg={6} md={12} sm={24} >
               <div  className={`${styles.topItem} ${styles.topItem4}`}>
               <div className={styles.count}>25%</div>
               <div className={styles.explain}>昨天总漏损率</div>
               </div>
               </Col>*/}
             {/* <Col xl={6} lg={6} md={12} sm={24}>
                <div className={`${styles.topItem} ${styles.topItem4}`}>
                  <div className={styles.count}>{this.state.server.current_time}</div>
                  <div className={styles.explain}>当前获取数据时间</div>
                </div>
              </Col>*/}
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Card
                  title={<span><Icon type='bar-chart' style={{marginRight: '5px', color: '#1890ff'}}/>集中器在线情况统计</span>}
                  bodyStyle={{padding: 24}}
                  style={{marginBottom: 16, minHeight: 509}}
                >
                  <ConcentratorOnlife concentrator={this.state.concentrator}/>
                </Card>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Card
                  title={<span><Icon type='pie-chart' style={{marginRight: '5px', color: '#1890ff'}}/>水表状态统计</span>}
                  bodyStyle={{padding: 24}}
                  style={{marginBottom: 16, minHeight: 509}}
                >
                  <Proportion meter={this.state.meter}/>
                </Card>
              </Col>
              </Row>
          </Panel>
        </Collapse>

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
            prefix === 'http://api.water.test.com' &&
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title={<span><Icon type='pie-chart' style={{marginRight: '5px', color: '#1890ff'}}/>五大区供水一览</span>}
                bodyStyle={{padding: 24}}
                style={{marginBottom: 16, minHeight: 509}}
              >
                <AreaSupplyList/>
              </Card>
            </Col>

          }
          {
            prefix === 'http://api.water.test.com' &&
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title={<span><Icon type='area-chart' style={{marginRight: '5px', color: '#1890ff'}}/>每天用水总量与漏损率</span>}
                bodyStyle={{padding: 24}}
                style={{marginBottom: 16, minHeight: 509}}
              >
                <DMArate/>
              </Card>
            </Col>
          }
        {/*  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='bar-chart' style={{marginRight: '5px', color: '#1890ff'}}/>昨日集中器在线情况统计</span>}
              bodyStyle={{padding: 24}}
              style={{marginBottom: 16, minHeight: 509}}
            >
              <ConcentratorOnlife concentrator={this.state.concentrator}/>
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='pie-chart' style={{marginRight: '5px', color: '#1890ff'}}/>昨日水表状态统计</span>}
              bodyStyle={{padding: 24}}
              style={{marginBottom: 16, minHeight: 509}}
            >
              <Proportion meter={this.state.meter}/>
            </Card>
          </Col>*/}
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='area-chart' style={{marginRight: '5px', color: '#1890ff'}}/>各水表类型用水量
                 <TreeSelect
                   value={this.state.value}
                   style={{width: 150, marginLeft: '10px'}}
                   treeDefaultExpandAll={true}
                   onChange={(value)=> {
                     this.setState({value});
                     this.onChangeArea(value)
                   }}
                 >
                {this.renderTreeNodes(data)}
                </TreeSelect>
                </span>}
              bodyStyle={{padding: 24}}
              style={{marginBottom: 16, minHeight: 509}}
            >
              <MYSHomepageChart last30day={this.state.last30day} last12month={this.state.last12month}/>
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title={<span><Icon type='pie-chart' style={{marginRight: '5px', color: '#1890ff'}}/>厂商-集中器/水表个数</span>}
              style={{marginBottom: 16, minHeight: 509}}
            >
              <VendorConcentrator />
            </Card>
          </Col>
          {
            company_code === 'hy' && <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Card
                extra={<a href="javascript:;" onClick={()=> {
                  dispatch(routerRedux.push(`/${company_code}/main/run_manage/DMA/DMA_data`));
                }}>查看详情</a>}
                bordered={false}
                title={<span><Icon type='area-chart'
                                   style={{marginRight: '5px', color: '#1890ff'}}/>五大DMA分区每小时用水量</span>}
                style={{marginBottom: 16, minHeight: 509}}
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
