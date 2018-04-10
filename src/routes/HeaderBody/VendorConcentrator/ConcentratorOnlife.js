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
    let option = option = {
      title : {
        text: '厂商-集中器比例',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['厂商一','厂商二','厂商三']
      },
      series : [
        {
          name: '集中器个数',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'厂商一'},
            {value:310, name:'厂商二'},
            {value:234, name:'厂商三'},
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


    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="concentratorOnline"></div>
    );
  }
}
