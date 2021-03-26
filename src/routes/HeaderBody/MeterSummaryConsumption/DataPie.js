import React, {PureComponent} from 'react';
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.state = {
      delayeringData:[]
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
  }
  componentWillReceiveProps(nextProps){
    if((nextProps.data !== this.props.data) && nextProps.data){
      this.dynamic(nextProps.data);
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
  delayering=(data)=>{
    if(!data) return null;
    this.state.delayeringData.push([...data]);
    this.setState({
      delayeringData:this.state.delayeringData
    })
    data.map((item) => {
      if(item.children){
         this.delayering(item.children)
      }
    });
  }
  dynamic = (data)=> {
    this.myChart = this.echarts.init(document.querySelector('.concentratorOffline'));
    this.delayering(data)
    console.log('this.state.delayeringData',this.state.delayeringData);

    let option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        selectedMode:false,
        orient: 'vertical',
        x: 'left',
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
      },
      series: [
        {
          name:'访问来源',
          type:'pie',
          radius: [0, '30%'],
          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:[
            {value:335, name:'直达'},
            {value:679, name:'营销广告'},
            {value:1548, name:'搜索引擎'}
          ]
        },
        {
          name:'访问来源',
          type:'pie',
          radius: ['40%', '55%'],
          data:[
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1048, name:'百度'},
            {value:251, name:'谷歌'},
            {value:147, name:'必应'},
            {value:102, name:'其他'}
          ]
        }
      ]
    };


    const that = this;
    that.myChart.setOption(option);
  }

  render() {
    return (
      <div className="concentratorOffline"></div>
    );
  }
}
