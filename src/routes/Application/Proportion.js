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
        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
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
