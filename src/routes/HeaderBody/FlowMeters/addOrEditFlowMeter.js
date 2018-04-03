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
  sider_regions: state.sider_regions,
  flow_meters: state.flow_meters,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'sider_regions/fetch',
      payload: {
        return: 'all'
      }
    });
    dispatch({
      type: 'flow_meters/fetchAll',
      payload: {
        return: 'all'
      }
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
    console.log(data)
    return data.map((item) => {
      if (item.children&&item.children.length>0) {
        return (
          <TreeNode value={item.id} title={item.number} key={item.id}>
            {this.renderFlowMetersTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.number} key={item.id}/>
    });
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
    const {sider_regions:{data},flow_meters}=this.props;
    const props = {
      action: '',
      name: 'shoce11',
      beforeUpload: (file) => {
        this.setState(({fileList}) => ({
          fileList: [file],
        }));
        return false;
      },
      showUploadList: {showPreviewIcon: true, showRemoveIcon: false},
      fileList: this.state.fileList,
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
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
              rules: [{required: true, message: '地址名称不能为空'}],
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
                所属安装小区
            </span>
            )}>
            {getFieldDecorator('villages', {
              rules: [{required: true, message: '安装小区不能为空'}],
            })(
              <TreeSelect
                allowClear
                multiple
              >
                {this.renderTreeNodes(data)}
              </TreeSelect>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
                所属上级流量计
            </span>
            )}>
            {getFieldDecorator('parents', {
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
