/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Switch,Tabs} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
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
        <Row>
            <FormItem label={formatMessage({id: 'intl.date'})}>
              {getFieldDecorator('date', {
                initialValue: this.props.initDate ? this.props.initDate : '',
              })(
                <DatePicker   disabledDate={disabledDate} />
              )}
            </FormItem>
          <FormItem label={formatMessage({id: 'intl.pressure_sensors_number'})}>
            {getFieldDecorator('pressure_sensor_number')(
              <Input />
            )}
          </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit"> {formatMessage({id: 'intl.search'})}</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            </FormItem>
           {/* {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
