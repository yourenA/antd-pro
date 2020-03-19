/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch, Icon, Modal, Popconfirm, message} from 'antd';
import {injectIntl} from 'react-intl';
import {connect} from 'dva';
import {renderNotification} from './../../../utils/utils'

const FormItem = Form.Item;

@connect(state => ({}))
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile ? false : true,
      time: new Date().getTime()
    };
  }

  componentDidMount() {
    const that = this;
    this.timer = setInterval(function () {
      that.setState({
        // disabled:false
        time: new Date().getTime()
      })
    }, 10000)
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
      const values = {
        sort_field: this.props.sort_field,
        sort_direction: this.props.sort_direction,
        ...fieldsValue,
      };
      this.props.handleSearch({...values, page: 1, per_page: this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  valveCommand = (command,renderNotificationObj)=> {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        meter_number: this.props.selectedRowKeys,
        feature: command
      },
      callback: ()=> {
        sessionStorage.setItem(`${command}-selected`, new Date().getTime())
        that.setState({
          // disabled:false
          time: new Date().getTime()
        });
        message.success('发送指令成功')
        renderNotification(renderNotificationObj)
      }
    });
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {expand}=this.state
    const {getFieldDecorator} = this.props.form;
    const that = this;
    const renderOpenValveBtn = function () {
      const clickTime = sessionStorage.getItem(`open_valve-selected`)
      const isLoading = clickTime && that.state.time - clickTime < 12000
      return (
        <Popconfirm
          title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.open_valve_batch'})})}
          onConfirm={()=> {
            that.setState({time: new Date().getTime()});
            const renderNotificationObj={key:'open_valve_batch',  message:formatMessage({id: 'intl.open_valve_batch'})+' 进度'}
            that.valveCommand('open_valve',renderNotificationObj)
          }}>
          <Button loading={isLoading} type="primary"
                  style={{marginLeft: 8}}>{isLoading ? '' : ''}{formatMessage({id: 'intl.open_valve_batch'})} {that.props.concentratorNumber}</Button>
        </Popconfirm>
      )
    }
    const renderCloseValveBtn = function () {
      const clickTime = sessionStorage.getItem(`close_valve-selected`)
      const isLoading = clickTime && that.state.time - clickTime < 12000
      return (
        <Popconfirm
          title={ formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.close_valve_batch'})})}
          onConfirm={()=> {
            that.setState({time: new Date().getTime()});
            const renderNotificationObj={key:'close_valve_batch',  message:formatMessage({id: 'intl.close_valve_batch'})+' 进度'}
            that.valveCommand('close_valve',renderNotificationObj)
          }}>
          <Button loading={isLoading} type="danger"
                  style={{marginLeft: 8}}>{isLoading ? '' : ''}{formatMessage({id: 'intl.close_valve_batch'})} {that.props.concentratorNumber}</Button>
        </Popconfirm>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row >
          <FormItem label={formatMessage({id: 'intl.water_meter_number'})}>
            {getFieldDecorator('number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.user_name'})}
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('real_name')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.user_number'})}
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.install_address'})}
                    style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('install_address')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem >
            {this.props.isMobile && <Button type="primary" onClick={this.toggle} style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'intl.collapse_condition'})}
              <Icon type={this.state.expand ? 'up' : 'down'}/>
            </Button>}
            <Button type="primary" htmlType="submit"> {formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            {/*{this.props.showAddBtn &&
             <Button type="primary" style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
          <FormItem
          >
            <span
              style={{marginRight: 8}}>{formatMessage({id: 'intl.water_meters_selected'}, {number: this.props.selectedRowKeys.length})}</span>
            {renderOpenValveBtn()}
            {renderCloseValveBtn()}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.open_operating_bar'})} style={{float: 'right'}}
                    className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateMeter') === 'true' ? true : false}
                    onChange={(checked)=> {
                      localStorage.setItem('canOperateMeter', checked);
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
