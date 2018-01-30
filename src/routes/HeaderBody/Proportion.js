import React, {PureComponent} from 'react';
export default class Proportion extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.state = {
    }
  }

  componentDidMount() {
    const that=this;
    setTimeout(function () {
      that.dynamic();
    },0);
    window.addEventListener('resize',this.resizeChart)
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.resizeChart)
  }
  resizeChart=()=>{
    if(this.myChart){
      this.myChart.resize();
    }
  }
  dynamic=()=>{
    this.myChart = this.echarts.init(document.querySelector('.proportion-data'));
    console.log(document.querySelector('.proportion-data').offsetWidth)
    let option = {
      title :'',
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      toolbox: {
        show: true,
        feature: {
          dataView: {readOnly: false},
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正确','停报','错报','漏报']
      },
      series : [
        {
          name: '昨日水表状态统计',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'正确',
              itemStyle:{
                normal: {
                  color: '#40c4ff',
                }
              },},
            {value:123, name:'停报'},
            {value:50, name:'错报'},
            {value:100, name:'漏报'},
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    const that=this;
    that.myChart.setOption(option);
    that.myChart.resize();
  }
  render() {
    return (
              <div className="proportion-data"></div>
    );
  }
}
