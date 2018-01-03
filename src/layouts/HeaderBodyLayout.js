/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Avatar, Dropdown, Spin ,BackTop } from 'antd';
import styles from './HeaderBodyLayout.less';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch,routerRedux } from 'dva/router';
import { getNavData } from '../common/nav';
import { getRouteData } from '../utils/utils';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import intersection from 'lodash/intersection';
import Main from './../routes/HeaderBody/NewPage';
import classNames from 'classnames';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
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
class HeaderBodyLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.menus = getNavData().reduce((arr, current) => {
      if(current.layout ==='HeaderBodyLayout' ){
        return arr.concat(current.children)
      }
      return arr.concat([])

    }, []);
    this.state = {
      current: '',
    };
  }
  componentDidMount() {
    // console.log(this.menus)
    const { location } = this.props;
    let { pathname } = location;
    const pathArr= pathname.split('/')
    this.setState({
      current:pathArr[pathArr.length-1]
    })
    this.props.dispatch({
      type: 'login/checkLoginState',
    });
  }
  getPageTitle() {
    const { location } = this.props;
    let { pathname } = location;
    let title = '珠华远传水表监控系统';
    getRouteData('HeaderBodyLayout').forEach((item) => {
      if (`/main${item.path}` === pathname) {
        title = `${item.name} - 珠华远传水表监控系统`;
      }
    });
    return title;
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  getNavMenuItems(menusData, parentPath = '/main/') {
    let permissions=(localStorage.getItem('permissions')?JSON.parse(localStorage.getItem('permissions'))
      :sessionStorage.getItem('permissions')?JSON.parse(sessionStorage.getItem('permissions')):[]).map((item,index)=>{
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
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        if(intersection(permissions,item.permissions).length>0 || !item.permissions) {
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
      const icon = item.icon && <Icon type={item.icon} />;
      if(intersection(permissions,item.permissions).length>0 || !item.permissions){
        return (
          <Menu.Item key={item.key || item.path}>
                <Link to={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </Link>
          </Menu.Item>
        );
      }

    });
  }
  render() {
    const {   login } = this.props;
    const layout= (
      <Layout  style={{ display:'flex',minHeight:'100vh' }}>
        <Header className={styles.header}>
          <div className="logo" >
            <Link to="/main">珠华远传水表监控系统</Link>
          </div>
          <Menu
            onClick={this.handleClick}
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
            selectedKeys={[this.state.current]}
          >
            {this.getNavMenuItems(this.menus)}
            <SubMenu style={{float:'right'}} title={ <span className={`${styles.action} ${styles.account}`}>
                     <Avatar  icon="user" className={styles.avatar}/>
              {login.username}
                  </span>}>
              <Menu.Item key="userInfo"><Icon type="user" />个人中心</Menu.Item>
              <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Layout className={styles.layoutContainer} style={{ flex:1 }}>
            <Content style={{ background: '#f0f2f5'}}>
              <BackTop />
              <Switch>

                {
                  getRouteData('HeaderBodyLayout').map(item =>{
                      return(
                        <Route
                          key={item.path}
                          path={`/main${item.path}`}
                          component={item.component}
                        />
                      )
                    }
                  )
                }
                <Route
                  path={`/main`}
                  component={Main}
                />
              </Switch>
            </Content>
        </Layout>
      </Layout>
    )
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
  login:state.login
}))(HeaderBodyLayout);
