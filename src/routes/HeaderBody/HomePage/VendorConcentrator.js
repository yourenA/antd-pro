import React, {PureComponent} from 'react';
import request from './../../../utils/request'
import {injectIntl} from 'react-intl';
@injectIntl
export default class VendorConcentrator extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {}
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeChart)
    const that=this;
    request(`/manufacturers`,{
      method:'GET',
      params:{
        return:'all'
      }
    }).then((response)=>{
      console.log(response);
      that.dynamic(response.data.data)
    })
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
  dynamic = (response)=> {
    const {intl:{formatMessage}} = this.props;
    this.myChart = this.echarts.init(document.querySelector('.VendorConcentrator'));
    let data=response;
    let parseData=[]
    let parseData1=[]
    let parseData2=[]
    for(let i=0;i<data.length;i++){
      parseData.push(data[i].name)
      parseData1.push({name:data[i].name,value:data[i].concentrator_count})
      parseData2.push({name:data[i].name,value:data[i].meter_count})
    }
    let option  = {
      // title : {
      //   text: '厂商-集中器/水表比例',
      //   x:'center',
      //   top:'20'
      // },
      color:[ '#04e000','#47e1ed', '#ff2115','#ea924c','#c23531','#2f4554',   '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        bottom: '50',
        data: parseData,
        textStyle:{
          color:'#fff'
        }
      },
      series : [
        {
          name: formatMessage({id: 'intl.concentrator_count'}),
          type: 'pie',
          radius : '40%',
          center: ['25%', '45%'],
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
          name: formatMessage({id: 'intl.water_meter_count'}),
          type: 'pie',
          radius : '40%',
          center: ['75%', '45%'],
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
      <div className="VendorConcentrator"></div>
    );
  }
}
