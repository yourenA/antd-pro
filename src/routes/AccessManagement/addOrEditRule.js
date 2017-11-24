/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Card, Tooltip, Button, Table, Popconfirm, Modal, message} from 'antd';
import {connect} from 'dva';
import AddOrEditDataDes from './addOrEditDataDes'
import {Link, routerRedux} from 'dva/router';
const FormItem = Form.Item;
@connect(state => ({
  rule: state.rule,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.uuid = 0;
    this.isNewRule = this.props.match.params.ruleId === 'add' ? true : false;
    this.state = {
      select: '',
      where: '',
      from: '',
      data: [],
      modalVisible: false,
      modalEditVisible: false,
      editRecord: {}
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const endpoint_id = this.props.match.params.id;
    const rule_id = this.props.match.params.ruleId;
    const that = this;
    if (this.isNewRule) {
      console.log('新建规则')
    } else {
      console.log('修改规则')
      dispatch({
        type: 'rule/fetchOneRule',
        payload: {
          endpoint_id,
          rule_id
        },
        callback: function () {
          const {rule:{editRecord}}=that.props
          editRecord.destinations.data.map((item, index)=> {
            item.uuid = item.id
          })
          that.setState({
            data: editRecord.destinations.data
          })
        }
      });

    }
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleModalEditVisible = (flag) => {
    this.setState({
      modalEditVisible: !!flag,
    });
  }
  handleChangeFrom = (e)=> {
    this.setState({
      from: e.target.value
    })
  }
  handleChangeWhere = (e)=> {
    this.setState({
      where: e.target.value
    })
  }
  handleChangeSelect = (e)=> {
    this.setState({
      select: e.target.value
    })
  }
  handleAdd = ()=> {
    const formValues = this.formRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    if (!formValues.kind || !formValues.value) {
      message.error('请完善目的地信息')
      return false
    }
    this.uuid++
    this.state.data.push({kind: formValues.kind, value: formValues.value, uuid: this.uuid})
    this.setState({
      data: this.state.data,
      modalVisible: false
    })
  }
  handleEdit = ()=> {
    const formValues = this.editFormRef.props.form.getFieldsValue();
    const that = this;
    console.log('formValues', formValues)
    if (!formValues.kind || !formValues.value) {
      message.error('请完善目的地信息')
      return false
    }
    const replacement = {
      uuid: this.state.editRecord.uuid,
      ...formValues
    }
    let list = this.state.data.map(t => {
      return t.uuid === replacement.uuid
        ? replacement
        : t;
    });
    this.setState({
      data: list,
      modalEditVisible: false
    })
  }
  handleRemove = (id)=> {
    let index = null;
    this.state.data.map((t, i) => {
      if (t.uuid === id) {
        index = i
      }
    });
    this.state.data.splice(index, 1)
    this.setState({
      data: this.state.data,
    })
  }
  handleSubmit = (e)=> {
    e.preventDefault();
    const that = this;
    const endpoint_id = this.props.match.params.id;
    const rule_id = this.props.match.params.ruleId;
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          console.log(values)
          const type = this.isNewRule ? 'rule/add' : 'rule/edit';
          const msg = this.isNewRule ? '创建规则成功' : '修改规则成功';
          const data = this.isNewRule ? {
            endpoint_id,
            destinations: this.state.data,
            ...values
          } : {
            id:rule_id,
            endpoint_id,
            destinations: this.state.data,
            ...values
          };
          this.props.dispatch({
            type: type,
            payload: {
              data
            },
            callback: function () {
              message.success(msg)
              that.props.dispatch(routerRedux.replace(`/access-management/endpoints/${endpoint_id}/rule`));
            }
          });
        }
      }
    );
  }

  render() {
    const columns = [{
      title: '目的地类型',
      dataIndex: 'kind',
      key: 'kind',
    }, {
      title: '目的地类型',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '操作',
      key: 'action',
      width: '120px',
      render: (val, record, index) => (
        <p>
          <a href="javascript:;" onClick={()=> {
            this.setState(
              {
                editRecord: record,
                modalEditVisible: true
              }
            )
          }}>编辑</a>
          <span className="ant-divider"/>
          <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                      onConfirm={()=>this.handleRemove(record.id)}>
            <a href="">删除</a>
          </Popconfirm>
        </p>
      ),
    }];
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const endpoint_id = this.props.match.params.id;
    const {rule:{editRecord}}=this.props
    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayoutWithLabel}
              label='名称'
            >
              {getFieldDecorator('name', {
                initialValue: !this.isNewRule ? editRecord.name : '',
                rules: [{required: true, message: '名称不能为空'}],
              })(
                <Input disabled={this.props.editRecord ? true : false}/>
              )}
            </FormItem>
            <FormItem
              label="描述"
              {...formItemLayoutWithLabel}

            >
              {getFieldDecorator('description', {
                initialValue: !this.isNewRule ? editRecord.description : '',
              })(
                <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
              )}
            </FormItem>
            <FormItem
              style={{marginBottom: '10px'}}
              {...formItemLayoutWithLabel}
              label="筛选条件"
            >
              <span
                className="ant-form-text">SELECT <b>{this.state.select}</b> FROM <b>{this.state.from}</b> WHERE <b>{this.state.where}</b></span>
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label='MQTT主题'
            >
              {getFieldDecorator('from', {
                initialValue: !this.isNewRule ? editRecord.from : '',
                rules: [{required: true, message: '请输入MQTT主题'}],
                onChange: this.handleChangeFrom,
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label='查询字段'
            >
              {getFieldDecorator('select', {
                initialValue: !this.isNewRule ? editRecord.select : '',
                rules: [{required: true, message: '请输入查询字段'}],
                onChange: this.handleChangeSelect,
              })(
                <Input type="textarea" autosize={{minRows: 2, maxRows: 6}}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              约束条件&nbsp;
                  <Tooltip
                    title="在约束条件中可以配合使用 SQL函数 来进行更复杂查询，如like、ceil、floor等">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
              )}
            >
              {getFieldDecorator('where', {
                initialValue: !this.isNewRule ? editRecord.where : '',
                onChange: this.handleChangeWhere,
                rules: [{required: true, message: '请输入约束条件'}],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label="数据目的地"
            >
              <div>
                <Table rowKey={record => record.uuid} columns={columns} dataSource={this.state.data}
                       pagination={false}/>
                <Button
                  style={{width: '100%', marginTop: 16, marginBottom: 8}}
                  type="dashed"
                  onClick={()=> {
                    this.setState({
                      modalVisible: true
                    })
                  }}
                  icon="plus"
                >
                  新增数据目的地
                </Button>
              </div>
            </FormItem>
            <FormItem
              wrapperCol={ {
                offset: 7,
                span: 10
              }}>
              <Button style={{marginRight: '10px', width: '40%'}} onClick={()=> {
                this.props.dispatch(routerRedux.replace(`/access-management/endpoints/${endpoint_id}/rule`));
              }}>
                取消
              </Button>
              <Button style={{width: '40%'}} type="primary" htmlType="submit">
                确定
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal
          title=" 新增数据目的地"
          visible={this.state.modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <AddOrEditDataDes wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title=" 修改数据目的地"
          visible={this.state.modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <AddOrEditDataDes editRecord={this.state.editRecord} wrappedComponentRef={(inst) => this.editFormRef = inst}/>
        </Modal>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
