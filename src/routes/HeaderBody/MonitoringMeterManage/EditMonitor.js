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

@connect(state => ({
  sider_regions: state.sider_regions,
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
    const {sider_regions:{data}}=this.props;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              站点名称
            </span>
          )}
        >
          {getFieldDecorator('site_name', {
            initialValue: this.props.editRecord ? this.props.editRecord.site_name : '',
          })(
            <Input  disabled/>
          )}
        </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
              小区名称
            </span>
            )}>
            {getFieldDecorator('village_id', {
              initialValue: this.props.editRecord?this.props.editRecord.village_id:'',
            })(
              <TreeSelect
                allowClear
              >
                {this.renderTreeNodes(data)}
                </TreeSelect>
            )}
          </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
