import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Badge,  Dropdown,Button,
  Menu,
  Icon,} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Pagination from '../../../components/Pagination/Index'
import DefaultSearch from './Search'
import {connect} from 'dva';
import find from 'lodash/find'
import uuid from 'uuid/v4'
import {getMonth,ellipsis2} from '../../../utils/utils'
import debounce from 'lodash/throttle'
import ResizeableTable from '../../../components/ResizeableTitle/Index'
import MyPhotoSwipe from '../../../components/Photoswipe/Index'
const {Content} = Layout;
@connect(state => ({
  meter_image: state.meter_image,
}))
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
      canOperate:localStorage.getItem('canOperateImage')==='true'?true:false,
      canAdd:true,
      per_page:30,
      canLoadByScroll: true,
      month:getMonth()
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
      type: 'meter_image/fetch',
      payload: {
        page: 1,
        month:this.state.month
      }
    });
  }
  componentWillUnmount(){
    document.querySelector('.ant-table-body').removeEventListener('scroll',debounce(this.scrollTable,200))
  }
  scrollTable = ()=> {
    const scrollTop = document.querySelector('.ant-table-body').scrollTop;
    const offsetHeight = document.querySelector('.ant-table-body').offsetHeight;
    const scrollHeight = document.querySelector('.ant-table-body').scrollHeight;
    const that = this;
    if (scrollTop + offsetHeight > scrollHeight - 300) {
      if (this.state.canLoadByScroll) {
        const {meter_image: {meta}} = this.props;
        if (this.state.page < meta.pagination.total_pages) {
          this.setState({
            canLoadByScroll: false,
          })
          this.handleSearch({
            page: this.state.page + 1,
            month:this.state.month,
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
      month:getMonth(),
      per_page:30,
    })
  }
  handleSearch = (values, cb, fetchAndPush = false) => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: fetchAndPush?'meter_image/fetchAndPush':'meter_image/fetch',
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
      month:this.state.month,
      per_page:this.state.per_page
    })
  }
  handPageSizeChange = (per_page)=> {
    this.handleSearch({
      page: 1,
      month:this.state.month,
      per_page:per_page
    })
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'meter_image/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除图片成功')
        that.handleSearch({
          page: that.state.page,
          month:that.state.month,
          per_page:that.state.per_page,
        })
      }
    });
  }
  openGallery=(url)=>{
    console.log('url',url)
    this.setState({url:url,uuid:uuid()})
  }
  // that.openGallery(index)
  render() {
    const {meter_image: {data, meta, loading}} = this.props;
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
      {title: '用户名', width: 100, dataIndex: 'username', key: 'username',
        render: (val, record, index) => {
          return ellipsis2(val,100)
        }},
      {title: '经纬度', width: 200, dataIndex: 'longitude', key: 'longitude',
        render: (val, record, index) => {
          return ellipsis2(`${val}/${record.latitude}`,200)
        }},
      {title: '日期', width: 150, dataIndex: 'date', key: 'date',
        render: (val, record, index) => {
          return ellipsis2(val,150)
        }},
      {title: '具体时间', width: 200, dataIndex: 'created_at', key: 'created_at',
        render: (val, record, index) => {
          return ellipsis2(val,200)
        }},
      {title: '查看照片', dataIndex: 'image', key: 'image',
        render: (val, record, index) => {
          return <Button type="primary" size="small" onClick={()=>this.openGallery(record.url)}>查看图像</Button>
        }},
    ];
    const operate={
      title: '操作',
      width: 150,
      fixed:'right',
      render: (val, record, index) =>{
          return (
            <p>
              {
                <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                            onConfirm={()=>this.handleRemove(record.id)}>
                  <a href="">删除</a>
                </Popconfirm>
              }

            </p>
          )
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
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '},{name: '抄表路线管理'}, {name: '抄表图片管理'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch  month={this.state.month} inputText="账号" dateText="发送时间" handleSearch={this.handleSearch}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   showAddBtn={this.state.showAddBtn} clickAdd={()=>this.setState({addModal:true})}
                                   changeShowOperate={()=> {
                                     this.setState({canOperate: !this.state.canOperate})
                                   }}/>
                  </div>
                </div>
                <ResizeableTable loading={loading} meta={meta} initPage={this.state.initPage}
                                 dataSource={data} columns={columns} rowKey={record => record.id}
                                 scroll={{x: 1000,y: this.state.tableY}}
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

  {/*        <Modal
            width="60%"
            title="查看图片"
            visible={this.state.showModal}
            onOk={this.handleAdd}
            onCancel={() => this.setState({showModal: false})}
            footer={[

            ]}
          >
            <MyPhotoSwipe  src={this.state.url}/>
            /!*<img src={this.state.url} alt="" style={{width:'100%',height:'100%'}}/>*!/
          </Modal>*/}
          <MyPhotoSwipe  src={this.state.url} uuid={this.state.uuid}/>
          <Modal
            key={ Date.parse(new Date())}
            title="修改用户"
            visible={this.state.editModal}
            onOk={this.handleEdit}
            onCancel={() => this.setState({editModal: false})}
          >
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Vendor
