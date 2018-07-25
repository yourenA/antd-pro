import React, {PureComponent} from 'react';
import { Row, Col } from 'antd';
export default class MYSHomepageChart extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.myChart2 = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    // setTimeout(function () {
    //   that.dynamic();
    // }, 0);
    window.addEventListener('resize', this.resizeChart)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.last30day !== this.props.last30day){
      this.dynamic(nextProps.last30day);
    }
    if(nextProps.last12month !== this.props.last12month){
      this.dynamic2(nextProps.last12month);
    }
  }
  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart2.resize();
    }
  }
  dynamic = (data)=> {
    console.log('data',data)
    if(data.length===0) return false;
    this.myChart = this.echarts.init(document.querySelector('.last-30days-water-consumption'));
    const lengendData=[];
    const xAxisData=[];
    const seriesData=[];
    for(let i=0;i<data.length;i++){
      lengendData.push(data[i].meter_model_name);
      const diffrentValvue=[];
      for(let k=0;k<data[i]['detail'].length;k++){
        diffrentValvue.push(data[i]['detail'][k].difference_value)
      }
      seriesData.push( {
        // label: {
        //   normal: {
        //     show: true,
        //     position: 'insideRight'
        //   }
        // },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ],
          label:{
            show:true,
            formatter:'{b}: {d}'
          }
        },
        name: data[i].meter_model_name,
        type: 'bar',
        data:diffrentValvue
      } )
    }
    console.log('seriesData',seriesData)
    for(let j=0;j<data[0]['detail'].length;j++){
      xAxisData.push(data[0]['detail'][j].date)
    }
    let option = {
      backgroundColor: '#eee',
      title: {
        text: '近一个月各类型水表用水量(虚线箭头为平均值)',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: lengendData,
        x: 'center',
        bottom:10
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '用水量',
          axisLabel: {
            formatter: '{value} T'
          }
        },
      ],
      series:seriesData
    };

    const that = this;
    that.myChart.setOption(option);
  }
  dynamic2 = (data)=> {
    console.log('data',data)
    if(data.length===0) return false;
    this.myChart2 = this.echarts.init(document.querySelector('.last-12months-water-consumption'));
    const lengendData=[];
    const xAxisData=[];
    const seriesData=[];
    for(let i=0;i<data.length;i++){
      lengendData.push(data[i].meter_model_name);
      const diffrentValvue=[];
      for(let k=0;k<data[i]['detail'].length;k++){
        diffrentValvue.push(data[i]['detail'][k].difference_value)
      }
      seriesData.push( {
        name: data[i].meter_model_name,
        label: {
          normal: {
            show: true,
            // position: 'insideRight'
          }
        },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        },
        type: 'bar',
        data:diffrentValvue
      } )
    }
    console.log('seriesData',seriesData)
    for(let j=0;j<data[0]['detail'].length;j++){
      xAxisData.push(data[0]['detail'][j].date)
    }
    let option = {
      backgroundColor: '#eee',
      title: {
        text: '近一年各类型水表用水量(虚线箭头为平均值)',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: lengendData,
        x: 'center',
        bottom:10
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '用水量',
          axisLabel: {
            formatter: '{value} T'
          }
        },
      ],
      series:seriesData
    };

    const that = this;
    that.myChart2.setOption(option);
  }
  render() {
    return (
      <div>
        <Row>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="last-30days-water-consumption"></div>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <div className="last-12months-water-consumption"></div>
          </Col>
        </Row>
      </div>
    );
  }
}
