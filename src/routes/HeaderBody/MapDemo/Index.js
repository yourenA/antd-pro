import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip,Row,Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Sider from './Sider'
import {connect} from 'dva';
import famen from './famen.png'
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global:state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.markers=[];
    const company_code = sessionStorage.getItem('company_code');
    this.BMap = window.BMap;
    this.state = {
    }
  }
  componentDidMount() {
    this.map = new this.BMap.Map("mapData");          // 创建地图实例
    this.map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    this.map.enableScrollWheelZoom();
  }
  renderMap=(data)=>{
    var markers = [];
    var points = [];
    var pt = null;
    const that=this;

    for (let i=0; i < data.length; i++) {
      pt = new this.BMap.Point(data[i].map.lng, data[i].map.lat);
      points.push(pt)
      var myIcon = new this.BMap.Icon(famen, new BMap.Size(64,64));
      var marker=new this.BMap.Marker(pt,{icon:myIcon});
      marker.addEventListener("click", function (e) {
        that.showInfo(data[i])
      });
      var label = new this.BMap.Label(data[i].number,{offset:new BMap.Size(-4,40)});
      marker.setLabel(label);
      this.markers.push(marker);
      this.map.addOverlay(marker);
    }
    this.map.setViewport(points);    //调整视野
  }

  showInfo=(point)=>{
    let dot = new this.BMap.Point(point.map.lng,point.map.lat);
    let content =`<table><tr><td>集中器号 : </td><td>${point.number}</td></tr>
                    <tr><td>地址 : </td><td>${point.install_address}</td></tr>
                    <tr><td>水表数 : </td><td>${point.meter_count}</td></tr>
                    <tr><td>本次登录时间 : </td><td>${point.last_logined_at}</td></tr>
                    <tr><td>最后一次访问时间 : </td><td>${point.last_onlined_at}</td></tr>
                    </table>`

    let infoWindow = new this.BMap.InfoWindow(content);  // 创建信息窗口对象
    let allOverlay = this.map.getOverlays();
    // for (let i = 0; i < this.markers.length -1; i++){
    //   var p = this.markers[i].getPosition();       //获取marker的位置
    //   if(p.lng===point.map.lng && p.lat===point.map.lat){
    //     this.markers[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //   }else{
    //     this.markers[i].setAnimation(null); //跳动的动画
    //
    //   }
    // }
    this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  }
  changeArea = (village_id)=> {
  }
  changeConcentrator = (data)=> {
    // this.searchFormRef.props.form.resetFields()
    this.showInfo(data)
  }

  render() {
    return (
      <Layout className="layout">
        <Sider
          renderMap={this.renderMap}
                changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator}
              />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '实时数据分析'}, {name: '地图展示'}]}>
              <div id="mapData" className="mapData" style={{margin:'-16px'}}></div>
            </PageHeaderLayout>
          </div>
        </Content>

      </Layout>
    );
  }
}

export default UserMeterAnalysis
