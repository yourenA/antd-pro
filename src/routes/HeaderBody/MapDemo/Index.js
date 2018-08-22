import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, message, Modal, Button, Tooltip,Row,Col} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Search from './Search'
import Sider from './Sider'
import {connect} from 'dva';
import find from 'lodash/find'
import {getPreDay, renderIndex, renderErrorData,renderIndex2} from './../../../utils/utils'
import debounce from 'lodash/throttle'
const {Content} = Layout;
@connect(state => ({
  village_meter_data: state.village_meter_data,
  global:state.global,
}))
class UserMeterAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const company_code = sessionStorage.getItem('company_code');
    this.BMap = window.BMap;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'member_add_and_edit'}),
      showAddBtnByCon: false,
      showdelBtn: find(this.permissions, {name: 'member_delete'}),
      tableY: 0,
      meter_number: '',
      member_number: '',
      install_address: '',
      page: 1,
      initPage:1,
      initRange: getPreDay(),
      started_at: '',
      ended_at: '',
      village_id: '',
      editModal: false,
      changeModal: false,
      area: '',
      canLoadByScroll:true,
      expandedRowKeys:[]
      // concentrator_number:''
    }
  }
  componentDidMount() {
    this.map = new this.BMap.Map("mapData");          // 创建地图实例
    this.map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    this.map.enableScrollWheelZoom();

    // function showInfo(e){
    //   console.log(e.point.lng + ", " + e.point.lat);
    // }
    // map.addEventListener("click", showInfo);

    // var bdary = new BMap.Boundary();
    // bdary.get("衡阳市", function(rs){       //获取行政区域
    //   map.clearOverlays();        //清除地图覆盖物
    //   var count = rs.boundaries.length; //行政区域的点有多少个
    //   if (count === 0) {
    //     alert('未能获取当前输入行政区域');
    //     return ;
    //   }
    //   var pointArray = [];
    //   for (var i = 0; i < count; i++) {
    //     var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000",fillColor:''}); //建立多边形覆盖物
    //     map.addOverlay(ply);  //添加覆盖物
    //     pointArray = pointArray.concat(ply.getPath());
    //   }
    //   map.setViewport(pointArray);    //调整视野
    //   //addlabel();
    // });


  }
  renderMap=(data)=>{
    var markers = [];
    var points = [];
    var pt = null;
    const that=this;

    for (let i=0; i < data.length; i++) {
      pt = new this.BMap.Point(data[i].map.lng, data[i].map.lat);
      points.push(pt)
      var marker=new this.BMap.Marker(pt);
      marker.addEventListener("click", function (e) {
        that.showInfo(data[i])
      });
      markers.push(marker);
    }
    this.map.setViewport(points);    //调整视野
    let markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});
  }

  showInfo=(point)=>{
    let dot = new BMap.Point(point.map.lng,point.map.lat);
    let content =`<table><tr><td>集中器号 : </td><td>${point.number}</td></tr>
                    <tr><td>地址 : </td><td>${point.install_address}</td></tr>
                    <tr><td>水表数 : </td><td>${point.meter_count}</td></tr>
                    <tr><td>本次登录时间 : </td><td>${point.last_logined_at}</td></tr>
                    <tr><td>最后一次访问时间 : </td><td>${point.last_onlined_at}</td></tr>
                    </table>`
    let infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
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
