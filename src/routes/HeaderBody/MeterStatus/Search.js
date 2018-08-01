/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Switch} from 'antd';
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      // const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        ...fieldsValue,
        // started_at: rangeTimeValue ? moment(rangeTimeValue[0]).format('YYYY-MM-DD') : '',
        // ended_at: rangeTimeValue ? moment(rangeTimeValue[1]).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values, page: 1,per_page:this.props.per_page})
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
        <Row gutter={16}>
          <FormItem label="水表编号">
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="户号">
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="用户名称">
            {getFieldDecorator('real_name')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="安装地址">
            {getFieldDecorator('install_address')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
         {/* <FormItem label="创建时间">
            {getFieldDecorator('range-time-picker', {
              initialValue: this.props.initRange ? this.props.initRange : '',
            })(
              <RangePicker allowClear={this.props.initRange ? false : true}/>
            )}
          </FormItem>*/}
          <FormItem >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
           {/* {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
