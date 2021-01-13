import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {Row, Col,Card, Modal,Button} from 'antd';
import  Detail from './LiquidHistory'
import request from "./../../../utils/request";
import max from 'lodash/max'
import {injectIntl} from 'react-intl';
@injectIntl
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: [],
      maxValue:0
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getData();
    this.timer=setInterval(function () {
      that.getData()
    }, 20000)

  }

  getData = ()=> {
    console.log('get data')
    const that = this;
    request(`/liquid_sensors`, {
      method: 'get',
      params: {
        return: 'all'
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        data: response.data.data
      },function () {
        that.dynamic(that.state.data);
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  dynamic = (data)=> {

    if (data.length === 0) {
      return
    }

    const that = this;
    const {intl:{formatMessage}} = this.props;
    setTimeout(function () {

      for (let i = 0; i < data.length; i++) {
        that['myChart' + i] = that.echarts.init(document.querySelector(`.valve-item-${i}`));
        that.myChart.push(that['myChart' + i])
        let xData = [data[i].number];
        let yData = [data[i].current_value];
        let itemMax=[data[i].max_actual_value]
        let maxValue=max(itemMax);
        console.log('maxValue',maxValue)
        let option = {
          title : {
            text: data[i].number,
            subtext: data[i].address,
            subtextStyle: {
              color: '#272727',
              fontSize: 14
            },
            x:'right',
            top:5,
            right:5
          },
          backgroundColor: '#eee',
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '15%',
            right: '20%',
            bottom: '10%',
          },
          xAxis: {
            type: 'category',
            data: xData,
          },
          yAxis: {
            type: 'value',
            name: formatMessage({id: 'intl.unit'})+' 米',
            max:maxValue
          },
          series: [{
            data: yData,
            type: 'bar',
            large: true,
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            },
          }]
        };


        that['myChart' + i].setOption(option);

      }
    }, 600)


  }
  showDetail=(item)=>{
    this.setState({
      maxValue:item.max_actual_value,
      number: item.number,
      showModal: true
    })
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    return (
      <div className="content">
        <PageHeaderLayout title="系统管理 " breadcrumb={[{name:  formatMessage({id: 'intl.data_analysis'})},
          {name: formatMessage({id: 'intl.liquid/valve_analysis'})}, {name: formatMessage({id: 'intl.liquid_sensors'}) }]}>
          <Card bordered={false} style={{margin: '-16px -16px 0'}}>
            {this.state.data.length>0?
              <Row gutter={16}>
                {this.state.data.map((item, index)=> {
                  return <Col  xs={1} sm={24} md={12} lg={6} xl={6} xxl={4} key={index}>
                    <div className={ `valve-item-${index}`} style={{width: '100%', height: '200px'}}></div>
                    <Button style={{marginBottom:'16px'}} type="primary" block onClick={()=>{this.showDetail(item)}}>{formatMessage({id: 'intl.detail'})}</Button>
                  </Col>
                })}

              </Row>
              :<h3 style={{textAlign:'center'}}>{formatMessage({id: 'intl.no_data'})}</h3>}
          </Card>
        </PageHeaderLayout>
        <Modal
          width="950px"
          destroyOnClose={true}
          title={`${this.state.number} ${formatMessage({id: 'intl.detail'})}`}
          visible={this.state.showModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({showModal: false})}
        >
          <Detail maxValue={this.state.maxValue} number={this.state.number}/>
        </Modal>
      </div>
    );
  }
}
