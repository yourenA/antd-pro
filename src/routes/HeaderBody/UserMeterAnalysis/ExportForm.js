/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
import moment from 'moment'
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {sider_regions:{data}}=this.props;
    if(data.length>0 && data[0].id!=='all'){
      data.unshift({id:'all',name:'全部小区'})
    }
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              小区名称
            </span>
          )}>
          {getFieldDecorator('village_id', {
            initialValue: 'all',
          })(
            <TreeSelect
              allowClear
              treeDefaultExpandAll={true}
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem label={ '开始时间'}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: moment(),

          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label={'结束时间'}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('ended_at', {
            initialValue: moment(),
          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
