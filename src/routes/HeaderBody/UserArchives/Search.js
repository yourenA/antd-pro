/**
 * Created by Administrator on 2017/11/17.
 */
import React, {Component} from 'react';
import {Form, DatePicker, Row, Col, Input, Button, Switch} from 'antd';
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import {injectIntl} from 'react-intl';
@injectIntl
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue)
      // const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        ...fieldsValue,
        // started_at: rangeTimeValue ? moment(rangeTimeValue[0]).format('YYYY-MM-DD') : '',
        // ended_at: rangeTimeValue ? moment(rangeTimeValue[1]).format('YYYY-MM-DD') : '',
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
    const {intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row>
          <FormItem label={formatMessage({id: 'intl.user_number'})}>
            {getFieldDecorator('member_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'intl.water_meter_number'})} >
            {getFieldDecorator('meter_number')(
              <Input placeholder={formatMessage({id: 'intl.please_input'})}/>
            )}
          </FormItem>
          <FormItem >
            <Button type="primary" htmlType="submit">{formatMessage({id: 'intl.search'})}  </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>{formatMessage({id: 'intl.reset'})}  </Button>
            {this.props.showAddBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickAdd} icon='plus'>{formatMessage({id: 'intl.add'})}  </Button>}
            {this.props.showImportBtn&&<Button style={{marginLeft: 8}} type="primary" onClick={this.props.clickImport} icon='plus'>{formatMessage({id: 'intl.batch_Import'})}</Button>}
          </FormItem>
          <FormItem >
            {this.props.showConcentratorExportBtn&&<Button  className="btn-cyan" type="primary" style={{marginLeft: 8}} onClick={()=>this.props.exportConcentratorCSV()} icon='export'>{formatMessage({id: 'intl.export_single_concentrator_info'})}</Button>}
            {this.props.showExportBtn&&<Button  className="btn-cyan" type="primary" style={{marginLeft: 8}} onClick={()=>this.props.exportCSV()} icon='export'>{formatMessage({id: 'intl.export_user_info'})}</Button>}
            {this.props.showConfigBtn&&<Button  className="btn-cyan" type="primary" style={{marginLeft: 8}} onClick={()=>this.props.setExport()}>{formatMessage({id: 'intl.set_export_user_info_format'})}</Button>}
          </FormItem>
          <FormItem  label={formatMessage({id: 'intl.open_operating_bar'})} style={{float:'right'}}  className="openOperate">
            <Switch defaultChecked={localStorage.getItem('canOperateUserArchives')==='true'?true:false} onChange={(checked)=>{
              localStorage.setItem('canOperateUserArchives',checked);
              this.props.changeShowOperate()
            }} />
          </FormItem>
        </Row>
      </Form>
    )
  }
}
const DefaultSearch = Form.create()(SearchForm);
export default DefaultSearch;
