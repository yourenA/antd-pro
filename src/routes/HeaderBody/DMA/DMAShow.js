import React, {PureComponent} from 'react';
import {Pagination, Table, Card, Layout, message, Popconfirm, Modal, Row, Col, Button, Popover, Icon,Progress} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './Search'
import {connect} from 'dva';
import moment from 'moment'
import imgSrc from './images/area.png'
import find from 'lodash/find'
import './index.less'
import {getPreMonth} from './../../../utils/utils'
import uuid from 'uuid/v4'
import {ContextMenu, Item, Separator, Submenu, ContextMenuProvider} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
const {Content} = Layout;
// create your menu first

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
    this.dmaArea = [];
    this.state = {
      showAddBtn: find(this.permissions, {name: 'manufacturer_add_and_edit'}),
      showdelBtn: find(this.permissions, {name: 'manufacturer_delete'}),
      initRange: new Date().getDate()===1?getPreMonth()
        :[moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + '01', 'YYYY-MM-DD'), moment(new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + (parseInt(new Date().getDate()) - 1), 'YYYY-MM-DD')],
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
      zoom: '80%',
      canMove: false,
      dmaArea: [],
      currentId: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'dma_data/reset',
    });
    dispatch({
      type: 'dma/fetchAll',
      payload: {
        return: 'all'
      },
      callback: ()=> {
        const dma = that.props.dma;
        that.parseDMAArea(dma.allData);
        that.setState({
          dmaArea: this.dmaArea
        })
        that.changeTableY();
        this.clickNode('珠晖区')
      }
    });
    window.addEventListener('resize', this.resiz)
  }

  parseDMAArea = (data)=> {
    const that = this;
    this.dmaArea.push(...data)
    data.map(function (item, idnex) {
      if (item.children && item.children.length > 0) {
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
  operateDMAImg = (action)=> {
    let zoom = parseInt(this.state.zoom)
    if ((zoom <= 40 && action === -1)) {
      return false
    }
    if ((zoom >= 150 && action === 1)) {
      return false
    }
    this.setState({
      zoom: parseInt(this.state.zoom) + (action === 1 ? +10 : -10) + '%'
    }, function () {
      let obj = document.getElementById('DMA-img');
      // obj.style.zoom = this.state.zoom;
      obj.style.transform = "scale("+parseInt(this.state.zoom)/100+")";
      this.resiz()
    })

  }
  onClick = ({event, ref, data, dataFromProvider}) => {
    this.operateDMAImg(data)
  }
  MyAwesomeMenu = () => (
    <ContextMenu id='menu_id'>
      <Item data={-1} onClick={this.onClick}>缩小</Item>
      <Item data={1} onClick={this.onClick}>放大</Item>
    </ContextMenu>
  )
  getPopover = (name)=> {
    const item = find(this.state.dmaArea, {name});
    if (item) {
      return (
        <div>
          <table className="custom-table">
            {/*<thead>
            <tr>
              <td>名称</td>
              <td>值</td>
            </tr>
            </thead>*/}
            <tbody>
            <tr>
              <td>分区名称</td>
              <td>{item.name}</td>
            </tr>
            <tr>
              <td>创建时间</td>
              <td>{item.created_at}</td>
            </tr>
            <tr>
              <td>备注</td>
              <td>{item.remark}</td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div>
          没有数据
        </div>
      )
    }
  }
  clickNode = (name)=> {
    const item = find(this.state.dmaArea, {name});
    if (item) {
      console.log(item.id);
      this.setState({
        currentId: item.id
      })
      this.handleSearch({
        return: 'all',
        area_id: item.id,
        started_at: this.state.started_at ? this.state.started_at : moment(this.state.initRange[0]).format('YYYY-MM-DD'),
        ended_at: this.state.ended_at ? this.state.ended_at : moment(this.state.initRange[1]).format('YYYY-MM-DD'),
      })

    } else {
      console.log('没有数据')
    }
  }
  setStart = (dateString)=> {
    console.log(dateString)
    if (this.state.currentId) {
      this.handleSearch({
        return: 'all',
        area_id: this.state.currentId,
        started_at: dateString,
        ended_at: this.state.ended_at,
      })
    } else {
      this.setState({
        started_at: dateString
      })
    }
  }
  setEnd = (dateString)=> {
    console.log(dateString)
    if (this.state.currentId) {
      this.handleSearch({
        return: 'all',
        area_id: this.state.currentId,
        started_at: this.state.started_at,
        ended_at: dateString,
      })
    } else {
      this.setState({
        ended_at: dateString
      })
    }
  }
  parseDMAData = (data)=> {
    const that = this;
    data.map(function (item, idnex) {
      item.uuid = uuid()
      if (item.children && item.children.length > 0) {
        return that.parseDMAData(item.children)
      } else {
        item.children = null
      }
      return item
    })
  }

  render() {
    const {dma_data:{allData}} = this.props;
    if (allData.length > 0) {
      this.parseDMAData(allData[0].flow_meters)
    }
    const zoom = parseInt(this.state.zoom) / 100;
    const iconWidth = 64;
    const rectWidth = 147;
    const rectHeight = 57;
    const columns = [
      {title: '流量计站点', dataIndex: 'site_name', key: 'site_name',
        // render: (val, record, index) => (
        //   <span style={{color:record.is_forward===-1?'red':''}}>{val}</span>
        // )
      },
      {title: '下属流量计读值', dataIndex: 'value', key: 'value'},
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
                <div id="DMA-map" className="map-container" style={{height: this.state.tableY + 'px'}}>
                  <Row gutter={16}>
                    <Col xs={14} sm={14} md={14} lg={14} xl={16}>
                      <ContextMenuProvider id="menu_id">
                        <div className="DMA-img-container" style={{
                          height: this.state.tableY + 'px',
                          overflowY: this.state.imgH > this.state.imgCH ? 'scroll' : 'hidden',
                          overflowX: this.state.imgW > this.state.imgCW ? 'scroll' : 'hidden'
                        }}>
                          <div className="DMA-img-wrap"

                               style={{width: this.state.imgW + 'px', height: this.state.imgH + 'px'}}>
                            <img id="DMA-img" src={imgSrc} alt="" className="DMA-img"
                                 style={{minHeight: this.state.tableY + 'px',transform:`scale(${zoom})`}}/>
                            <Popover content={this.getPopover('石鼓区')} title="石鼓区">
                              <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('石鼓区')} style={{
                                width: rectWidth * zoom + 'px',
                                height: rectHeight * zoom + 'px',
                                left: 647 * zoom + 'px',
                                top: 582 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('中心区')} title="中心区">
                              <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('中心区')} style={{
                                width: rectWidth * zoom + 'px',
                                height: rectHeight * zoom + 'px',
                                left: 595 * zoom + 'px',
                                top: 845 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('华新区')} title="华新区">
                              <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('华新区')} style={{
                                width: rectWidth * zoom + 'px',
                                height: rectHeight * zoom + 'px',
                                left: 375 * zoom + 'px',
                                top: 880 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('雁峰区')} title="雁峰区">
                              <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('雁峰区')} style={{
                                width: rectWidth * zoom + 'px',
                                height: rectHeight * zoom + 'px',
                                left: 715 * zoom + 'px',
                                top: 1096 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('珠晖区')} title="珠晖区">
                              <div className="DMA-rect DMA-rect-node1" onClick={()=>this.clickNode('珠晖区')} style={{
                                width: rectWidth * zoom + 'px',
                                height: rectHeight * zoom + 'px',
                                left: 911 * zoom + 'px',
                                top: 896 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('1区')} title="1区">
                              <div className="DMA-node DMA-node1" onClick={()=>this.clickNode('1区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 627 * zoom + 'px',
                                top: 512 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('2区')} title="2区">
                              <div className="DMA-node DMA-node2" onClick={()=>this.clickNode('2区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 783 * zoom + 'px',
                                top: 610 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('3区')} title="3区">
                              <div className="DMA-node DMA-node3" onClick={()=>this.clickNode('3区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 498 * zoom + 'px',
                                top: 685 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('4区')} title="4区">
                              <div className="DMA-node DMA-node4" onClick={()=>this.clickNode('4区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 619 * zoom + 'px',
                                top: 720 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('5区')} title="5区">
                              <div className="DMA-node DMA-node5" onClick={()=>this.clickNode('5区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 419 * zoom + 'px',
                                top: 820 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('6区')} title="6区">
                              <div className="DMA-node DMA-node6" onClick={()=>this.clickNode('6区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 638 * zoom + 'px',
                                top: 805 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('7区')} title="7区">
                              <div className="DMA-node DMA-node7" onClick={()=>this.clickNode('7区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 582 * zoom + 'px',
                                top: 909 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('8区')} title="8区">
                              <div className="DMA-node DMA-node8" onClick={()=>this.clickNode('8区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 659 * zoom + 'px',
                                top: 1020 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('9区')} title="9区">
                              <div className="DMA-node DMA-node9" onClick={()=>this.clickNode('9区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 870 * zoom + 'px',
                                top: 1076 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('10区')} title="10区">
                              <div className="DMA-node DMA-node10" onClick={()=>this.clickNode('10区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 690 * zoom + 'px',
                                top: 1212 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('11区')} title="11区">
                              <div className="DMA-node DMA-node11" onClick={()=>this.clickNode('11区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 772 * zoom + 'px',
                                top: 758 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('12区')} title="12区">
                              <div className="DMA-node DMA-node12" onClick={()=>this.clickNode('12区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 840 * zoom + 'px',
                                top: 900 * zoom + 'px'
                              }}></div>
                            </Popover>
                            <Popover content={this.getPopover('13区')} title="13区">
                              <div className="DMA-node DMA-node13" onClick={()=>this.clickNode('13区')} style={{
                                width: iconWidth * zoom + 'px',
                                height: iconWidth * zoom + 'px',
                                left: 1074 * zoom + 'px',
                                top: 852 * zoom + 'px'
                              }}></div>
                            </Popover>

                          </div>
                        </div>
                        <div className="DMA-img-operation DMA-img-enlarge" onClick={()=>this.operateDMAImg(1)}><Icon
                          type="plus" style={{fontSize: '25px'}}/></div>
                        <div className="DMA-img-operation DMA-img-reduce" onClick={()=>this.operateDMAImg(-1)}><Icon
                          type="minus" style={{fontSize: '25px'}}/></div>
                      </ContextMenuProvider>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10} xl={8}
                         style={{height: this.state.tableY + 'px', overflow: 'auto'}}>
                      <div className="DMA-info">
                        <div className="DMADetail">
                          <h2 style={{marginBottom: '10px'}}><span className="info-icon"></span><p>基本信息</p></h2>
                          <table className="custom-table">
                           {/* <thead>
                            <tr>
                              <td>名称</td>
                              <td>值</td>
                            </tr>
                            </thead>*/}
                            <tbody>
                            <tr>
                              <td>分区名称</td>
                              <td>{allData.length > 0 ? allData[0].area_name : null}</td>
                            </tr>
                            <tr>
                              <td>水表数量</td>
                              <td>{allData.length > 0 ? allData[0].meter_count : null}</td>
                            </tr>
                            <tr>
                              <td>水表有效读数数量</td>
                              <td>{allData.length > 0 ? allData[0].meter_effective_count : null}</td>
                            </tr>
                            <tr>
                              <td>水表有效读数率</td>
                              <td>{allData.length > 0 ? allData[0].meter_effective_rate : null}</td>
                            </tr>
                            <tr>
                              <td>水表读数总值</td>
                              <td>{allData.length > 0 ? allData[0].total_meter_value : null}</td>
                            </tr>
                            <tr>
                              <td>流量计正向流量总值</td>
                              <td>{allData.length > 0 ? allData[0].total_forward_value : null}</td>
                            </tr>
                            <tr>
                              <td>流量计反向流量总值</td>
                              <td>{allData.length > 0 ? allData[0].total_reverse_value : null}</td>
                            </tr>
                            <tr>
                              <td>其他（大客户水表）读数</td>
                              <td>{allData.length > 0 ? allData[0].other_value : null}</td>
                            </tr>
                            <tr>
                              <td>产销差</td>
                              <td>{allData.length > 0 ? allData[0].attrition_value : null}</td>
                            </tr>
                            <tr>
                              <td>产销差率</td>
                              <td>{allData.length > 0 ?  (typeof parseFloat(allData[0].attrition_rate === 'number') && !isNaN(parseFloat(allData[0].attrition_rate))) ? <Progress percent={parseFloat(allData[0].attrition_rate)} size="small" />:allData[0].attrition_rate : null}</td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                        <h2 style={{marginBottom: '10px', marginTop: '10px'}}><span className="flowmeter-icon"></span>
                          <p>下属流量计信息</p></h2>
                        <Table
                          className='meter-table'
                          rowKey={record => record.uuid}
                          dataSource={allData.length > 0 ? allData[0].flow_meters : []}
                          columns={columns}
                          pagination={false}
                          size="small"
                        />

                        {this.MyAwesomeMenu()}
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
