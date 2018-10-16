/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,message,Input,Button,Icon,Radio} from 'antd';
import moment from 'moment'
import {disabledDate,searchFormItemLayout} from './../../../utils/utils'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: this.props.initRange[0],
      endValue: this.props.initRange[1],
      expand: this.props.isMobile?false:true,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      if( moment( this.state.startValue).format('YYYY-MM-DD')===moment( this.state.endValue).format('YYYY-MM-DD')){
        message.error('开始时间和结束时间不能一样')
        return false
      }
      const values = {
        member_number: fieldsValue.member_number,
        // concentrator_number: fieldsValue.concentrator_number,
        meter_number: fieldsValue.meter_number,
        install_address: fieldsValue.install_address,
        real_name: fieldsValue.real_name,
        display_type:fieldsValue.display_type,
        started_at:  moment( this.state.startValue).format('YYYY-MM-DD'),
        ended_at:  moment( this.state.endValue).format('YYYY-MM-DD'),
      };
      this.props.handleSearch({...values,page:1,per_page:this.props.per_page})
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
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    const {expand}=this.state
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>
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

          <FormItem label="户号"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          {/*<FormItem label="集中器编号">
            {getFieldDecorator('concentrator_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>*/}
            <FormItem label="水表编号"
                      style={{ display: expand ? 'inline-block' : 'none' }}
            >
              {getFieldDecorator('meter_number')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
            <FormItem label="用户名称"
                      style={{ display: expand ? 'inline-block' : 'none' }}
            >
              {getFieldDecorator('real_name')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          <FormItem label="安装地址"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('install_address')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>

          <FormItem label="显示"
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('display_type',{
              initialValue:  'all',
            })(
              <RadioGroup>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="only_normal">正常</RadioButton>
                <RadioButton value="only_error">异常</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? '收起' : '展开'}条件 <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {this.props.showExportBtn&&<Button type="primary" className="btn-cyan" style={{marginLeft: 8}} onClick={()=>this.props.exportCSV()}  icon='export'>导出水表读数</Button>}
            {this.props.showConfigBtn&&company_code!=='hy'&&<Button type="primary"  className="btn-cyan" style={{marginLeft: 8}} onClick={()=>this.props.setExport()}>设置导出格式</Button>}
            {company_code==='ll'&&<Button type="primary"  icon='upload'  style={{marginLeft: 8}} onClick={()=>this.props.uploadLl()}>上传醴陵读数</Button>}
            {/*<Button  type="primary" style={{marginLeft: 8}} onClick={()=>message.info('暂未开通该功能')}>导出到Oracle</Button>*/}
          </FormItem>
          <FormItem label="总用水量">
              <Input value={this.props.total_difference_value} style={{width:'173px'}} readOnly addonAfter="吨" />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
