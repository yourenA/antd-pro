import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm, Modal, Row, Col, Button, Popover,Icon} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import imgSrc from './images/area.png'
import find from 'lodash/find'
import './index.less'
import uuid from 'uuid/v4'
const {Content} = Layout;
@connect(state => ({
  dma: state.dma,
  dma_data: state.dma_data,
}))
class Vendor extends PureComponent {
  constructor(props) {
    super(props);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.map = null;
    this.BMap = window.BMap;
    this.dmaArea=[]
    this.state = {
      showAddBtn: find(this.permissions, {name: 'manufacturer_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'manufacturer_delete'}),
      initRange: [moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      tableY: 0,
      imgW: 0,
      imgH: 0,
      imgCW: 0,
      imgCH: 0,
      manufacturer_id: '',
      page: 1,
      started_at: '',
      ended_at: '',
      editModal: false,
      addModal: false,
      zoom:'60%',
      canMove:false,
      dmaArea:[],
      currentId:''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: 'dma_data/reset',
    });
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
      callback: ()=> {
        const dma=that.props.dma;
        that.parseDMAArea(dma.allData);
        that.setState({
          dmaArea:this.dmaArea
        })
        that.changeTableY();
        // this.renderMap()
      }
    });
    window.addEventListener('resize', this.resiz)
  }

  parseDMAArea=(data)=>{
    const that=this;
    this.dmaArea.push(...data)
    data.map(function (item,idnex) {
      if( item.children && item.children.length>0){
        return that.parseDMAArea(item.children)
      }
      return item
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resiz)
  }

  resiz = ()=> {
    this.changeTableY()
  }
  changeTableY = ()=> {
    this.setState({
      tableY: document.body.offsetHeight - document.querySelector('.map-container').offsetTop - (68 + 54 + 17)
    }, function () {
      this.changeScroll()
    })
  }
  changeScroll = ()=> {
    const imgW = document.querySelector('.DMA-img').offsetWidth
    const imgH = document.querySelector('.DMA-img').offsetHeight
    const imgCW = document.querySelector('.DMA-img-container').clientWidth
    const imgCH = document.querySelector('.DMA-img-container').clientHeight
    this.setState({
      imgW, imgH, imgCW, imgCH
    })
  }

/*  /!*renderMap() {
    var map = new this.BMap.Map("DMA-map");          // 创建地图实例
    this.map = map;
    map.centerAndZoom(new BMap.Point(112.69113, 26.77524), 11);
    map.enableScrollWheelZoom();
    const data = [[{"lng": 112.585346, "lat": 26.88485}, {"lng": 112.621278, "lat": 26.887685}, {
      "lng": 112.630477,
      "lat": 26.871186
    }, {"lng": 112.668709, "lat": 26.8601}, {"lng": 112.668134, "lat": 26.823224}, {
      "lng": 112.664109,
      "lat": 26.817291
    }, {"lng": 112.64485, "lat": 26.818323}, {"lng": 112.618978, "lat": 26.820128}, {
      "lng": 112.606043,
      "lat": 26.811101
    }, {"lng": 112.591382, "lat": 26.827092}, {"lng": 112.582184, "lat": 26.858553}, {
      "lng": 112.580747,
      "lat": 26.876085
    }],
      [{"lng": 112.630477, "lat": 26.888458}, {"lng": 112.705503, "lat": 26.89284}, {
        "lng": 112.714414,
        "lat": 26.871702
      }, {"lng": 112.71269, "lat": 26.846434}, {"lng": 112.70694, "lat": 26.832766}, {
        "lng": 112.690268,
        "lat": 26.830961
      }, {"lng": 112.679919, "lat": 26.831993}, {"lng": 112.678482, "lat": 26.837666}, {
        "lng": 112.681644,
        "lat": 26.85778
      }, {"lng": 112.679345, "lat": 26.864483}, {"lng": 112.664397, "lat": 26.87196}, {
        "lng": 112.648012,
        "lat": 26.875054
      }, {"lng": 112.634501, "lat": 26.881241}],
      [{"lng": 112.674745, "lat": 26.95211}, {"lng": 112.637663, "lat": 26.919129}, {
        "lng": 112.626165,
        "lat": 26.908047
      }, {"lng": 112.629902, "lat": 26.892325}, {"lng": 112.705791, "lat": 26.896191}, {
        "lng": 112.706078,
        "lat": 26.925056
      }, {"lng": 112.70694, "lat": 26.964475}, {"lng": 112.673883, "lat": 26.964732}],
      [{"lng": 112.664684, "lat": 26.96499}, {"lng": 112.649161, "lat": 26.936651}, {
        "lng": 112.616966,
        "lat": 26.91449
      }, {"lng": 112.620991, "lat": 26.893356}, {"lng": 112.578447, "lat": 26.890778}, {
        "lng": 112.572698,
        "lat": 26.963444
      }],
      [{"lng": 112.716427, "lat": 26.96396}, {"lng": 112.787716, "lat": 26.965505}, {
        "lng": 112.840608,
        "lat": 26.993837
      }, {"lng": 112.83141, "lat": 26.906759}, {"lng": 112.826235, "lat": 26.862936}, {
        "lng": 112.739998,
        "lat": 26.829929
      }, {"lng": 112.718151, "lat": 26.824255}],
      [{"lng": 112.502558, "lat": 26.972202}, {"lng": 112.560624, "lat": 26.963444}, {
        "lng": 112.581321,
        "lat": 26.808779
      }, {"lng": 112.533603, "lat": 26.764918}, {"lng": 112.497959, "lat": 26.732915}, {
        "lng": 112.410572,
        "lat": 26.864999
      }, {"lng": 112.428394, "lat": 26.98405}],
      [{"lng": 112.593395, "lat": 26.803104}, {"lng": 112.706078, "lat": 26.8062}, {
        "lng": 112.83141,
        "lat": 26.852623
      }, {"lng": 112.941793, "lat": 26.605845}, {"lng": 112.908448, "lat": 26.540704}, {
        "lng": 112.561199,
        "lat": 26.498291
      }, {"lng": 112.583046, "lat": 26.623416}, {"lng": 112.5543, "lat": 26.62755}, {
        "lng": 112.546252,
        "lat": 26.755628
      }]];

    const that = this;
    for (let i = 0; i < data.length; i++) {
      let points = [];
      for (let j = 0; j < data[i].length; j++) {
        points.push(new this.BMap.Point(data[i][j].lng, data[i][j].lat))
      }
      let polygon = new this.BMap.Polygon(points, {
        strokeColor: "blue",
        strokeWeight: 1,
        strokeOpacity: 0.5,
        fillOpacity: 0.4
      });  //创建多边形
      let center = polygon.getBounds().getCenter();
      var opts = {
        position: center,    // 指定文本标注所在的地理位置
      }
      var label = new BMap.Label("1234", opts);  // 创建文本标注对象
      label.setStyle({
        color: "red",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑"
      });
      map.addOverlay(label);
      map.addOverlay(polygon);   //增加多边形
      polygon.addEventListener("click", function (e) {
        that.showInfo(e)
      });
    }
  }*!/
  showInfo = (e)=> {
    var parsePoint = e.point;
    var dot = new BMap.Point(parsePoint.lng, parsePoint.lat);
    var content = '<div><p>这里是DMA信息</p>' +
      '<table><tr><td>供水量</td><td>10000T</td></tr><tr><td>出水量</td><td>1000T</td></tr><tr><td>产销差</td><td>9000</td></tr><tr><td>产销差率</td><td>90%</td></tr></table></div>'
    var infoWindow = new this.BMap.InfoWindow(content);  // 创建信息窗口对象
    this.map.openInfoWindow(infoWindow, dot); //开启信息窗口
  }*/
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dma_data/fetchAll',
      payload: {
        ...values,
      },
    });

    this.setState({
      started_at: values.started_at,
      ended_at: values.ended_at,
      page: values.page
    })
  }
  operateDMAImg=(action)=>{
    let zoom=parseInt(this.state.zoom)
    if((zoom<=40&&action===-1)){
      return false
    }
    if((zoom>=150&&action===1)){
      return false
    }
    this.setState({
      zoom:parseInt(this.state.zoom)+(action===1?+10:-10)+'%'
    },function () {
      let obj=document.getElementById('DMA-img');
      obj.style.zoom=this.state.zoom;
      this.resiz()
    })

  }
  getPopover=(name)=>{
    const item=find(this.state.dmaArea,{name});
    if(item){
      return (
        <div>
          <Row className="item">
            <Col span={9} style={{textAlign:'right'}}>创建时间 :</Col>
            <Col span={15} > {item.created_at}</Col>
          </Row >
          <Row className="item">
            <Col span={9} style={{textAlign:'right'}}>备注 :</Col>
            <Col span={15}> {item.remark}</Col>
          </Row >

        </div>
      )
    }else{
      return (
        <div>
          没有数据
        </div>
        )
    }
  }
  clickNode=(name)=>{
    const item=find(this.state.dmaArea,{name});
    if(item){
      console.log(item.id);
      this.setState({
        currentId:item.id
      })
      this.handleSearch({
        return: 'all',
        area_id:item.id,
        started_at:this.state.started_at?this.state.started_at:moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at?this.state.ended_at:moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      })

    }else{
      console.log('没有数据')
    }
  }
  setStart=(dateString)=>{
    console.log(dateString)
    if(this.state.currentId){
      this.handleSearch({
        return: 'all',
        area_id:this.state.currentId,
        started_at:dateString,
        ended_at: this.state.ended_at,
      })
    }else{
      this.setState({
        started_at:dateString
      })
    }
  }
  setEnd=(dateString)=>{
    console.log(dateString)
    if(this.state.currentId){
      this.handleSearch({
        return: 'all',
        area_id:this.state.currentId,
        started_at:this.state.started_at,
        ended_at: dateString,
      })
    }else{
      this.setState({
        ended_at:dateString
      })
    }
  }
  parseDMAData=(data)=>{
    const that=this;
    data.map(function (item,idnex) {
      item.uuid=uuid()
      if( item.children && item.children.length>0){
        return that.parseDMAData(item.children)
      }else{
        item.children=null
      }
      return item
    })
  }
  render() {
    const {dma_data:{allData}} = this.props;
    if(allData.length>0){
      this.parseDMAData(allData[0].flow_meters)
    }
    const zoom=parseInt(this.state.zoom)/100;
    const iconWidth=64;
    const rectWidth=147;
    const rectHeight=57;
    const columns = [
      {title: '名称', dataIndex: 'name', key: 'name'},
      {title: '读值', dataIndex: 'value', key: 'value'},
      {title: '产销差', dataIndex: 'attrition_value', key: 'attrition_value'},
      {title: '产销差率', dataIndex: 'attrition_rate', key: 'attrition_rate'},
    ];
    return (
      <Layout className="layout">
        <Content >
          <div className="content">
            <PageHeaderLayout title="DMA展示 " breadcrumb={[{name: '运行管理'}, {name: 'DMA分区管理'}, {name: 'DMA展示'}]}>
              <Card bordered={false} style={{margin: '-16px -16px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch handleSearch={this.handleSearch}
                                   setStart={this.setStart}
                                   setEnd={this.setEnd}
                                   handleFormReset={this.handleFormReset} initRange={this.state.initRange}
                                   clickAdd={()=>this.setState({addModal: true})}/>
                  </div>
                </div>
                <div  id="DMA-map" className="map-container" style={{height: this.state.tableY + 'px'}}>
                  <Row gutter={16}>
                    <Col xs={14} sm={14} md={14} lg={14} xl={16}>
                      <div className="DMA-img-container" style={{
                        height: this.state.tableY + 'px',
                        overflowY: this.state.imgH > this.state.imgCH ? 'scroll' : 'hidden',
                        overflowX: this.state.imgW > this.state.imgCW ? 'scroll' : 'hidden'
                      }}>
                        <div className="DMA-img-wrap"

                             style={{width: this.state.imgW + 'px', height: this.state.imgH + 'px'}}>
                          <img  id="DMA-img" src={imgSrc} alt="" className="DMA-img" style={{minHeight: this.state.tableY + 'px',zoom:this.state.zoom}}/>
                          <Popover content={this.getPopover('石鼓区')} title="石鼓区">
                            <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('石鼓区')} style={{width:rectWidth*zoom+'px',height:rectHeight*zoom+'px',left:647*zoom+'px',top:582*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('中心区')} title="中心区">
                            <div className="DMA-rect DMA-rect-node1"  onClick={()=>this.clickNode('中心区')}  style={{width:rectWidth*zoom+'px',height:rectHeight*zoom+'px',left:606*zoom+'px',top:769*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('华新区')} title="华新区">
                            <div className="DMA-rect DMA-rect-node1"  onClick={()=>this.clickNode('华新区')}  style={{width:rectWidth*zoom+'px',height:rectHeight*zoom+'px',left:375*zoom+'px',top:880*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('雁峰区')} title="雁峰区">
                            <div className="DMA-rect DMA-rect-node1"  onClick={()=>this.clickNode('雁峰区')}  style={{width:rectWidth*zoom+'px',height:rectHeight*zoom+'px',left:715*zoom+'px',top:1096*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('珠晖区')} title="珠晖区">
                            <div className="DMA-rect DMA-rect-node1"  onClick={()=>this.clickNode('珠晖区')}  style={{width:rectWidth*zoom+'px',height:rectHeight*zoom+'px',left:911*zoom+'px',top:896*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('1区')} title="1区">
                            <div className="DMA-node DMA-node1"  onClick={()=>this.clickNode('1区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:627*zoom+'px',top:512*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('2区')} title="2区">
                            <div className="DMA-node DMA-node2"  onClick={()=>this.clickNode('2区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:783*zoom+'px',top:610*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('3区')} title="3区">
                            <div className="DMA-node DMA-node3"  onClick={()=>this.clickNode('3区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:498*zoom+'px',top:685*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('4区')} title="4区">
                            <div className="DMA-node DMA-node4"  onClick={()=>this.clickNode('4区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:619*zoom+'px',top:720*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('5区')} title="5区">
                            <div className="DMA-node DMA-node5"  onClick={()=>this.clickNode('5区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:419*zoom+'px',top:820*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('6区')} title="6区">
                            <div className="DMA-node DMA-node6"  onClick={()=>this.clickNode('6区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:638*zoom+'px',top:816*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('7区')} title="7区">
                            <div className="DMA-node DMA-node7"  onClick={()=>this.clickNode('7区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:582*zoom+'px',top:909*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('8区')} title="8区">
                            <div className="DMA-node DMA-node8"  onClick={()=>this.clickNode('8区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:659*zoom+'px',top:1020*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('9区')} title="9区">
                            <div className="DMA-node DMA-node9"  onClick={()=>this.clickNode('9区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:870*zoom+'px',top:1076*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('10区')} title="10区">
                            <div className="DMA-node DMA-node10"  onClick={()=>this.clickNode('10区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:690*zoom+'px',top:1212*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('11区')} title="11区">
                            <div className="DMA-node DMA-node11"  onClick={()=>this.clickNode('11区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:772*zoom+'px',top:758*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('12区')} title="12区">
                            <div className="DMA-node DMA-node12"  onClick={()=>this.clickNode('12区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:840*zoom+'px',top:900*zoom+'px'}}></div>
                          </Popover>
                          <Popover content={this.getPopover('13区')} title="13区">
                            <div className="DMA-node DMA-node13"  onClick={()=>this.clickNode('13区')}  style={{width:iconWidth*zoom+'px',height:iconWidth*zoom+'px',left:1074*zoom+'px',top:852*zoom+'px'}}></div>
                          </Popover>

                        </div>
                      </div>
                      <div className="DMA-img-operation DMA-img-enlarge" onClick={()=>this.operateDMAImg(1)}><Icon type="plus" style={{fontSize:'25px'}}/></div>
                      <div className="DMA-img-operation DMA-img-reduce" onClick={()=>this.operateDMAImg(-1)}><Icon type="minus" style={{fontSize:'25px'}}/></div>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10} xl={8}  style={{height: this.state.tableY + 'px',overflow:'auto'}}>
                      <div className="DMA-info">
                        <div className="DMADetail">
                          <h2 style={{marginBottom:'10px'}}>基本信息</h2>
                          <table>
                            <thead>
                            <tr>
                              <td>名称</td>
                              <td>值</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                              <td>分区名称</td>
                              <td>{allData.length>0?allData[0].area_name:null}</td>
                            </tr>
                            <tr>
                              <td>户表读数总值</td>
                              <td>{allData.length>0?allData[0].total_meter_value:null}</td>
                            </tr>
                            <tr>
                              <td>流量计读数总值</td>
                              <td>{allData.length>0?allData[0].total_flow_meter_value:null}</td>
                            </tr>
                            <tr>
                              <td>其他（大客户水表）读数</td>
                              <td>{allData.length>0?allData[0].other_value:null}</td>
                            </tr>
                            <tr>
                              <td>产销差</td>
                              <td>{allData.length>0?allData[0].attrition_value:null}</td>
                            </tr>
                            <tr>
                              <td>产销差率</td>
                              <td>{allData.length>0?allData[0].attrition_rate:null}</td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                        <h2 style={{marginBottom:'10px',marginTop:'10px'}}>下属流量计信息</h2>
                          <Table
                            className='meter-table'
                            rowKey={record => record.uuid}
                            dataSource={allData.length>0?allData[0].flow_meters:[]}
                            columns={columns}
                            pagination={false}
                            size="small"
                          />
                      </div>

                    </Col>
                  </Row>
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
