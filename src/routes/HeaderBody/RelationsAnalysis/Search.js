/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button,DatePicker } from 'antd';
import {disabledDate} from './../../../utils/utils'
import moment from 'moment'
const FormItem = Form.Item;

import {injectIntl} from 'react-intl';
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      const values = {
        started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values})
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
          <FormItem label={this.props.dateText ? this.props.dateText :  formatMessage({id: 'intl.start'})}>
            {getFieldDecorator('started_at', {
              initialValue: this.props.initRange ? this.props.initRange[0] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>

          <FormItem label={this.props.dateText ? this.props.dateText :  formatMessage({id: 'intl.end'})}>
            {getFieldDecorator('ended_at', {
              initialValue: this.props.initRange ? this.props.initRange[1] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit"> {formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            {/* {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
        </Row>

      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
