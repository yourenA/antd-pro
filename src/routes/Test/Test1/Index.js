import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Row, Col, Form, Icon, Input, Button, Checkbox,Select,Badge,Table,Pagination,message} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
@connect(state => ({
  user_command_data:state.user_command_data
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      feature: [{key:'open_valve',value:'开阀'},{key:'close_valve',value:'关阀'},{key:'upload_single',value:'抄读单表'}]
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_command_data/fetch',
      payload: {
        page: 1,
      }
    });

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
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'table-index',
        render: (text, record, index) => {
          return (
            <span>
                {index + 1}
            </span>
          )
        }
      },
      {title: '集中器编号', width: '15%', dataIndex: 'concentrator_number', key: 'concentrator_number'},
      {title: '水表号', width: '15%', dataIndex: 'meter_number', key: 'meter_number'},
      {title: '功能代码', dataIndex: 'feature', key: 'feature', width:  '15%', },
      {
        title: '状态',
        dataIndex: 'status',
        width: '10%',
        render:(val,record,index)=>{
          return(
            <span>
                 <Badge status={`${val===-1?"error":"success"}`} />{record.status_explain}
              </span>
          )
        }
      },
      {title: '执行回调结果', dataIndex: 'result', key: 'result'},
      {title: '执行用户名', dataIndex: 'send_username', key: 'send_username'},
      {title: '创建名称', dataIndex: 'created_at', key: 'created_at',},
    ];
    return (
      <div>
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
            <Card title="测试结果列表"  extra={<a onClick={()=>{this.handleSearch({page:1})}}>刷新 <Icon type="sync" /></a> }>
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
                pagination={false}
                size="small"
              />
              <Pagination showQuickJumper className='pagination' total={meta.pagination.total}
                          current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                          style={{marginTop: '10px'}} onChange={this.handPageChange}/>

            </Card>

          </Col>
        </Row>
        <Row type="flex" justify="center" align="top" gutter={16}>

        </Row>
      </div>


    );
  }
}
const WrappedNormalLoginForm = Form.create()(Dashboard);
export default WrappedNormalLoginForm
