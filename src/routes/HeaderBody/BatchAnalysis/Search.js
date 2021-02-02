/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Alert, Button, Select} from 'antd';
import {injectIntl} from 'react-intl';
import moment from 'moment'
import {connect} from 'dva';

const {MonthPicker, RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;

@connect(state => ({}))
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  handleSubmit = (e) => {
    console.log('handleSubmit')
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        started_at: moment(this.state.startValue).format('YYYY-MM-DD'),
        ended_at: moment(this.state.endValue).format('YYYY-MM-DD'),
      };

    });
  }
  handleFormReset = () => {
    this.props.handleFormReset()
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onMonthChange = (date, dateString) => {
    console.log('dateString', dateString)
    this.props.setMonthdate(date)
  }

  render() {
    const {intl: {formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');
    const children = [];
    for (let i = 0; i < this.props.meters.length; i++) {
      children.push(<Option key={this.props.meters[i].meter_number}>{this.props.meters[i].meter_number}</Option>);
    }
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row>
          <FormItem label={'月份'}>
            <MonthPicker
              onChange={this.onMonthChange}
              value={this.props.monthDate} format={'YYYY-MM'}/>
          </FormItem>
          <FormItem label={'水表号'}>
            <Select
              value={this.props.selectValue}
              mode="multiple"
              style={{width: '500px'}}
              placeholder="选择水表号"
              onChange={this.props.handleChange}
            >
              {children}
            </Select>
          </FormItem>
          <FormItem style={{color: 'red', float: 'right'}}>
            数据量大时会导致页面曲线图渲染变慢，请耐心等待
          </FormItem>

        </Row>
      </Form>
    )
  }
}

const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
