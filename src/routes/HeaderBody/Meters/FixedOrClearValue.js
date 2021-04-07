/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  InputNumber, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
import moment from 'moment'
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <div>

      <Form onSubmit={this.handleSubmit}>
        <FormItem label={'水表号'}  {...formItemLayoutWithLabel}>
          {getFieldDecorator('meter_number',{
            initialValue: this.props.editRecord.number
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label={'开始日期'}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: moment(),

          })(
            <DatePicker
              style={{width:'100%'}}
              allowClear={false}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label={'结束日期'}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('ended_at', {
            initialValue: moment(),
          })(
            <DatePicker
              style={{width:'100%'}}
              allowClear={false}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        {
          this.props.showValue&&
          <FormItem label={'水表读数'}   {...formItemLayoutWithLabel}>
            {getFieldDecorator('value')(
              <InputNumber style={{width:'100%'}} placeholder={'请输入'}/>
            )}
          </FormItem>
        }

      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
