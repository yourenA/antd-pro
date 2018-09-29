/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import {Layout, Menu, Modal, Icon, Avatar, message, BackTop, notification, Button, Badge, Popover,Tooltip} from 'antd';
import styles from './HeaderBodyLayout.less';
import {connect} from 'dva';
import {Link, Route, Redirect, Switch, routerRedux} from 'dva/router';
import {getNavData} from '../common/nav';
import {getRouteData} from '../utils/utils';
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import intersection from 'lodash/intersection';
import throttle from 'lodash/throttle'
import Main from './../routes/HeaderBody/NewPage';
import classNames from 'classnames';
import EditPassword from '../routes/HeaderBody/HomePage/EditPassword'
import request from './../utils/request'
import NotFound from './../routes/Exception/404';
import {projectName, poweredBy} from './../common/config'
import moment from 'moment';
import find from 'lodash/find'

const {SubMenu} = Menu;
const {Header, Content} = Layout;
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
      if (current.layout === 'HeaderBodyLayout') {
        return arr.concat(current.children)
      }
      return arr.concat([])

    }, []);
    this.permissions =  JSON.parse(sessionStorage.getItem('permissions'));
    this.zeroNotify = null;
    this.nightNotify = null;
    this.noConsumptionNotifyDay = null;
    this.state = {
      current: '',
      editModal: false,
      request_consumption_abnormality:  find(this.permissions, {name: 'consumption_abnormality'}),
      request_zero_abnormality: find(this.permissions, {name: 'zero_abnormality'}),
      request_night_abnormality: find(this.permissions, {name: 'night_abnormality'}),
      request_leak_abnormality: find(this.permissions, {name: 'leak_abnormality'}),
      consumption_abnormality_count: false,
      zero_abnormality_count: false,
      night_abnormality_count: false,
      leak_abnormality_count: false,
      valve_status_abnormality_count: false,
      voltage_status_abnormality_count: false,
      concentrator_offline_abnormality_count: false,
      mobileVisible: false,
    };
  }
  hide = () => {
    this.setState({
      mobileVisible: false,
    });
  }

  handleVisibleChange = (mobileVisible) => {
    this.setState({ mobileVisible });
  }
  componentDidMount() {
    // console.log(this.menus)
    const {location} = this.props;
    let {pathname} = location;
    const pathArr = pathname.split('/')
    this.setState({
      current: pathArr[pathArr.length - 1]
    })
    this.props.dispatch({
      type: 'login/checkLoginState',
      payload: pathname
    });


    const noZeroNotifyDay = localStorage.getItem('noZeroNotifyDay');
    const noNightNotifyDay = localStorage.getItem('noNightNotifyDay');
    const noLeakNotifyDay = localStorage.getItem('noLeakNotifyDay');
    const noConsumptionNotifyDay = localStorage.getItem('noConsumptionNotifyDay');

    const that = this;
    const notificationText={
      consumption_abnormality_count:{title:'用水量异常报警',text:'个水表出现用水量异常',urlSuffix:'consumption_abnormality'},
      zero_abnormality_count:{title:'零流量异常报警',text:'个水表出现零流量异常',urlSuffix:'zero_abnormality'},
      night_abnormality_count:{title:'夜间流量异常报警',text:'个水表出现夜间流量异常',urlSuffix:'night_abnormality'},
      leak_abnormality_count:{title:'漏水异常报警',text:'个水表出现漏水异常报警',urlSuffix:'leak_abnormality'},
      valve_status_abnormality_count:{title:'水表阀控异常报警',text:'个水表出现阀控异常报警',urlSuffix:'valve_status_abnormality'},
      voltage_status_abnormality_count:{title:'水表电池电压异常报警',text:'个水表出现电池电压异常报警',urlSuffix:'voltage_status_abnormality'},
      concentrator_offline_abnormality_count:{title:'集中器离线异常报警',text:'个集中器出现离线异常',urlSuffix:'statistics_daily/concentrator_error'},
    }
    request(`/summary_abnormality`, {
      method: 'get',
    }).then((response)=> {
      console.log(response)
      for(let i in response.data){
        that.renderNotification(i,response.data[i],notificationText[i].title,notificationText[i].text,notificationText[i].urlSuffix)
      }
    })
    window.addEventListener('resize', throttle(this.resize, 100))

  }
  renderNotification=(key,count,title,text,urlSuffix)=>{
    const company_code = sessionStorage.getItem('company_code');
    const NotifyDay = localStorage.getItem(company_code+key);
    const dispatch = this.props.dispatch;
    const date = moment(new Date()).format('YYYY-MM-DD');
    if(count!==0){
      this.setState({
        [key]:true
      })
    }
    if (NotifyDay === date || count===0) {
      console.log('用水量异常报警没数据或不提醒')
    }else{
      const args = {
        placement: 'bottomRight',
        message: title,
        duration: 15,
        key: key,
        description: <div>{count} {text}
          <p>
            <a href="javascript:;" onClick={()=> {
              localStorage.setItem(company_code+key, date);
              notification.close(key)
            }
            }>今天不再提醒</a><span className="ant-divider"/><a href="javascript:;" onClick={()=> {
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/${urlSuffix}`));
          }
          }>查看详情</a>
          </p>
        </div>,
      };
      this[key] = notification.warning(args);
    }

  }
  resize = ()=> {
    const offsetW = document.documentElement.clientWidth;
    this.props.dispatch({
      type: 'global/SetMobile',
      payload: offsetW
    });
  }

  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      let {pathname} = nextProps.location;
      const pathArr = pathname.split('/');
      console.log('pathArr[4]', pathArr)
      this.setState({
        current: pathArr.length===3?pathArr[2]:pathArr[4]
      })
      const company_code = sessionStorage.getItem('company_code');
      if (pathArr[1] !== company_code) {
        console.log('url code 已经改变');
        this.props.dispatch({
          type: 'login/toLoginPage',
          payload: pathname
        });
      }
    }
  }
  componentWillUnmount = ()=> {
    notification.destroy();
    window.removeEventListener('resize', this.resize)
  }
  getPageTitle() {
    const {location} = this.props;
    let {pathname} = location;
    const company_name = sessionStorage.getItem('company_name');
    const company_code = sessionStorage.getItem('company_code');
    let title = company_name + projectName;
    getRouteData('HeaderBodyLayout').forEach((item) => {
      // console.log(`/${company_code}/main${item.path}`)
      if (`/${company_code}/main${item.path}` === pathname) {
        title = `${item.name} - ${company_name + projectName}`;
      }
      if (pathname.indexOf(`system_setup`) > 0) {
        title = `系统设置 - ${company_name + projectName}`;
      }
    });
    return title;
  }
  handleClick = (e) => {
    console.log('click ', e);
    if (e.key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    } else if (e.key === 'password') {
      this.setState({editModal: true})
    }  else if (e.key === 'about') {
    }else {
      this.setState({
        current: e.key,
      });
    }
    this.setState({
      mobileVisible: false,
    });


  }
  getNavMenuItems(menusData, parentPath = '') {
    let permissions = (localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions'))
      : sessionStorage.getItem('permissions') ? JSON.parse(sessionStorage.getItem('permissions')) : []).map((item, index)=> {
      return item.name
    })

    const company_code = sessionStorage.getItem('company_code');


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
      if (item.children && item.children.some(child => child.name)) {
        if (intersection(permissions, item.permissions).length > 0 || !item.permissions) {
          let showBadge = false
          if (item.path === 'unusual_analysis' && (this.state.consumption_abnormality_count || this.state.zero_abnormality_count || this.state.night_abnormality_count || this.state.leak_abnormality_count
            || this.state.valve_status_abnormality_count || this.state.voltage_status_abnormality_count )) {
            showBadge = true
          }
          return (
            <SubMenu
              title={
                item.icon ? (
                  <span>
                  <Icon type={item.icon}/>
                  <span>{item.name} </span>
                    {showBadge && <span>
                <Tooltip  placement="right"  title="红点表示当天存在异常报警">
                  <span> < Badge status="error"/></span>
                </Tooltip>
              </span>}
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
      if ((intersection(permissions, item.permissions).length > 0 || !item.permissions) && (!item.showCompany || item.showCompany.indexOf(company_code) >= 0)) {
        if(item.noShowCompany && item.noShowCompany.indexOf(company_code)>=0){
          return false
        }
        let showBadge = false
        if ((item.path === 'consumption_abnormality' && this.state.consumption_abnormality_count) ||
          (item.path === 'night_abnormality' && this.state.night_abnormality_count) ||
          (item.path === 'valve_status_abnormality' && this.state.valve_status_abnormality_count) ||
          (item.path === 'voltage_status_abnormality' && this.state.voltage_status_abnormality_count) ||
          (item.path === 'leak_abnormality' && this.state.leak_abnormality_count) ||
          (item.path === 'zero_abnormality' && this.state.zero_abnormality_count)) {
          showBadge = true
        }
        return (
          <Menu.Item key={item.key || item.path}>
            <Link to={itemPath} target={item.target}>
              {icon}<span>{item.name} </span>
              {showBadge && < Badge status="error"/>}
            </Link>
          </Menu.Item>
        );
      }

    });
  }
  handleEditPassword = ()=> {
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log(formValues)
    request(`/password`, {
      method: 'PUT',
      data: formValues
    }).then((response)=> {
      console.log(response)
      if (response.status === 200) {
        message.success('修改密码成功');
        that.setState({
          editModal: false
        })
      }
    }).catch((err)=> {
      console.log(err)
    });
  }

  render() {
    const {login, dispatch} = this.props;
    const {isMobile} =this.props.global;
    const company_code = sessionStorage.getItem('company_code');
    const company_name = sessionStorage.getItem('company_name');
    const {location} = this.props;
    let {pathname} = location;
    const pathArr = pathname.split('/');
    // console.log('pathArr',pathArr[1])
    // console.log('company_code',company_code)
    const renderMenu = (
      <Menu
        onClick={this.handleClick}
        theme="dark"
        mode="horizontal"
        style={{lineHeight: '64px'}}
        selectedKeys={[this.state.current]}
      >
        {company_code==='mys'&&<Menu.Item key={'main'}>
          <Link className={`${styles.homepage}`} to={`/${company_code}/main`} >
            <Icon type={'home'}/><span>首页</span>
          </Link>
        </Menu.Item>}
        {this.getNavMenuItems(this.menus, company_code + '/main/')}
        <Menu.Item key={'about'}>
          <Link className={`${styles.homepage}`} to={`/about`} target="_blank">
            <Icon type={'book'}/><span>说明文档</span>
          </Link>
        </Menu.Item>
        <SubMenu style={{float: 'right'}} title={ <span className={`${styles.action} ${styles.account}`}>
                     <Avatar icon="user" className={styles.avatar}/>
          {login.username}
                  </span>}>
          <Menu.Item key="password"><Icon type="user"/>修改密码</Menu.Item>
          <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
        </SubMenu>
      </Menu>
    )
    const renderMobileMenu = (
      <Menu
        onClick={this.handleClick}
        theme="dark"
        mode="inline"
        selectedKeys={[this.state.current]}
        style={{width:'calc(100vw - 32px)'}}
      >

        {this.getNavMenuItems(this.menus, company_code + '/main/')}
        <SubMenu title={ <span >
                      <Icon type='user'/>
          {login.username}
                  </span>}>
          <Menu.Item key="password"><Icon type="user"/>修改密码</Menu.Item>
          <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
        </SubMenu>
      </Menu>
    )
    const layout = (
      <Layout >
        <div className={styles.header}>
          <div className="logo">
            <Link to={`/${company_code}/main`} className="logo-up">{company_name}{projectName}</Link>
          </div>
          {
            isMobile ? <Popover className="mobile" content={renderMobileMenu} trigger="click"  placement="bottomRight"
                                visible={this.state.mobileVisible}
                                onVisibleChange={this.handleVisibleChange}
            >
              <Icon className={`${styles.mobile_menu}`} type="bars"/>
            </Popover> : renderMenu
          }
        </div>
        <Layout className={styles.layoutContainer}>
          <Content style={{background: '#f0f2f5'}}>
            <BackTop />
            <Switch>
              {
                getRouteData('HeaderBodyLayout').map(item => {
                    return (
                      <Route
                        key={item.path}
                        path={`/${company_code}/main${item.path}`}
                        component={item.component}
                      />
                    )
                  }
                )
              }
              <Route
                exact
                path={`/${company_code}/main`}
                component={Main}
              />
              <Route component={NotFound}/>
            </Switch>

          </Content>
          <Modal
            title="修改密码"
            visible={this.state.editModal}
            onOk={this.handleEditPassword}
            onCancel={() => this.setState({
              editModal: false
            })}
          >
            <EditPassword wrappedComponentRef={(inst) => this.editFormRef = inst}/>
          </Modal>
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
  global: state.global,
  login: state.login
}))(HeaderBodyLayout);
