import React, {PureComponent} from 'react';
import {injectIntl} from 'react-intl';
import {dateIsToday} from './../../../utils/utils'
@injectIntl
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
    window.addEventListener('resize',this.resizeChart)
    this.dynamic2();
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.meter !== this.props.meter) && nextProps.meter.total_count) {
      this.dynamic(nextProps.meter);

    }
    if (this.props.totalData !== nextProps.totalData) {
      if (this.myChart2) {
        this.myChart2.setOption({
          title: {
            id: 'title',
            text:nextProps.totalData.toFixed(2),
          },
        })
      }
    }
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
  dynamic=(meter)=>{
    const {intl:{formatMessage}} = this.props;
    this.myChart = this.echarts.init(document.querySelector('.proportion-data'));
    let isToday=dateIsToday(this.props.date);
    let option = {
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
        top:5,
        data: [formatMessage({id: 'intl.meter_successful_upload_count'}),isToday?formatMessage({id: 'intl.meter_no_upload_count_today'}):formatMessage({id: 'intl.meter_no_upload_count'}),
          formatMessage({id: 'intl.meter_error_upload_count'}),
          formatMessage({id: 'intl.meter_stop_upload_count'}),'抄表失败'],
        textStyle:{
          color:'#fff'
        }
      },
      grid: {
        top: 70,
      },
      series : [
        {
          name: '水表状态统计',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['55%', '55%'],
          data:[
            {value:meter.yesterday_upload_count, name:formatMessage({id: 'intl.meter_successful_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#04e000',
                }
              },},
            {value:meter.yesterday_missing_upload_count, name:isToday?formatMessage({id: 'intl.meter_no_upload_count_today'}):formatMessage({id: 'intl.meter_no_upload_count'}),
              itemStyle:{
                normal: {
                  color: '#ff9d78',
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
                  color: '#98d8f9',
                }
              },},
            {value:meter.yesterday_fail_upload_count, name:'抄表失败',
              itemStyle:{
                normal: {
                  color: 'red',
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
  dynamic2=(meter)=>{
    const {intl:{formatMessage}} = this.props;
    this.myChart2 = this.echarts.init(document.querySelector('.yongshuiliang'));
    var value = 0.2;
    var data = [value, value, value, ];
    let option = {
      title: {
        id:'title',
        text: this.props.totalData.toFixed(2),
        textStyle: {
          fontSize: 24,
          fontFamily: 'Microsoft Yahei',
          fontWeight: 'normal',
          color: '#f9f4fb',
          rich: {
            a: {
              fontSize: 28,
            }
          }
        },
        x: 'center',
        y: '35%'
      },
      graphic: [{
        type: 'group',
        left: 'center',
        top: '60%',
        children: [{
          type: 'text',
          z: 100,
          left: '10',
          top: 'middle',
          style: {
            fill: '#fff',
            text: '当天总用水量',
            font: '18px Microsoft YaHei'
          }
        }]
      }],
      series: [{
        type: 'liquidFill',
        radius: '80%',
        center: ['50%', '50%'],
        //  shape: 'roundRect',
        data: data,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0.5,
            y2: 1,
            colorStops: [{
              offset: 1,
              color: 'rgba(68,145,253,0.69)'
            }, {
              offset: 0.5,
              color: 'rgba(106,207,255,0.68)'
            }, {
              offset: 0,
              color: 'rgba(68, 145, 253, 1)'
            }],
            globalCoord: false
          },
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 20,
            borderColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(69,73,240,0.83)'
              }, {
                offset: 0.5,
                color: 'rgba(38,153,240,0.81)'
              }, {
                offset: 1,
                color: 'rgba(69, 73, 240, 1)'
              }],
              globalCoord: false
            },
          }
        },
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 1,
            color: 'rgba(4,224,0,0)'
          }, {
            offset: 0.5,
            color: 'rgba(4,224,0,1)'
          }, {
            offset: 0,
            color: 'rgba(31, 222, 225, 1)'
          }],
          globalCoord: false
        },
        label: {
          normal: {
            formatter: '',
          }
        }
      }, ]
    };
    const that=this;
    that.myChart2.setOption(option);
    that.myChart2.resize();
  }
  render() {
    return (
      <div style={{position:'relative'}}>
        <div className="proportion-data"></div>
        <div className="yongshuiliang" style={{position:'absolute',bottom:'47px',left:'10%',width:'150px',height:'150px'}}></div>
      </div>

    );
  }
}
