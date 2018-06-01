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
    window.addEventListener('resize',this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.meter.total_count !== this.props.meter.total_count) && nextProps.meter.total_count){
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
        orient: 'vertical',
        left: 'left',
        data: ['水表上传数量','水表没有上传数量','水表错误上传数量','水表停止上传数量']
      },
      series : [
        {
          name: '昨日水表状态统计',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:meter.yesterday_upload_count, name:'水表上传数量',
              itemStyle:{
                normal: {
                  color: '#61a0a8',
                }
              },},
            {value:meter.yesterday_missing_upload_count, name:'水表没有上传数量',
              itemStyle:{
                normal: {
                  color: '#d48265',
                }
              },},
            {value:meter.yesterday_error_upload_count, name:'水表错误上传数量',
              itemStyle:{
                normal: {
                  color: '#c23531',
                }
              },},
            {value:meter.yesterday_stop_upload_count, name:'水表停止上传数量',
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
