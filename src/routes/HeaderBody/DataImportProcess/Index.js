import React, {PureComponent} from 'react';
import {Table, Card, Layout, message, Popconfirm, Modal, Switch, Steps, Button} from 'antd';
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
import AddOrEditServer from './../Servers/addOrEditServers'
import ImportArchives from './../UserArchives/ImportUserArchives'
import request from "./../../../utils/request";
import find from 'lodash/find'
import './index.less'
const Step = Steps.Step;

const {Content} = Layout;
import {injectIntl} from 'react-intl';
@injectIntl
@connect(state => ({
  area: state.area,
  manufacturers: state.manufacturers,
  concentrator_models: state.concentrator_models,
  concentrators: state.concentrators,
  meter_models: state.meter_models,
  servers: state.servers,
  sider_regions:state.sider_regions,
  dma:state.dma
}))

class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.file = ()=> {
    }
    this.state = {
      current: 0,
    };
  }

  confirmNext() {
    const current = this.state.current + 1;
    switch (this.state.current) {
      case 0 :
        this.handleAddVendor(current);
        break;
      case 1 :
        this.handleAddArea(current);
        break;
      case 2 :
        this.handleAddServer(current);
        break;
      case 3 :
        this.handleAddConcentratorModels(current);
        break;
      case 4 :
        this.handleAddConcentrator(current);
        break;
      case 5 :
        this.handleAddMeterModel(current);
        break;
      case 6 :
        this.handleImport(current);
        break;
    }
  }

  next() {
    const current = this.state.current + 1;
    const {dispatch}=this.props
    console.log('his.state.current', this.state.current)
    switch (this.state.current) {
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
          type: 'servers/fetch',
          payload: {
            display_type: 'only_enabled',
            return: 'all'
          }
        });
        break;
      case 3 :
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
        const company_code = sessionStorage.getItem('company_code');
        dispatch({
          type: 'meter_models/fetch',
          payload: {
            return: 'all'
          },
        });
        dispatch({
          type: 'concentrators/fetch',
          payload: {
            return: 'all'
          },
        });
        dispatch({
          type: 'sider_regions/fetch',
          payload: {
            return: 'all'
          }
        });
        if(company_code==='hy'){
          dispatch({
            type: 'dma/fetchAll',
            payload: {
              return: 'all'
            },
          });
        }
        break;
    }
    this.setState({current});
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({current});
  }

  handleAddVendor = (current) => {
    const that = this;
    const formValues = this.VendorformRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'manufacturers/add',
      payload: {
        ...formValues
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.vendor'})}
          )
        )
        that.setState({current});
      }
    });

  }
  handleAddArea = (current) => {
    const that = this;
    const formValues = this.AreaformRef.props.form.getFieldsValue();
    console.log('formValues', formValues);

    this.props.dispatch({
      type: 'area/add',
      payload: {
        ...formValues
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.village'})}
          )
        )
        that.props.dispatch({
          type: 'manufacturers/fetch',
          payload: {
            return: 'all'
          }
        });
        that.setState({current});
      }
    });

  }
  handleAddServer = (current) => {
    const that = this;
    const formValues = this.ServerformRef.props.form.getFieldsValue();
    console.log('formValues', formValues);
    this.props.dispatch({
      type: 'servers/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.server_address'})}
          )
        )
        that.props.dispatch({
          type: 'servers/fetch',
          payload: {
            display_type: 'only_enabled',
            return: 'all'
          }
        });
        that.setState({current});
      }
    });

  }
  handleAddConcentratorModels = (current) => {
    const that = this;
    const formValues = this.ConcerntratorModelformRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'concentrator_models/add',
      payload: {
        ...formValues,
        protocols: formValues.protocols,
        manufacturer_id: formValues.manufacturer_id.key,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.concentrator_type'})}
          )
        )
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
        that.setState({current});
      }
    });
  }
  handleAddConcentrator = (current) => {
    const that = this;
    const formValues = this.ConcentratorformRef.props.form.getFieldsValue();
    if(formValues.sim_operator==='other'){
      formValues.sim_operator=formValues.other_sim_operator
    }
    formValues.sim_number_type=formValues.sim_number_type?Number(formValues.sim_number_type):'';
    formValues.villages = [];
    for (let k in formValues) {
      if (k.indexOf('villages-') >= 0) {
        if (formValues.hasOwnProperty(k)) {
          if (formValues[k].village === undefined) {
            const {intl:{formatMessage}} = that.props;
            message.error(formatMessage({id: 'intl.village_name'})+formatMessage({id: 'intl.can_not_be_empty'}))
            this.setState({
              canAdd: true
            })
            return false
          } else {
            const village = formValues[k].village
            formValues.villages.push(village[village.length - 1])
          }
        }
      }
    }
    const company_code = sessionStorage.getItem('company_code');
    var center=company_code==='mys'?[114.288209,27.637665]:[113.131695, 27.827433]
    formValues.longitude=center[0];
    formValues.latitude=center[1];
    if (formValues.latitude_longitude) {
      let latitude_longitude = formValues.latitude_longitude
      formValues.longitude = latitude_longitude ? latitude_longitude.split('/')[0] : center[0]
      formValues.latitude = latitude_longitude ? latitude_longitude.split('/')[1] : center[1]
      that.addConcerntorRequest(formValues,current)
    }else if(formValues.install_address){
      let myGeo = new this.BMap.Geocoder();
      myGeo.getPoint(formValues.install_address, function(point){
        if (point) {
          console.log(point)
          formValues.longitude=point.lng.toString();
          formValues.latitude=point.lat.toString();
          that.addConcerntorRequest(formValues,current)
        }else{
          console.log("您选择地址没有解析到结果!");
          that.addConcerntorRequest(formValues,current)

        }
      });
    }else{
      that.addConcerntorRequest(formValues,current)

    }
  }
  addConcerntorRequest=(formValues,current)=>{
    const that=this;
    this.props.dispatch({
      type: 'concentrators/add',
      payload: {
        ...formValues,
        village_ids: formValues.villages,
        server_id: formValues.server_id.key,
        concentrator_model_id: formValues.concentrator_model_id.key,
        is_count: formValues.is_count.key,
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.concentrator'})}
          )
        )
        that.setState({current});
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
        is_control: formValues.is_control.key ? parseInt(formValues.is_control.key) : -1
      },
      callback: function () {
        const {intl:{formatMessage}} = that.props;
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.add'}), type: formatMessage({id: 'intl.water_meter_type'})}
          )
        )
        that.props.dispatch({
          type: 'meter_models/fetch',
          payload: {
            return: 'all'
          },
        });
        that.props.dispatch({
          type: 'concentrators/fetch',
          payload: {
            return: 'all'
          },
        });
        that.props.dispatch({
          type: 'sider_regions/fetch',
          payload: {
            return: 'all'
          }
        });
        const company_code = sessionStorage.getItem('company_code');
        if(company_code==='hy'){
          that.props.dispatch({
            type: 'dma/fetchAll',
            payload: {
              return: 'all'
            },
          });
        }
        that.setState({current});
      }
    });

  }
  findChildFunc = (cb)=> {
    this.file = cb
  }
  handleImport = ()=> {
    const {intl:{formatMessage}} = this.props;
    let file = this.file();
    const formValues = this.importFormRef.props.form.getFieldsValue();
    console.log('formValues', formValues)
    if (!formValues.file) {
      message.error( formatMessage({id: 'intl.please_choose_Excel'}));
      return false
    }
    var formData = new FormData();
    formData.append("file", formValues.file.file);
    formData.append("meter_model_id", formValues.meter_model_id);
    formData.append("meter_number_length", formValues.meter_number_length);
    formData.append("is_reset", formValues.is_reset.key);
    formData.append("concentrator_number", formValues.concentrator_number);
    formData.append("village_id", formValues.village_id[formValues.village_id.length - 1]);


    const that = this;
    request(`/meter_import`, {
      method: 'POST',
      data: formData
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.import'}), type: formatMessage({id: 'intl.excel'})}
          )
        )
      }
    })
  }

  render() {
    const {intl:{formatMessage}} = this.props;
    const {manufacturers, concentrator_models, area, concentrators, meter_models, servers,sider_regions,dma} = this.props;

    const steps = [{
      title: formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.vendor_manage'}),
      content: <AddOrEditVendor wrappedComponentRef={(inst) => this.VendorformRef = inst}/>,
    }, {
      title: formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.village_manage'}),
      content: <AddOrEditArea wrappedComponentRef={(inst) => this.AreaformRef = inst}/>,
    }, {
      title: formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.servers_manage'}),
      content: <AddOrEditServer wrappedComponentRef={(inst) => this.ServerformRef = inst}/>,
    }, {
      title:formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.concentrator_type_manage'}) ,
      content: <AddOrEditConcentratorModels manufacturers={manufacturers.data}
                                            wrappedComponentRef={(inst) => this.ConcerntratorModelformRef = inst}/>,
    }, {
      title:formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.concentrator_manage'}) ,
      content: <AddOrEditConcentrator wrappedComponentRef={(inst) => this.ConcentratorformRef = inst} area={area.data}
                                      servers={servers.data} concentrator_models={concentrator_models.data}/>,
    }, {
      title: formatMessage({id: 'intl.add'})+" "+formatMessage({id: 'intl.meter_type_manage'}),
      content: <AddOrEditMeterModel manufacturers={manufacturers.data}
                                    wrappedComponentRef={(inst) => this.MeterModelformRef = inst}/>,
    }, {
      title: formatMessage({id: 'intl.import_user_and_meter'}),
      content: <ImportArchives  dma={dma}  findChildFunc={this.findChildFunc}
                               wrappedComponentRef={(inst) => this.importFormRef = inst}
                               sider_regions={sider_regions}
                               meter_models={meter_models.data} concentrators={concentrators.data}/>,
    },];
    const {current} = this.state;
    return (
      <Layout className="layout">
        <Sider changeArea={this.changeArea} location={this.props.history.location}/>
        <Content >
          <div className="content">
            <PageHeaderLayout title="系统管理 "  breadcrumb={[{name: formatMessage({id: 'intl.system'})},
              {name: formatMessage({id: 'intl.add_data_at_one_stop'})}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div>
                  <Steps size="small" current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                  </Steps>
                  <div className="steps-content">{steps[this.state.current].content}</div>
                  <div className="steps-action">
                    {
                      this.state.current > 0
                      &&
                      <Button onClick={() => this.prev()}>
                        {formatMessage({id: 'intl.pre'})}
                      </Button>
                    }
                    {
                      this.state.current < steps.length - 1
                      &&
                      <Button onClick={() => this.next()} style={{marginLeft: 8}}>  {formatMessage({id: 'intl.next'})}</Button>
                    }
                    <Button type="primary" onClick={() => this.confirmNext()} style={{marginLeft: 8}}>{formatMessage({id: 'intl.submit'})}</Button>

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
