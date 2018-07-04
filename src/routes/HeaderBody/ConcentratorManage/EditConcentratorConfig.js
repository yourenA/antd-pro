/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Select, Input, TreeSelect, Cascader, InputNumber, Radio, Checkbox, Row, Col} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class AddConcentrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.editRecord.upload_cycle_unit,
      checkedList:this.props.editRecord.sleep_hours[0],
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
          this.setState({
            minute:Number(editRecord.upload_time.substring(0,2)),
            second:Number(editRecord.upload_time.substring(3,5)),
          });
          break
      }
    }
  }
  renderTreeSelect = (data)=> {
    return data.map((item)=> {
      if (item.children) {
        this.renderTreeSelect(item.children)
      }
      item.value = item.id;
      item.label = item.name
      return item
    })
  }
  renderTreeNodes = (data)=> {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
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
        <Form onSubmit={this.handleSubmit}>
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
        </Form>
      </div>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
