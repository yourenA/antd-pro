/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Icon} from 'antd';
import moment from 'moment'
import find from 'lodash/find'
import {disabledDate} from './../../../utils/utils'
import {injectIntl} from 'react-intl';
const FormItem = Form.Item;
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,
    };
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
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

  render() {
    const { intl:{formatMessage} } = this.props;
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    const hot_difference_value=this.props.meta.aggregator?find(this.props.meta.aggregator.temperature_type_difference_values,function (o) {
      return o.name==='热水表'
    }).difference_value:0;
    const cold_difference_value=this.props.meta.aggregator?find(this.props.meta.aggregator.temperature_type_difference_values,function (o) {
      return o.name==='冷水表'
    }).difference_value:0;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
          <FormItem label={this.props.dateText ? this.props.dateText :  formatMessage({id: 'intl.start'})}>
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
          <FormItem label={this.props.dateText ? this.props.dateText :  formatMessage({id: 'intl.end'})}>
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
          <FormItem label={ formatMessage({id: 'intl.water_meter_number'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('meter_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.end'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('user_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.user_name'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('real_name')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={ formatMessage({id: 'intl.install_address'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}
          >
            {getFieldDecorator('install_address')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          {/* <FormItem label="创建时间">
           {getFieldDecorator('range-time-picker', {
           initialValue: this.props.initRange ? this.props.initRange : '',
           })(
           <RangePicker allowClear={this.props.initRange ? false : true}/>
           )}
           </FormItem>*/}
          <FormItem >
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'collapse_condition.end'})} <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit"> {formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
            {/* {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>添加</Button>}*/}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.cold'})}>
            <Input value={cold_difference_value} style={{width:'173px'}} readOnly addonAfter={formatMessage({id: 'intl.ton'})} />
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.hot'})}>
            <Input value={hot_difference_value} style={{width:'173px'}} readOnly addonAfter={formatMessage({id: 'intl.ton'})} />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
