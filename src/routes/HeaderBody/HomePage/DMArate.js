import React, {PureComponent} from 'react';
export default class DMArate extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {}
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    setTimeout(function () {
      that.dynamic();
    },300)
  }
  componentWillReceiveProps(nextProps){
    // if((nextProps.concentrator.total_count !== this.props.concentrator.total_count) && nextProps.concentrator.total_count){
    //   this.dynamic(nextProps.concentrator);
    // }
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
    this.myChart = this.echarts.init(document.querySelector('.DMArate'));


    var xAxisData = [];
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var data4=[]

    for (let i = 1; i < 20; i++) {
      xAxisData.push('2018-3-' + i);
      let ramdon1=(Math.random() * 1000).toFixed(2)
      let ramdon2=(Math.random() * 500).toFixed(2)
      data2.push(ramdon1);
      data3.push(ramdon2);
      data1.push((-Math.random()*ramdon2).toFixed(2));
    }
    for(let i=0;i<data1.length;i++){
      let rate=(((-parseInt(data1[i]))/(parseInt(data2[i])+parseInt(data3[i])))*100).toFixed(2)
      data4.push(rate)
    }
    var itemStyle = {
      normal: {
      },
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
      }
    };

    let option = {
      backgroundColor: '#eee',
      legend: {
        data: ['漏损量', '总用水量'],
        orient: 'vertical',
        left: 'left',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
        },
        {
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      xAxis: {
        data: xAxisData,
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
      },
      yAxis: [
        {
          type: 'value',
          name: '用水量',
          position: 'left',

        },
        {
          type: 'value',
          name: '漏损率 %',
          position: 'right',
        },
      ],

      grid: {
        top: 110
      },
      series: [
        {
          name: '漏损量',
          type: 'bar',
          stack: 'one',
          itemStyle: itemStyle,
          data: data1,
          yAxisIndex: 0,
        },
        {
          name: '总用水量',
          type: 'bar',
          stack: 'one',
          itemStyle: itemStyle,
          data: data2,
          yAxisIndex: 0,

        },
        {
          name:'漏损率',
          type:'line',
          yAxisIndex: 1,
          data:data4
        },
      ]
    };

    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="DMArate"></div>
    );
  }
}
