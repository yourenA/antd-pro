import React, {PureComponent} from 'react';
export default class Proportion extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.myChart2=null;
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
      this.myChart2.resize();
    }
  }
  dynamic=()=>{
    this.myChart = this.echarts.init(document.querySelector('.fine-num'));
    this.myChart2 = this.echarts.init(document.querySelector('.upload-num'));
    let option = {
      title: {
        text: '集中器优良率',
        bottom:0,
        left:'center'
      },
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
        data: ['株洲珠华','衡阳']
      },
      series : [
        {
          name: '优良率',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '60%'],
          data:[
            {value:335, name:'株洲珠华'},
            {value:400, name:'衡阳'},
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
    let option2 ={
      title: {
        text: '水表上报率',
        bottom:0,
        left:'center'
      },
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
        data: ['株洲珠华','衡阳']
      },
      series : [
        {

          name: '上报率',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '60%'],
          data:[
            {value:80, name:'株洲珠华'},
            {value:130, name:'衡阳'},
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
    that.myChart2.setOption(option2);
  }
  render() {
    return (
      <div>
        <div className="fine-num"></div>
        <div className="upload-num"></div>
      </div>
    );
  }
}
