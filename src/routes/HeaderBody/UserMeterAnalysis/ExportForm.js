/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
import {disabledDate} from './../../../utils/utils'
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;
import moment from 'moment'
import {injectIntl} from 'react-intl';
@injectIntl
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
    const { intl:{formatMessage} } = this.props;
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
      data.unshift({id:'all',name:formatMessage({id: 'intl.all'})})
    }
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={(
            <span>
              {formatMessage({id: 'intl.village_name'})}
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
        <FormItem label=   {formatMessage({id: 'intl.start'})}
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: company_code==='hy'?moment().add(-1, 'days'):moment(),

          })(
            <DatePicker
              allowClear={false}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label=   {formatMessage({id: 'intl.end'})}
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
        {company_code === 'hy' ? null : <FormItem
          {...formItemLayoutWithLabel}
          label= {formatMessage({id: 'intl.export_type'})}
        >
          {getFieldDecorator('export_type', {
            initialValue: 'only_normal',
          })(
            <RadioGroup>
              <Radio value="only_normal">{formatMessage({id: 'intl.correct_data'})}</Radio>
              <Radio value="all">{formatMessage({id: 'intl.all'})}</Radio>
            </RadioGroup>
          )}
        </FormItem>
        }
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
