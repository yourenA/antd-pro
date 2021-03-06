import React from 'react';
import PropTypes from 'prop-types';
import {Layout, Menu, Icon, Avatar, Dropdown, Spin, BackTop, Tabs,Button} from 'antd';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {Link, Route, Redirect, Switch, routerRedux} from 'dva/router';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import intersection from 'lodash/intersection';
import styles from './BasicLayout.less';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import HeaderSearch from '../components/HeaderSearch';
import GlobalFooter from '../components/GlobalFooter';
import {getNavData} from '../common/nav';
import {getRouteData} from '../utils/utils';
import zhuhuaLogo from '../images/zhuhua.png'
// import DeviceManage from '../routes/AccessManagement/DeviceManage';
// import IdentifyManage from '../routes/AccessManagement/IdentifyManage';
// import StrategyManage from '../routes/AccessManagement/StrategyManage';
import NotFound from './../routes/Exception/404';
import EndpointDetailLayout from './../routes/AccessManagement/EndpointDetailLayout'
import UsergroupLayout from './../routes/SystemManagement/UsergroupLayout'
import UserInfo from './../routes/UserInfo/Index'
import NewPage from './../routes/NewPage'
import {projectName, poweredBy} from './../common/config'
const TabPane = Tabs.TabPane;
const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = getNavData().reduce((arr, current) => {
      if (current.layout === 'UserLayout' || current.layout === 'HeaderBodyLayout' || current.layout === 'TestLayout'|| current.showInSibar === false) {
        return arr.concat([])
      }
      return arr.concat(current.children)
    }, []);
    this.isPageExit=!!find(getRouteData('BasicLayout'), function(o) {
      return o.path == props.location.pathname;
    });
    const panes =(props.location.pathname===getRouteData('BasicLayout')[0].path||props.location.pathname==='/')? [getRouteData('BasicLayout')[0]]:[getRouteData('BasicLayout')[0],find(getRouteData('BasicLayout'), function(o) {
      return o.path == props.location.pathname;
    })];
    console.log('panes',panes)
    this.state = {
      activeKey:props.location.pathname==='/'?getRouteData('BasicLayout')[0].path: props.location.pathname,
      panes,
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  getChildContext() {

    const {location} = this.props;
    const routeData = getRouteData('BasicLayout');
    const menuData = getNavData().reduce((arr, current) => arr.concat(current.children), []);
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return {location, breadcrumbNameMap};
  }

  componentDidMount() {
    document.title='广州辂轺信息科技有限公司'
    const { location } = this.props;
    let { pathname } = location;
    this.props.dispatch({
      type: 'login/checkLoginState',
      payload:pathname
    });
  }
  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      let {pathname} = nextProps.location;
      const pathArr = pathname.split('/');
      console.log('pathArr',pathArr.length)
      const company_code = sessionStorage.getItem('company_code');
      if(pathArr[1]!==company_code){
        console.log('url 以改变')
        this.props.dispatch(routerRedux.push(`/login/${pathArr[1]}`));
      }
    }
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }

  onCollapse = (collapsed) => {
    //向global发送action
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  onMenuClick = ({key}) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    } else if (key === 'userInfo') {
      this.props.dispatch(routerRedux.push(`/user-info`));
      this.changeTab(find(getRouteData('BasicLayout'), function(o) {
        return o.path == '/user-info';
      }))
    }
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);//splice:切割数组 返回修改后的数组
    if (currentMenuSelectedKeys.length === 0) {
      return [''];
    }
    return currentMenuSelectedKeys;
  }

  getCurrentMenuSelectedKeys(props) {
    const {location: {pathname}} = props || this.props;
    const keys = pathname.split('/').slice(1);//split:将字符串转为数组，slice:切割数组 返回切割的数组
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    // console.log('keys',keys)
    return keys;
  }

  getNavMenuItems(menusData, parentPath = '') {
    let permissions = (sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : []).map((item, index)=> {
      return item.name
    })
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (!item.noshowInSibar && item.children && item.children.some(child => child.name)) {
        if (intersection(permissions, item.permissions).length > 0 || !item.permissions) {
          return (
            <SubMenu
              title={
                item.icon ? (
                  <span>
                  <Icon type={item.icon}/>
                  <span>{item.name}</span>
                </span>
                ) : item.name
              }
              key={item.key || item.path}
            >
              {this.getNavMenuItems(item.children, itemPath)}
            </SubMenu>
          );
        }
      }
      const icon = item.icon && <Icon type={item.icon}/>;
      if (!item.noshowInSibar && (intersection(permissions, item.permissions).length > 0 || !item.permissions)) {
        return (
          <Menu.Item key={item.key || item.path}>
            {
              /^https?:\/\//.test(itemPath) ? (
                <a href={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </a>
              ) : (
                <Link
                  //onClick={()=>this.changeTab({...item, path: itemPath})}
                  to={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </Link>
              )
            }
          </Menu.Item>
        );
      }

    });
  }

  changeTab = (item)=> {
    const panes = this.state.panes;
    const canFindInPanes = find(panes, function (o) {
      return o.path == item.path;
    })
    if (canFindInPanes) {
      this.setState({activeKey: item.path});
    } else {
      panes.push({name: item.name, component: item.component, path: item.path});
      this.setState({panes, activeKey: item.path});
    }
  }
  onChange = (activeKey) => {
    this.props.dispatch(routerRedux.push(activeKey));
    this.setState({activeKey});
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  remove = (targetKey) => {
    if( this.state.panes.length===1){
      return false
    }
    const that=this;
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.path === targetKey) {
        lastIndex = i - 1;
      }
    });
    const index=findIndex(this.state.panes,function (o) {
      return o.path===targetKey&&targetKey===that.state.activeKey
    })
    const panes = this.state.panes.filter(pane => pane.path !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].path;
    }
    if(index===0){
      activeKey = panes[0].path;
    }
    this.props.dispatch(routerRedux.push(activeKey));
    this.setState({panes, activeKey});
  }

  getPageTitle() {
    const {location} = this.props;
    const {pathname} = location;
    let title = '广州辂轺信息科技有限公司';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 广州辂轺信息科技有限公司`;
      }
    });
    return title;
  }

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  toggle = () => {
    const {collapsed} = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 600);
  }
  refreshTab=()=>{
    if(this[this.state.activeKey]){
      this[this.state.activeKey]()
    }
  }
  findChildFunc = (path,cb)=> {
    this[path] = cb
  }
  render() {
    // if(!this.isPageExit){
    //   return(
    //     <NotFound actions={
    //       <Button type="primary" onClick={()=>{
    //         this.props.dispatch(routerRedux.push(`/home`));
    //         window.location.reload()
    //       }}>返回首页</Button>
    //     }/>
    //   )
    // }
    const {collapsed, login} = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="userInfo"><Icon type="user"/>个人中心</Menu.Item>
        <Menu.Item ><Icon type="setting"/>设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
      </Menu>
    );
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };
    const company_code = sessionStorage.getItem('company_code');
    console.log('company_code',company_code)
    let pawerByText=poweredBy;
    switch(company_code){
      case 'hngydx':
        pawerByText='珠华水工业、湖南工业大学';
        break;
      case 'demo':
      case 'system':
        pawerByText='广州辂轺信息科技有限公司';
        break;
      default:
        break;
    }
    const layout = (
      <div>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={this.onCollapse}
          width={200}
          className={styles.sider}//引入BasicLayout.less中的类名，使用css
        >
          <div className={styles.logo}>
            <Link onClick={()=>{
              this.setState({activeKey:`/${company_code}/home`});
            }} to={`/${company_code}/home`}>
              {/*<img src={zhuhuaLogo} alt="logo"/>*/}
              <h1>广州辂轺信息科技</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{padding: '16px 0', width: '100%'}}
          >
            {this.getNavMenuItems(this.menus,company_code)}
          </Menu>
        </Sider>
        <Layout className={styles.bce_content} style={{left: collapsed ? '80px' : '200px'}}>
          <Header className={styles.header} style={{left: collapsed ? '80px' : '200px'}}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
            {/*  <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />*/}
              {login.username ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                     <Avatar icon="user" className={styles.avatar}/>
                    {login.username}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{marginLeft: 8}}/>}
            </div>
          </Header>
          <Content className={styles.main_area}>
            <div className={styles.main}>
              <BackTop />
            <Switch>
               {
               getRouteData('BasicLayout').map(item =>{
               return(
               <Route
               exact={item.exact}
               key={item.path}
               path={`/${company_code}${item.path}`}
               component={item.component}
               />
               )
               }
               )
               }
               <Route
               path={`/${company_code}access-management/endpoints/:id`}
               component={EndpointDetailLayout}
               />
               <Route
               path={`/${company_code}system-management/usergroup/:id`}
               component={UsergroupLayout}
               />
               <Route
               path={`/${company_code}user-info`}
               component={UserInfo}
               />
               {
               (sessionStorage.getItem('role_display_name')==='系统管理员')?
               <Redirect exact from={`/${company_code}`} to={`/${company_code}/home`}/>
               : <Redirect exact from={`/${company_code}`} to={`/${company_code}/main`} />
               }

               <Route component={NotFound} />
               </Switch>
              <GlobalFooter
                copyright={
                  <div>
                    powered by {pawerByText}
                  </div>
                }
              />

            </div>

          </Content>
        </Layout>
      </div>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div >{layout}</div>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  login: state.login
}))(BasicLayout);
