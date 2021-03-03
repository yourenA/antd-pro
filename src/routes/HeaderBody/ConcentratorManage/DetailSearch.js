/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form,Row,Popconfirm ,Input,Button,Switch,notification,Progress } from 'antd';
import {renderNotification} from './../../../utils/utils'
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
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
    },1000)
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
    const {intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const command=this.props.protocols;
    const that=this;
    const renderCommandBtn=command.map((item,index)=>{
      const clickTime=sessionStorage.getItem(`concentrator_number-${item}-${this.props.concentratorNumber}`)
      const isLoading=clickTime&&this.state.time-clickTime<10000
      return(
        <Button loading={isLoading} key={index} type="primary" style={{marginLeft: 8}}
                onClick={()=>{
                  that.setState({ time:new Date().getTime()})
                  let concentratorNumber=that.props.concentratorNumber
                  const renderNotificationObj={key:item.toUpperCase()+concentratorNumber, message:item.toUpperCase()+formatMessage({id: 'intl.upload_multiple'})+concentratorNumber+' 进度'}
                  this.props.read_multiple_901f(item,renderNotificationObj)
                }}>
          {item.toUpperCase()+" "}&nbsp;{formatMessage({id: 'intl.upload_multiple'})+"  "}&nbsp;{this.props.concentratorNumber}</Button>
      )
    })
    const renderOpenValveBtn=function () {
      const clickTime=sessionStorage.getItem(`open_all_valve-${that.props.concentratorNumber}`)
      const isLoading=clickTime&&that.state.time-clickTime<10000
      return(
      <Popconfirm
        title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.open_valve'})})+that.props.concentratorNumber}
        onConfirm={()=>{
          that.setState({ time:new Date().getTime()});
          let concentratorNumber=that.props.concentratorNumber
          const renderNotificationObj={key:'open'+concentratorNumber,  message:formatMessage({id: 'intl.open_valve'})+concentratorNumber+' 进度'}
          that.props.valveCommand('open_all_valve',renderNotificationObj)
        }}>
        <Button loading={isLoading}  type="primary" style={{marginLeft: 8}}>{formatMessage({id: 'intl.open_valve'})+"  "} &nbsp;{that.props.concentratorNumber}</Button>
      </Popconfirm>
      )
    }
    const renderCloseValveBtn=function () {
      const clickTime=sessionStorage.getItem(`close_all_valve-${that.props.concentratorNumber}`)
      const isLoading=clickTime&&that.state.time-clickTime<10000
      return(
      <Popconfirm         title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.close_valve'})})+that.props.concentratorNumber} onConfirm={()=>{
        that.setState({ time:new Date().getTime()});
        let concentratorNumber=that.props.concentratorNumber
        const renderNotificationObj={key:'close'+concentratorNumber,  message:formatMessage({id: 'intl.close_valve'})+concentratorNumber+' 进度'}
        that.props.valveCommand( 'close_all_valve',renderNotificationObj)
      }}>
        <Button loading={isLoading}  type="danger" style={{marginLeft: 8}}>{formatMessage({id: 'intl.close_valve'})+" "} &nbsp;{that.props.concentratorNumber}</Button>
      </Popconfirm>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
          <FormItem>
            <Button type="primary"  icon="arrow-left" onClick={this.props.onBack}>{formatMessage({id: 'intl.back'})}</Button>
          </FormItem>
            <FormItem label={formatMessage({id: 'intl.water_meter_number'})}>
              {getFieldDecorator('meter_number')(
                <Input />
              )}
            </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">{ formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
          </FormItem>
          <FormItem>
            {this.props.showCommandBtn&&renderCommandBtn}
            {(company_code !== 'hy')&&this.props.showCommandBtn&&renderOpenValveBtn()}
            {(company_code !== 'hy')&&this.props.showCommandBtn&&renderCloseValveBtn()}
          </FormItem>
          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})} style={{float:'right'}}  className="openOperate">
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
