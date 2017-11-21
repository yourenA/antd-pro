import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import styles from './BasicLayout.less';
import HeaderSearch from '../components/HeaderSearch';
import GlobalFooter from '../components/GlobalFooter';
import { getNavData } from '../common/nav';
import { getRouteData } from '../utils/utils';
import waterLogo from '../images/water.png'
import DeviceManage from '../routes/AccessManagement/DeviceManage';
import IdentifyManage from '../routes/AccessManagement/IdentifyManage';
import StrategyManage from '../routes/AccessManagement/StrategyManage';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

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
      if(current.layout ==='UserLayout' || current.showInSibar===false  ){
        return arr.concat([])
      }
      return arr.concat(current.children)
    }, []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  getChildContext() {
    const { location } = this.props;
    const routeData = getRouteData('BasicLayout');
    const menuData = getNavData().reduce((arr, current) => arr.concat(current.children), []);
    const breadcrumbNameMap = {};
    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = item.name;
    });
    return { location, breadcrumbNameMap };
  }
  componentDidMount() {
    // console.log(this.menus)
    this.props.dispatch({
      type: 'login/checkLoginState',
    });
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
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);//splice:切割数组 返回修改后的数组
    if (currentMenuSelectedKeys.length === 0) {
      return ['access-management'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);//split:将字符串转为数组，slice:切割数组 返回切割的数组
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    // console.log('keys',keys)
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
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
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
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
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link to={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  getPageTitle() {
    const { location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - Ant Design Pro`;
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
    const { collapsed } = this.props;
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
  render() {
    const {  collapsed, login } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item ><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item ><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };
    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onCollapse={this.onCollapse}
          width={256}
          className={styles.sider}//引入BasicLayout.less中的类名，使用css
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={waterLogo} alt="logo" />
              <h1>水务系统IOT</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className={styles.right}>
              <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value); // eslint-disable-line
                }}
              />
              {login.username ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                     <Avatar  icon="user" className={styles.avatar}/>
                    {login.username}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {
                getRouteData('BasicLayout').map(item =>{
                  return(
                    <Route
                      exact={item.exact}
                      key={item.path}
                      path={item.path}
                      component={item.component}
                    />
                  )
                }

                )
              }
              <Route
                path='/access-management/endpoints/:id/device'
                component={DeviceManage}
              />
              <Route
                path='/access-management/endpoints/:id/identify'
                component={IdentifyManage}
              />
              <Route
                path='/access-management/endpoints/:id/strategy'
                component={StrategyManage}
              />
              <Redirect to="/access-management/endpoints" />
            </Switch>
            <GlobalFooter
              links={[{
                title: 'Pro 首页',
                href: 'http://pro.ant.design',
                blankTarget: true,
              }, {
                title: 'GitHub',
                href: 'https://github.com/ant-design/ant-design-pro',
                blankTarget: true,
              }, {
                title: 'Ant Design',
                href: 'http://ant.design',
                blankTarget: true,
              }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  login:state.login
}))(BasicLayout);
