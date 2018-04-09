/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, Upload, Button, Icon, TreeSelect} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(state => ({
  flow_meters: state.flow_meters,
  dma: state.dma,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      parents:[]
    };
  }
  componentDidMount() {

    const {dispatch} = this.props;
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
    });
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
  renderFlowMetersTreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children&&item.children.length>0) {
        return (
          <TreeNode value={item.id}  title={item.name} key={item.id}>
            {this.renderFlowMetersTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }
  renderDMATreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children&&item.children.length>0) {
        return (
          <TreeNode value={item.id}  title={item.name} key={item.id}>
            {this.renderDMATreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id}/>
    });
  }
  handleChangeDMA=(value)=>{
    console.log(value);
    const {dispatch} = this.props;
    this.props.form.setFieldsValue({
      parents:[],
    });
    dispatch({
      type: 'flow_meters/fetchAll',
      payload: {
        return: 'all',
        area_id: value,
      },
      callback:()=>{
      }
    });
  }
  onChangeParents=(parents)=>{
    this.setState({ parents });
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const {flow_meters,dma}=this.props;
    console.log('editRecord',this.props.editRecord)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              名称
            </span>
            )}
          >
            {getFieldDecorator('name', {
              initialValue: this.props.editRecord ? this.props.editRecord.name : '',
              rules: [{required: true, message: '名称不能为空'}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              流量表编号
            </span>
            )}
          >
            {getFieldDecorator('number', {
              initialValue: this.props.editRecord ? this.props.editRecord.number : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              生产厂家
            </span>
            )}>
            {getFieldDecorator('manufacturer_id', {
              initialValue: this.props.editRecord?{key:this.props.editRecord.manufacturer_id,label:this.props.editRecord.manufacturer_name}:{key:'',label:''},
              rules: [{required: true, message: '生产厂家不能为空'}],
            })(
              <Select labelInValue={true} >
                { this.props.manufacturers.map((item, key) => {
                  return (
                    <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                  )
                }) }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              地理信息编码
            </span>
            )}
          >
            {getFieldDecorator('geo_code', {
              initialValue: this.props.editRecord ? this.props.editRecord.geo_code : '',
              rules: [{required: true, message: '地理信息编码不能为空'}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                所属DMA分区
            </span>
            )}>
            {getFieldDecorator('area_id', {
              onChange: this.handleChangeDMA,
              initialValue: this.props.editRecord?this.props.editRecord.area_id:null,
              rules: [{required: true, message: '所属DMA分区不能为空'}],
            })(
              <TreeSelect
                allowClear
              >
                {this.renderDMATreeNodes(dma.allData)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem
            label="是否正向流量"
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('is_forward', {
              initialValue: this.props.editRecord ? this.props.editRecord.is_forward : 1,
              rules: [{required: true, message: '是否正向流量不能为空'}],
            })(
              <RadioGroup>
                <Radio value={1}>是</Radio>
                <Radio value={-1}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              地址
            </span>
            )}
          >
            {getFieldDecorator('address', {
              initialValue: this.props.editRecord ? this.props.editRecord.address : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                上级流量计名称
            </span>
            )}>
            {getFieldDecorator('parents', {
              value:this.state.parents,
              initialValue:this.props.editRecord ? this.props.editRecord.parents : [],
              onChange:this.onChangeParents
            })(
              <TreeSelect
                allowClear
                multiple
              >
                {this.renderFlowMetersTreeNodes(flow_meters.allData)}
              </TreeSelect>
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
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
