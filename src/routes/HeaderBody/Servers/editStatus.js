/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Switch, } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;

class EditStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label="服务器地址状态"
        >
          {getFieldDecorator('status',
            { initialValue: this.props.editRecord ? (this.props.editRecord.status===1?true:false) : false
              ,valuePropName: 'checked' })(
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditStatusForm = Form.create()(EditStatus);
export default connect()(EditStatusForm);
