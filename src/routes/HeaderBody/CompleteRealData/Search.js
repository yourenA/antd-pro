/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Icon , Input, Button,Radio} from 'antd';
import moment from 'moment'
import {disabledDate} from './../../../utils/utils'
import {injectIntl} from 'react-intl';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: this.props.isMobile?false:true,

    };
  }
  componentDidMount() {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const {getFieldDecorator} = this.props.form;
    const {expand}=this.state
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row >
        {/*  <FormItem label={this.props.inputText ? this.props.inputText : "名称"}>
            {getFieldDecorator('query')(
              <Input placeholder="请输入"/>
            )}
          </FormItem>*/}
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
          <FormItem label={formatMessage({id: 'intl.user_number'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('member_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.water_meter_number'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('meter_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.user_name'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('real_name')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.display_type'})}
                    style={{ display: expand ? 'inline-block' : 'none' }}>
            {getFieldDecorator('display_type',{
              initialValue:  'only_latest',
            })(
              <RadioGroup>
                <RadioButton value="only_latest">{formatMessage({id: 'intl.latest_data'})}</RadioButton>
                <RadioButton value="all">{formatMessage({id: 'intl.all_data'})}</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem >
            {this.props.isMobile&&<Button type="primary" onClick={this.toggle}  style={{marginRight: 8}}>
              {this.state.expand ? formatMessage({id: 'intl.expand_condition'}) : formatMessage({id: 'intl.collapse_condition'})} <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>}
            <Button type="primary" htmlType="submit"> {formatMessage({id: 'intl.search'})}</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{ formatMessage({id: 'intl.reset'})}</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
