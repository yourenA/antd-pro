import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
import {connect} from 'dva';
const { Sider} = Layout;
import {injectIntl} from 'react-intl';

@connect(state => ({
  global:state.global,
}))
@injectIntl
class SiderNav extends PureComponent {
  constructor(props) {
    super(props);
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
      siderNav: [{name: this.props.intl.formatMessage({id: 'intl.user_account'}), url: 'user_manage'}, {name: this.props.intl.formatMessage({id: 'intl.user_role'}), url: 'user_group_manage'}],
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
    const company_code = sessionStorage.getItem('company_code');
    const that=this;
    const renderSiderNav=this.state.siderNav.map((item,index)=>{
      return (
        <div onClick={()=>that.changeNavIndex(item.url)} key={index} className={that.state.activeNav===item.url?"siderNav-item siderNav-item-active":"siderNav-item"}>
          <Link to={`/${company_code}/main/system_manage/account_manage/${item.url}`}>{item.name}</Link>
        </div>
      )
    })
    return (
      <Sider collapsed={this.state.collapsed}  collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          选项
        </div>
        <div className="siderNav">
          {renderSiderNav}
        </div>
        <div className="showToggle"   onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderNav
