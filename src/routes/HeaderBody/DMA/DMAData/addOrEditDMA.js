/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Upload,Button ,Icon,TreeSelect } from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }
  componentDidMount() {

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
      return  <TreeNode value={item.id}   title={item.name} key={item.id} />
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
        sm: {span: 15},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const {dma:{allData}}=this.props;

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
              上级名称
            </span>
            )}>
            {getFieldDecorator('parent_id', {
              initialValue: this.props.editRecord?this.props.editRecord.parent_id:null,
            })(
              <TreeSelect
                treeDefaultExpandAll={true}
              >
                {this.renderTreeNodes(allData)}
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
