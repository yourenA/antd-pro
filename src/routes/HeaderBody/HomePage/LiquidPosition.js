import React, {PureComponent} from 'react';
import request from "./../../../utils/request";
export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts= window.echarts;
    this.myChart=null;
    this.state = {
    }
  }

  componentDidMount() {
    const that=this;
    window.addEventListener('resize',this.resizeChart)
    this.getData();
    this.timer=setInterval(function () {
      that.getData()
    }, 120000)

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
      that.dynamic(response.data.data)
    })
  }
  dynamic = (data)=> {
    this.myChart = this.echarts.init(document.querySelector('.liquidPosition-data'));
    let xData = [];
    let yData = [];
    for (let i = 0; i < data.length; i++) {
      xData.push(data[i].number);
      yData.push(data[i].current_value)
    }
    let option = {
      backgroundColor: '#eee',
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: '传感器编号',
      },
      yAxis: {
        type: 'value',
        name: '单位0.01米',
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


    const that = this;
    that.myChart.setOption(option);
    // that.myChart.on('click', function (params) {
    //   that.setState({
    //     number:params.name,
    //     showModal:true
    //   })
      // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
    // });
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.resizeChart)
  }
  resizeChart=()=>{
    if(this.myChart){
      this.myChart.resize();
    }
  }
  render() {
    return (
              <div className="liquidPosition-data"></div>
    );
  }
}
