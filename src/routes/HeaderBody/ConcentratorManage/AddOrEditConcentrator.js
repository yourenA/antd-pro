/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Input,TreeSelect,Cascader,Tabs, Row, Col, InputNumber, Radio, Checkbox} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
class AddConcentrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsActiveKey:'edit',
      value: this.props.editRecord.upload_cycle_unit,
      checkedList:this.props.editRecord.sleep_hours,
      day:'',
      hour:'',
      minute:'',
      second:''
    };
  }
  componentDidMount() {
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
  renderTreeSelect=(data)=>{
    return data.map((item)=>{
      if(item.children){
        this.renderTreeSelect(item.children)
      }
      item.value=item.id;
      item.label=item.name
      return item
    })
  }
  renderTreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return  <TreeNode value={item.id}  title={item.name} key={item.id} />
    });
  }
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  onChangeSleepHours = (checkedList) => {
    this.setState({
      checkedList
    });
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      }
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // if(this.props.editRecord){
    //   const village_id=this.getParentKey(this.props.editRecord.village_id,this.props.area);
    //   console.log('village_id',village_id)
    // }
    const that = this;
    let arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(arr)
    }
    const rendersleep_hours = arr.map((item, index)=> {
      return (
        <Col key={index} span={4}><Checkbox value={String(index)}>{index}</Checkbox></Col>
      )
    })
    return (
      <div>
        <Tabs activeKey={this.state.tabsActiveKey} onChange={(activeKey)=>{this.setState({tabsActiveKey:activeKey})}}>
          <TabPane tab="编辑集中器基本属性" key="edit"><Form onSubmit={this.handleSubmit}>
            {/* <FormItem
             label="服务器地址"
             {...formItemLayoutWithLabel}
             >
             {getFieldDecorator('server_id', {
             initialValue: this.props.editRecord?{key:this.props.editRecord.server_id,label:this.props.editRecord.server_ip}:{key:'',label:''},
             rules: [{required: true, message: '服务器地址为空'}],
             })(
             <Select labelInValue={true}>
             { this.props.servers.map(item => <Option key={item.id} value={item.id}>{item.ip}</Option>) }
             </Select>
             )}
             </FormItem>*/}
            <FormItem
              label="集中器类型"
              {...formItemLayoutWithLabel}
            >
              {getFieldDecorator('concentrator_model_id', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.concentrator_model_id,label:this.props.editRecord.concentrator_model_name}:{key:'',label:''},
                rules: [{required: true, message: '集中器类型不能为空'}],
              })(
                <Select labelInValue={true}  disabled={this.props.editRecord ?true:false}>
                  { this.props.concentrator_models.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              集中器编号
            </span>
              )}
            >
              {getFieldDecorator('number', {
                initialValue: this.props.editRecord ? this.props.editRecord.number : '',
                rules: [{required: true, message: '集中器编号不能为空'}],
              })(
                <Input disabled={this.props.editRecord ?true:false}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              硬件编号
            </span>
              )}
            >
              {getFieldDecorator('serial_number', {
                initialValue: this.props.editRecord ? this.props.editRecord.serial_number : '',
                rules: [{required: true, message: '硬件编号不能为空'}],
              })(
                <Input  disabled={this.props.editRecord ?true:false}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              安装小区
            </span>
              )}>
              {getFieldDecorator('village_id', {
                rules: [{required: true, message: '安装小区不能为空'}],
                initialValue: this.props.editRecord?this.props.editRecord.village_ids:'',
              })(
                <Cascader options={this.renderTreeSelect(this.props.area)} placeholder="请选择"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              安装地址
            </span>
              )}
            >
              {getFieldDecorator('install_address', {
                initialValue: this.props.editRecord ? this.props.editRecord.install_address : '',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              是否统计
            </span>
              )}>
              {getFieldDecorator('is_count', {
                initialValue: this.props.editRecord?{key:this.props.editRecord.is_count.toString(),label:this.props.editRecord.is_count===1?'是':'否'}:{key:'1',label:'是'},
              })(
                <Select labelInValue={true} >
                  { [{key:1,label:'是'},{key:-1,label:'否'}].map((item, key) => {
                    return (
                      <Option key={item.key} value={item.key.toString()}>{item.label}</Option>
                    )
                  }) }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label={(
                <span>
              备注
            </span>
              )}
            >
              {getFieldDecorator('remark', {
                initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
              })(
                <Input />
              )}
            </FormItem>
            {
              this.props.editRecord?null:
                <FormItem
                  style={{color:'red'}}
                  label="提示"
                  {...formItemLayoutWithLabel}>
                  <div>添加集中器会同时对集中器进行初始化</div>
                </FormItem>
            }

          </Form></TabPane>
          <TabPane tab="编辑集中器上传时间" key="editUpload"><Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayoutWithLabel}
              label="上传周期"
            >
              {getFieldDecorator('radio-group', {
                initialValue: this.state.value,
              })(
                <RadioGroup onChange={this.onChange}>
                  <Radio value="monthly">每月</Radio>
                  <Radio value="daily">每天</Radio>
                  <Radio value="hourly">每小时</Radio>
                  <Radio value="every_fifteen_minutes">每15分钟</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutWithLabel}
              label="上传时间"
            >
              {
                that.state.value === 'monthly'&&<span>日:<InputNumber min={1} max={28} step={1} precision={0} value={this.state.day} onChange={(val)=>{this.setState({day:val})}} style={{width: '60px'}}/></span>
              }
              {
                (that.state.value === 'monthly'||that.state.value === 'daily')&&<span>时:<InputNumber min={0} max={59} step={1} precision={0} value={this.state.hour} onChange={(val)=>{this.setState({hour:val})}} style={{width: '60px'}}/></span>
              }
              分:<InputNumber min={0} max={59} step={1} precision={0} value={this.state.minute} onChange={(val)=>{this.setState({minute:val})}} style={{width: '60px'}}/>
              秒:<InputNumber min={0} max={59} step={1} precision={0} value={this.state.second} onChange={(val)=>{this.setState({second:val})}} style={{width: '60px'}}/>
            </FormItem>
          </Form></TabPane>
          <TabPane tab="编辑集中器睡眠时间" key="editSleep"><Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayoutWithLabel}
              label="睡眠时间"
            >
              <Checkbox.Group onChange={this.onChangeSleepHours} value={this.state.checkedList} >
                <Row>
                  {rendersleep_hours}
                </Row>
              </Checkbox.Group>
            </FormItem>
          </Form></TabPane>
        </Tabs>

    </div>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
