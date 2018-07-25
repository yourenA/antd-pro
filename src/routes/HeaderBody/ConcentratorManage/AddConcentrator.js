/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Select,Input,TreeSelect,Cascader,Tabs, Row, Col, InputNumber, Radio, Checkbox,Button,Icon} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
let uuid = 0;
class AddConcentrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
  add = () => {
    uuid++;
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  remove = (k) => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
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
    const formItemLayoutWithOutLabel={
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 18, offset: 5},
      },
    };
    const {getFieldDecorator, getFieldValue} = this.props.form;
    // if(this.props.editRecord){
    //   const village_id=this.getParentKey(this.props.editRecord.village_id,this.props.area);
    //   console.log('village_id',village_id)
    // }
    getFieldDecorator('keys', {initialValue: [uuid]});
    const keys = getFieldValue('keys');
    console.log('keys',keys)
    const formItems = keys.map((k, index) => {
      const layout = index === 0 ? formItemLayoutWithLabel : formItemLayoutWithOutLabel;
      return (
        <FormItem
          {...layout}
          label={index === 0 ? '安装小区' : ''}
          required={false}
          key={k}>
          {getFieldDecorator(`villages-${k}`, {
            initialValue: [],
          })(<VillageCascader area={this.props.area}/>)}
          <Icon
            className="concentrator-cascader-del-btn"
            type="minus-circle-o"
            title="删除"
            onClick={() => this.remove(k)}
          />
        </FormItem>
      );
    });
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
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
            {/*<FormItem
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
            </FormItem>*/}
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button  onClick={this.add} style={{width: '60%'}}>
              <Icon type="plus"/> 增加安装小区
            </Button>
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

          </Form>

    </div>
    );
  }
}

class VillageCascader  extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      village: value || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleCurrencyChange = (village) => {
    if (!('value' in this.props)) {
      this.setState({village});
    }
    this.triggerChange({village});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
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
  render() {
    const {size} = this.props;
    const state = this.state;
    return (
      <span>
         <Cascader className="concentrator-cascader" options={this.renderTreeSelect(this.props.area)}  value={state.village}  onChange={this.handleCurrencyChange} placeholder="请选择"/>
      </span>
    );
  }
}

const AddConcentratorFormWrap = Form.create()(AddConcentrator);
export default connect()(AddConcentratorFormWrap);
