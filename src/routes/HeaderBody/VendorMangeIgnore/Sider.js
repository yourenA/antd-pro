import React, { Component } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
const { Sider} = Layout;
class SiderNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      siderNav: [{title: '心跳函数', key: 'heartbeat'}, {title: '功能函数', key: 'function'}, {
        title: '定时上传',
        key: 'timing'
      }],
    }
  }
  componentWillReceiveProps=(nextProps)=>{
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  changeNavIndex=(item)=>{
    this.setState({
      activeNav:item.key
    })
    this.props.changeTab(item)
  }
  render() {
    const that=this;
    const renderSiderNav=this.state.siderNav.map((item,index)=>{
      return (
        <div onClick={()=>that.changeNavIndex(item)} key={item.key} className={that.props.activeKey===item.key?"siderNav-item siderNav-item-active":"siderNav-item"}>
          <a>{item.title}</a>
        </div>
      )
    })
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="210">
        <div className="sider-title">
          选项
        </div>
        <div className="siderNav">
          {renderSiderNav}
        </div>
        <div className="toggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderNav
