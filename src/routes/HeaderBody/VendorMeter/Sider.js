import React, { PureComponent } from 'react';
import {Icon, Row,Col, Layout,Checkbox} from 'antd';
import {Link} from 'dva/router';
import request from "./../../../utils/request";
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
const { Sider} = Layout;
@connect(state => ({
  global:state.global,
}))
@injectIntl
class SiderEmpty extends PureComponent {
  constructor(props) {
    super(props);
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
      data:[],
      checkValue:[]
    }
  }
  componentDidMount() {
    const that = this;
    request(`/manufacturers`, {
      method: 'GET',
    }).then((response)=> {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          data:response.data.data,
          checkValue:response.data.data.reduce((pre,item)=>{
            pre.push(item.id);
            return pre
          },[])
        },function () {
          this.props.handleSearch({
            manufacturer_ids:this.state.checkValue,
            started_at:this.props.started_at,
            ended_at:this.props.ended_at,
          },this.props.changeTableY)
        })

      }
    })
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  onChange=(checkedValues) =>{
    console.log('checked = ', checkedValues);
    this.setState({
      checkValue:checkedValues
    },function () {
      this.props.handleSearch({
        manufacturer_ids:this.state.checkValue,
        started_at:this.props.started_at,
        ended_at:this.props.ended_at,
      })
    })
  }
  render() {
    const {intl:{formatMessage}} = this.props;
    const renderCheckbox=this.state.data.map((item,index)=>{
      return  <Col key={index} span={24} style={{marginBottom:'6px'}}>
        <Checkbox value={item.id}>{item.name}</Checkbox>
      </Col>
    })
    return (
      <Sider collapsed={this.state.collapsed}  collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          {formatMessage({id: 'intl.vendor_option'})}
        </div>
        <div className="sider-content" style={{padding:'12px'}}>
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={this.state.checkValue}>
            <Row>
              {
                renderCheckbox
              }
            </Row>
          </Checkbox.Group>
        </div>
        <div className="showToggle"   onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderEmpty
