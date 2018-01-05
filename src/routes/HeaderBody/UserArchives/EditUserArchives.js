/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
class EditUserArchives extends Component {
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
          label="用户姓名"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('username', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="身份证号"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('id', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="地址"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('address', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="联系电话"
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('tel', {
            initialValue: this.props.editRecord ? this.props.editRecord.username : '',
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
