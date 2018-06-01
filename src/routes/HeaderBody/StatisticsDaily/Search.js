/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button,Radio} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const date = fieldsValue['date'];
      const values = {
        ...fieldsValue,
        date:moment(date).format('YYYY-MM-DD'),
      };
      this.props.handleSearch({...values, page: 1})
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
          <FormItem label={ '日期'}>
            {getFieldDecorator('date', {
              initialValue: this.props.initDate ? this.props.initDate : '',
            })(
              <DatePicker   disabledDate={disabledDate} />
            )}
          </FormItem>
          <FormItem label="集中器编号">
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            label='户号'
          >
            {getFieldDecorator('member_number', {
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="水表编号">
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="显示">
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="only_missing_upload">漏报</RadioButton>
                <RadioButton value="only_error_upload">错报</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
