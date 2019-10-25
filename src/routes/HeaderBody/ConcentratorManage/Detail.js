import React, {PureComponent} from 'react';
import {Tabs, Form, Button, Select,Radio , Row, Col,DatePicker,Popconfirm,InputNumber,Checkbox,message} from 'antd';
import moment from 'moment';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
import {injectIntl} from 'react-intl';

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mapModal: false,
      tabsActiveKey:'archives-setting',
      value: this.props.editRecord.upload_cycle_unit,
      checkedList:this.props.editRecord.sleep_hours,
      day:'',
      hour:'',
      minute:'',
      second:'',
      time:new Date().getTime(),
      server_id:{key:this.props.editRecord.server_id,lebal:this.props.editRecord.server_ip},
      apn:'CMNET'
    }
  }
  componentDidMount() {
    const that=this;
    this.timer=setInterval(function () {
      that.setState({
        // disabled:false
        time:new Date().getTime()
      })
    },10000)
    const editRecord=this.props.editRecord
    if(editRecord.upload_time){
      switch (editRecord.upload_cycle_unit){
        case 'monthly':
          this.setState({
            day:Number(editRecord.upload_time.substring(0,2)),
            hour:Number(editRecord.upload_time.substring(3,5)),
            minute:Number(editRecord.upload_time.substring(6,8)),
            second:Number(editRecord.upload_time.substring(9,11)),
          });
          break
        case 'daily':
          this.setState({
            hour:Number(editRecord.upload_time.substring(0,2)),
            minute:Number(editRecord.upload_time.substring(3,5)),
            second:Number(editRecord.upload_time.substring(6,8)),
          });
          break
        case 'hourly':
        case 'every_fifteen_minutes':
          this.setState({
            minute:Number(editRecord.upload_time.substring(0,2)),
            second:Number(editRecord.upload_time.substring(3,5)),
          });
          break
      }
    }
  }

  changeTab = (key)=> {
  }
  onChangeSleepHours = (checkedList) => {
    this.setState({
      checkedList
    });
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  read_multiple_901f=(command)=>{
    console.log('集抄：',this.props.editRecord.number)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.editRecord.number,
        feature:'runonce_upload_multiple_timing',
        protocol:command
      },
      callback:()=>{
        sessionStorage.setItem(`concentrator_number-${command}-${this.props.editRecord.number}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
      }
    });
  }
  valveCommand=(command)=>{
    console.log(command,this.props.editRecord.number)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.editRecord.number,
        feature: command
      },
      callback:()=>{
        sessionStorage.setItem(`${command}-${this.props.editRecord.number}`,new Date().getTime())
        that.setState({
          // disabled:false
          time:new Date().getTime()
        });
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
      }
    });
  }
  UpdateSimInfo=()=>{
    const {dispatch} = this.props;
    const that=this;
    dispatch({
    type: 'user_command_data/fetchSimInfo',
      payload:{
      id:this.props.editRecord.id,
    },
    callback:()=>{
      const {intl:{formatMessage}} = that.props;
      message.success(
        formatMessage(
          {id: 'intl.operate_successful'},
          {operate: formatMessage({id: 'intl.update'}), type: formatMessage({id: 'intl.update_SIM_card_information'})}
        )
      )
      this.props.handleSearch()
    }
  });
  }
  downloadDocument=()=>{
    console.log('download_document',this.props.editRecord.number)
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'user_command_data/add',
      payload:{
        concentrator_number:this.props.editRecord.number,
        feature: 'download_document'
      },
      callback:()=>{
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.download_document'}), type: ''}
          )
        )
      }
    });
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const editRecord=this.props.editRecord
    let arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(i)
    }
    const rendersleep_hours = arr.map((item, index)=> {
      return (
        <Col key={index} span={4}><Checkbox value={String(index)}>{index}</Checkbox></Col>
      )
    })
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      }
    };
    const formItemLayoutWithLabel2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }
    };
    const that=this
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const renderCommandBtn=editRecord.protocols.map((item,index)=>{
      const clickTime=sessionStorage.getItem(`concentrator_number-${item}-${editRecord.number}`)
      const isLoading=clickTime&&this.state.time-clickTime<120000
      return(
        <Button loading={isLoading} key={index} type="primary" style={{marginRight: 10}} onClick={()=>{this.setState({ time:new Date().getTime()});this.read_multiple_901f(item)}}>{item.toUpperCase()}&nbsp;{ formatMessage({id: 'intl.upload_multiple'})} </Button>

      )
    })
    const renderOpenValveBtn=function () {
      const clickTime=sessionStorage.getItem(`open_all_valve-${editRecord.number}`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Popconfirm  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.open_valve'})})+editRecord.number} onConfirm={()=>{that.setState({ time:new Date().getTime()});that.valveCommand('open_all_valve')}} >
          <Button loading={isLoading}  type="primary"  style={{marginRight: 10}} >{ formatMessage({id: 'intl.open_valve'})} </Button>
        </Popconfirm>
      )
    }
    const renderCloseValveBtn=function () {
      const clickTime=sessionStorage.getItem(`close_all_valve-${editRecord.number}`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Popconfirm  title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.close_valve'})})+editRecord.number} onConfirm={()=>{that.setState({ time:new Date().getTime()});that.valveCommand( 'close_all_valve')}} >
          <Button loading={isLoading}  type="danger"  style={{marginRight: 10}} >{ formatMessage({id: 'intl.close_valve'})} </Button>
        </Popconfirm>
      )
    }
    const renderInitBtn=function () {
      const clickTime=sessionStorage.getItem(`data_initialization-${editRecord.number}`)
      const isLoading=clickTime&&that.state.time-clickTime<12000
      return(
        <Popconfirm title={ formatMessage({id: 'intl.are_you_sure_to'},{operate:formatMessage({id: 'intl.initialize'})})+editRecord.number}  onConfirm={()=>{that.setState({ time:new Date().getTime()});that.valveCommand( 'data_initialization')}} >
          <Button loading={isLoading}  type="primary"  style={{marginRight: 10}} >{ formatMessage({id: 'intl.initialize'})} </Button>
        </Popconfirm>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Tabs  activeKey={this.state.tabsActiveKey}  onChange={(activeKey)=>{this.setState({tabsActiveKey:activeKey})}}>
        <TabPane tab= { formatMessage({id: 'intl.concentrator_upload_valve_control_initialize'})} key="archives-setting">
          <Form >
            <FormItem
              label={ formatMessage({id: 'intl.upload_multiple'})}
              {...formItemLayoutWithLabel}
            >
              {renderCommandBtn}
            </FormItem>
            {(company_code !== 'hy'&& company_code.indexOf("test")===-1) && <FormItem
              label={ formatMessage({id: 'intl.batch_valve_control'})}
              {...formItemLayoutWithLabel}
            >
              {renderOpenValveBtn()}
              {renderCloseValveBtn()}
            </FormItem>
            }
            <FormItem
              label= { formatMessage({id: 'intl.initialize'})}
              {...formItemLayoutWithLabel}
            >
              {renderInitBtn()}<label htmlFor="">  { formatMessage({id: 'intl.concentrator_tip'})}</label>
            </FormItem>
            <FormItem
              label={ formatMessage({id: 'intl.update_SIM_card_information'})}
              {...formItemLayoutWithLabel}
            >
              <Button   type="primary"  style={{marginRight: 10}} onClick={this.UpdateSimInfo}>{ formatMessage({id: 'intl.update'})}</Button>
            </FormItem>
            <FormItem
              label={ formatMessage({id: 'intl.download_document'})}
              {...formItemLayoutWithLabel}
            >
              <Button   type="primary"  style={{marginRight: 10}} onClick={this.downloadDocument}>{ formatMessage({id: 'intl.download_document'})}</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab= { formatMessage({id: 'intl.concentrator_gprs'})} key="setGPRS"><Form onSubmit={this.handleSubmit}>
          <FormItem
            label={ formatMessage({id: 'intl.server_address'})}
            {...formItemLayoutWithLabel}
          >
              <Select style={{width:'250px'}} value={this.state.server_id} onChange={(value)=>{this.setState({server_id:value})}} labelInValue={true} >
                { this.props.servers.map(item => <Option key={item.id}
                                                         value={item.id}>{item.ip + ':' + item.port}</Option>) }
              </Select>
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label="APN"
          >
              <Select  value={this.state.apn}  onChange={(value)=>{this.setState({apn:value})}} style={{width:'250px'}} >
                <Option value="CMNET">CMNET</Option>
                <Option value="CMWAP">CMWAP</Option>
              </Select>
          </FormItem>
        </Form></TabPane>
       {/* <TabPane tab="定时上传设置" key="upload-setting" forceRender={true}>
          <Form >
            <FormItem
              label="停止定时上传"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>停止</Button>
            </FormItem>
            <FormItem
              label="上传频率"
              {...formItemLayoutWithLabel}>
              <Select labelInValue={true}>
                { [{id: 1, name: '每月上报'}, {id: 112, name: '每日上报'}, {id: 1123, name: '每小时上报'}, {
                  id: 5959,
                  name: '每15分钟上报'
                }].map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
              </Select>
            </FormItem>
            <FormItem
              label="设置上传基淮时间"
              {...formItemLayoutWithLabel}>
              <DatePicker onChange={this.onChange}  allowEmpty={false} style={{width:"120px"}} />
              <TimePicker onChange={this.onChange}  allowEmpty={false} style={{width:"120px",marginRight:'12px'}}    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
              <Button type='primary'>确定</Button>
            </FormItem>
            <FormItem
              label="获取上传参数值"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>获取</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="集中器设置" key="concentrator-setting" forceRender={true}>
          <Form >
            <FormItem
              label="读取 GPRS 参数"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>读取</Button>
            </FormItem>
            <FormItem
              label="读取 GPRS 参数"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>读取</Button>
            </FormItem>
            <FormItem
              label="读取集中器日期和时间"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>读取</Button>
            </FormItem>
            <FormItem
              label="设置集中器日期和时间"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>设置</Button>
            </FormItem>
            <FormItem
              label="集中器地址"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>读取</Button>
            </FormItem>
            <FormItem
              label="设置集中器地址"
              {...formItemLayoutWithLabel2}>
              <Input   style={{ width: 50 }}/>:
              <Input   style={{ width: 50 }}/>:
              <Input   style={{ width: 50 }}/>:
              <Input   style={{ width: 50,marginRight:'12px' }}/>
              <Button type='primary'>确定</Button>
            </FormItem>
            <FormItem
              label="重启集中器"
              {...formItemLayoutWithLabel2}
            >
              <Button type='primary'>重启</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="数据设置" key="data-setting" forceRender={true}>
          <Form >
            <FormItem
              label="查看数据型式"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>查看</Button>
            </FormItem>
            <FormItem
              label="查看运行模式"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>查看</Button>
            </FormItem>
            <FormItem
              label="查看当前程序版本"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>查看</Button>
            </FormItem>
            <FormItem
              label="查看函数形式"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>查看</Button>
            </FormItem>
          </Form>
        </TabPane>*/}
        <TabPane tab= { formatMessage({id: 'intl.concentrator_upload_time'})} key="editUpload"><Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={ formatMessage({id: 'intl.upload_cycle_unit_explain'})}
          >
            {getFieldDecorator('radio-group', {
              initialValue: this.state.value,
            })(
              <RadioGroup onChange={this.onChange}>
                <Radio value="monthly">{ formatMessage({id: 'intl.monthly'})}</Radio>
                <Radio value="daily">{ formatMessage({id: 'intl.daily'})}</Radio>
                <Radio value="hourly">{ formatMessage({id: 'intl.hourly'})}</Radio>
                <Radio value="every_fifteen_minutes">{ formatMessage({id: 'intl.every_fifteen_minutes'})}</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {
            that.state.value !== 'every_fifteen_minutes'&&
            <FormItem
              {...formItemLayoutWithLabel}
              label={ formatMessage({id: 'intl.concentrator_upload_time'})}
            >
              {
                that.state.value === 'monthly'&&<span style={{marginRight:'10px'}}>{ formatMessage({id: 'intl.day'})}: <InputNumber min={1} max={28} step={1} precision={0} value={this.state.day} onChange={(val)=>{this.setState({day:val})}} style={{width: '60px'}}/></span>
              }
              {
                (that.state.value === 'monthly'||that.state.value === 'daily')&&<span style={{marginRight:'10px'}}>{ formatMessage({id: 'intl.hour'})}: <InputNumber min={0} max={59} step={1} precision={0} value={this.state.hour} onChange={(val)=>{this.setState({hour:val})}} style={{width: '60px'}}/></span>
              }
              { formatMessage({id: 'intl.minute'})}: <span  style={{marginRight:'10px'}}><InputNumber min={0} max={59} step={1} precision={0} value={this.state.minute} onChange={(val)=>{this.setState({minute:val})}} style={{width: '60px'}}/></span>
              { formatMessage({id: 'intl.second'})}: <span><InputNumber min={0} max={59} step={1} precision={0} value={this.state.second} onChange={(val)=>{this.setState({second:val})}} style={{width: '60px'}}/></span>
            </FormItem>
          }

        </Form></TabPane>
        <TabPane tab={ formatMessage({id: 'intl.concentrator_sleep_time'})} key="editSleep"><Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={ formatMessage({id: 'intl.concentrator_sleep_time'})}
          >
            <Checkbox.Group onChange={this.onChangeSleepHours} value={this.state.checkedList} >
              <Row>
                {rendersleep_hours}
              </Row>
            </Checkbox.Group>
          </FormItem>
        </Form></TabPane>
      </Tabs>
    );
  }
}
const DetailFormWrap = Form.create()(Detail);
export default injectIntl(connect()(DetailFormWrap));
