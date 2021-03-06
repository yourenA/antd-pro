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
        ...fieldsValue,
        display_type: fieldsValue.display_type,
        member_number: fieldsValue.member_number,
        meter_number: fieldsValue.meter_number,
        manufacturer_id: fieldsValue.manufacturer_id ? fieldsValue.manufacturer_id.key : '',
        size_type: fieldsValue.size_type ? fieldsValue.size_type.key : '',
        temperature_type: fieldsValue.temperature_type ? fieldsValue.temperature_type.key : '',
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
              initialValue: moment(this.props.started_at),
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
              initialValue: moment(this.props.ended_at),
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.user_name'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('real_name')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.water_meter_number'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('meter_number', {
              initialValue: this.props.meter_number,
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.user_number'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number', {
              initialValue: this.props.member_number,
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label={formatMessage({id: 'intl.vendor_name'})}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('manufacturer_id', {
              initialValue: this.props.manufacturer_id,
            })(
              <Select allowClear={true} labelInValue={true} style={{width: 120}}>
                { this.props.manufacturers.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem
            label={'尺寸类型'}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('size_type', {
              initialValue:{key:'',label:''},
            })(
              <Select
                allowClear={true}
                labelInValue={true} style={{width: 120}}
              >
                { [{id:1,name:'小表'},{id:2,name:'大表'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem
            label={'温度介质类型'}
            style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('temperature_type', {
              initialValue:{key:'',label:''},
            })(
              <Select
                allowClear={true}
                labelInValue={true} style={{width: 120}}
              >
                {[{id:1,name:'冷水表'},{id:2,name:'热水表'}].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.display_type'})}
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('display_type', {
              initialValue:this.props.display_type,
            })(
              <RadioGroup>
                <RadioButton value="all">{formatMessage({id: 'intl.all'})}</RadioButton>
                <RadioButton value="only_missing_upload">{formatMessage({id: 'intl.only_missing'})}</RadioButton>
                <RadioButton value="only_error_upload">{formatMessage({id: 'intl.only_error'})}</RadioButton>
                <RadioButton value="only_fail_upload">{formatMessage({id: 'intl.only_fail_upload'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'intl.collapse_condition'})} <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">{ formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            {this.props.showExportBtn&&<Button  className="btn-cyan" type="primary" style={{marginLeft: 8}} onClick={()=>this.props.exportConcentratorCSV()} icon='export'>导出异常水表信息</Button>}
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
