/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, message, Tooltip, Select,Button} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
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
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="目的地类型"
          {...formItemLayoutWithLabel}>
          {getFieldDecorator('kind', {
            initialValue: this.props.editRecord?this.props.editRecord.kind:'',
            rules: [{required: true, message: '请选择目的地类型'}],
          })(
            <Select  >
              <Option value="MQTT">MQTT</Option>
              <Option value="TSDB">TSDB</Option>
              <Option value="MQTT_DYNAMIC">MQTT_DYNAMIC</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              目的地值
            </span>
          )}
        >
          {getFieldDecorator('value', {
            initialValue: this.props.editRecord ? this.props.editRecord.value : '',
            rules: [{required: true, message: '目的地值不能为空'}],
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
