import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Badge,  Dropdown,Button,
  Menu,
  Icon,} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from './../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import find from 'lodash/find'
import AddOrEditForm from './addOrEditMember'
import {renderIndex,ellipsis2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
import ResizeableTable from './../../../components/ResizeableTitle/Index'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  user: state.user,
  usergroup: state.usergroup,
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
      canOperate:localStorage.getItem('canOperateuser')==='true'?true:false,
      canAdd:true,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    // console.log(find(this.permissions, {name: 'user_add_and_edit'}))
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
      payload: {
        page: 1,
      }
    });
    dispatch({
      type: 'usergroup/fetch',
      payload: {
        return: 'all'
      }
    });
  }
  componentWillUnmount(){
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    dispatch({
      type: 'usergroup/reset',
    });
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {user: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            query: this.state.query,
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
      query: '',
      per_page:30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: fetchAndPush?'user/fetchAndPush':'user/fetch',
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
      query: this.state.query,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      query: this.state.query,
      per_page:per_page
    })
  }
  handleAdd = () => {
    this.setState({
      canAdd:false
    })
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.formRef.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          let management_data={}
          management_data.type=formValues.type;
          management_data.custom_rules={
            villages:formValues.villages,
            manufacturers:formValues.manufacturers,
            concentrators:formValues.concentrators,
          }
          this.props.dispatch({
            type: 'user/add',
            payload: {
              data: {
                ...formValues,
                management_data,
                is_email_notify: formValues.is_email_notify?1:-1,
                is_sms_notify: formValues.is_sms_notify?1:-1,
                role_id: formValues.role_id.key,
              },
            },
            callback: function () {
              const {intl:{formatMessage}} = that.props;
              message.success(
                formatMessage(
                  {id: 'intl.operate_successful'},
                  {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.account'})}
                )
              )
              that.setState({
                addModal: false,
              });
              that.setState({
                canAdd:true
              })
              that.handleSearch({
                page: that.state.page,
                query: that.state.query,
                per_page:that.state.per_page,
              })
            },
            errorCallback:function () {
              that.setState({
                canAdd:true
              })
            }
          });
        }else{
          that.setState({
            canAdd:true
          })
        }
      })


  }
  handleEdit=()=>{
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    const that = this;
    let management_data={}
    management_data.type=formValues.type;
    management_data.custom_rules={
      villages:formValues.villages,
      manufacturers:formValues.manufacturers,
      concentrators:formValues.concentrators,
    }
    this.props.dispatch({
      type: 'user/edit',
      payload: {
        data: {
          ...formValues,
          management_data,
          is_email_notify: formValues.is_email_notify?1:-1,
          is_sms_notify: formValues.is_sms_notify?1:-1,
          role_id: formValues.role_id?formValues.role_id.key:'',
          id:this.state.editRecord.id
        },
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.account'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page:that.state.per_page,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'user/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.account'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page:that.state.per_page,
        })
      }
    });
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
      type: 'user/editStatus',
      payload: {
        data: {
          id,
          status:sendStatus
        }
      },
      callback: function () {
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.status'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page:that.state.per_page,
        })
      }
    });
  }
  handleResetPassword = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'user/resetPassword',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('重置密码成功')
        that.handleSearch({
          page: that.state.page,
          query: that.state.query,
          per_page:that.state.per_page,
        })
      }
    });
  }
  handleChangePhoneCall=(id)=>{
    console.log(id)
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const {user: {data, meta, loading},usergroup} = this.props;
    const itemMenu = (
      <Menu>
        {
          this.state.showPasswordBtn&& <Menu.Item>
            <a onClick={()=>{this.handleResetPassword(this.state.editRecord.id)}}>{ formatMessage({id: 'intl.reset_password'})}</a>
          </Menu.Item>
        }

        {this.state.showdelBtn&&<Menu.Item>
          <a onClick={()=>{this.handleRemove(this.state.editRecord.id)}}>{ formatMessage({id: 'intl.delete'})}</a>
        </Menu.Item>}

      </Menu>
    );
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   fixed: 'left',
      //   width: 50,
      //   className: 'table-index',
      //   render: (text, record, index) => {
      //     return renderIndex(meta,this.state.initPage,index)
      //   }
      // },
      {title: formatMessage({id: 'intl.username'}), width: 100, dataIndex: 'username', key: 'username', fixed: 'left',
        render: (val, record, index) => {
          return ellipsis2(val,100)
        }},
      {title: formatMessage({id: 'intl.role_name'}), dataIndex: 'role_display_name', key: 'role_display_name',  width: 100,
        render: (val, record, index) => {
          return ellipsis2(val,100)
        }},
      {title: formatMessage({id: 'intl.real_name'}), width: 100, dataIndex: 'real_name', key: 'real_name',
        render: (val, record, index) => {
          return ellipsis2(val,100)
        }},

      {title: formatMessage({id: 'intl.telephone'}), dataIndex: 'mobile', key: 'mobile', width: 150,
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title: formatMessage({id: 'intl.email'}), dataIndex: 'email', key: 'email', width: 150,
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title: formatMessage({id: 'intl.is_telephone_notify'}), dataIndex: 'is_sms_notify', key: 'is_sms_notify', width: 180,
        render: (val, record, index) => (
          <Switch checked={record.is_sms_notify===1?true:false}  />
        )},

      {
        title: formatMessage({id: 'intl.is_email_notify'}), dataIndex: 'is_email_notify', key: 'is_email_notify', width: 150,
        render: (val, record, index) => (
            <Switch checked={record.is_email_notify===1?true:false}  />
        )
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
    const operate={
      title: formatMessage({id: 'intl.operate'}),
      width: 170,
      fixed:'right',
      render: (val, record, index) =>{
        if(record.lock===1){
          return null
        }else if(record.lock===2){
          return (
            <p>
              {
                this.state.showAddBtn &&
                <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            editModal: true
                          }
                        )
                      }}>{formatMessage({id: 'intl.edit'})}</a>
                </span>
              }

            </p>
          )
        }else{
          return (
            <p>
              {
                this.state.showAddBtn &&
                <span>
                      <a href="javascript:;" onClick={()=> {
                        this.setState(
                          {
                            editRecord: record,
                            editModal: true
                          }
                        )
                      }}>{formatMessage({id: 'intl.edit'})}</a>
            <span className="ant-divider"/>
                </span>
              }
              {
                this.state.showStatusBtn &&
                <span>
                     <Popconfirm placement="topRight" title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: record.status===1?'intl.disable':'intl.enable'})})}
                                 onConfirm={()=>this.handleEditStatus(record.id,record.status)}>
              <a href="javascript:;">{formatMessage({id: record.status===1?'intl.disable':'intl.enable'})}</a>
            </Popconfirm>
            <span className="ant-divider"/>
                </span>
              }
              {
                (this.state.showdelBtn || this.state.showPasswordBtn)?
                  <Dropdown onVisibleChange={(visible)=>{
                    if(visible){
                      this.setState({
                        editRecord:record,
                      })
                    }else{
                      this.setState({
                        editRecord:{},
                      })
                    }

                  }} overlay={itemMenu}><a >{formatMessage({id: 'intl.more'})}<Icon type="ellipsis" /></a></Dropdown>
                  :null
              }

            </p>
          )
        }
      }
    }
    if(this.state.canOperate){
      columns.push(operate )
    }
    return (
      <Layout className="layout">
        {/*<Sider changeArea={this.changeArea} location={this.props.history.location}/>*/}
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: formatMessage({id: 'intl.system'})},{name: formatMessage({id: 'intl.account_manage'})}, {name:formatMessage({id: 'intl.user_account'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="账号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x: 1400,y: this.state.tableY}}
                                 history={this.props.history}
                                 operate={operate}
                                 canOperate={this.state.canOperate}
                />
                {/*<Table
                  rowClassName={function (record, index) {
                    if (record.description === '') {
                      return 'error'
                    }
                  }}
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{x: 1100,y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />*/}
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange} handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
          </div>

          <Modal
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false,canAdd:true})}
            footer={[
              <Button key="back" onClick={() => this.setState({addModal:false})}>{formatMessage({id: 'intl.cancel'})}</Button>,
              <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
                {formatMessage({id: 'intl.submit'})}
              </Button>,
            ]}
          >
            <AddOrEditForm   usergroup={usergroup.data}  wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            destroyOnClose={true}
            title={formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm usergroup={usergroup.data} editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
