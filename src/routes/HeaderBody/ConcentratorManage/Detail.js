import React, {PureComponent} from 'react';
import {Tabs, Form, Button, Select,TimePicker ,DatePicker,Input} from 'antd';
import moment from 'moment';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const that = this;
  }

  changeTab = (key)=> {
  }
  onChange = (date, dateString)=> {
    console.log(date, dateString);
  }

  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
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
    return (
      <Tabs defaultActiveKey="archives-setting" onChange={this.changeTab}>
        <TabPane tab="集中器档案设置" key="archives-setting">
          <Form >
            <FormItem
              label="初始化"
              {...formItemLayoutWithLabel}
            >
              <Button type='primary'>初始化</Button>
            </FormItem>
            <FormItem
              label="提示"
              {...formItemLayoutWithLabel}
              style={{color: 'red'}}
            >
              初始化将清除所有用户信息和水表信息
            </FormItem>
            <FormItem
              label="获取水表总量"
              {...formItemLayoutWithLabel}>
              <Button type='primary'>水表总数</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="定时上传设置" key="upload-setting" forceRender={true}>
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
        </TabPane>
      </Tabs>
    );
  }
}
const DetailFormWrap = Form.create()(Detail);
export default connect()(DetailFormWrap);
