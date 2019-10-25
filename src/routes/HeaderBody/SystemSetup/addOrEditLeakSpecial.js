/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, TreeSelect, Switch} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
import request from '../../../utils/request';
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meters:[]
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
  render() {
    const {sider_regions:{data}}=this.props;
    const {intl:{formatMessage}} = this.props;
    const formItemLayoutWithLabel2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form >
          {
            this.props.editSpecialRecord ? null :
              <FormItem
                {...formItemLayoutWithLabel2}
                label={(
                  <span>
              小区名称
            </span>
                )}>
                {getFieldDecorator('parent_id', {
                  rules: [{required: true}],
                })(
                  <TreeSelect
                    onChange={this.changeVillage}
                  >
                    {this.renderTreeNodes(data)}
                  </TreeSelect>
                )}
              </FormItem>
          }
          {
            this.props.editSpecialRecord ? null :
              <FormItem
                {...formItemLayoutWithLabel2}
                label='用户名称/水表编号'
              >
                {getFieldDecorator(`meter_numbers`, {
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
                        return <Option key={index} value={`${item.real_name}@${item.number}`}>{item.real_name}/{item.number}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
          }


          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
                 {formatMessage({id: 'intl.judgment_value'})}
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue: this.props.editSpecialRecord ? this.props.editSpecialRecord.value : 1,
              rules: [{required: true, message: formatMessage({id: 'intl.judgment_value'})+ formatMessage({id: 'intl.can_not_be_empty'})}],
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
