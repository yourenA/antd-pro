import React, {PureComponent} from 'react';
import {
  Table,
  Card,
  Popconfirm,
  Layout,
  message,
  Modal,
  Tooltip,
  Divider,
  Row,
  BackTop,
  Popover,
  List,
  Avatar
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import Search from './Search'
import Sider from './../Sider'
import {connect} from 'dva';
import find from 'lodash/find'
import styles from './../../PlatformManagement/CardList.less';
import Detail from './../UserMeterAnalysis/Detail'
import AnalysisDetail from './AnalysisDetail'
const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  big_meter_analysis: state.big_meter_analysis,
  global: state.global,
}))

class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.state = {
      showAddBtnByCon: false,
      showSyncBtn: find(this.permissions, {name: 'monitoring_meter_sync'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage: 1,
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

      // concentrator_number:''
    }
  }

  componentDidMount() {
   
    // this.handleSearch({
    //   page: 1,
    //   meter_number: this.state.meter_number,
    //   member_number: this.state.member_number,
    //   install_address: this.state.install_address,
    // }, false, function () {
    // })
    // document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
  }

  componentWillUnmount() {
    // document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    dispatch({
      type: 'big_meter_analysis/reset',

    });
  }

  changeTableY = ()=> {

    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.scroll-box').offsetTop - (40+ 54 + 50 + 38 + 5)
    })
  }


  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      meter_number: '',
      member_number: '',
      // concentrator_number:'',
      install_address: '',
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
        site_type:3
      }, false, function () {
      })
    })
  }
  handleSearch = (values, fetchAndPush = false, cb) => {
    const that = this;
    const {dispatch} = this.props;
    this.setState({
      expandedRowKeys: []
    })
    dispatch({
      type: fetchAndPush ? 'big_meter_analysis/fetchAndPush' : 'big_meter_analysis/fetch',
      payload: {
        ...values,
        concentrator_number: this.state.concentrator_number ? this.state.concentrator_number : '',
        village_id: this.state.village_id ? this.state.village_id : '',
        site_type:3
      },
      callback: function () {
        const {big_meter_analysis: {data}} = that.props;
        that.setState({
          ...values,
        })
        if (!fetchAndPush) {
          that.setState({
            initPage: values.page
          })
        }
        if (cb)cb()
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
      per_page:this.state.per_page
      // area: this.state.area
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page,
      size_type:this.state.size_type

    })
  }
  handleSync=()=>{
    const {dispatch} = this.props;
    dispatch({
      type:  'big_meter_analysis/syncData',
      payload: {
        site_type:3
      },
      callback: function () {
        message.success('同步数据成功')
      }
    });
  }
  renderPopiver = (item)=> {
    return (
      <div className="popover">
        <table className="custom-table">
          <tbody>
          <tr>
            <td>终端编号</td>
            <td>{item.site_id}</td>
          </tr>
          <tr>
            <td>户号</td>
            <td>{item.user_number}</td>
          </tr>
          <tr>
            <td>管径</td>
            <td>{item.caliber}</td>
          </tr>
          <tr>
            <td>详细地址</td>
            <td>{item.address}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {big_meter_analysis: {data, meta, loading}, concentrators, meters} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {isMobile} =this.props.global;
    const colorList = ['#f56a00', '#00a2ae'];
    
    return (
      <Layout className="layout">
        <Sider
          showConcentrator={false}
          changeArea={this.changeArea}
          changeConcentrator={this.changeConcentrator}
          siderLoadedCallback={this.siderLoadedCallback}/>
        <Content style={{background: '#f5f5f5'}}>

          <div className="content" id="content">
            <BackTop target={()=>{return document.querySelector('#content')} }/>
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name:  formatMessage({id: 'intl.data_analysis'})},
              {name: formatMessage({id: 'intl.big_meter_volume'})}]}>

              <Card bordered={false} style={{margin: '-16px -16px 0', background: '#f5f5f5'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <Search wrappedComponentRef={(inst) => this.searchFormRef = inst}
                            initRange={this.state.initRange}
                            village_id={this.state.village_id}
                            handleSync={this.handleSync}
                            colorList={colorList}
                            handleForward={this.handleForward}
                            handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}
                            showSyncBtn={this.state.showSyncBtn}
                            clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <div className="scroll-box" style={{height:this.state.tableY+'px',overflowY: 'scroll'}}>
                  <List
                    rowKey="id"
                    grid={{gutter: 24, xl: 4, lg: 3, md: 2, sm: 2, xs: 1}}
                    loading={loading}
                    dataSource={data}
                    renderItem={(item, index)=> (
                      <List.Item key={item.id}>
                        <Card className={styles.card}>
                          <Card.Meta
                            className={styles.antCardMeta2}
                            avatar={<div>
                              <Avatar
                                style={{ backgroundColor:colorList[index % colorList.length]}} >{item.site_name.substring(0, 1)}</Avatar>
                            </div>}
                            title={
                              <Popover style={{width: '200px'}} content={this.renderPopiver(item)}
                                       title={''}>
                                  <span className={styles.cardTitle} onClick={()=> {
                                    this.setState({
                                      site_name: item.site_name,
                                      site_id:item.site_id,
                                      valueAnalysisModal: true
                                    })
                                  }}>{item.site_name}</span>
                              </Popover>
                            }
                            description={(
                              <div className="big-meter-description">
                                <p>{ formatMessage({id: 'intl.date'})} : <Tooltip title={item.collected_at}><span>{item.collected_at}</span>
                                </Tooltip></p>
                                <Divider className="big-meter-divider"/>
                                <p>{ formatMessage({id: 'intl.instantaneous_flow_rate'})} : <Tooltip title={item.instantaneous_value}><span className={styles.wordValue}>{item.instantaneous_value}</span></Tooltip>
                                </p>
                                <Divider className="big-meter-divider"/>
                                <p>{ formatMessage({id: 'intl.forward_flow_rate'})} : <Tooltip title={item.forward_cumulative_value}><span
                                  className={styles.wordValue}>{item.forward_cumulative_value}</span></Tooltip>
                                </p>
                                <Divider className="big-meter-divider"/>
                                <p>{ formatMessage({id: 'intl.reverse_flow_rate'})} : <Tooltip title={item.reverse_cumulative_value}><span
                                  className={styles.wordValue}>{item.reverse_cumulative_value}</span></Tooltip></p>
                                <Divider className="big-meter-divider"/>
                              </div>
                            )}
                          />
                        </Card>
                      </List.Item>

                    )}
                  />
                </div>
                <Pagination meta={meta} handPageChange={this.handPageChange} handPageSizeChange={this.handPageSizeChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

        </Content>
        <Modal
          destroyOnClose={true}
          width="1100px"
          title={`${ formatMessage({id: 'intl.big_meter_volume'})} ${this.state.site_name} `}
          visible={this.state.valueAnalysisModal}
          onOk={() => this.setState({valueAnalysisModal: false})}
          onCancel={() => this.setState({valueAnalysisModal: false})}
        >
          <AnalysisDetail site_id={this.state.site_id}/>
        </Modal>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
