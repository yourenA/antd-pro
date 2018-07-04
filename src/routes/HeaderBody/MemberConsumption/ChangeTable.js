/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {
  Form, Input, Select, Col,
  Row,InputNumber
} from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
class EditUserArchives extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="原表号"
            {...formItemLayoutWithLabel}
          >
            <p>64110003</p>
          </FormItem>
          <FormItem
            label="新表号"
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('new_meter_num', {
              initialValue: this.props.editRecord ? this.props.editRecord.username : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="新表初始水量"
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('new_meter_count', {
              initialValue: this.props.editRecord ? this.props.editRecord.username : '',
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="估算水量"
            {...formItemLayoutWithLabel}
          >
            {getFieldDecorator('compute_water_count', {
              initialValue: {name: 0, authority: '0'},
            })(
              <ThemeInput />
            )}
          </FormItem>
        </Form>
        <hr/>
        <Row style={{marginTop: '12px'}}>
          <Col md={12} sm={24}>
            <div className="desc-title">上次正确读表时间</div>
            <div className="desc-detail">2018-01-05</div>
          </Col>
          <Col md={12} sm={24}>
            <div className="desc-title">读数</div>
            <div className="desc-detail">30602.05</div>
          </Col>
          <Col md={12} sm={24}>
            <div className="desc-title">三个月日均用水量</div>
            <div className="desc-detail"> 66.71</div>
          </Col>
        </Row>
      </div>
    );
  }
}

class ThemeInput extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      name: value.name || 0,
      authority: value.authority || "0",
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleNumberChange = (value) => {
    const name = value;
    if (!('value' in this.props)) {
      this.setState({name});
    }
    this.triggerChange({name});
  }
  handleCurrencyChange = (authority) => {
    if (!('value' in this.props)) {
      this.setState({authority});
    }
    this.triggerChange({authority});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const {size} = this.props;
    const state = this.state;
    return (
      <span>

        <Select
          value={state.authority}
          size={size}
          style={{width: '53%', marginRight: '3%'}}
          onChange={this.handleCurrencyChange}
        >
          <Option value="0">换表期间用水量估计</Option>
          <Option value="1">原表读数估计</Option>
        </Select>
           <InputNumber
             type="text"
             size={size}
             value={state.name}
             onChange={this.handleNumberChange}
             style={{width: '35%'}}
             addonAfter="m³"
           />
            m³
      </span>
    );
  }
}

const EditUserArchivesFormWrap = Form.create()(EditUserArchives);
export default connect()(EditUserArchivesFormWrap);
