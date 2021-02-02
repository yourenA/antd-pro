import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, fixedZero} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  batch_analysis: state.batch_analysis,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.echarts= window.echarts;
    this.myChart=null;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 400,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll: true,
      expandedRowKeys: [],
      otherMeterValue: '0',
      forwardsMeterValue: '0',
      key:uuid(),
      monthDate: moment(moment(), 'YYYY-MM'),
      selectValue:[]
      // concentrator_number:''
    }
  }

  componentDidMount() {
    window.addEventListener('resize',this.resizeChart)
  }

  componentWillUnmount() {
    window.removeEventListener('resize',this.resizeChart)
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-analysis').offsetTop - (68 + 54 )
    })
  }
  resizeChart=()=>{
    if(this.myChart){
      this.myChart.resize();
    }
  }
  siderLoadedCallback = (village_id)=> {
    console.log('加载区域', village_id)
    this.setState({
      village_id
    })
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      install_address: '',
      // started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      // ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      village_id: village_id
    })
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields();
    const that = this;
    this.setState({
      concentrator_number: '',
      village_id: village_id
    }, function () {
      that.setState({
        selectValue:[]
      })
      this.changeTableY();
      this.handleSearch({})
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({})
    })
  }
  handleFormReset = () => {
    this.handleSearch({})
  }
  handleSearch = (values,saveInput) => {
    let daysInMonth=moment(this.state.monthDate).daysInMonth();
    console.log('handleSearch')
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type:  'batch_analysis/fetch',
      payload: {
        village_id: this.state.village_id ? this.state.village_id : '',
        started_at:`${moment(this.state.monthDate).format('YYYY-MM')}-01`,
        ended_at:moment().format('YYYY-MM')===moment(this.state.monthDate).format('YYYY-MM')?
          `${moment(this.state.monthDate).format('YYYY-MM-DD')}`:`${moment(this.state.monthDate).format('YYYY-MM')}-${daysInMonth}`,
      },
      callback: function () {
        const {batch_analysis: {data}} = that.props;
        if(that.state.selectValue.length>0){
          const fliterData=filter(data,o=>{return that.state.selectValue.indexOf(o.meter_number)>=0})
          console.log('fliterData',fliterData)
          that.renderChart(fliterData)
        }else{
          that.renderChart(data)
        }
      }
    });
  }
  renderChart=(data)=>{
    console.log('data',data);
    data=sortBy(data, ['meter_number'])
    if( this.myChart){
      this.myChart.clear()
    }
    this.myChart = this.echarts.init(document.querySelector('.meter-analysis'));
    let date=[];
    let daysInMonth=moment(this.state.monthDate).daysInMonth();
    for(let i=1;i<=daysInMonth;i++){
      date.push(String(fixedZero(i)))
    }
    console.log(date);
    let  series=[];
    let legend=[]
    for(let i=0;i<data.length;i++){
      legend.push(data[i].meter_number)
      series.push({
        name: data[i].meter_number,
        type: 'line',
        symbolSize: 8,
        symbol: 'circle',
        data: data[i].data,
        smooth: true,
        emphasis:{
          itemStyle:{
            color:'rgb(18,123,255)'
          }
        },
        lineStyle: {
          normal: {
            width: 2,
          },
        },
      },)
    }
    let  option = {
      title: {
        text: `${moment(this.state.monthDate).format('YYYY-MM')} 水表用水量折线图`
      },
      tooltip: {
        formatter: "水表号:{a} <br/>{b}日用水量 : {c} m³"
      },
      legend: {
        show:data.length>10?false:true,
        left: 'center',
        data: legend
      },
      toolbox: {
        right: '1%',
        feature: {
          saveAsImage: {},
          dataView: {readOnly: true},
        }
      },
      grid: {
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data:date
      },
      yAxis: {
        type: 'value'
      },
      series:series
    };
    this.myChart.setOption(option);
  }
  setMonthdate=(date)=>{
    this.setState({
      monthDate:date
    },function () {
      this.handleSearch()
    })
  }
  handleChange=(value,option)=> {
    this.setState({
      selectValue:value
    },function () {
      console.log(this.state.selectValue)
      const {batch_analysis: {data}} = this.props;
      if(this.state.selectValue.length>0){
        const fliterData=filter(data,o=>{return this.state.selectValue.indexOf(o.meter_number)>=0})
        console.log('fliterData',fliterData)
        this.renderChart(fliterData)
      }else{
        this.renderChart(data)
      }

    })
  }
  render() {
    const {batch_analysis: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        <Sider
          showConcentrator={false}
          changeArea={this.changeArea}
          changeConcentrator={this.changeConcentrator}
          siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name:formatMessage({id: 'intl.data_analysis'}) }, {name: formatMessage({id: 'intl.batch_analysis'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            handleChange={this.handleChange}
                            meters={data}
                            selectValue={this.state.selectValue}
                            village_id={this.state.village_id}
                            monthDate={this.state.monthDate}
                            setMonthdate={this.setMonthdate}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                  <div className="meter-analysis" style={{width:'100%',height:this.state.tableY}}>

                  </div>
                </div>


              </Card>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
