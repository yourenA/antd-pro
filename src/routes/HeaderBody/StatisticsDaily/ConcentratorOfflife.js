import React, {PureComponent} from 'react';
import {injectIntl} from 'react-intl';
@injectIntl
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.concentrator !== this.props.concentrator) && nextProps.concentrator){
      this.dynamic(nextProps.concentrator);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart)
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
  dynamic = (concentrator)=> {
    const {intl:{formatMessage}} = this.props;
    this.myChart = this.echarts.init(document.querySelector('.concentratorOffline'));
    console.log(concentrator);
    let concentrator_number=concentrator.reduce((total,item)=>{
      if(concentrator.length>5){
        if(total.length%2===0){
          total.push(item.concentrator_number)
        }else{
          total.push(`\n${item.concentrator_number}`)
        }
      }else{
        total.push(item.concentrator_number)
      }

      return total
    },[]);
    let concentrator_offlife_count=concentrator.reduce((total,item)=>{
      if(item.offlines){
        total.push(item.offlines.split(',').length)
      }else{
        total.push(0)
      }
      return total
    },[]);
    let option = {
      // backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 75
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: concentrator_number
      },
      yAxis: {
        type: 'value',
        name: formatMessage({id: 'intl.offline_hours'}),
      },
      xAxis : {
        name: formatMessage({id: 'intl.concentrator_number'}),
        type: 'category',
        data: concentrator_number,
        axisLabel:{interval:0},
      },
      series: [
        {
          name:  formatMessage({id: 'intl.offline_hours'}),
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
            }
          },
          itemStyle:{
            normal: {
              color: '#c23531',
            }
          },
          data:concentrator_offlife_count
        },
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="concentratorOffline"></div>
    );
  }
}
