
/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Icon, Input, Button,TreeSelect,Radio} from 'antd';
import moment from 'moment'

import {disabledDate} from './../../../utils/utils'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
import {injectIntl} from 'react-intl';
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile ? false : true,
    };
  }

  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  }
  componentDidMount() {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const date = fieldsValue['date'];
      const values = {
        ...fieldsValue,
        started_at:  fieldsValue['started_at'] ? moment( fieldsValue['started_at']).format('YYYY-MM-DD') : '',
        ended_at:  fieldsValue['ended_at']  ? moment( fieldsValue['ended_at']).format('YYYY-MM-DD') : '',
      };
      this.props.handleSearch({...values, page: 1,per_page:this.props.per_page})
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.props.handleFormReset()
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
  render() {
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row>
          {
            company_code==='hy'&&
            <FormItem
              label='DMA分区'>
              {getFieldDecorator('area_id', {
              })(
                <TreeSelect
                  style={{width:'100px'}}
                  allowClear
                >
                  {this.renderDMATreeNodes(this.props.dma.allData)}
                </TreeSelect>
              )}
            </FormItem>
          }
          <FormItem label={this.props.dateText ? this.props.dateText : formatMessage({id: 'intl.start'})}>
            {getFieldDecorator('started_at', {
              initialValue: this.props.initRange ? this.props.initRange[0] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem label={this.props.dateText ? this.props.dateText : formatMessage({id: 'intl.end'})}>
            {getFieldDecorator('ended_at', {
              initialValue: this.props.initRange ? this.props.initRange[1] : '',
            })(
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.user_number'})} style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('member_number')(
              <Input placeholder={ formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.concentrator_number'})} style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('concentrator_number')(
              <Input placeholder={ formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.water_meter_number'})}  style={{display: expand ? 'inline-block' : 'none'}}>
            {getFieldDecorator('meter_number')(
              <Input placeholder={ formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.display_type'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('display_type',{
              initialValue:  'only_unprocessed',
            })(
              <RadioGroup>
                <RadioButton value="only_unprocessed">{ formatMessage({id: 'intl.unprocessed'})}</RadioButton>
                <RadioButton value="only_processed">{ formatMessage({id: 'intl.processed'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'collapse_condition.end'})} <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit">{ formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            <Button type="primary" style={{marginLeft: 8}} onClick={this.props.setWarningRule}>{ formatMessage({id: 'intl.set_alarm_rule'})}</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
