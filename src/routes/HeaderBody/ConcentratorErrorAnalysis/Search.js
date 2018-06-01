/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Switch,Divider,Badge,Select } from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
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
      const values = {
        concentrator_number:fieldsValue.concentrator_number,
        manufacturer_id: fieldsValue.manufacturer_id?fieldsValue.manufacturer_id.key:'',
        started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values,page:1})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    form.setFieldsValue({
      concentrator_number: '',
    });
    this.props.handleFormReset()
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>
          <FormItem label={this.props.dateText ? this.props.dateText : '开始时间'}>
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
          <FormItem label={this.props.dateText ? this.props.dateText : '结束时间'}>
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
          <FormItem
            label='集中器编号'
          >
            {getFieldDecorator('concentrator_number', {
              initialValue: this.props.initConcentrator ? this.props.initConcentrator : '',
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label="厂商名称"
          >
            {getFieldDecorator('manufacturer_id', {
            })(
              <Select allowClear={true} labelInValue={true} style={{width:120}}>
                { this.props.manufacturers.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
          </FormItem>
          <FormItem style={{float:'right'}}>
            <Badge status="success" />在线 <Divider type="vertical"/>
            <Badge status="error" />离线 <Divider type="vertical"/>
            <Badge status="warning" />休眠 <Divider type="vertical"/>
            <Badge status="default" />无记录
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
