import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Row, Col, Form, Icon, Input, Button, Checkbox,Select,Badge,Table,Pagination,message,Divider,Tooltip} from 'antd';
import { renderIndex} from './../../../utils/utils'
import uuid from 'uuid/v4'
const Option = Select.Option;
const FormItem = Form.Item;
@connect(state => ({
  user_command_data:state.user_command_data
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.state = {
      page:1,
      auto:false,
      feature: [{key:'open_valve',value:'开阀'},{key:'close_valve',value:'关阀'}
        ,{key:'read_single_901f',value:'901F点抄'},{key:'read_multiple_901f',value:'901F集抄'},{key:'upload_single',value:'点抄'},{key:'runonce_upload_multiple_timing',value:'集抄'}]
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        page: 1,
      }
    });
    // this.timer=setInterval(this.setIntervalFetch,10000)

  }
  setIntervalFetch=()=>{
    this.handleSearch({
      page: 1,
    })
  }
  componentWillUnmount=()=>{
    clearInterval(this.timer)
  }
  toggleAuto=()=>{
    const that=this;
    this.setState({
      auto:!this.state.auto
    },function () {
      if(this.state.auto){
        console.log('开启自动刷新')
        clearInterval(this.timer)
        that.handleSearch({
          page: 1,
        })
        this.timer=setInterval(function () {
          that.handleSearch({
            page: 1,
          })
        },5000)
      }else{
        console.log('停止自动刷新')
        clearInterval(this.timer)
      }
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const that = this;
        const {dispatch} = this.props;
        dispatch({
          type: 'user_command_data/add',
          payload:{
            ...values,
            feature:values.feature?values.feature.key:''
          },
          callback:()=>{
            message.success('发送指令成功')
            that.props.dispatch({
              type: 'user_command_data/fetch',
              payload: {
                page:that.state.page
              },
            });
          }
        });
      }
    });
  }
  handPageChange = (page)=> {
    this.handleSearch({
      page: page,
    })
  }

  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        ...values,
      },
    });

    this.setState({
      page: values.page
    })
  }

  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24},
        sm: {offset: 7, span: 17},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const {user_command_data: {data, meta, loading,command_msg}} = this.props;
    for (let i = 0; i < data.length; i++) {
      data[i].uuidkey = uuid()
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        fixed: 'left',
        className: 'table-index',
        render: (text, record, index) => {
          return renderIndex(meta, this.state.page, index)
        }
      },
      {title: '集中器编号', width: 110, dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表号', width: 100, dataIndex: 'meter_number', key: 'meter_number'},
      {title: '读数', width: 100, dataIndex: 'value', key: 'value'},
   /*   {title: '功能代码', dataIndex: 'feature', key: 'feature', width: 140, },*/
   /*   {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render:(val,record,index)=>{
          return(
            <span>
                 <Badge status={`${val===-1?"error":"success"}`} />{record.status_explain}
              </span>
          )
        }
      },
      {title: '执行回调结果', dataIndex: 'result', key: 'result', width: 130,},*/
      {title: '附带参数', dataIndex: 'body', key: 'body', width: 200,
        render:(val,record,index)=>{
          return(
          <Tooltip arrowPointAtCenter title={<p style={{width:'200px',wordWrap:'break-word'}}>{ JSON.stringify(val)}</p>}>
            <p style={{width:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{JSON.stringify(val)}</p>
          </Tooltip>
          )
        }},
      {title: '上传时间', dataIndex: 'uploaded_at', key: 'uploaded_at', width: 150,},
      {title: '采集时间', dataIndex: 'collected_at', key: 'collected_at',},

    ];
    return (
      <div >
        <Row type="flex" justify="center" align="top" gutter={16}>
          <Col sm={12} md={8} lg={6}>
            <Card title="测试">
              <Form >
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>集中器编号</span>
                  )}>
                  {getFieldDecorator('concentrator_number', {})(
                    <Input placeholder="集中器编号"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>
              水表编号
            </span>
                  )}>
                  {getFieldDecorator('meter_number', {})(
                    <Input placeholder="水表编号"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>
              指令
            </span>
                  )}>
                  {getFieldDecorator('feature', {
                  })(
                    <Select labelInValue={true} >
                      { this.state.feature.map((item, key) => {
                        return (
                          <Option key={item.key} value={item.key}>{item.value}</Option>
                        )
                      }) }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithLabel}
                  label={(
                    <span>协议</span>
                  )}>
                  {getFieldDecorator('protocol', {})(
                    <Input placeholder="协议"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayoutWithOutLabel}
                >
                  <Button style={{width:'100%'}} type="primary" onClick={this.handleSubmit}>
                    发送指令
                  </Button>
                </FormItem>
                <FormItem
                  {...formItemLayoutWithOutLabel}
                >
                  {
                    JSON.stringify(command_msg)
                  }
                </FormItem>
              </Form>
            </Card>

          </Col>
          <Col sm={20} md={20} lg={16} >
            <Card title="测试结果列表"  extra={<div><Button type="primary" onClick={this.toggleAuto}>{this.state.auto?'停止自动刷新':'开启自动刷新'} <Icon type="sync" /></Button> <Divider type="vertical" /><Button disabled={this.state.auto} onClick={()=>{this.handleSearch({page:1})}}>手动刷新 <Icon type="sync" /></Button></div> }>
              <Table
                rowClassName={function (record, index) {
                  if (record.description === '') {
                    return 'error'
                  }
                }}
                className='meter-table'
                loading={loading}
                rowKey={record => record.uuidkey}
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{x: 900}}
                size="small"
              />
              <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                          current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                          style={{marginTop: '10px'}} onChange={this.handPageChange}/>

            </Card>

          </Col>
          <style>
            {`
                            #root{
                                background: #f9f9f9;
                            }
                        `}
          </style>
        </Row>
      </div>


    );
  }
}
const WrappedNormalLoginForm = Form.create()(Dashboard);
export default WrappedNormalLoginForm
