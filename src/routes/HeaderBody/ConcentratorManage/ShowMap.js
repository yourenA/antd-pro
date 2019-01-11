import React, {PureComponent} from 'react';
import {
  InputNumber,
  Form,
  Button
} from 'antd';
const FormItem = Form.Item;

export default class MapData extends PureComponent {

  constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.point = null;
    this.marker = null;
    this.map = null;
    this.state = {
      longitude: 0,
      latitude: 0,
    }
  }

  componentDidMount() {
    if (this.props.findChildFunc) {
      this.props.findChildFunc(this.getPoint);
    }

    this.map = new this.BMap.Map("concentratorMap");          // 创建地图实例
    const company_code = sessionStorage.getItem('company_code');
    var center = (this.props.editRecord && this.props.editRecord.latitude) ? [this.props.editRecord.longitude, this.props.editRecord.latitude] : company_code === 'mys' ? [114.288209, 27.637665] : [113.131695, 27.827433]
    this.setState({
      longitude: center[0],
      latitude: center[1],
    })
    this.map.centerAndZoom(new BMap.Point(center[0], center[1]), 10);
    this.map.enableScrollWheelZoom();
    var point = new BMap.Point(center[0], center[1]);
    this.map.centerAndZoom(point, 15);
    this.marker = new BMap.Marker(point);// 创建标注
    this.map.addOverlay(this.marker);             // 将标注添加到地图中
    if (!this.props.cantMovePoint) {
      this.marker.enableDragging()
    }
    const that = this;
    that.point = point;
    this.marker.addEventListener("dragend", function () {
      var p = that.marker.getPosition();
      console.log(("marker的位置是" + p.lng + "," + p.lat))
      that.setState({
        longitude: p.lng,
        latitude: p.lat,
      })
      that.point = p
    });
  }

  clickReset = ()=> {
    const company_code = sessionStorage.getItem('company_code');
    var center = (this.props.editRecord && this.props.editRecord.latitude) ? [this.props.editRecord.longitude, this.props.editRecord.latitude] : company_code === 'mys' ? [114.288209, 27.637665] : [113.131695, 27.827433]
    var point = new BMap.Point(center[0], center[1]);

    this.setState({

      longitude: center[0],
      latitude: center[1],
    })
    this.map.setCenter(point)
    this.map.clearOverlays();
    this.marker = new BMap.Marker(point);// 创建标注
    this.map.addOverlay(this.marker);             // 将标注添加到地图中
    const that = this;
    that.point = point;
    if (!this.props.cantMovePoint) {
      this.marker.enableDragging()
    }
    this.marker.addEventListener("dragend", function () {
      var p = that.marker.getPosition();
      console.log(("marker的位置是" + p.lng + "," + p.lat))
      that.setState({
        longitude: p.lng,
        latitude: p.lat,
      })
      that.point = p
    });
  }
  getPoint = ()=> {
    return this.point
  }

  changeTude = (value, type)=> {
    this.setState({
      [type]: value
    }, function () {
      var point = new BMap.Point(this.state.longitude, this.state.latitude);
      this.map.setCenter(point)
      this.map.clearOverlays();
      this.marker = new BMap.Marker(point);// 创建标注
      this.map.addOverlay(this.marker);             // 将标注添加到地图中
      if (!this.props.cantMovePoint) {
        this.marker.enableDragging()
      }
      const that = this;
      that.point = point;
      this.marker.addEventListener("dragend", function () {
        var p = that.marker.getPosition();
        console.log(("marker的位置是" + p.lng + "," + p.lat))
        that.setState({
          longitude: p.lng,
          latitude: p.lat,
        })
        that.point = p
      });

    })
  }

  render() {
    const that = this;
    return (
      <div style={{position: 'relative'}}>
        <div id="concentratorMap" className="concentratorMap"></div>
        <div className="map-tip">
          {
            !this.props.cantMovePoint &&
            <Form layout="inline">
              <FormItem
                label="经度"
              >
                <InputNumber min={0} max={180} value={this.state.longitude} onChange={(value)=> {
                  that.changeTude(value, 'longitude')
                }}
                />
              </FormItem>
              <FormItem
                label="纬度"
              >
                <InputNumber min={0} max={90} value={this.state.latitude} onChange={(value)=> {
                  that.changeTude(value, 'latitude')
                }}
                />
              </FormItem>
              <FormItem
              >
                <Button onClick={this.clickReset} type="primary">重置</Button>
              </FormItem>
            </Form>
          }
        </div>
      </div>

    );
  }
}
