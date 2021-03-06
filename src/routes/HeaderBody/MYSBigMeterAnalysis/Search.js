/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Switch} from 'antd';
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
          <FormItem label={'用户名'}
          >
            {getFieldDecorator('real_name')(
              <Input placeholder='请输入'/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.water_meter_number'})}>
            {getFieldDecorator('number')(
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
