/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,Col,Input,Button,Switch} from 'antd';
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
      const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        query: fieldsValue.query,
        started_at: rangeTimeValue ? moment(rangeTimeValue[0]).format('YYYY-MM-DD') : '',
        ended_at: rangeTimeValue ? moment(rangeTimeValue[1]).format('YYYY-MM-DD') : '',
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
        <Row gutter={16}>
          <Col md={7} lg={5}  sm={24}>
            <FormItem label="水表编号">
              {getFieldDecorator('water_num')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={7} lg={5} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('username')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} lg={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('range-time-picker',{
                initialValue:this.props.initRange?this.props.initRange: '',
              })(
                <RangePicker  allowClear={this.props.initRange?false:true}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <FormItem label="只显示异常">
            {getFieldDecorator('check',{ valuePropName: 'checked' })(
                <Switch  />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <Button type="primary" style={{marginLeft: 8}}>导出到CSV</Button>
            <Button  type="primary" style={{marginLeft: 8}} onClick={this.handleFormReset}>导出到Oracle</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
