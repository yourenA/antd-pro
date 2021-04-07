import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Alert, Button, Tooltip, Row, Col, Drawer } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import moment from 'moment'
import update from 'immutability-helper'
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData, renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import ReactDataGrid from 'react-data-grid';
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
import request from "../../../utils/request";
import Detail from "../Meters/Detail";
const {Content} = Layout;
@connect(state => ({
  meter_summary_consumption: state.meter_summary_consumption,
  global: state.global,
}))
@injectIntl
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
      ignore_zero:'-1',
      initRange:[moment(new Date().getFullYear()+'-'+(parseInt(new  Date().getMonth())+1)+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
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
      key:uuid()
      // concentrator_number:''
    }
  }

  componentDidMount() {
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }

  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }

  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.tableListForm').offsetTop - (68 + 54 + 50 + 38 + 5)
    })
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
      this.changeTableY();
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        ignore_zero:this.state.ignore_zero,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      }, false, function () {
        that.setState({
          otherMeterValue: '0',
          forwardsMeterValue: '0',
        })
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      village_id: parent_village_id,
      concentrator_number: concentrator_number
    }, function () {
      this.handleSearch({
        page: 1,
        meter_number: this.state.meter_number,
        member_number: this.state.member_number,
        install_address: this.state.install_address,
        ignore_zero:this.state.ignore_zero,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),

      })
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      install_address: '',
      ignore_zero:'-1',
      started_at: moment(this.state.initRange[0]).format('YYYY-MM-DD'),
      ended_at: moment(this.state.initRange[1]).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values,saveInput) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })
    if(!saveInput){
      this.setState({
        key:uuid()
      })
    }
    dispatch({
      type:  'meter_summary_consumption/fetch',
      payload: {
        ...values,
        others: values.others ? values.others : [],
        forwards: values.forwards ? values.forwards :[],
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        is_manually: -1
      },
      callback: function () {
        const {meter_summary_consumption: {data}} = that.props;
        that.setState({
          ...values,
        })
      }
    });
  }
  handPageChange = (page)=> {
    const that = this;
    this.handleSearch({
      page: page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      ignore_zero:this.state.ignore_zero,
      // area: this.state.area
    })
  }
  handleChangeOtherMeter = ()=> {
    let others = [{}];
    others[0]['value'] = Number(this.state.otherMeterValue);
    others[0]['village_id'] = this.state.village_id;
    this.handleSearch({
      page: this.state.page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      ignore_zero:this.state.ignore_zero,
      others: JSON.stringify(others)
      // area: this.state.area
    })
  }
  handleLeak = ()=> {
    let tbodyRow = document.querySelectorAll('.ant-table-row');
    let others = [];
    let forwards = [];
    for (let i = 0; i < tbodyRow.length; i++) {
      let othersInput = tbodyRow[i].querySelectorAll('input.ant-input')[1];
      let forwardsInput = tbodyRow[i].querySelectorAll('input.ant-input')[0];
      let inputHidden = tbodyRow[i].querySelector('input.hidden');
      others.push({value: othersInput.value, village_id: inputHidden.value})
      forwards.push({value: forwardsInput.value, village_id: inputHidden.value})
    }
    console.log(others)
    this.handleSearch({
      page: this.state.page,
      meter_number: this.state.meter_number,
      member_number: this.state.member_number,
      install_address: this.state.install_address,
      ended_at: this.state.ended_at,
      started_at: this.state.started_at,
      others: others,
      forwards:forwards
      // area: this.state.area
    },true)
  }
  handleForward = (values)=> {
    let tbodyRow = document.querySelectorAll('.ant-table-row');
    let forwards = [];
    let village_items = [];
    for (let i = 0; i < tbodyRow.length; i++) {
      let forwardsInput = tbodyRow[i].querySelector('input.ant-input');
      let inputHidden = tbodyRow[i].querySelector('input.hidden');
      // forwards.push({value: input.value, village_id: inputHidden.value})
      village_items.push({
        member_count: '-',
        other_value: '-',
        forward_value: forwardsInput.value,
        village_id: inputHidden.value
      })
    }
    console.log('forwards',forwards)
    this.handleSearch({
      ...values,
      village_items:village_items
      // forwards: forwards
      // area: this.state.area
    },true)
  }
  render() {
    const {meter_summary_consumption: {data, meta, loading}, concentrators, meters, intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const defaultColumnProperties = {
      resizable: true,
    };
    const columns = [
      {
        name: '序号',
        width: 50,
        key: '_index',
        frozen: true,
        formatter: (event) => {
          return <p className={'index'}>{event.value + 1}</p>;
        },
      },
      {
        name: '日期',
        width: 150,
        key: 'date',
      },
      {
        name: '平均用水量',
        width: 150,
        key: 'value',
      },


    ].map(c => ({ ...defaultColumnProperties, ...c }));
    const columns2 = [
      {
        name: '序号',
        width: 50,
        key: '_index',
        frozen: true,
        formatter: (event) => {
          return <p className={'index'}>{event.value + 1}</p>;
        },
      },
      {
        name: '水表号',
        width: 150,
        key: 'meter_number',
        formatter: (event) => {
          const that=this
          return <span style={{color:'#368bff',cursor:'pointer'}} onClick={()=>{
            request(`/meters`,{
              method:'GET',
              params:{
                number:event.value
              }
            }).then((response)=>{
              if(response.data.data.length===1){
                that.setState({
                  id:response.data.data[0].id,
                  number:response.data.data[0].number,
                  meterModal:true
                })
              }
            });
          }}>{event.value}</span>;
        },
      },
      {
        name: '平均用水量',
        width: 150,
        key: 'value',
      },


    ].map(c => ({ ...defaultColumnProperties, ...c }));

    let totalWidth = 0;
    let totalWidth2 = 0;
    let gridTableW =( document.body.offsetWidth  - 256 )/2
    for (let i = 0; i < columns.length; i++) {
      totalWidth += columns[i].width;
    }
    if (totalWidth < gridTableW) {
      columns[columns.length - 1].width = columns[columns.length - 1].width + gridTableW - totalWidth;
    }
    for (let i = 0; i < columns2.length; i++) {
      totalWidth2 += columns2[i].width;
    }
    if (totalWidth2 < gridTableW) {
      columns2[columns2.length - 1].width = columns2[columns2.length - 1].width + gridTableW - totalWidth2;
    }
    return (
      <Layout className="layout">
        <Sider
          showConcentrator={false}
          changeArea={this.changeArea}
          changeConcentrator={this.changeConcentrator}
          siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name:formatMessage({id: 'intl.data_analysis'}) }, {name: formatMessage({id: 'intl.meter_summary_consumption'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleLeak={this.handleLeak}
                            handleForward={this.handleForward}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showAddBtn={this.state.showAddBtn && this.state.showAddBtnByCon}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
               <Row gutter={16}>

                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Alert type="info" message="日均用水量数据 (某一天该区域总用水量/水表总数)"></Alert>
                    {
                      data.daily_average_items&&
                      <ReactDataGrid
                        columns={columns}
                        rowGetter={i => {
                          return { ...data.daily_average_items[i], _index: i };
                        }}
                        rowsCount={data.daily_average_items.length}
                        minHeight={ this.state.tableY}
                      />
                    }

                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Alert  type="success" message="户均用水量数据 (该时间段某一个水表总用水量/天数)"></Alert>
                    {
                      data.daily_average_items&&
                      <ReactDataGrid
                        columns={columns2}
                        rowGetter={i => {
                          return { ...data.meter_average_items[i], _index: i };
                        }}
                        rowsCount={data.meter_average_items.length}
                        minHeight={ this.state.tableY}
                      />
                    }
                  </Col>
                </Row>


              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
        <Drawer
          title={`水表 ${this.state.number} 详情`}
          placement="right"
          destroyOnClose
          onClose={() => {
            this.setState({
              meterModal: false,
              id: '',
            });
          }}

          width={700}
          visible={this.state.meterModal}
        >
          <Detail id={this.state.id}></Detail>
        </Drawer>
      </Layout>
    );
  }
}

export default UserMeterAnalysis
