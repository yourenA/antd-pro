import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Switch,Button } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import Pagination from './../../../../components/Pagination/Index'

import {connect} from 'dva';
import find from 'lodash/find'
import AddOrEditForm from './addOrEditDMA'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  global: state.global,
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
      initPage: 1,
      editModal: false,
      addModal: false,
      canOperate:localStorage.getItem('canOperateDMA')==='true'?true:false,
      canAdd:true,
      per_page:30,
      canLoadByScroll: true,
    }
  }

  componentDidMount() {
    document.querySelector('.ant-table-body').addEventListener('scroll',debounce(this.scrollTable,200))
    const {dispatch} = this.props;
    dispatch({
      type: 'dma/fetch',
      payload: {
        page: 1,
      },
      callback: ()=> {
        this.changeTableY()
      }
    });
  }
  componentWillUnmount() {
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
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
        const {dma: {meta}} = this.props;
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
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.meter-table').offsetTop - (68 + 54 + 50 + 38 + 17)
    })
  }
  handleFormReset = () => {
    this.handleSearch({
      page: 1,
      per_page:30,
    })
  }
  handleSearch =(values, cb, fetchAndPush = false) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: fetchAndPush?'dma/fetchAndPush':'dma/fetch',
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
  handleAdd = () => {
    this.setState({
      canAdd:false
    })
    const that = this;
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
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
        that.setState({
          canAdd:true
        })
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page,
        })
      },
      errorCallback:function () {
        that.setState({
          canAdd:true
        })
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'dma/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改DMA分区成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page,
        })
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'dma/remove',
      payload: {
        id: id,
      },
      callback: function () {
        message.success('删除DMA分区成功')
        that.handleSearch({
          page: that.state.page,
          per_page:that.state.per_page,
        })
      }
    });
  }

  render() {
    const {dma: {data, meta, loading}, dma} = this.props;
    const columns = [
      {title: '名称', dataIndex: 'name', key: 'name',width:'25%'},
      {title: '备注', dataIndex: 'remark', key: 'remark'},
      {title: '创建时间', dataIndex: 'created_at', key: 'created_at',width:'30%'},
    ];
    if(this.state.canOperate){
      columns.push( {
        title: '操作',
        width: 100,
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
                          callback: ()=> {
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
      })
    }
    const {isMobile} =this.props.global;
    return (
      <div className="content">
        <PageHeaderLayout title="运行管理 " breadcrumb={[{name: '运行管理 '}, {name: 'DMA分区管理'}, {name: '分区管理'}]}>
          <Card bordered={false} style={{margin: '-16px -16px 0'}}>
            <div className='tableList'>
              <div className='tableListForm'>
                <DefaultSearch handleSearch={this.handleSearch}
                               handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                               showAddBtn={this.state.showAddBtn} clickAdd={()=> {
                  const {dispatch} = this.props;
                  dispatch({
                    type: 'dma/fetchAll',
                    payload: {
                      return: 'all'
                    },
                    callback: ()=> {
                      this.setState({addModal: true})
                    }
                  });

                }}
                               changeShowOperate={()=> {
                                 this.setState({canOperate: !this.state.canOperate})
                               }}
                />
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
              scroll={isMobile ? {x: 600} : {y: this.state.tableY}}
              pagination={false}
              size="small"
            />
            <Pagination meta={meta}  initPage={this.state.initPage} handPageSizeChange={this.handPageSizeChange}   handPageChange={this.handPageChange}/>
          </Card>
        </PageHeaderLayout>
        <Modal
          title="添加DMA分区"
          visible={this.state.addModal}
          onOk={this.handleAdd}
          onCancel={() => this.setState({addModal: false,canAdd:true})}
          footer={[
            <Button key="back" onClick={() => this.setState({addModal:false})}>取消</Button>,
            <Button key="submit" type="primary" disabled={!this.state.canAdd} onClick={this.handleAdd}>
              确认
            </Button>,
          ]}
        >
          <AddOrEditForm dma={dma} wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="修改DMA分区"
          visible={this.state.editModal}
          onOk={this.handleEdit}
          onCancel={() => this.setState({editModal: false})}
        >
          <AddOrEditForm dma={dma} editRecord={this.state.editRecord}
                         wrappedComponentRef={(inst) => this.editFormRef = inst}/>
        </Modal>
      </div>


    );
  }
}

export default Vendor
