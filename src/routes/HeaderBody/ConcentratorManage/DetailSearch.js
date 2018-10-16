/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,DatePicker,Row,Col,Input,Button,Switch} from 'antd';
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.timer=null
    this.state = {
      disabled:false,
      time:new Date().getTime()
    };
  }
  componentDidMount() {
    const that=this;
    this.timer=setInterval(function () {
      that.setState({
        // disabled:false
        time:new Date().getTime()
      })
    },10000)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      const values = {
        meter_number: fieldsValue.meter_number,
      };
      this.props.handleSearch({...values,page:1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const command=this.props.protocols;
    const that=this;
    const renderCommandBtn=command.map((item,index)=>{
      const clickTime=sessionStorage.getItem(`concentrator_number-${item}-${this.props.concentratorNumber}`)
      const isLoading=clickTime&&this.state.time-clickTime<120000
      return(
        <Button loading={isLoading} key={index} type="primary" style={{marginLeft: 8}} onClick={()=>{this.setState({ time:new Date().getTime()});this.props.read_multiple_901f(item)}}>{isLoading?'正在':''}{item.toUpperCase()}集抄 {this.props.concentratorNumber}</Button>
      )
    })
    const renderOpenValveBtn=function () {
      const clickTime=sessionStorage.getItem(`open_all_valve-${that.props.concentratorNumber}`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Button loading={isLoading}  type="primary" style={{marginLeft: 8}} onClick={()=>{that.setState({ time:new Date().getTime()});that.props.valveCommand('open_all_valve')}}>{isLoading?'正在':''}开阀 {that.props.concentratorNumber}</Button>
      )
    }
    const renderCloseValveBtn=function () {
      const clickTime=sessionStorage.getItem(`close_all_valve-${that.props.concentratorNumber}`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Button loading={isLoading}  type="danger" style={{marginLeft: 8}} onClick={()=>{that.setState({ time:new Date().getTime()});that.props.valveCommand( 'close_all_valve')}}>{isLoading?'正在':''}关阀 {that.props.concentratorNumber}</Button>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={16}>
          <FormItem>
            <Button type="primary"  icon="arrow-left" onClick={this.props.onBack}>返回</Button>
          </FormItem>
            <FormItem label="水表编号">
              {getFieldDecorator('meter_number')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {this.props.showCommandBtn&&renderCommandBtn}
            {this.props.showCommandBtn&&renderOpenValveBtn()}
            {this.props.showCommandBtn&&renderCloseValveBtn()}
          </FormItem>
          <FormItem  label="打开操作栏" style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateConcentratorDetail')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateConcentratorDetail',checked);
              this.props.changeShowOperate()
            }} />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
