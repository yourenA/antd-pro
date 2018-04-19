import React, {PureComponent} from 'react';
import request from './../../../utils/request'
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
      query:{
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
    console.log('online')
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
      backgroundColor: '#eee',
      // title : {
      //   text: '厂商-集中器/水表比例',
      //   x:'center',
      //   top:'20'
      // },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        bottom: '50',
        data: parseData
      },
      series : [
        {
          name: '集中器个数',
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
          name: '水表个数',
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
