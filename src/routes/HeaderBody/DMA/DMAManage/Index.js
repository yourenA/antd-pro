import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm,Modal,Switch} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DefaultSearch from './../../OnlyAdd'

import {connect} from 'dva';
import find from 'lodash/find'
import AddOrEditForm from './addOrEditDMA'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.state = {
      showAddBtn: find(this.permissions, {name: 'area_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'area_delete'}),
      tableY: 0,
      query: '',
      page: 1,
      editModal: false,
      addModal: false,
    }
  }

  componentDidMount() {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
    const {dispatch} = this.props;
    dispatch({
      type: 'dma/fetch',
      payload: {
        page: 1,
      },
      callback:()=>{
        this.changeTableY()
      }
    });
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dma/fetch',
      payload: {},
    });

    this.setState({
      page: 1,
      query: '',
    })
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dma/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      query: values.query,
      page: values.page
    })
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
      query: this.state.query,
    })
  }
  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'dma/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('添加DMA分区成功')
        that.setState({
          addModal: false,
        });
        that.props.dispatch({
          type: 'dma/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
          }
        });
      }
    });

  }
  handleEdit=()=>{
    const formValues =this.editFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    const that = this;
    this.props.dispatch({
      type: 'dma/edit',
      payload: {
        ...formValues,
        id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改DMA分区成功')
        that.setState({
          editModal: false,
        });
        that.props.dispatch({
          type: 'dma/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'dma/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除DMA分区成功')
        that.props.dispatch({
          type: 'dma/fetch',
          payload: {
            query:that.state.query,
            page:that.state.page
          }
        });
      }
    });
  }
  render() {
    const {dma: {data, meta, loading},dma} = this.props;
    const columns = [
      {title: '名称', dataIndex: 'name', key: 'name',width:'30%'},
      {title: '备注', dataIndex: 'remark', key: 'remark',width:'30%'},
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at'},
      {
        title: '操作',
          width:100,
        render: (val, record, index) => (
          <p>
            {
              this.state.showAddBtn &&
              <span>
                      <a href="javascript:;" onClick={()=> {
                        const {dispatch} = this.props;
                        dispatch({
                          type: 'dma/fetchAll',
                          payload: {
                            return: 'all'
                          },
                          callback:()=>{
                            this.setState(
                              {
                                editRecord: record,
                                editModal: true
                              }
                            )
                          }
                        });

                      }}>编辑</a>
            <span className="ant-divider"/>
                </span>
            }
            {
              this.state.showdelBtn &&
              <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                          onConfirm={()=>this.handleRemove(record.id)}>
                <a href="">删除</a>
              </Popconfirm>
            }

          </p>
        ),
      },
    ];
    return (
          <div className="content">
            <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: 'DMA分区管理'}, {name: '分区管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>{
                      const {dispatch} = this.props;
                      dispatch({
                        type: 'dma/fetchAll',
                        payload: {
                          return: 'all'
                        },
                        callback:()=>{
                          this.setState({addModal:true})
                        }
                      });

                    }}/>
                  </div>
                </div>
                <Table
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
                  scroll={{ y: this.state.tableY}}
                  pagination={false}
                  size="small"
                />
                <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                            current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                            style={{marginTop: '10px'}} onChange={this.handPageChange}/>
              </Card>
            </PageHeaderLayout>
            <Modal
              key={ Date.parse(new Date())+1}
              title="添加DMA分区"
              visible={this.state.addModal}
              onOk={this.handleAdd}
              onCancel={() => this.setState({addModal: false})}
            >
              <AddOrEditForm    dma={dma} wrappedComponentRef={(inst) => this.formRef = inst}/>
            </Modal>
            <Modal
              key={ Date.parse(new Date())}
              title="修改DMA分区"
              visible={this.state.editModal}
              onOk={this.handleEdit}
              onCancel={() => this.setState({editModal: false})}
            >
              <AddOrEditForm  dma={dma} editRecord={this.state.editRecord}  wrappedComponentRef={(inst) => this.editFormRef = inst}/>
            </Modal>
          </div>


    );
  }
}

export default Vendor
