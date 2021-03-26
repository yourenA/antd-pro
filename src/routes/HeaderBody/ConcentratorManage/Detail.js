import React, {PureComponent} from 'react';
import {
  Tabs,
  Form,
  Button,
  Select,
  Radio,
  Row,
  Col,
  DatePicker,
  Popconfirm,
  InputNumber,
  Checkbox,
  message
} from 'antd';
import moment from 'moment';
import {connect} from 'dva';
import {renderNotification} from './../../../utils/utils'

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
      tabsActiveKey: 'archives-setting',
      value: this.props.editRecord.upload_cycle_unit,
      checkedList: this.props.editRecord.sleep_hours,
      day: '',
      hour: '',
      minute: '',
      second: '',
      time: new Date().getTime(),
      server_id: {key: this.props.editRecord.server_id, lebal: this.props.editRecord.server_ip},
      apn: 'CMNET'
    }
  }

  componentDidMount() {
    const that = this;
    this.timer = setInterval(function () {
      that.setState({
        // disabled:false
        time: new Date().getTime()
      })
    }, 2000)
    const editRecord = this.props.editRecord
    if (editRecord.upload_time) {
      switch (editRecord.upload_cycle_unit) {
        case 'monthly':
          this.setState({
            day: Number(editRecord.upload_time.substring(0, 2)),
            hour: Number(editRecord.upload_time.substring(3, 5)),
            minute: Number(editRecord.upload_time.substring(6, 8)),
            second: Number(editRecord.upload_time.substring(9, 11)),
          });
          break
        case 'daily':
          this.setState({
            hour: Number(editRecord.upload_time.substring(0, 2)),
            minute: Number(editRecord.upload_time.substring(3, 5)),
            second: Number(editRecord.upload_time.substring(6, 8)),
          });
          break
        case 'hourly':
        case 'every_fifteen_minutes':
          this.setState({
            minute: Number(editRecord.upload_time.substring(0, 2)),
            second: Number(editRecord.upload_time.substring(3, 5)),
          });
          break
      }
    }
  }

  changeTab = (key) => {
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
  read_multiple_901f = (command, renderNotificationObj) => {
    console.log('集抄：', this.props.editRecord.number)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        concentrator_number: this.props.editRecord.number,
        feature: 'runonce_upload_multiple_timing',
        protocol: command
      },
      callback: () => {
        sessionStorage.setItem(`concentrator_number-${command}-${this.props.editRecord.number}`, new Date().getTime())
        that.setState({
          // disabled:false
          time: new Date().getTime()
        });
        const {intl: {formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        renderNotification(renderNotificationObj)
      }
    });
  }
  valveCommand = (command, renderNotificationObj) => {
    console.log(command, this.props.editRecord.number)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        concentrator_number: this.props.editRecord.number,
        feature: command
      },
      callback: () => {
        sessionStorage.setItem(`${command}-${this.props.editRecord.number}`, new Date().getTime())
        that.setState({
          // disabled:false
          time: new Date().getTime()
        });
        const {intl: {formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.send'}), type: formatMessage({id: 'intl.command'})}
          )
        )
        renderNotification(renderNotificationObj)
      }
    });
  }
  UpdateSimInfo = () => {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/fetchSimInfo',
      payload: {
        id: this.props.editRecord.id,
      },
      callback: () => {
        const {intl: {formatMessage}} = that.props;
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
  downloadDocument = () => {
    console.log('download_document', this.props.editRecord.number)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'user_command_data/add',
      payload: {
        concentrator_number: this.props.editRecord.number,
        feature: 'download_document'
      },
      callback: () => {
        const {intl: {formatMessage}} = that.props;
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
    const {intl: {formatMessage}} = this.props;
    const editRecord = this.props.editRecord
    let arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(i)
    }
    const rendersleep_hours = arr.map((item, index) => {
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
    const that = this
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const renderCommandBtn = editRecord.protocols.map((item, index) => {
      const clickTime = sessionStorage.getItem(`concentrator_number-${item}-${editRecord.number}`)
      const isLoading = clickTime && this.state.time - clickTime < 10000
      return (
        <Button loading={isLoading} key={index} type="primary" style={{marginRight: 10}} onClick={() => {
          this.setState({time: new Date().getTime()});
          let concentratorNumber = this.props.editRecord.number
          const renderNotificationObj = {
            key: item.toUpperCase() + concentratorNumber,
            message: item.toUpperCase() + formatMessage({id: 'intl.upload_multiple'}) + concentratorNumber + ' 进度'
          }

          this.read_multiple_901f(item, renderNotificationObj)
        }}>
          {item.toUpperCase()}&nbsp;{formatMessage({id: 'intl.upload_multiple'})} </Button>

      )
    })
    const renderOpenValveBtn = function () {
      const clickTime = sessionStorage.getItem(`open_all_valve-${editRecord.number}`)
      const isLoading = clickTime && that.state.time - clickTime < 10000
      return (
        <Popconfirm
          title={formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.open_valve'})}) + editRecord.number}
          onConfirm={() => {
            that.setState({time: new Date().getTime()});
            let concentratorNumber  = that.props.editRecord.number
            const renderNotificationObj = {
              key: 'open' + concentratorNumber,
              message: formatMessage({id: 'intl.open_valve'}) + concentratorNumber + ' 进度'
            }
            that.valveCommand('valveCommand',renderNotificationObj)
          }}>
          <Button loading={isLoading} type="primary"
                  style={{marginRight: 10}}>{formatMessage({id: 'intl.open_valve'})} </Button>
        </Popconfirm>
      )
    }
    const renderCloseValveBtn = function () {
      const clickTime = sessionStorage.getItem(`close_all_valve-${editRecord.number}`)
      const isLoading = clickTime && that.state.time - clickTime < 10000
      return (
        <Popconfirm
          title={formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.close_valve'})}) + editRecord.number}
          onConfirm={() => {
            that.setState({time: new Date().getTime()});
            let concentratorNumber  = that.props.editRecord.number

            const renderNotificationObj = {
              key: 'close' + concentratorNumber,
              message: formatMessage({id: 'intl.close_valve'}) + concentratorNumber + ' 进度'
            }
            that.valveCommand('close_all_valve',renderNotificationObj)
          }}>
          <Button loading={isLoading} type="danger"
                  style={{marginRight: 10}}>{formatMessage({id: 'intl.close_valve'})} </Button>
        </Popconfirm>
      )
    }
    const renderInitBtn = function () {
      const clickTime = sessionStorage.getItem(`data_initialization-${editRecord.number}`)
      const isLoading = clickTime && that.state.time - clickTime < 10000
      return (
        <Popconfirm
          title={formatMessage({id: 'intl.are_you_sure_to'}, {operate: formatMessage({id: 'intl.initialize'})}) + editRecord.number}
          onConfirm={() => {
            that.setState({time: new Date().getTime()});
            let concentratorNumber  = that.props.editRecord.number

            const renderNotificationObj = {
              key: 'init' + concentratorNumber,
              message: formatMessage({id: 'intl.initialize'}) + concentratorNumber + ' 进度'
            }
            that.valveCommand('data_initialization',renderNotificationObj)
          }}>
          <Button loading={isLoading} type="primary"
                  style={{marginRight: 10}}>{formatMessage({id: 'intl.initialize'})} </Button>
        </Popconfirm>
      )
    }
    const company_code = sessionStorage.getItem('company_code');
    return (
      <Tabs activeKey={this.state.tabsActiveKey} onChange={(activeKey) => {
        this.setState({tabsActiveKey: activeKey})
      }}>
        <TabPane tab={formatMessage({id: 'intl.concentrator_upload_valve_control_initialize'})} key="archives-setting">
          <Form>
            <FormItem
              label={formatMessage({id: 'intl.upload_multiple'})}
              {...formItemLayoutWithLabel}
            >
              {renderCommandBtn}
            </FormItem>
            {(company_code !== 'hy' ) && <FormItem
              label={formatMessage({id: 'intl.batch_valve_control'})}
              {...formItemLayoutWithLabel}
            >
              {renderOpenValveBtn()}
              {renderCloseValveBtn()}
            </FormItem>
            }
            <FormItem
              label={formatMessage({id: 'intl.initialize'})}
              {...formItemLayoutWithLabel}
            >
              {renderInitBtn()}<label htmlFor="">  {formatMessage({id: 'intl.concentrator_tip'})}</label>
            </FormItem>
            <FormItem
              label={formatMessage({id: 'intl.update_SIM_card_information'})}
              {...formItemLayoutWithLabel}
            >
              <Button type="primary" style={{marginRight: 10}}
                      onClick={this.UpdateSimInfo}>{formatMessage({id: 'intl.update'})}</Button>
            </FormItem>
            <FormItem
              label={formatMessage({id: 'intl.download_document'})}
              {...formItemLayoutWithLabel}
            >
              <Button type="primary" style={{marginRight: 10}}
                      onClick={this.downloadDocument}>{formatMessage({id: 'intl.download_document'})}</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab={formatMessage({id: 'intl.concentrator_gprs'})} key="setGPRS"><Form onSubmit={this.handleSubmit}>
          <FormItem
            label={formatMessage({id: 'intl.server_address'})}
            {...formItemLayoutWithLabel}
          >
            <Select style={{width: '250px'}} value={this.state.server_id} onChange={(value) => {
              this.setState({server_id: value})
            }} labelInValue={true}>
              {this.props.servers.map(item => <Option key={item.id}
                                                      value={item.id}>{item.ip + ':' + item.port}</Option>)}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label="APN"
          >
            <Select value={this.state.apn} onChange={(value) => {
              this.setState({apn: value})
            }} style={{width: '250px'}}>
              <Option value="CMNET">CMNET</Option>
              <Option value="CMWAP">CMWAP</Option>
            </Select>
          </FormItem>
        </Form></TabPane>
        <TabPane tab={formatMessage({id: 'intl.concentrator_upload_time'})} key="editUpload"><Form
          onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={formatMessage({id: 'intl.upload_cycle_unit_explain'})}
          >
            {getFieldDecorator('radio-group', {
              initialValue: this.state.value,
            })(
              <RadioGroup onChange={this.onChange} disabled={this.props.editRecord.type===4}>
                <Radio value="monthly">{formatMessage({id: 'intl.monthly'})}</Radio>
                <Radio value="daily">{formatMessage({id: 'intl.daily'})}</Radio>
                <Radio value="hourly">{formatMessage({id: 'intl.hourly'})}</Radio>
                <Radio value="every_fifteen_minutes">{formatMessage({id: 'intl.every_fifteen_minutes'})}</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {
            that.state.value !== 'every_fifteen_minutes' &&
            <FormItem
              {...formItemLayoutWithLabel}
              label={formatMessage({id: 'intl.concentrator_upload_time'})}
            >
              {
                that.state.value === 'monthly' &&
                <span style={{marginRight: '10px'}}>{formatMessage({id: 'intl.day'})}:
                  <InputNumber min={1} max={28}
                               step={1}
                               precision={0}
                               value={this.state.day}
                               onChange={(val) => {
                                 this.setState({day: val})
                               }}
                               style={{width: '60px'}}/></span>
              }
              {
                (that.state.value === 'monthly' || that.state.value === 'daily') &&
                <span style={{marginRight: '10px'}}>{formatMessage({id: 'intl.hour'})}:
                  <InputNumber min={0} max={59}
                               step={1}
                               precision={0}
                               value={this.state.hour}
                               onChange={(val) => {
                                 this.setState({hour: val})
                               }}
                               style={{width: '60px'}}/></span>
              }
              {formatMessage({id: 'intl.minute'})}: <span style={{marginRight: '10px'}}>
              <InputNumber min={0} max={59}
                           step={1}
                           precision={0}
                           value={this.state.minute}
                           onChange={(val) => {
                             this.setState({minute: val})
                           }}
                           style={{width: '60px'}}/></span>
              {formatMessage({id: 'intl.second'})}: <span><InputNumber min={0} max={59} step={1} precision={0}
                                                                       value={this.state.second} onChange={(val) => {
              this.setState({second: val})
            }} style={{width: '60px'}}/></span>
            </FormItem>
          }

        </Form></TabPane>
        <TabPane tab={formatMessage({id: 'intl.concentrator_sleep_time'})} key="editSleep"><Form
          onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={formatMessage({id: 'intl.concentrator_sleep_time'})}
          >
            <Checkbox.Group onChange={this.onChangeSleepHours} value={this.state.checkedList}>
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
