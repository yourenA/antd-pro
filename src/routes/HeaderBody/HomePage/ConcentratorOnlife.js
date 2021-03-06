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
    const that=this
    if((nextProps.concentrator !== this.props.concentrator) && nextProps.concentrator.total_count){
      setTimeout(function () {
        that.dynamic(nextProps.concentrator);
      })
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
    this.myChart = this.echarts.init(document.querySelector('.concentratorOnline'));
    console.log(concentrator)
    const company_code = sessionStorage.getItem('company_code');
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },

      grid: {
        top: 70
      },
      legend: {
        left: 'left',
        top:5,
        data: [formatMessage({id: 'intl.online'}), formatMessage({id: 'intl.sleep'}),formatMessage({id: 'intl.offline'}) ],
        textStyle:{
          color:company_code==='hy'?'#333':'#fff'
        }

      },
      yAxis: {
        type: 'value',
        name: formatMessage({id: 'intl.concentrator_count'}),
        nameTextStyle:{
          color:company_code==='hy'?'#333':'#fff'
        },
        axisLabel:{
          textStyle:{
            color:company_code==='hy'?'#333':'#fff'
          }
        },
        lineStyle:{
          color:company_code==='hy'?'#333':'#fff'
        },
        axisLine:{
          lineStyle:{
            color:company_code==='hy'?'#333':'#fff'
          }
        }
      },
      xAxis : {
        name:  formatMessage({id: 'intl.time'}),
        type: 'category',
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        nameTextStyle:{
          color:company_code==='hy'?'#333':'#fff'
        },
        splitLine:{
          lineStyle:{
            color:company_code==='hy'?'#333':'#fff'
          }
        },
        axisLabel:{
          textStyle:{
            color:company_code==='hy'?'#333':'#fff'
          }
        },
        axisLine:{
          lineStyle:{
            color:company_code==='hy'?'#333':'#fff'
          }
        }
      },
      series: [
        {
          name: formatMessage({id: 'intl.online'}),
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: '#04e000',
            }
          },
          data: concentrator.yesterday_online_status
        },
        {
          name: formatMessage({id: 'intl.sleep'}),
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: '#d48265',
            }
          },
          data: concentrator.yesterday_sleep_status

        },
        {
          name: formatMessage({id: 'intl.offline'}),
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          itemStyle:{
            normal: {
              color: '#c23531',
            }
          },
          data:concentrator.yesterday_offline_status
        },
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
