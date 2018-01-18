/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,Row,Input,Button} from 'antd';
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        query: fieldsValue.query,
      };
      this.props.handleSearch({...values,page:1})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <FormItem  label={this.props.inputText?this.props.inputText:"名称"}>
              {getFieldDecorator('query')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem   >
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              {this.props.showAddBtn&&<Button  type="primary"  style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>添加</Button>}
            </FormItem>

        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
