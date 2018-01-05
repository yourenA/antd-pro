/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class AddConcentrator extends Component {
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
          label="服务器地址"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password_confirmation', {
          })(
            <Select labelInValue={true}>
              { [{id:1,name:'2016'},{id:112,name:'201fafa6'},{id:1123,name:'20faw16'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          label="型号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password_confirmation', {
          })(
            <Select labelInValue={true}>
              { [{id:1,name:'2016'},{id:112,name:'201fafa6'},{id:1123,name:'20faw16'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          style={{color:'red'}}
          label="提示"
          {...formItemLayoutWithLabel}>
          <div>添加集中器会同时对集中器进行初始化</div>
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
