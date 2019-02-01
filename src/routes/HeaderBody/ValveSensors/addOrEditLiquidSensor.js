/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, DatePicker, Select, TreeSelect, InputNumber, Radio} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
import request from "./../../../utils/request";
const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concentrators: []
    };
  }

  componentDidMount() {
    if (this.props.editRecord) {

      this.onChangeCasader(this.props.editRecord.village_id, true)
    }
  }

  onChangeCasader = (value, init)=> {
    console.log('value', value);
    const that = this;
    const {form} = this.props;
    form.setFieldsValue({concentrator_number: ''})
    request(`/concentrators`, {
      method: 'get',
      params: {
        village_id: value
      }
    }).then((response)=> {
      console.log(response);
      that.setState({
        concentrators: response.data.data
      }, function () {
        if (init === true) {
          that.props.form.setFieldsValue({
            concentrator_number: that.props.editRecord.concentrator_number,
          });
        }

      })
    })
  }
  renderTreeNodes = (data)=> {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }

  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const {sider_regions:{data}}=this.props;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              液位传感器编号
            </span>
            )}
          >
            {getFieldDecorator('number', {
              initialValue: this.props.editRecord ? this.props.editRecord.number : '',
              rules: [{required: true, message: '编号不能为空'}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label="传感器序号"
          >
            {getFieldDecorator('index', {
              initialValue: this.props.editRecord ? this.props.editRecord.index : '',
              rules: [{required: true, message: '传感器序号不能为空'}],
            })(
              <InputNumber min={1}/>
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              阀门联动最低液位值
            </span>
            )}
          >
            {getFieldDecorator('min_actual_value', {
              initialValue: this.props.editRecord ? this.props.editRecord.min_actual_value : '',
              rules: [{required: true, message: '阀门联动最低液位值不能为空'}],
            })(
              <InputNumber  />
            )}
          </FormItem>

          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
             阀门联动最高液位值
            </span>
            )}
          >
            {getFieldDecorator('max_actual_value', {
              initialValue: this.props.editRecord ? this.props.editRecord.max_actual_value : '',
              rules: [{required: true, message: '阀门联动最高液位值不能为空'}],
            })(
              <InputNumber  />
            )}
          </FormItem>

          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
             液位阀控门限值
            </span>
            )}
          >
            {getFieldDecorator('thresholds', {
              initialValue: this.props.editRecord ? this.props.editRecord.thresholds : '',
              rules: [{required: true, message: '液位阀控门限值不能为空'}],
            })(
              <InputNumber  />
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              计量单位
            </span>
            )}
          >
            {getFieldDecorator('unit', {
              initialValue: this.props.editRecord ? this.props.editRecord.unit : '%',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label="正/负反馈"
          >
            {getFieldDecorator('is_positive_feedback', {
              initialValue: this.props.editRecord ? this.props.editRecord.is_positive_feedback.toString() : '1',
              rules: [{required: true, message: '正/负反馈不能为空'}],
            })(
              <RadioGroup>
                <Radio value="1">正反馈</Radio>
                <Radio value="-1">负反馈</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label="是否自动联动"
          >
            {getFieldDecorator('is_automatic_linkage', {
              initialValue: this.props.editRecord ? this.props.editRecord.is_automatic_linkage.toString() : '1',
              rules: [{required: true, message: '正/负反馈不能为空'}],
            })(
              <RadioGroup>
                <Radio value="1">是</Radio>
                <Radio value="-1">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              安装小区
            </span>
            )}>
            {getFieldDecorator('village_id', {
              initialValue: this.props.editRecord ? this.props.editRecord.village_id : '',
              rules: [{required: true, message: '安装小区不能为空'}],
            })(
              <TreeSelect
                onChange={this.onChangeCasader}
              >
                {this.renderTreeNodes(data)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              集中器编号
            </span>
            )}>
            {getFieldDecorator('concentrator_number', {
              initialValue: this.props.editRecord ? this.props.editRecord.concentrator_number : '',
              rules: [{required: true, message: '集中器编号不能为空'}],
            })(
              <Select >
                { this.state.concentrators.map(item => <Option key={item.id}
                                                               value={item.number}>{item.number}</Option>) }
              </Select>
            )}
          </FormItem>

          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label="地址"
          >
            {getFieldDecorator('address', {
              initialValue: this.props.editRecord ? this.props.editRecord.address : '',

              rules: [{required: true, message: '地址不能为空'}],
            })(
              <Input />
            )}
          </FormItem>


          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              开始使用日期
            </span>
            )}
          >
            {getFieldDecorator('enabled_date', {
              initialValue: this.props.editRecord ? moment(this.props.editRecord.enabled_date) : moment(),
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem
            style={{width: '50%', display: 'inline-block'}}
            {...formItemLayoutWithLabel}
            label={(
              <span>
              备注
            </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
