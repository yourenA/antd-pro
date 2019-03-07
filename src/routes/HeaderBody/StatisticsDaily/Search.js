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
import {injectIntl} from 'react-intl';
@injectIntl
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
      this.props.handleSearch({...values, page: 1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
          <FormItem label={ formatMessage({id: 'intl.date'})}>
            {getFieldDecorator('date', {
              initialValue: this.props.initDate ? this.props.initDate : '',
            })(
              <DatePicker   disabledDate={disabledDate} />
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.concentrator_number'})}>
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.user_number'})}
          >
            {getFieldDecorator('member_number', {
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.water_meter_number'})}>
            {getFieldDecorator('meter_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.start'})}>
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">{formatMessage({id: 'intl.all'})}</RadioButton>
                <RadioButton value="only_missing_upload">{formatMessage({id: 'intl.missing'})}</RadioButton>
                <RadioButton value="only_error_upload">{formatMessage({id: 'intl.error'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">{ formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
