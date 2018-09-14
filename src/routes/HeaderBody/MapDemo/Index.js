import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip, Row, Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Sider from './Sider'
import {connect} from 'dva';
import icon1 from './1.png'
import icon2 from './2.png'
import RealDataTable from './RealData'
import request from '../../../utils/request';
import find from 'lodash/find'
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global: state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.markers = [];
    this.windowInfo = null;
    this.timer=null;
    const company_code = sessionStorage.getItem('company_code');
    this.BMap = window.BMap;
    this.state = {
      data:[],
      meta: {pagination: {total: 0, per_page: 0}},
      minimum_pressure_value:0,
      maximum_pressure_value:0,
      minimum_temperature_value:0,
      maximum_temperature_value:0
    }
  }

  componentDidMount() {
    const that = this;
    request(`/configs?groups[]=pressure_sensor_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        minimum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'minimum_pressure_value'
        }).value,
        maximum_pressure_value: find(response.data.data, function (o) {
          return o.name === 'maximum_pressure_value'
        }).value,
      })

    })

    request(`/configs?groups[]=temperature_sensor_abnormality`, {
      method: 'GET',
      query: {}
    }).then((response)=> {
      console.log(response);
      that.setState({
        minimum_temperature_value: find(response.data.data, function (o) {
          return o.name === 'minimum_temperature_value'
        }).value,
        maximum_temperature_value: find(response.data.data, function (o) {
          return o.name === 'maximum_temperature_value'
        }).value,
      })

    })

    this.map = new this.BMap.Map("mapData");          // 创建地图实例
    this.map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]}));
    this.map.enableScrollWheelZoom();

  }

  renderMap = (data, initial)=> {
    var points = [];
    var pt = null;
    const that = this;
    this.map.clearOverlays();
    for (let i = 0; i < data.length; i++) {
      let pressureWarm = find(data[i].pressure_sensors_analysis,function (o) {
        return o.pressure_value_status===-1
      })
      let temperatureWarm = find(data[i].temperature_sensors_analysis,function (o) {
        return o.temperature_value_status===-1
      })
      if (this.windowInfo) {
        if (this.windowInfo.title === data[i].number) {
          console.log('自动开启信息窗口')
          that.showInfo(data[i])
        }
      }
      pt = new this.BMap.Point(data[i].longitude, data[i].latitude);
      points.push(pt)
      let marker = new this.BMap.Marker(pt/*, {icon: myIcon}*/)
      marker.addEventListener("mouseover", function (e) {
        that.showInfo(data[i])
      });
      let label = new this.BMap.Label(data[i].number, {offset: new BMap.Size(-20, 28)});
      marker.setLabel(label);
      this.markers.push(marker);
      this.map.addOverlay(marker);
      if(pressureWarm || temperatureWarm){
        marker.setAnimation(BMAP_ANIMATION_BOUNCE)  //跳动的动画要放在最后面
      }
    }

    initial && this.map.setViewport(points);    //调整视野
    // this.changePoints()
    this.timer=setTimeout(this.getPoint, 10000)
  }
  saveConcentrators=(data)=>{
    this.setState({
      data:data
    },function () {
      this.getPoint(true)
    })
  }

  componentWillUnmount() {
    if(this.timer){
      clearTimeout(this.timer)
    }
  }
  getPoint = (init)=> {
    const that=this;
    request(`/concentrator_real_time_data`, {
      method: 'GET',
      params: {
        return: 'all'
      }
    }).then((concentratorsResponse)=> {
      console.log('concentrator_real_time_data',concentratorsResponse);
      const data=this.state.data
      for(let j=0;j<data.length;j++){
        const concentrate=find(concentratorsResponse.data,function (o) {
          return o.concentrator_number===data[j].number
        })
        if(concentrate){
          console.log('存在相同的集中器')
          if(concentrate.temperature_sensors){
            data[j].temperature_sensors_analysis=concentrate.temperature_sensors
          }else{
            data[j].temperature_sensors_analysis=[]
          }
          if(concentrate.pressure_sensors){
            data[j].pressure_sensors_analysis=concentrate.pressure_sensors
          }else{
            data[j].pressure_sensors_analysis=[]
          }
        }else{
          data[j].temperature_sensors_analysis=[]
          data[j].pressure_sensors_analysis=[]
        }
      }

      if (this.map.getInfoWindow()) {
        this.windowInfo = {title: this.map.getInfoWindow().getTitle(), ref: this.map.getInfoWindow()}
      } else {
        this.windowInfo = null;
      }

      that.setState({
        data:[...data]
      },function () {
        console.log('渲染地图')
        that.renderMap(data,init)
      });
    })
  }

  showInfo = (point)=> {
    let dot = new this.BMap.Point(point.longitude, point.latitude);
    let content = `<div class="table-content">
<table class="custom-table">
                    <thead> <tr><th class="table-header-1">集 中 器 信 息&nbsp&nbsp&nbsp</th><th  ></th></tr></thead>
                    <tbody>
                    <tr><td >集中器号 : </td><td>${point.number}</td></tr>
                    <tr><td>地址 : </td><td class="table-header-address">${point.install_address}</td></tr>
                    </tbody>
                    </table>
`
    for(let i=0;i<point.pressure_sensors_analysis.length;i++){
      content=content.concat(`<table class="custom-table ${point.pressure_sensors_analysis[i].pressure_value_status===-1?'custom-table-error':''}">
                    <thead> <tr><th  class="table-header-1">压力传感器信息 </th><th  class="table-header-2">当前值</th><th  class="table-header-3">正常值</th></tr></thead>
                    <tbody>
                    <tr><td>压力传感器号 : </td><td>${point.pressure_sensors_analysis[i].pressure_sensor_number}</td><td>-</td></tr>
                    <tr><td>最新上传时间 : </td><td>${point.pressure_sensors_analysis[i].uploaded_at}</td><td>-</td></tr>
                    <tr><td>最新传感值 : </td><td>${point.pressure_sensors_analysis[i].pressure_value}</td><td>${this.state.minimum_pressure_value}-${this.state.maximum_pressure_value}</td></tr>
                    <tr><td>状态 : </td><td>${point.pressure_sensors_analysis[i].pressure_value_status===-1?'异常':'正常'}</td><td>-</td></tr>
                    </tbody>
                    </table>
                    `)
    }
    for(let i=0;i<point.temperature_sensors_analysis.length;i++){
      content=content.concat(`<table class="custom-table ${point.temperature_sensors_analysis[i].temperature_value_status===-1?'custom-table-error':''}">
                    <thead> <tr><th  class="table-header-1">温度传感器信息 </th><th  class="table-header-2">当前值</th><th  class="table-header-3">正常值</th></tr></thead>
                    <tbody>
                    <tr><td>温度传感器号 : </td><td>${point.temperature_sensors_analysis[i].temperature_sensor_number}</td><td>-</td></tr>
                    <tr><td>最新上传时间 : </td><td>${point.temperature_sensors_analysis[i].uploaded_at}</td><td>-</td></tr>
                    <tr><td>最新传感值 : </td><td>${point.temperature_sensors_analysis[i].temperature_value}</td><td>${this.state.minimum_temperature_value}-${this.state.maximum_temperature_value}</td></tr>
                     <tr><td>状态 : </td><td>${point.temperature_sensors_analysis[i].temperature_value_status===-1?'异常':'正常'}</td><td>-</td></tr>
                    </tbody>
                    </table>
                    `)
    }
    content=content.concat(`</div>`)
    let infoWindow = new this.BMap.InfoWindow(content, {title: point.number});  // 创建信息窗口对象
    let info = this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  }
  changeArea = (village_id)=> {
  }
  changeConcentrator = (data)=> {
    const showPoint=find(this.state.data,function (o) {
      return o.number===data.number
    })
    this.showInfo(showPoint)
  }

  render() {
    console.log('maximum_pressure_value',this.state.maximum_pressure_value)
    return (
      <Layout className="layout">
        <Sider
          saveConcentrators={this.saveConcentrators}
          getPoint={this.getPoint}
          changeArea={this.changeArea}
          changeConcentrator={this.changeConcentrator}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '地图展示'}]}>
              <div id="mapData" className="mapData" style={{margin: '-16px'}}></div>
              <div className="realData">
               <RealDataTable meta={this.state.meta} data={this.state.data}
                               history={this.props.history}
                               changeConcentrator={this.changeConcentrator}/>
              </div>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
