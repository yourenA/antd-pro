import React, {PureComponent} from 'react';
import {
  Card,
  Form,
} from 'antd';

export default class MapData extends PureComponent {

   constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.state = {
    }
  }

  componentDidMount() {
    var map = new this.BMap.Map("mapData");          // 创建地图实例
    map.centerAndZoom(new BMap.Point(112.159141, 26.269442), 5);
    map.enableScrollWheelZoom();

    // function showInfo(e){
    //   console.log(e.point.lng + ", " + e.point.lat);
    // }
    // map.addEventListener("click", showInfo);

    var bdary = new BMap.Boundary();
    bdary.get("衡阳市", function(rs){       //获取行政区域
      map.clearOverlays();        //清除地图覆盖物
      var count = rs.boundaries.length; //行政区域的点有多少个
      if (count === 0) {
        alert('未能获取当前输入行政区域');
        return ;
      }
      var pointArray = [];
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000",fillColor:''}); //建立多边形覆盖物
        map.addOverlay(ply);  //添加覆盖物
        pointArray = pointArray.concat(ply.getPath());
      }
      map.setViewport(pointArray);    //调整视野
      //addlabel();
    });


    const points = [];

    function addProducts(quantity) {
      const startId = points.length;
      for (var i = 0; i < quantity; i++) {
        const id = startId + i;
        points.push({
          id:id,
          lng: 112.159141 + parseFloat(Math.random().toFixed(2)),
          lat: 26.269442 + parseFloat(Math.random().toFixed(2)),
          name: "集中器" + id,
          address: '衡阳市' + id + '号楼',
          info: '这是集中器的相关信息',
          detail: {
            SupplierPartNumber1: "supplier_part_number_1" + id,
            Supplier1: "supplier_1" + id,
            ManufacturerPartNumber: "manufacturer_part_number" + id,
            Manufacturer: "manufacturer" + id,
            Category: "category",
            RoHS: "rohs",
            Description: "description",
            Stock1: "stock_1",
            pricing_1: "Pricing 1",
            packaging: "Packaging",
            part_status: "Part Status",
            mounting_type: "Mounting Type",
            library_ref: "Library Ref",
            componentLink1url: "ComponentLink1URL",
            ComponentLink1Description: "componentLink1description"
          },
          img: 'img1.jpg'
        });
      }
    }

    var MAX = 50;
    var markers = [];
    var pt = null;
    addProducts(MAX);
    for (let i=0; i < MAX; i++) {
      pt = new this.BMap.Point(points[i].lng, points[i].lat);
      var marker=new this.BMap.Marker(pt);
      marker.addEventListener("click", function (e) {
        showInfo(e, points[i])
      });
      markers.push(marker);
    }

    function showInfo(e, point) {
      var parsePoint = point;
      var dot = new BMap.Point(point.lng,point.lat);
      var content = '<div class="infowin"><p><b>' + parsePoint.name + '</b></p><p>' + parsePoint.address + '</p>' +
        '<p><p class="btn-detail">' + parsePoint.info + '</p></p>'
      var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
      map.openInfoWindow(infoWindow, dot); //开启信息窗口
    }
//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
    var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
  }



  render() {
    return (
          <div id="mapData" className="mapData"></div>
    );
  }
  }
