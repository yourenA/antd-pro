import React, {PureComponent} from 'react';
import {injectIntl} from 'react-intl';
@injectIntl
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
    window.addEventListener('resize',this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.meter !== this.props.meter) && nextProps.meter.total_count){
      this.dynamic(nextProps.meter);
    }
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.resizeChart)
  }
  resizeChart=()=>{
    if(this.myChart){
      this.myChart.resize();
    }
  }
  dynamic=(meter)=>{
    const {intl:{formatMessage}} = this.props;
    this.myChart = this.echarts.init(document.querySelector('.proportion-data'));
    let option = {
      backgroundColor: '#eee',
      title :'',
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataView: {readOnly: false},
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },
      legend: {
        left: 'left',
        data: [formatMessage({id: 'intl.meter_successful_upload_count'}),formatMessage({id: 'intl.meter_no_upload_count'}),
          formatMessage({id: 'intl.meter_error_upload_count'}),
          formatMessage({id: 'intl.meter_stop_upload_count'})]
      },
      series : [
        {
          name: '昨日水表状态统计',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            {value:meter.yesterday_upload_count, name:formatMessage({id: 'intl.meter_successful_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#61a0a8',
                }
              },},
            {value:meter.yesterday_missing_upload_count, name:formatMessage({id: 'intl.meter_no_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#d48265',
                }
              },},
            {value:meter.yesterday_error_upload_count, name:formatMessage({id: 'intl.meter_error_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#c23531',
                }
              },},
            {value:meter.yesterday_stop_upload_count, name:formatMessage({id: 'intl.meter_stop_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#2f4554',
                }
              },},
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
