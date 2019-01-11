import React, {PureComponent} from 'react';
import {
  Modal ,
  Form,
  message
} from 'antd';
import AddPointForm from './addOrEditPoint';
import uuid from 'uuid/v4'
const FormItem = Form.Item;

export default class MapData extends PureComponent {

  constructor(props) {
    super(props);
    this.BMapLib = window.BMapLib;
    this.BMap = window.BMap;
    this.point = null;
    this.marker = null;
    this.map = null;
    this.state = {
      longitude: 0,
      latitude: 0,
      points:[],
      moveId:null,
      editRecord:{},
    }
  }

  componentDidMount() {
    if (this.props.findChildFunc) {
      this.props.findChildFunc(this.getPoint);
    }
    this.onlyShowRoute()


  }

  onlyShowRoute = ()=> {
    const that = this;
    const points = [...this.props.editRecord.locations.data].map((item,index)=>{
      return {...item,id:uuid()}
    });
    console.log('points',points)
    that.setState({
      points:points
    })
    let poi = null;
    if (points.length > 0) {
      poi = new BMap.Point(points[0].longitude, points[0].latitude);
    } else {
      poi = new BMap.Point(115.444906, 30.230739);
    }
    this.map = new this.BMap.Map("showRouteMap", {
      enableMapClick: false,//兴趣点不能点击
    });          // 创建地图实例
    this.map.centerAndZoom(poi, 16);//设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(); //启用鼠标滚动对地图放大缩小
    this.map.addControl( new this.BMap.ScaleControl({anchor: 0}))// 左上角，添加比例尺
    this.map.addControl(new this.BMap.NavigationControl())// 左上角，添加默认缩放平移控件

    let linePoints = [];
    console.log('points', points)
    for (let i = 0; i < points.length; i++) {
      linePoints.push(new BMap.Point(points[i].longitude, points[i].latitude))
      let marker = new this.BMap.Marker(new BMap.Point(points[i].longitude, points[i].latitude)); // 创建点
      console.log('marker',marker)
      marker.addEventListener('click', function () {
        console.log('click')
        that.showInfo(points[i])
      })

      let label = new this.BMap.Label(`第${i+1}个地点`,{offset:new BMap.Size(20,3)});
      marker.setLabel(label);
      if (this.props.cantMovePoint) {
        let markerMenu = new this.BMap.ContextMenu();
        marker.enableDragging();
        markerMenu.addItem(new this.BMap.MenuItem('删除', this.removeMarker.bind(marker)));
        markerMenu.addItem(new this.BMap.MenuItem('修改', this.editMarker.bind(marker)));
        marker.addContextMenu(markerMenu);

        marker.addEventListener("dragstart", function () {
          console.log('dragStart id', points[i].id)
          that.setState({
            moveId : points[i].id
          })
        });
        marker.addEventListener("dragend", function () {
          let p = marker.getPosition();
          console.log('dragend', p)
          that.moveMarker(marker)
        });

      }
      this.map.addOverlay(marker);            //增加点
    }
    this.map.setViewport(linePoints);
    let line = new BMap.Polyline(linePoints);
    this.map.addOverlay(line);
    if (this.props.cantMovePoint) {
      this.operateRoute()

    }


  }
  moveMarker=(marker)=>{
    console.log('marker)', marker)
    this.map.clearOverlays();
    let points=this.state.points
    for (let j = 0; j < points.length; j++) {
      if (points[j].id === this.state.moveId) {
        console.log('找到', marker)

        points[j].latitude = marker.point.lat;
        points[j].longitude = marker.point.lng;
//                map.clearOverlays(line);
        break
      }
    }
    let linePoints = [];
    for (let i = 0; i < points.length; i++) {
      linePoints.push(new BMap.Point(points[i].longitude, points[i].latitude))

      this.createMark(points[i],i)


    }
    let line = new this.BMap.Polyline(linePoints);
    this.map.addOverlay(line);
    // renderWalkLine(points)

  }
  createMark=(point,index)=>{
    let marker = new BMap.Marker(new BMap.Point(point.longitude, point.latitude)); // 创建点
    const that=this;
    let markerMenu = new this.BMap.ContextMenu();
    marker.enableDragging();
    markerMenu.addItem(new this.BMap.MenuItem('删除', this.removeMarker.bind(marker)));
    markerMenu.addItem(new this.BMap.MenuItem('修改', this.editMarker.bind(marker)));
    marker.addContextMenu(markerMenu);
    let label = new this.BMap.Label(`第${index+1}个地点`,{offset:new BMap.Size(20,3)});
    marker.setLabel(label);
    marker.addEventListener('click', function () {
      console.log('click')
      that.showInfo(point)
    })

    marker.addEventListener("dragstart", function () {
      console.log('dragStart id',point.id)
      that.setState({
        moveId : point.id
      })
    });
    marker.addEventListener("dragend", function () {
      let p = marker.getPosition();
      console.log('dragend', p)
      that.moveMarker(marker)
    });

    this.map.addOverlay(marker);            //增加点
  }
  removeMarker=(e,ee,marker)=>{
    console.log('marker',marker)
    let points=this.state.points
    let index = undefined
    for (let i = 0; i < points.length; i++) {
      console.log('points',points[i])
      if (marker.point.lat == points[i].latitude && marker.point.lng == points[i].longitude) {
        console.log('找到')
        index = i;
        break
      }
    }
    console.log('index',index)
    if (index>=0) {
      this.map.clearOverlays();
      points.splice(index, 1);
      this.setState({
        points:points
      })
      let linePoints = [];
      console.log('points2',points)
      for (let j = 0; j < points.length; j++) {
        linePoints.push(new BMap.Point(points[j].longitude, points[j].latitude))
        this.createMark(points[j],j)
      }
      // renderWalkLine(points)
      let line = new this.BMap.Polyline(linePoints);
      this.map.addOverlay(line);
    }

  }
  editMarker=(e,ee,marker)=>{
    let index = undefined
    let points=this.state.points
    console.log('edit marker',marker)
    for (let i = 0; i < points.length; i++) {
      console.log('points',points[i])
      if (marker.point.lat == points[i].latitude && marker.point.lng == points[i].longitude) {
        console.log('找到')
        index = i;
        break
      }
    }
    console.log('points[index]',points[index])
    this.setState({
      marker:marker,
      editModal:true,
      editRecord:points[index]
    })

  }
  handleEditPoint=()=>{
    let points=this.state.points
    let index = undefined
    for (let i = 0; i < points.length; i++) {
      console.log('points',points[i])
      if (this.state.marker.point.lat == points[i].latitude && this.state.marker.point.lng == points[i].longitude) {
        console.log('找到')
        index = i;
        break
      }
    }
    console.log('index',index)
    if (index>=0) {
      this.map.removeOverlay(this.state.marker);
      const formValues = this.editFormRef.props.form.getFieldsValue();
      const replacePoint={longitude:points[index].longitude, latitude:points[index].latitude,meter_count:formValues.meter_count,remark:formValues.remark,id:points[index].id}
      points.splice(index, 1,replacePoint);
      this.setState({
        points:points,
        editModal:false
      })
      // renderWalkLine(points)
      this.createMark(replacePoint,index)
    }
  }
  operateRoute = ()=> {
    let drawingManager = new this.BMapLib.DrawingManager(this.map, {
      isOpen: true, //是否开启绘制模式
      enableDrawingTool: true, //是否显示工具栏
      drawingMode: 'marker',//绘制模式  多边形
      drawingToolOptions: {
        anchor: 1, //位置
        offset: new BMap.Size(5, 5), //偏离值
        drawingModes: [
          'marker',
        ]
      },
    });

    drawingManager.addEventListener('markercomplete', this.overlaycomplete);
    drawingManager.enableCalculate()

  }

  overlaycomplete=(e, marker)=>{
    this.setState({
      marker:marker,
      addModal:true
    })
  }
  handleCancelPoint=()=>{

    this.map.removeOverlay(this.state.marker);

    this.setState({
      marker:null,
      addModal:false
    })
  }
  handleAddPoint=()=>{
    const that=this;
    let points=this.state.points
    let markerMenu = new this.BMap.ContextMenu();
    this.state.marker.enableDragging();
    markerMenu.addItem(new this.BMap.MenuItem('删除', this.removeMarker.bind(this.state.marker)));
    markerMenu.addItem(new this.BMap.MenuItem('修改', this.editMarker.bind(this.state.marker)));
    this.state.marker.addContextMenu(markerMenu);


    const formValues = this.addFormRef.props.form.getFieldsValue();
    if(!formValues.meter_count){
      message.error('水表数量必填')
      return
    }

    let lastPoint = points[points.length - 1]
    console.log('lastPoint',lastPoint)
    if (lastPoint) {
      let line = new BMap.Polyline([{lat: lastPoint.latitude,lng: lastPoint.longitude}, this.state.marker.point]);
      this.map.addOverlay(line);
    }
    const id=uuid()
    const addPoint={longitude:this.state.marker.point.lng, latitude:this.state.marker.point.lat,meter_count:formValues.meter_count,remark:formValues.remark,id:id}
    points.push(addPoint)
    let label = new this.BMap.Label(`第${points.length}个地点`,{offset:new BMap.Size(20,3)});
    this.state.marker.setLabel(label);
    this.state.marker.addEventListener('click', function () {
      console.log('click')
      that.showInfo(addPoint)
    })
    this.state.marker.addEventListener("dragstart", function () {
      console.log('dragStart id',id)
      that.setState({
        moveId :id
      })
    });
    this.state.marker.addEventListener("dragend", function () {
      that.moveMarker(that.state.marker)
    });
    this.setState({
      points:points,
      addModal:false
    })
  }
  showInfo = (point)=> {
    let dot = new this.BMap.Point(point.longitude, point.latitude);
    let content = `<div class="table-content">
<table class="custom-table">
                    <tbody>
                    <tr><td >水表数量 : </td><td>${point.meter_count}</td></tr>
                    <tr><td>备注 : </td><td class="table-header-address">${point.remark}</td></tr>
                    </tbody>
                    </table>
                    </div>
`;
    let infoWindow = new this.BMap.InfoWindow(content);  // 创建信息窗口对象
    let info = this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  }
  getPoint = ()=> {
    return this.state.points
  }


  render() {
    const that = this;
    return (
      <div style={{position: 'relative'}}>
        <div id="showRouteMap" className="showRouteMap"
             style={{height: this.props.cantMovePoint ? "calc(100vh - 156px)" : "calc(100vh - 103px)"}}></div>


        <Modal
          title={`添加抄表点`}
          visible={this.state.addModal}
          onCancel={this.handleCancelPoint}
          onOk={this.handleAddPoint}
        >
          <AddPointForm    wrappedComponentRef={(inst) => this.addFormRef = inst} />
        </Modal>
        <Modal
          key={ Date.parse(new Date()) + 2}
          destroyOnClose={true}
          title={`修改抄表点`}
          visible={this.state.editModal}
          onCancel={()=>{this.setState({editModal:false})}}
          onOk={this.handleEditPoint}
        >
          <AddPointForm editRecord={this.state.editRecord}   wrappedComponentRef={(inst) => this.editFormRef = inst} />
        </Modal>
      </div>

    );
  }
}
