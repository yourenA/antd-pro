import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import './DistributionGraph.less'

@connect(state => ({
}))
@Form.create()
export default class EndpointsList extends PureComponent {

   constructor(props) {
    super(props);
    // this.BMap = window.BMap;
    this.state = {
    }
  }

  /*componentDidMount() {
    console.log(this.BMap)
    console.log(window.BMap)
    var map = new this.BMap.Map("hot-map");          // 创建地图实例
    var point = new this.BMap.Point(110.418261, 39.921984);
    map.centerAndZoom(point, 5);             // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); // 允许滚轮缩放
    let points =[];
    for (let i = 0; i < 100; i++) {
      points.push({
        "lng": Math.random() * 2 + 115,
        "lat": Math.random() * 1 + 39,
        "count": parseInt(Math.random() * (60 + 1), 10)
      })
    }
    const heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":50});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data:points,max:60});
    //是否显示热力图
    heatmapOverlay.show();
  }*/



  render() {
    return (
      <PageHeaderLayout title={{label: '分布图'}} breadcrumb={[{name: '应用'}, {name: '分布图'}]}>
        <Card bordered={false}>
          <div id="hot-map"></div>
        </Card>
      </PageHeaderLayout>
    );
  }
  }
