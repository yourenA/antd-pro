/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, Upload, Button, Icon, TreeSelect} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;

@connect(state => ({
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
              地理信息编码
            </span>
            )}
          >
            {getFieldDecorator('geo_code', {
              initialValue: this.props.editRecord ? this.props.editRecord.geo_code : '',
            })(
              <Input />
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
