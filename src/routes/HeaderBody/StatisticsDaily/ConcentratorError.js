import React, {PureComponent} from 'react';
import { Table, Card, Layout, message,Badge,Col,Row,Progress} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './ConcentratorErrorSearch'
import { routerRedux} from 'dva/router';
import {connect} from 'dva';
import moment from 'moment';
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ConcentratorOfflife from './ConcentratorOfflife'
import uuid from 'uuid/v4'
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  concentrator_daily_errors: state.concentrator_daily_errors,
  global:state.global,
}))
class FunctionContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableY: 0,
      page: 1,
      initDate:moment(new Date(), 'YYYY-MM-DD'),
      date: '',
      concentrator_number:''
    }
  }

  componentDidMount() {
    this.handleSearch({
      concentrator_number:'',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    },this.changeTableY)
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 5)
    }, function () {
      if (localStorage.getItem('locale') === 'en') {
        this.setState({
          tableY: this.state.tableY - 20
        })
      }
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      concentrator_number:'',
      page: 1,
      date: moment(this.state.initDate).format('YYYY-MM-DD'),
    })
  }
  handleSearch = (values,cb) => {
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_daily_errors/fetch',
      payload: {
        ...values,
      },
      callback:function () {
        that.setState({
          ...values,
        });
        if(cb) cb()
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      concentrator_number:this.state.concentrator_number,
      page: page,
      date: this.state.date,

    })
  }


  render() {
    const {intl:{formatMessage}} = this.props;
    const {concentrator_daily_errors: {data, meta, loading},dispatch} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const company_code = sessionStorage.getItem('company_code');
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   fixed: 'left',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.page,index)
      //   }
      // },
      {title:  formatMessage({id: 'intl.concentrator_number'}), width:100, dataIndex: 'concentrator_number', key: 'concentrator_number'
        , render: (val, record, index) => {
        return (
          <p  className="link" onClick={()=>{
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/concentrator_unusual_analysis?concentrator=${val}&date=${this.state.date}`));
          }} >{val}</p>
        )
      }},
      {title:  formatMessage({id: 'intl.offline_hours'}),width:150,  dataIndex: 'offlines', key: 'offlines',
        render: (val, record, index) => {
          return ellipsis2(val, 150)
        }},
      {title: formatMessage({id: 'intl.status'}) , dataIndex: 'status', key: 'status' ,width:80,render:(val, record, index) => (
        <p>
          <Badge status={val===1?"success":"error"} />{record.status_explain}
        </p>
      )},
      {title:  formatMessage({id: 'intl.total_meter_count'}), width: 90, dataIndex: 'total_meter_count', key: 'total_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 90)
        }},
      {title:  formatMessage({id: 'intl.upload_meter_count'}), width: 100, dataIndex: 'upload_meter_count', key: 'upload_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 100)
        }},
      {
        title: formatMessage({id: 'intl.upload_meter_rate'}) , width: 80, dataIndex: 'upload_meter_rate', key: 'upload_meter_rate', className: 'align-center',
        render: (val, record, index) => {
          return parseFloat(val) ?
            <Progress type="circle" percent={parseFloat(val)} width={30} format={(val) =>val + '%'}/> : val
        }
      },
      {title: formatMessage({id: 'intl.normal_meter_count'}) , width: 110, dataIndex: 'normal_meter_count', key: 'normal_meter_count',
        render: (val, record, index) => {
          return ellipsis2(val, 110)
        }},
      {
        title: formatMessage({id: 'intl.normal_meter_rate'}) , dataIndex: 'normal_meter_rate', key: 'normal_meter_rate', className: 'align-center',
        render: (val, record, index) => {
          return parseFloat(val) ?
            <Progress type="circle" percent={parseFloat(val)} width={30} format={(val) =>val + '%'}/> : val
        }
      },
    ];
    const {isMobile} =this.props.global;
    return (
      <PageHeaderLayout title="异常分析 " breadcrumb={[{name: formatMessage({id: 'intl.abnormal_analysis'})},
        {name: formatMessage({id: 'intl.Statistical_daily'})},{name: formatMessage({id: 'intl.concentrator_error'})}]}>
        <Card bordered={false} style={{margin: '-16px -16px 0'}}>
          <Row>
            <Col md={24} lg={14} >
              <div className='tableList'>
                <div className='tableListForm'>
                  <DefaultSearch inputText="集中器编号" dateText="发送时间" handleSearch={this.handleSearch}
                                 handleFormReset={this.handleFormReset} initDate={this.state.initDate}/>
                </div>
              </div>
              <ResizeableTable loading={loading} meta={meta} initPage={this.state.page}
                               dataSource={data} columns={columns} rowKey={record => record.uuidkey}
                               scroll={{x:1200,y: this.state.tableY}}
                               history={this.props.history}
                               className={'meter-table padding-6'}
              />
              {/*<Table
                className='meter-table padding-6'
                loading={loading}
                rowKey={record => record.uuidkey}
                dataSource={data}
                columns={columns}
                scroll={{x:1000,y: this.state.tableY}}
                //scroll={{y: this.state.tableY}}
                pagination={false}
                size="small"
              />*/}
              <Pagination meta={meta} handPageChange={this.handPageChange}/>
            </Col>
            <Col  md={24} lg={10} >
              <ConcentratorOfflife concentrator={data}/>
            </Col>
          </Row>


        </Card>
      </PageHeaderLayout>
    );
  }
}

export default FunctionContent
