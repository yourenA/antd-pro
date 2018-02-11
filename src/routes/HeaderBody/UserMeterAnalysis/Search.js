/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Switch} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
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
        meter_number: fieldsValue.meter_number,
        real_name: fieldsValue.real_name,
        display_type:fieldsValue.display_type?'only_error':'all',
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
            <FormItem label="水表编号">
              {getFieldDecorator('meter_number')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem label="用户名称">
              {getFieldDecorator('real_name')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem label="日期区间">
              {getFieldDecorator('range-time-picker',{
                initialValue:this.props.initRange?this.props.initRange: '',
              })(
                <RangePicker  disabledDate={disabledDate}  allowClear={this.props.initRange?false:true}/>
              )}
            </FormItem>
        </Row>
        <Row gutter={16}>
          <FormItem label="只显示异常">
            {getFieldDecorator('display_type',{ valuePropName: 'checked' })(
                <Switch  />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={()=>this.props.exportCSV()}>导出到CSV</Button>
            <Button  type="primary" style={{marginLeft: 8}} onClick={()=>message.info('暂未开通该功能')}>导出到Oracle</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
