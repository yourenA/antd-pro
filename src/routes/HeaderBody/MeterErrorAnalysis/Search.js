/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Switch,Select} from 'antd';
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
      const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        manufacturers: fieldsValue.manufacturers?fieldsValue.manufacturers.key:'',
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
          <FormItem
            label="厂商名称"
          >
            {getFieldDecorator('manufacturers', {
            })(
              <Select labelInValue={true} style={{width:120}}>
                { this.props.manufacturers.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
            <FormItem label="日期区间">
              {getFieldDecorator('range-time-picker',{
                initialValue:this.props.initRange?this.props.initRange: '',
              })(
                <RangePicker  disabledDate={disabledDate} allowClear={this.props.initRange?false:true}/>
              )}
            </FormItem>
          <FormItem>
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
