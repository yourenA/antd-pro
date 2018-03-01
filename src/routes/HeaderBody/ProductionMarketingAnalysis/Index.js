/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Select, Layout, Card, Button, Input, TreeSelect, DatePicker,InputNumber} from 'antd';
import {connect} from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Sider from './Sider'
const TreeNode = TreeSelect.TreeNode;
import './index.less'
import request from './../../../utils/request'
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
const {Content} = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_consumption:'',
      member_consumption:'',
      difference_consumption:'',
      attrition_rate:'',
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

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
  }
  handleSubmit =  (e) => {
    e.preventDefault();
    const that=this;
    this.props.form.validateFields({ force: true },
      (err, fieldsValue) => {
        if (!err) {
          const values = {
            ...fieldsValue,
            started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
            ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',

          };
          console.log(values)
          request(`/village_difference_consumption`,{
            method:'GET',
            params:{
              ...values
            }
          }).then((response)=>{
            console.log(response);
            that.setState({
              total_consumption:response.data.total_consumption,
              member_consumption:response.data.member_consumption,
              difference_consumption:response.data.difference_consumption,
              attrition_rate:response.data.attrition_rate,
            })
          })
        }
      }
    );
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
    const {getFieldDecorator,} = this.props.form;
    const {sider_regions:{data}}=this.props;
    return (
      <Layout className="layout">
        <Sider/>
        <Content style={{background: '#fff'}}>
          {/*<Working/>*/}
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '产销差分析'}]}>
              <Card bordered={false} style={{margin: '-24px -24px 0'}}>
                <Card className="analysis-card" title="输入参数" style={{width: 564, margin: '0 auto'}}>
                  <Form style={{maxWidth: '500px', margin: '0 auto'}} >
                    <FormItem
                      {...formItemLayoutWithLabel}
                      label={ '开始时间'}>
                      {getFieldDecorator('started_at', {
                        rules: [{required: true, message: '开始时间不能为空'}],
                      })(
                        <DatePicker
                          allowClear={false}
                          disabledDate={disabledDate}
                          format="YYYY-MM-DD"
                        />
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayoutWithLabel}
                      label={'结束时间'}>
                      {getFieldDecorator('ended_at', {
                        rules: [{required: true, message: '结束时间不能为空'}],
                      })(
                        <DatePicker
                          allowClear={false}
                          disabledDate={disabledDate}
                          format="YYYY-MM-DD"
                        />
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayoutWithLabel}
                      label={(
                        <span>
                            所属地区
                        </span>
                      )}>
                      {getFieldDecorator('village_id', {
                        rules: [{required: true, message: '所属小区不能为空'}],
                      })(
                        <TreeSelect
                          treeDefaultExpandAll={true}
                        >
                          {this.renderTreeNodes(data)}
                        </TreeSelect>
                      )}
                    </FormItem>
                    <FormItem
                      label="总用水量 (m³)"
                      {...formItemLayoutWithLabel}
                    >
                      {getFieldDecorator('total_consumption', {
                        rules: [{required: true, message: '总用水量不能为空'}],
                      })(
                        <InputNumber/>
                      )}
                    </FormItem>
                    <FormItem
                      wrapperCol={ {
                        offset: 8,
                      }}>
                      <Button onClick={this.handleFormReset}>重置</Button>
                      <Button style={{marginLeft: 8}} type="primary" onClick={this.handleSubmit}>计算</Button>
                    </FormItem>
                  </Form>
                </Card>
                <Card className="analysis-card" title="分析结果" style={{width: 564, margin: '24px auto'}}>
                  <Form style={{maxWidth: '500px', margin: '0 auto'}}>
                    <FormItem
                      label="总用水量 (m³)"
                      {...formItemLayoutWithLabel}
                    >
                      <p>{this.state.total_consumption}</p>
                    </FormItem>
                    <FormItem
                      label="客户用水量 (m³)"
                      {...formItemLayoutWithLabel}
                    >
                      <p>{this.state.member_consumption}</p>
                    </FormItem>
                    <FormItem
                      label="差量 (m³)"
                      {...formItemLayoutWithLabel}
                    >
                      <p>{this.state.difference_consumption}</p>
                    </FormItem>
                    <FormItem
                      label="漏損率 (%)"
                      {...formItemLayoutWithLabel}
                    >
                      <p>{this.state.attrition_rate}</p>
                    </FormItem>
                  </Form>
                </Card>

              </Card>
            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>

    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
