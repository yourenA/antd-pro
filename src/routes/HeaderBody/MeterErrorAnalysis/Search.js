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
import {injectIntl} from 'react-intl';
@injectIntl
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
    const {intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row>

          <FormItem label={this.props.dateText ? this.props.dateText :formatMessage({id: 'intl.start'})}>
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
          <FormItem label={this.props.dateText ? this.props.dateText :formatMessage({id: 'intl.start'})}>
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
            label={formatMessage({id: 'intl.water_meter_number'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('meter_number', {})(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.user_number'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number', {})(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.vendor_name'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('manufacturer_id', {})(
              <Select allowClear={true} labelInValue={true} style={{width: 120}}>
                { this.props.manufacturers.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.display_type'})}
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('display_type', {
              initialValue: 'all',
            })(
              <RadioGroup>
                <RadioButton value="all">{formatMessage({id: 'intl.all'})}</RadioButton>
                <RadioButton value="only_missing_upload">{formatMessage({id: 'intl.missing'})}</RadioButton>
                <RadioButton value="only_error_upload">{formatMessage({id: 'intl.error'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'intl.collapse_condition'})} <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">{ formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.open_operating_bar'})} style={{float: 'right'}}>
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
