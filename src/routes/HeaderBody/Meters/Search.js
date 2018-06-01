/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button} from 'antd';
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
        number: fieldsValue.number,
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
      <Form onSubmit={this.handleSubmit} layout="inline"  style={{overflow:'hidden'}}>
          <FormItem  label={"水表号"}>
            {getFieldDecorator('number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem   >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {this.props.showAddBtn&&<Button  type="primary"  style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>添加</Button>}
          </FormItem>
          <FormItem   style={{float:'right'}}>
            <Button type="primary" onClick={this.props.clickInfo} icon='tag'>查看开/关阀信息</Button>
          </FormItem>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
