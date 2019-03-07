import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Badge,  Dropdown,
  Menu,
  Tooltip,
  Icon,} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import find from 'lodash/find'
import {Link, routerRedux} from 'dva/router';
import {renderIndex,ellipsis2} from './../../../utils/utils'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {injectIntl} from 'react-intl';
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  usergroup: state.usergroup,
  global:state.global,
}))
@injectIntl
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'user_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'user_delete'}),
      showStatusBtn: find(this.permissions, {name: 'user_status_edit'}),
      showPasswordBtn: find(this.permissions, {name: 'user_default_password_edit'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      canOperate:localStorage.getItem('canOperateUserGroup')==='true'?true:false,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/fetch',
      payload: {
        page: 1,
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {usergroup: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page:this.state.per_page,
            // area: this.state.area
          }, function () {
            that.setState({
              canLoadByScroll: true,
            })
          }, true)
        }
      }
    }
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'usergroup/fetchAndPush':'usergroup/fetch',
      payload: {
        ...values,
      },
      callback: function () {
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
    this.handleSearch({
      page: page,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page:per_page
    })
  }
  handleEditStatus=(id,status)=>{
    let sendStatus=0;
    if(status===1){
      sendStatus=-1;
    }else{
      sendStatus=1;
    }
    const that=this;
    this.props.dispatch({
      type: 'usergroup/editStatus',
      payload: {
        data: {
          id,
          status:sendStatus
        }
      },
      callback: function () {
        message.success('修改状态成功')
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'usergroup/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除角色成功')
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page
        })
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {usergroup: {data, meta, loading},dispatch} = this.props;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 50,
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {
        title: formatMessage({id: 'intl.role_name'}),
        dataIndex: 'display_name',
        key:'display_name',
        width:150,
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }
      },{
        title: formatMessage({id: 'intl.description'}),
        dataIndex: 'description',
        key:'description',
        width: 200,
        render: (val, record, index) => {
          return ellipsis2(val,200)
        }
      },
      {
        title: formatMessage({id: 'intl.status'}),
        dataIndex: 'status',
        render:(val,record,index)=>{
          return(
            <span>
                 <Badge status={`${val===-1?"error":"success"}`} />{record.status_explain}
              </span>
          )
        }
      },
    ];
    const operate=  {
      title: formatMessage({id: 'intl.operate'}),
      width:170,
      render: (val, record, index) => (
        record.lock!==1&&<p>
          <a href="javascript:;" onClick={()=>{
            dispatch(routerRedux.push(`/${company_code}/main/system_manage/account_manage/user_group_manage/${record.id}`))

          }}>{formatMessage({id: 'intl.edit'})}</a>
          <span className="ant-divider" />
          <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: record.status===1?'intl.disable':'intl.enable'})})}
                      onConfirm={()=>this.handleEditStatus(record.id,record.status)}>
            <a href="javascript:;">{formatMessage({id: record.status===1?'intl.disable':'intl.enable'})}</a>
          </Popconfirm>
          <span className="ant-divider" />
          <Popconfirm placement="topRight"  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.delete'})})}
                      onConfirm={()=>this.handleRemove(record.id)}>
            <a href="">{formatMessage({id: 'intl.delete'})}</a>
          </Popconfirm>

        </p>
      ),
    }
    if(this.state.canOperate){
      columns.push(operate )
    }
    const {isMobile} =this.props.global;
    return (
      <Layout className="layout">
        {/*<Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.account_manage'})},
              {name:formatMessage({id: 'intl.user_role'})}]}>
              <Card bordered={false}   style={{margin:'-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   per_page={this.state.per_page}
                                   showAddBtn={this.state.showAddBtn} clickAdd={() => dispatch(routerRedux.push(`/${company_code}/main/system_manage/account_manage/user_group_manage/add`))}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}
                    />
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                />
              {/*  <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={isMobile?{x:600}:{y: this.state.tableY}}
                  //scroll={{ y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                {
                  meta && <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}  handPageChange={this.handPageChange}/>
                }

              </Card>
            </PageHeaderLayout>
          </div>

        </Content>
      </Layout>
    );
  }
}

export default Vendor
