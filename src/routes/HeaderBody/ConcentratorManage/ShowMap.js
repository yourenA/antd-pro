
import React, {PureComponent} from 'react';
import {
  Card,
  Form,
} from 'antd';

export default class MapData extends PureComponent {

   constructor(props) {
    super(props);
    this.BMap = window.BMap;
     this.point=null;
    this.state = {
    }
  }

  componentDidMount() {
    this.props.findChildFunc(this.getPoint);
    var map = new this.BMap.Map("concentratorMap");          // 创建地图实例
    map.centerAndZoom(new BMap.Point(113.131695, 27.827433), 5);
    map.enableScrollWheelZoom();
    var point = new BMap.Point(113.131695, 27.827433);
    map.centerAndZoom(point,12);
    var geoc = new BMap.Geocoder();
    var marker = new BMap.Marker(point);// 创建标注
    map.addOverlay(marker);             // 将标注添加到地图中
    marker.enableDragging()
    const that=this;
    that.point=point;
    // var size = new BMap.Size(10, 20);
    // map.addControl(new this.BMap.CityListControl({
    //   anchor: BMAP_ANCHOR_TOP_LEFT,
    //   offset: size,
    //   // 切换城市之间事件
    //   // onChangeBefore: function(){
    //   //    alert('before');
    //   // },
    //   // 切换城市之后事件
    //   onChangeAfter:function(data){
    //     console.log(data)
    //   }
    // }));
    marker.addEventListener("dragend",function () {
      var p = marker.getPosition();
      console.log(("marker的位置是" + p.lng + "," + p.lat))
      that.point=p
    });
    // map.addEventListener("click", function(e){
    //   var pt = e.point;
    //   geoc.getLocation(pt, function(rs){
    //     var addComp = rs.addressComponents;
    //     alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
    //   });
    // });
  }
  getPoint=()=>{
    return this.point
  }


  render() {
    return (
          <div id="concentratorMap" className="concentratorMap"></div>
    );
  }
}
