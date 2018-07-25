import React, { PureComponent } from 'react';
import {Icon, Tree, Layout} from 'antd';
import {Link} from 'dva/router';
import {connect} from 'dva';
const { Sider} = Layout;

@connect(state => ({
  global:state.global,
}))
class SiderNav extends PureComponent {
  constructor(props) {
    super(props);
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
      siderNav: [{name: '夜间流量异常报警设置', url: 'night_warning_setup'}, {name: '零水量异常报警设置', url: 'zero_warning_setup'}, {name: '用水量异常报警设置', url: 'unusual_water'},
        {name: '漏水异常报警设置', url: 'leak_warning_setup'},{name: '水表水量分析页面设置', url: 'member_meter_setup'},
        // {name: '系统名称设置', url: 'system_name'}, {name: '短信通知设置', url: 'sms_notice' },
        //           {name: '邮件通知设置', url: 'email_notice' }
                  ],
      activeNav:this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1]
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    if(this.props.location.pathname!==nextProps.location.pathname){
      this.setState({
        activeNav:nextProps.location.pathname.split('/')[nextProps.location.pathname.split('/').length-1]
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
          <Link to={`/${company_code}/main/system_manage/system_setup/${item.url}`}>{item.name}</Link>
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
