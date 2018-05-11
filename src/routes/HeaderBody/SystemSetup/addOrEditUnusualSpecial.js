/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, InputNumber, DatePicker, Switch} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(state => ({
  meters: state.meters,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    if (this.props.editSpecialRecord) {

    } else {
      dispatch({
        type: 'meters/fetch',
        payload: {
          page: 1,
          number: ''
        },
        callback: ()=> {
        }
      });
    }
  }

  handleChange = (value)=> {
    console.log(value)
    const {dispatch} = this.props;
    dispatch({
      type: 'meters/fetch',
      payload: {
        page: 1,
        number: value
      },
      callback: ()=> {
      }
    })
  }

  render() {
    const formItemLayoutWithLabel2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 8},
      }
    };
    const {meters}=this.props
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
              水表号
            </span>
                )}>
                {getFieldDecorator('meter_number', {
                  initialValue: {key: '', label: ''},
                  rules: [{required: true, message: '水表类型不能为空'}],
                })(
                  <Select labelInValue={true} onSearch={this.handleChange} showSearch>
                    { meters.data.map((item, key) => {
                      return (
                        <Option key={item.number} value={item.number.toString()}>{item.number}</Option>
                      )
                    }) }
                  </Select>
                )}
              </FormItem>
          }


          <FormItem
            {...formItemLayoutWithLabel2}
            label={(
              <span>
              水表异常判断值
                  </span>
            )}
          >
            {getFieldDecorator('value', {
              initialValue: this.props.editSpecialRecord ? this.props.editSpecialRecord.value : 0,
              rules: [{required: true, message: '判断值不能为空'}],
            })(
              <InputNumber min={0}/>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
