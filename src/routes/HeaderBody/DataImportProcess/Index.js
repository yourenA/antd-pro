import React, {PureComponent} from 'react';
import { Table, Card, Layout, message, Popconfirm,Modal,Switch,Steps,Button } from 'antd';
import Pagination from './../../../components/Pagination/Index'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import Sider from './../EmptySider'
import AddOrEditVendor from './../VendorMange/addOrEditVendor'
import AddOrEditArea from './../AreaManage/addOrEditArea'
import AddOrEditConcentratorModels from './../ConcentratorModels/addOrEditConcentratorModels'
import AddOrEditConcentrator from './../ConcentratorManage/AddConcentrator'
import AddOrEditMeterModel from './../MeterModels/addOrEditMeterModels'
import ImportArchives from './../UserArchives/ImportUserArchives'
import request from "./../../../utils/request";
import find from 'lodash/find'
import './index.less'
const Step = Steps.Step;

const {Content} = Layout;
@connect(state => ({
  area: state.area,
  manufacturers: state.manufacturers,
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  meter_models: state.meter_models,
}))

class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.file=()=>{}
    this.state = {
      current: 0,
    };
  }
  confirmNext() {
    const current = this.state.current + 1;
    switch (this.state.current){
      case 0 :
        this.handleAddVendor(current);
            break;
      case 1 :
        this.handleAddArea(current);
        break;
      case 2 :
        this.handleAddConcentratorModels(current);
        break;
      case 3 :
        this.handleAddConcentrator(current);
        break;
      case 4 :
        this.handleAddMeterModel(current);
        break;
      case 5 :
        this.handleImport(current);
        break;
    }
  }
  next() {
    const current = this.state.current + 1;
    const {dispatch}=this.props

    switch (this.state.current){
    case 1 :
      dispatch({
        type: 'manufacturers/fetch',
        payload: {
          return: 'all'
        }
      });
      break;
    case 2 :
      dispatch({
        type: 'concentrator_models/fetch',
        payload: {
          return: 'all'
        },
      });
      dispatch({
        type: 'area/fetch',
        payload: {
          return: 'all'
        }
      });
      break;
      case 4 :
        dispatch({
          type: 'meter_models/fetch',
          payload: {
            return:'all'
          },
        });
        dispatch({
          type: 'concentrators/fetch',
          payload: {
            return:'all'
          },
        });
        break;
    }
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  handleAddVendor = (current) => {
    const that = this;
    const formValues =this.VendorformRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'manufacturers/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('添加厂商成功')
        that.setState({ current });
      }
    });

  }
  handleAddArea = (current) => {
    const that = this;
    const formValues =this.AreaformRef.props.form.getFieldsValue();
    console.log('formValues',formValues);

    this.props.dispatch({
      type: 'area/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('添加区域成功');
        that.props.dispatch({
          type: 'manufacturers/fetch',
          payload: {
            return: 'all'
          }
        });
        that.setState({ current });
      }
    });

  }
  handleAddConcentratorModels = (current) => {
    const that = this;
    const formValues =this.ConcerntratorModelformRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    this.props.dispatch({
      type: 'concentrator_models/add',
      payload: {
        ...formValues,
        protocols:formValues.protocols.join('|'),
        manufacturer_id: formValues.manufacturer_id.key,
      },
      callback: function () {
        message.success('添加集中器类型成功')
        that.props.dispatch({
          type: 'concentrator_models/fetch',
          payload: {
            return: 'all'
          },
        });
        that.props.dispatch({
          type: 'area/fetch',
          payload: {
            return: 'all'
          }
        });
        that.setState({ current });
      }
    });
  }
  handleAddConcentrator = (current) => {
    const that = this;
    const formValues = this.ConcentratorformRef.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        village_id: formValues.village_id[formValues.village_id.length - 1],
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        message.success('添加集中器成功')
        that.setState({ current });
      }
    });
  }
  handleAddMeterModel = (current) => {
    const that = this;
    const formValues = this.MeterModelformRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'meter_models/add',
      payload: {
        ...formValues,
        manufacturer_id: formValues.manufacturer_id.key,
        is_control:formValues.is_control.key?parseInt(formValues.is_control.key):-1
      },
      callback: function () {
        message.success('添加水表类型成功');
        that.props.dispatch({
          type: 'meter_models/fetch',
          payload: {
            return:'all'
          },
        });
        that.props.dispatch({
          type: 'concentrators/fetch',
          payload: {
            return:'all'
          },
        });
        that.setState({ current });
      }
    });

  }
  findChildFunc = (cb)=> {
    this.file=cb
  }
  handleImport=()=>{
    let file=this.file();
    const formValues =this.importFormRef.props.form.getFieldsValue();
    console.log('formValues',formValues)
    if(!formValues.file){
      message.error('请选择文件');
      return false
    }
    var formData = new FormData();
    formData.append("file", formValues.file.file);
    formData.append("meter_model_id", formValues.meter_model_id);
    formData.append("is_reset", formValues.is_reset.key);
    formData.append("concentrator_number", formValues.concentrator_number);
    const that=this;
    request(`/meter_import`, {
      method: 'POST',
      data: formData
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        message.success('导入成功');
      }
    })
  }
  render() {
    const {manufacturers,concentrator_models, area,concentrators,meter_models} = this.props;

    const steps = [{
      title: '添加厂商',
      content:  <AddOrEditVendor   wrappedComponentRef={(inst) => this.VendorformRef = inst}/>,
    },{
      title: '添加区域',
      content:  <AddOrEditArea    wrappedComponentRef={(inst) => this.AreaformRef = inst}/>,
    }, {
      title: '添加集中器类型',
      content: <AddOrEditConcentratorModels manufacturers={manufacturers.data}  wrappedComponentRef={(inst) => this.ConcerntratorModelformRef = inst}/>,
    }, {
      title: '添加集中器',
      content:  <AddOrEditConcentrator wrappedComponentRef={(inst) => this.ConcentratorformRef = inst} area={area.data}
                                       concentrator_models={concentrator_models.data} />,
    }, {
      title: '添加水表类型',
      content:  <AddOrEditMeterModel manufacturers={manufacturers.data} wrappedComponentRef={(inst) => this.MeterModelformRef = inst}/>,
    }, {
      title: '导入用户和水表数据',
      content: <ImportArchives  findChildFunc={this.findChildFunc} wrappedComponentRef={(inst) => this.importFormRef = inst} meter_models={meter_models.data} concentrators={concentrators.data}  />,
    },];
    const { current } = this.state;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 " breadcrumb={[{name: '系统管理 '}, {name: '一站添加数据'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div>
                  <Steps size="small"  current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                  </Steps>
                  <div className="steps-content">{steps[this.state.current].content}</div>
                  <div className="steps-action">
                    {
                      this.state.current > 0
                      &&
                      <Button  onClick={() => this.prev()}>
                        上一步
                      </Button>
                    }
                    {
                      this.state.current < steps.length - 1
                      &&
                      <Button  onClick={() => this.next()} style={{ marginLeft: 8 }} >跳过</Button>
                    }
                      <Button type="primary" onClick={() => this.confirmNext()}  style={{ marginLeft: 8 }} >确定</Button>

                  </div>
                </div>
              </Card>
            </PageHeaderLayout>
          </div>

        </Content>
      </Layout>
    );
  }
}

export default Vendor