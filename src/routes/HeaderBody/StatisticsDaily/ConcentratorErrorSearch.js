/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
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
        date: date ? moment(date).format('YYYY-MM-DD') : '',
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
          <FormItem label="集中器编号">
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={ '日期'}>
            {getFieldDecorator('date', {
              initialValue: this.props.initDate ? this.props.initDate : '',
            })(
              <DatePicker   disabledDate={disabledDate} />
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
