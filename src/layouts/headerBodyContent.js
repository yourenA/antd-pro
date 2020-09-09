/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import {
  Layout,
  Menu,
  Modal,
  Icon,
  Avatar,
  message,
  BackTop,
  notification,
  Button,
  Badge,
  Popover,
  Tooltip,
  LocaleProvider
} from 'antd';
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
import HyLogo from '../images/hy-logo.png'
import {injectIntl, FormattedMessage} from 'react-intl';
const {SubMenu} = Menu;
const {Header, Content} = Layout;
@injectIntl
class TestLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.menus = getNavData().reduce((arr, current) => {
      if (current.layout === 'HeaderBodyLayout') {
        return arr.concat(current.children)
      }
      return arr.concat([])

    }, []);
    this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
    this.zeroNotify = null;
    this.nightNotify = null;
    this.noConsumptionNotifyDay = null;
    this.state = {
      current: '',
      editModal: false,
      request_consumption_abnormality: find(this.permissions, {name: 'consumption_abnormality'}),
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
      locale: sessionStorage.getItem('locale') || "zh-CN"
    };
  }

  hide = () => {
    this.setState({
      mobileVisible: false,
    });
  }

  handleVisibleChange = (mobileVisible) => {
    this.setState({mobileVisible});
  }

  componentDidMount() {
    const {intl:{formatMessage}} = this.props;
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
    const notificationText = {
      consumption_abnormality: {
        name: 'consumption_abnormality',
        title: formatMessage({id: 'intl.water_consumption_abnormal_analysis'}) ,
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.water_consumption_abnormal_analysis'})}),
        urlSuffix: 'consumption_abnormality'
      },
      zero_abnormality: {name: 'zero_abnormality', title:formatMessage({id: 'intl.zero_consumption_abnormal_analysis'}) ,
        text: '个水表出现零流量异常', urlSuffix: 'zero_abnormality'},
      night_abnormality: {
        name: 'night_abnormality',
        title: formatMessage({id: 'intl.night_consumption_abnormal_analysis'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.night_consumption_abnormal_analysis'})}),
        urlSuffix: 'night_abnormality'
      },
      leak_abnormality: {name: 'leak_abnormality', title:formatMessage({id: 'intl.water_leak_abnormal_analysis'}) ,
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.water_leak_abnormal_analysis'})}),
        urlSuffix: 'leak_abnormality'},
      valve_status_abnormality: {
        name: 'valve_status_abnormality',
        title: formatMessage({id: 'intl.valve_status_abnormal_analysis'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.valve_status_abnormal_analysis'})}),
        urlSuffix: 'valve_status_abnormality'
      },
      voltage_status_abnormality: {
        name: 'voltage_status_abnormality',
        title: formatMessage({id: 'intl.voltage_status_abnormal_analysis'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.voltage_status_abnormal_analysis'})}),
        urlSuffix: 'voltage_status_abnormality'
      },
      concentrator_offline_abnormality: {
        name: 'concentrator_offline_abnormality',
        title: formatMessage({id: 'intl.concentrator_abnormal_analysis'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.concentrator_abnormal_analysis'})}),
        urlSuffix: 'statistics_daily/concentrator_error'
      },
      error_upload: {name: 'error_upload', title: formatMessage({id: 'intl.water_meter'})+formatMessage({id: 'intl.error'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.water_meter'})+formatMessage({id: 'intl.error'})}),
        urlSuffix: 'meter_unusual_analysis'},
      missing_upload: {name: 'missing_upload', title: formatMessage({id: 'intl.water_meter'})+formatMessage({id: 'intl.missing'}),
        text: formatMessage({id: 'intl.alert_type'},{type: formatMessage({id: 'intl.water_meter'})+formatMessage({id: 'intl.missing'})}),
        urlSuffix: 'meter_unusual_analysis'},
    }
    request(`/summary_abnormality`, {
      method: 'get',
    }).then((response)=> {
      console.log(response)
      for (let i in response.data) {
        that.renderNotification(i, response.data[i], notificationText[i])
      }
    })
    window.addEventListener('resize', throttle(this.resize, 100))

  }

  renderNotification = (key, data, notificationText)=> {
    if(!notificationText)return false
    const {intl:{formatMessage}} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const NotifyDay = localStorage.getItem(company_code + key);
    const dispatch = this.props.dispatch;
    const date = moment(new Date()).format('YYYY-MM-DD');
    if ((data.alarm_level === 2 || data.alarm_level === 1) && data.count !== 0) {
      this.setState({
        [key]: true
      })
    }
    if (NotifyDay === date || data.alarm_level !== 1 || data.count === 0) {
    } else {
      const args = {
        placement: 'bottomRight',
        message: notificationText.title,
        duration: 15,
        key: key,
        description: <div>{data.count} {notificationText.text}
          <p>
            <a href="javascript:;" onClick={()=> {
              localStorage.setItem(company_code + key, date);
              notification.close(key)
            }
            }>{ formatMessage({id: 'intl.no_longer_reminded_today'})}</a><span className="ant-divider"/><a
            href="javascript:;" onClick={()=> {
            dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/${notificationText.urlSuffix}`));
          }
          }>{ formatMessage({id: 'intl.show_details'})}</a>
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
        current: pathArr.length === 3 ? pathArr[2] : pathArr[4]
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


  handleClick = (e) => {
    console.log('click ', e);
    if (e.key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    } else if (e.key === 'password') {
      this.setState({editModal: true})
    } else if (e.key === 'about') {
    } else {
      this.setState({
        current: e.key,
      });
    }
    this.setState({
      mobileVisible: false,
    });


  }

  getNavMenuItems(menusData, parentPath = '') {
    const {intl:{formatMessage}} = this.props;
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
          if (item.path === 'unusual_analysis' &&
            (this.state.concentrator_offline_abnormality || this.state.error_upload || this.state.missing_upload || this.state.consumption_abnormality || this.state.zero_abnormality || this.state.night_abnormality || this.state.leak_abnormality
            || this.state.valve_status_abnormality || this.state.voltage_status_abnormality )) {
            showBadge = true
          }
          return (
            <SubMenu
              title={
                item.icon ? (
                  <span>
                  <Icon type={item.icon}/>
                    <FormattedMessage id={`intl.${item.name}`}/>
                    {showBadge && <span>
                <Tooltip placement="right" title={ formatMessage({id: 'intl.nav_tip'})}>
                  <span> < Badge status="error"/></span>
                </Tooltip>
              </span>}
                </span>
                ) : <FormattedMessage id={`intl.${item.name}`}/>
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
        if (item.noShowCompany && item.noShowCompany.indexOf(company_code) >= 0) {
          return false
        }
        let showBadge = false
        if (
          (item.path === 'concentrator_unusual_analysis' && this.state.concentrator_offline_abnormality) ||
          (item.path === 'meter_unusual_analysis' && this.state.error_upload) ||
          (item.path === 'meter_unusual_analysis' && this.state.missing_upload) ||
          (item.path === 'consumption_abnormality' && this.state.consumption_abnormality) ||
          (item.path === 'night_abnormality' && this.state.night_abnormality) ||
          (item.path === 'valve_status_abnormality' && this.state.valve_status_abnormality) ||
          (item.path === 'voltage_status_abnormality' && this.state.voltage_status_abnormality) ||
          (item.path === 'leak_abnormality' && this.state.leak_abnormality) ||
          (item.path === 'zero_abnormality' && this.state.zero_abnormality)
        ) {
          showBadge = true
        }
        return (
          <Menu.Item key={item.key || item.path}>
            <Link to={itemPath} target={item.target}>
              {icon} {(company_code==='lqsrmyy'&&item.path==='liquid_valve_analysis')?'液位传感器分析':<FormattedMessage id={`intl.${item.name}`}/>}
              {showBadge && < Badge status="error"/>}
            </Link>
          </Menu.Item>
        );
      }

    });
  }

  handleEditPassword = ()=> {
    const {intl:{formatMessage}} = this.props;
    const that = this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log(formValues)
    request(`/password`, {
      method: 'PUT',
      data: formValues
    }).then((response)=> {
      console.log(response)
      if (response.status === 200) {
        message.success(
          formatMessage(
            {id: 'intl.operate_successful'},
            {operate: formatMessage({id: 'intl.edit'}), type: formatMessage({id: 'intl.password'})}
          )
        )
        that.setState({
          editModal: false
        })
      }
    }).catch((err)=> {
      console.log(err)
    });
  }

  render() {
    const {login, dispatch, intl:{formatMessage}} = this.props;
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
        {company_code === 'mys' && <Menu.Item key={'main'}>
          <Link className={`${styles.homepage}`} to={`/${company_code}/main`}>
            <Icon type={'home'}/><span>{ formatMessage({id: 'intl.home'})}</span>
          </Link>
        </Menu.Item>}
        {this.getNavMenuItems(this.menus, company_code + '/main/')}
     {/*   <Menu.Item key={'about'}>
          <Link className={`${styles.homepage}`} to={`/about`} target="_blank">
            <Icon type={'book'}/><span>{formatMessage({id: 'intl.document'})}</span>
          </Link>
        </Menu.Item>*/}
        <SubMenu style={{float: 'right'}} title={ <span className={`${styles.action} ${styles.account}`}>
                     <Avatar  src="https://www.17sucai.com/preview/3250/2013-10-10/demo2/images/icon_19.png" className={styles.avatar}/>
          {login.username}
                  </span>}>
          <Menu.Item key="password"><Icon type="user"/>{formatMessage({id: 'intl.change_password'})}</Menu.Item>
          <Menu.Item key="logout"><Icon type="logout"/>{formatMessage({id: 'intl.sign_out'})}</Menu.Item>
        </SubMenu>
      </Menu>
    )
    const renderMobileMenu = (
      <Menu
        onClick={this.handleClick}
        theme="dark"
        mode="inline"
        selectedKeys={[this.state.current]}
        style={{width: 'calc(100vw - 32px)'}}
      >

        {this.getNavMenuItems(this.menus, company_code + '/main/')}
        <SubMenu title={ <span >
                      <Icon type='user'/>
          {login.username}
                  </span>}>
          <Menu.Item key="password"><Icon type="user"/>{formatMessage({id: 'intl.change_password'})}</Menu.Item>
          <Menu.Item key="logout"><Icon type="logout"/>{formatMessage({id: 'intl.sign_out'})}</Menu.Item>
        </SubMenu>
      </Menu>
    )
    const layout = (
      <Layout >
        <div className={styles.header}>
          <div className="logo">
            <Link to={`/${company_code}/main`} className="logo-up animated bounceInLeft ">{company_code === 'hy' &&
            <img src={HyLogo} style={{marginRight: '5px'}}/>}{company_name}<FormattedMessage id="intl.project_name"/></Link>
          </div>
          {
            isMobile ? <Popover className="mobile" content={renderMobileMenu} trigger="click" placement="bottomRight"
                                visible={this.state.mobileVisible}
                                onVisibleChange={this.handleVisibleChange}
            >
              <Icon className={`${styles.mobile_menu}`} type="bars"/>
            </Popover> : renderMenu
          }
        </div>
        <Layout className={styles.layoutContainer} >
          <Content  className={company_code === 'hy'?'hy-company':'other-company'}>
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
            title={formatMessage({id: 'intl.change_password'})}
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
      <div>{layout}</div>
    );
  }
}
export default connect(state => ({
  global: state.global,
  login: state.login
}))(TestLayout);
