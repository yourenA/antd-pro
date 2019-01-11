import React, {PureComponent} from 'react';
import {Table, Card, Popconfirm, Layout, Badge, Modal, Divider, Tabs, Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Sider from './../EmptySider'
import {connect} from 'dva';
import find from 'lodash/find'
import defaultIcon from './default.png'
import warmingIcon from './warming.png'
import errorIcon from './error.png'
const {Content} = Layout;
@connect(state => ({
  concentrator_maps: state.concentrator_maps,
}))
class ConcentratorManage extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.BMap = window.BMap;
    this.markers = [];
    this.windowInfo = null;
    this.timer=null;
    this.state = {
      showAddBtn: find(this.permissions, {name: 'concentrator_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'concentrator_delete'}),
      commandBtn: find(this.permissions, {name: 'user_send_command'}),
      showSiderCon: true,
      tableY: 0,
      query: '',
      page: 1,
      initPage: 1,
      // initRange:[moment(new Date().getFullYear()+'-'+new  Date().getMonth()+1+'-'+'01' , 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      // started_at:'',
      // ended_at:'',
      editModal: false,
      addModal: false,
      orderModal: false,
      mapModal:false,
      village_id: '',
      showArea: true,
      editRecord: null,
      refreshSider: 0,
      canAdd: true,
      per_page: 30,
      canLoadByScroll: true,
      size_type:''
    }

  }
  componentDidMount(){
    this.handleSearch()
    this.map = new this.BMap.Map("mapData", {
      enableMapClick : false,//兴趣点不能点击
    });          // 创建地图实例
    this.map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]}));
    this.map.enableScrollWheelZoom();
  }

  changeArea = (village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      showAddBtnByCon: false,
      village_id: village_id
    }, function () {
      this.handleSearch({
        return:'all'
      })
    })
  }
  changeConcentrator = (concentrator_number, parent_village_id)=> {
    // this.searchFormRef.props.form.resetFields()
    this.setState({
      query: concentrator_number,
      village_id: parent_village_id,
    }, function () {
      this.handleSearch({
        return:'all'
      })
    })

  }

  handleSearch = (values) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'concentrator_maps/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        const {concentrator_maps:{data}}=that.props;

        let meters=[]
        for(let i=0;i<data.length;i++){
          if(data[i].meters.length===0){
            continue
          }
          for(let j=0;j<data[i].meters.length;j++){
            const dataInfo=data[i];
            let meterInfo={};
            meterInfo.concentrator_number=dataInfo.concentrator_number
            meterInfo.longitude=dataInfo.longitude
            meterInfo.latitude=dataInfo.latitude
            meterInfo.meter_number=dataInfo.meters[j].meter_number
            meterInfo.status=dataInfo.meters[j].status
            meterInfo.value=dataInfo.meters[j].value
            meters.push(meterInfo)
          }
        }
        console.log('meters',meters);
        that.renderMap(meters,true)

      }
    });
  }
  renderMap = (data, initial)=> {
    var points = [];
    var pt = null;
    const that = this;
    this.map.clearOverlays();
    for (let i = 0; i < data.length; i++) {
      if(!(data[i].longitude)||!( data[i].latitude)){
        console.log('不是经纬度');
        continue
      }
      pt = new this.BMap.Point(data[i].longitude, data[i].latitude);
      points.push(pt);
      let icon = defaultIcon;
      let text_color = 'blue';
      console.log('data[i] .status',data[i] .status)
      let myIcon = ''

      switch (data[i] .status) {
        case  1:
          myIcon = new BMap.Icon(defaultIcon, new BMap.Size(18,24),{anchor: new BMap.Size(10, 25) })// 指定定位位置
          text_color = 'blue';
          break;
        case  -1:
          text_color = '#faad14';
          myIcon = new BMap.Icon(warmingIcon, new BMap.Size(18,24),{anchor: new BMap.Size(10, 25) })// 指定定位位置

          break;
        case  -2:
          text_color = 'red';
          myIcon = new BMap.Icon(errorIcon, new BMap.Size(18,24),{anchor: new BMap.Size(10, 25) })// 指定定位位置
          break;
      }

      let marker = new this.BMap.Marker(pt,{icon: myIcon});

      marker.addEventListener("click", function (e) {
        that.showInfo(data[i])
      });
      let label = new this.BMap.Label(data[i].meter_number, {offset: new BMap.Size(-20, 25)});
      label.setStyle({
        borderColor:text_color,
        color : text_color,
      });
      marker.setLabel(label);
      this.markers.push(marker);
      this.map.addOverlay(marker);
    }
    console.log('points',points)

    initial && this.map.setViewport(points);    //调整视野
    // this.changePoints()
    this.timer=setTimeout(this.getPoint, 10000)
  }
  showInfo = (point)=> {
    let dot = new this.BMap.Point(point.longitude, point.latitude);
    let status_text = "正常";
    switch (point.status) {
      case  1:
        status_text = "正常";
        break;
      case  -1:
        status_text = "漏报";
        break;
      case  -2:
        status_text = "错报";
        break;
    }
    let content = `<div class="table-content">
<table class="custom-table">
                    <thead> <tr><th class="table-header-1">大表信息&nbsp&nbsp&nbsp</th><th  ></th></tr></thead>
                    <tbody>
                    <tr><td >大表编号 : </td><td>${point.meter_number}</td></tr>
                    <tr><td >所属集中器号 : </td><td>${point.concentrator_number}</td></tr>
                    <tr><td >状态 : </td><td>${status_text}</td></tr>
                    <tr><td >读值 : </td><td>${point.value}</td></tr>
                    </tbody>
                    </table>
`
    content=content.concat(`</div>`)
    let infoWindow = new this.BMap.InfoWindow(content, {title: point.number});  // 创建信息窗口对象
    let info = this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  }
  render() {
    return (
      <Layout className="layout">
        <Sider refreshSider={this.state.refreshSider} showSiderCon={this.state.showSiderCon}
               changeArea={this.changeArea}
               changeConcentrator={this.changeConcentrator} showArea={this.state.showArea}
        />
        <Content style={{background: '#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实时数据分析" breadcrumb={[{name: '数据分析'}, {name: '大表数据分析地图'}]}>
              <div style={{position:'relative'}}>
                <div id="mapData" className="mapData" style={{margin: '-16px'}}></div>
                <div className="map-tip">
                  <Badge status="processing"  text="正常" /><br/>
                  <Badge status="warning"  text="漏报" /><br/>
                  <Badge status="error"  text="错报" />
                </div>
              </div>

            </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default ConcentratorManage
