/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, Row, Input, Button, Switch,Icon,Modal,Popconfirm ,message} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;

@connect(state => ({
}))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,
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
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.props.handleSearch({...values, page: 1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
  }
  valveCommand=(command)=>{
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        meter_number:this.props.selectedRowKeys,
        feature: command
      },
      callback:()=>{
        sessionStorage.setItem(`${command}-selected`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        message.success('发送指令成功')
      }
    });
  }
  render() {
    const {expand}=this.state
    const {getFieldDecorator} = this.props.form;
    const that=this;
    const renderOpenValveBtn=function () {
      const clickTime=sessionStorage.getItem(`open_valve-selected`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Popconfirm title={`确定要批量开阀?`} onConfirm={()=>{that.setState({ time:new Date().getTime()});that.valveCommand('open_valve')}} okText="确定" cancelText="取消">
          <Button loading={isLoading}  type="primary" style={{marginLeft: 8}}>{isLoading?'正在':''}批量开阀 {that.props.concentratorNumber}</Button>
        </Popconfirm>
      )
    }
    const renderCloseValveBtn=function () {
      const clickTime=sessionStorage.getItem(`close_valve-selected`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Popconfirm title={`确定要批量关阀?`} onConfirm={()=>{that.setState({ time:new Date().getTime()});that.valveCommand( 'close_valve')}} okText="确定" cancelText="取消">
          <Button loading={isLoading}  type="danger" style={{marginLeft: 8}}>{isLoading?'正在':''}批量关阀 {that.props.concentratorNumber}</Button>
        </Popconfirm>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Form onSubmit={this.handleSubmit} layout="inline" style={{overflow: 'hidden'}}>
        <Row gutter={16}>
          <FormItem label={"水表号"}>
            {getFieldDecorator('number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={"用户名称"}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('real_name')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={"户号"}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('member_number')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label={"安装地址"}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('install_address')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem >
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? '收起' : '展开'}条件 <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            {/*{this.props.showAddBtn &&
            <Button type="primary" style={{marginLeft: 8}} onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
          {
            company_code!=='hy'&&
            <FormItem
            >
              <span style={{ marginRight:   8 }}>已选{this.props.selectedRowKeys.length}个水表</span>
              {renderOpenValveBtn()}
              {renderCloseValveBtn()}
            </FormItem>
          }
          <FormItem label="打开操作栏" style={{float: 'right'}}  className="openOperate">
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
