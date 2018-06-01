import React, {PureComponent} from 'react';
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
      total.push(item.offlines.split(',').length)
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
        name: '离线小时数',
      },
      xAxis : {
        name: '编号',
        type: 'category',
        data: concentrator_number,
        axisLabel:{interval:0},
      },
      series: [
        {
          name:  '离线小时数',
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
