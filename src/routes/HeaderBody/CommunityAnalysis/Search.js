/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button,message} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
import {connect} from 'dva';
import DataRangePickers from './../../../components/DataRangePickers/Index'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
@connect(state => ({
}))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
    };
  }
  componentDidMount() {
    this.setState({
      startValue: this.props.initRange[0],
      endValue: this.props.initRange[1],
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if( moment( this.state.startValue).format('YYYY-MM-DD')===moment(this.state.endValue).format('YYYY-MM-DD')){
        message.error('开始时间和结束时间不能一样')
        return false
      }
      const values = {
        ...fieldsValue,
        started_at:  moment( this.state.startValue).format('YYYY-MM-DD'),
        ended_at:  moment( this.state.endValue).format('YYYY-MM-DD'),
      };
      this.props.handleSearch({...values, page: 1})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.setState({
      startValue: this.props.initRange[0],
      endValue: this.props.initRange[1],
    })
    this.props.handleFormReset()
  }
  onStartChange=(value)=>{
    const endValue =  moment(this.state.endValue).format('YYYY-MM-DD')
    const selectValue= moment(value).format('YYYY-MM-DD')
    if(endValue===selectValue){
      message.error('开始时间和结束时间不能一样');
      return false
    }
    this.onChange('startValue', value);
  }
  onEndChange=(value)=>{
    const startValue =  moment(this.state.startValue).format('YYYY-MM-DD')
    const selectValue= moment(value).format('YYYY-MM-DD')
    if(startValue===selectValue){
      message.error('开始时间和结束时间不能一样');
      return false
    }
    // if(moment(value).format('YYYY-MM-DD')===moment().format('YYYY-MM-DD')){
    //   message.error('今天数据还没有上传，不能统计，请选择合法的时间');
    //   return false
    // }
    this.onChange('endValue', value);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return  moment(moment(startValue.valueOf()).format('YYYY-MM-DD')) >= moment(moment(endValue.valueOf()).format('YYYY-MM-DD')) ||   startValue > moment().add(-1, 'days') || startValue < moment('2017-10-01');
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return    moment(moment(endValue.valueOf()).format('YYYY-MM-DD')) <= moment(moment(startValue.valueOf()).format('YYYY-MM-DD'))||  endValue > moment().add(0, 'days') || endValue < moment('2017-10-01');
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row  gutter={16}>
        {/*  <FormItem label={this.props.inputText ? this.props.inputText : "名称"}>
            {getFieldDecorator('query')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>*/}
          <FormItem label={this.props.dateText ? this.props.dateText : '开始时间'}>
              <DatePicker
                value={this.state.startValue}
                disabledDate={this.disabledStartDate}
                onChange={this.onStartChange}
                allowClear={false}
                //disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
          </FormItem>
          <FormItem label={this.props.dateText ? this.props.dateText : '结束时间'}>
              <DatePicker
                value={this.state.endValue}
                disabledDate={this.disabledEndDate}
                onChange={this.onEndChange}
                allowClear={false}
                //disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
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
