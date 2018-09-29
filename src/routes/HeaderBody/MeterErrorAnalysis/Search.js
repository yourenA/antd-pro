/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, message, Input, Button, Switch, Select, Radio, Icon} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile ? false : true,
    };
  }

  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      const values = {
        display_type: fieldsValue.display_type,
        member_number: fieldsValue.member_number,
        meter_number: fieldsValue.meter_number,
        manufacturer_id: fieldsValue.manufacturer_id ? fieldsValue.manufacturer_id.key : '',
        started_at: fieldsValue['started_at'] ? moment(fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at: fieldsValue['ended_at'] ? moment(fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values, page: 1, per_page: this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
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
            label='水表编号'
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('meter_number', {})(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label='户号'
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number', {})(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label="厂商名称"
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('manufacturer_id', {})(
              <Select labelInValue={true} style={{width: 120}}>
                { this.props.manufacturers.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem label="显示"
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('display_type', {
              initialValue: 'all',
            })(
              <RadioGroup>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="only_missing_upload">漏报</RadioButton>
                <RadioButton value="only_error_upload">错报</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile && <Button type="primary" onClick={this.toggle} style={{marginRight: 8}}>
              {this.state.expand ? '收起' : '展开'}条件 <Icon type={this.state.expand ? 'up' : 'down'}/>
            </Button>}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
          </FormItem>
          <FormItem label="打开操作栏" style={{float: 'right'}}>
            <Switch defaultChecked={localStorage.getItem('canOperateMeterUnusualAnalysis') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperateMeterUnusualAnalysis', checked);
                      this.props.changeShowOperate()
                    }}/>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
