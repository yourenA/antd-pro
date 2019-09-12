import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Switch} from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import find from 'lodash/find'
import AddOrEditForm from './addOrEditArea'
import debounce from 'lodash/throttle'
import {injectIntl} from 'react-intl';
const {Content} = Layout;
@connect(state => ({
  area: state.area,
}))
@injectIntl
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'village_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'village_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      editModal: false,
      addModal: false,
      canOperate: localStorage.getItem('canOperateArea') === 'true' ? true : false,
      per_page: 30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll', debounce(this.scrollTable, 200))
    const {dispatch} = this.props;
    dispatch({
      type: 'area/fetch',
      payload: {
        page: 1,
      },
      callback: ()=> {
        this.changeTableY()
      }
    });
  }

  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll', debounce(this.scrollTable, 200))
  }

  scrollTable = ()=> {
    console.log('scroll')
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    console.log('scrollTop', scrollTop)
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      console.log('到达底部');
      if (this.state.canLoadByScroll) {
        const {area: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            per_page: this.state.per_page,
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
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page: 30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush ? 'area/fetchAndPush' : 'area/fetch',
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
      per_page: this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      per_page: per_page
    })
  }
  handleAdd = () => {

    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues);

    this.props.dispatch({
      type: 'area/add',
      payload: {
        ...formValues
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.village'})}
          )
        )
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });

  }
  handleEdit = ()=> {

    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'area/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.village'})}
          )
        )
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });
  }
  handleRemove = (id)=> {
    const {intl:{formatMessage}} = this.props;
    const that = this;
    this.props.dispatch({
      type: 'area/remove',
      payload: {
        id: id,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.delete'}), type: formatMessage({id: 'intl.village'})}
          )
        )
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page
        })
      }
    });
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {area: {data, meta, loading}, manufacturers} = this.props;
    const columns = [
      {title: formatMessage({id: 'intl.village_name'}), dataIndex: 'name', key: 'name', width: '30%'},
      {title: formatMessage({id: 'intl.remark'}), dataIndex: 'remark', key: 'remark', width: '30%'},
    ];
    if (this.state.canOperate) {
      columns.push({
        title: formatMessage({id: 'intl.operate'}),
        render: (val, record, index) => (
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
              this.state.showdelBtn &&
              <Popconfirm placement="topRight"
                          title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.delete'})})}
                          onConfirm={()=>this.handleRemove(record.id)}>
                <a href="">{formatMessage({id: 'intl.delete'})}</a>
              </Popconfirm>
            }

          </p>
        ),
      })
    }
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.village_manage'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch inputText="区域名称" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal: true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={data}
                  columns={columns}
                  scroll={{y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination meta={meta} initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}
                            handPageChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>

          </div>

          <Modal
            destroyOnClose={true}
            title={formatMessage({id: 'intl.add'})}
            visible={this.state.addModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({addModal: false})}
          >
            <AddOrEditForm wrappedComponentRef={(inst) => this.formRef = inst}/>
          </Modal>
          <Modal
            destroyOnClose={true}
            title={formatMessage({id: 'intl.edit'})}
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
            <AddOrEditForm editRecord={this.state.editRecord} wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
