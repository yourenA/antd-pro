/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Upload,Button ,Icon,TreeSelect } from 'antd';
import {connect} from 'dva';
import request from '../../../utils/request';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {injectIntl} from 'react-intl';
let uuid = 0;
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meters: [],
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

    request(`/meters`, {
      method: 'GET',
      params: {
        return: 'all'
      }
    }).then(response=>{
      if(response.status===200){
        this.setState({
          meters:response.data.data
        })
      }

    })
  }
  changeVillage=(e)=>{
    request(`/meters`, {
      method: 'GET',
      params: {
        return: 'all',
        village_id:e
      }
    }).then(response=>{
      if(response.status===200){
        this.setState({
          meters:response.data.data
        })
      }

    })
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
    const {sider_regions:{data}}=this.props;
    const {intl:{formatMessage}} = this.props;
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
    const {getFieldDecorator,getFieldValue} = this.props.form;
    getFieldDecorator('keys', {initialValue: [uuid]});
    const keys = getFieldValue('keys');
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
          {getFieldDecorator('parent_id', {
          })(
            <TreeSelect
              onChange={this.changeVillage}
              allowClear
            >
              {this.renderTreeNodes(data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem
          {...formItemLayoutWithLabel}
          label='用户名称/水表编号'
         >
          {getFieldDecorator(`meter_number`, {
            rules: [{required: true, message: formatMessage({id: 'intl.meter'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
          })(
            <Select
              showSearch
              mode="multiple"
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
              {
                return option.props.children.join('').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              }
            >
              {
                this.state.meters.map((item,index)=>{
                  return <Option key={index} value={item.number+'@'+item.real_name}>{item.real_name}/{item.number}</Option>
                })
              }
            </Select>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}


const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
