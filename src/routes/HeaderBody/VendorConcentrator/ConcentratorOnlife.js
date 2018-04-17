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
    setTimeout(function () {
      that.dynamic();
    },500)
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
    console.log('online')
    this.myChart = this.echarts.init(document.querySelector('.concentratorOnline'));
    let data=this.props.data;
    let parseData=[]
    let parseData1=[]
    let parseData2=[]
    for(let i=0;i<data.length;i++){
      parseData.push(data[i].name)
      parseData1.push({name:data[i].name,value:data[i].concentrator_count})
      parseData2.push({name:data[i].name,value:data[i].concentrator_count1})
    }
    let option = option = {
      title : {
        text: '厂商-集中器/水表比例',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        bottom: '100',
        data: parseData
      },
      series : [
        {
          name: '集中器个数',
          type: 'pie',
          radius : '35%',
          center: ['30%', '40%'],
          data:parseData1,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: '水表个数',
          type: 'pie',
          radius : '35%',
          center: ['70%', '40%'],
          data:parseData2,
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


    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="concentratorOnline"></div>
    );
  }
}
