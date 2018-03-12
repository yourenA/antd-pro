import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
const { Sider} = Layout;
class SiderNav extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      siderNav: [{name: '用户管理', url: 'user_manage'}, {name: '角色管理', url: 'user_group_manage'}],
      activeNav:this.props.location.pathname.indexOf('user_group_manage')>=0?'user_group_manage':this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1]
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    if(this.props.location.pathname!==nextProps.location.pathname){
      this.setState({
        activeNav:nextProps.location.pathname.indexOf('user_group_manage')>=0?'user_group_manage':nextProps.location.pathname.split('/')[nextProps.location.pathname.split('/').length-1]
      })
    }

  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  changeNavIndex=(url)=>{
    this.setState({
      activeNav:url
    })
  }
  render() {
    const that=this;
    const renderSiderNav=this.state.siderNav.map((item,index)=>{
      return (
        <div onClick={()=>that.changeNavIndex(item.url)} key={index} className={that.state.activeNav===item.url?"siderNav-item siderNav-item-active":"siderNav-item"}>
          <Link to={`/main/system_manage/account_manage/${item.url}`}>{item.name}</Link>
        </div>
      )
    })
    return (
      <Sider collapsed={this.state.collapsed} className="sider" width="250">
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