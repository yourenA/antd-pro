/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import {Layout, Menu, Modal, Icon, Avatar, message, BackTop, notification, Button} from 'antd';
import styles from './HeaderBodyLayout.less';
import {connect} from 'dva';
import {Link, Route, Redirect, Switch, routerRedux} from 'dva/router';
import {getNavData} from '../common/nav';
import {getRouteData} from '../utils/utils';
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import intersection from 'lodash/intersection';
import Main from './../routes/HeaderBody/NewPage';
import classNames from 'classnames';
import EditPassword from '../routes/HeaderBody/HomePage/EditPassword'
import request from './../utils/request'
import NotFound from './../routes/Exception/404';
import {projectName, poweredBy} from './../common/config'
import moment from 'moment';
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
    this.zeroNotify = null;
    this.nightNotify = null;
    this.noConsumptionNotifyDay = null;
    this.state = {
      current: '',
      editModal: false
    };
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
    const date = moment(new Date()).format('YYYY-MM-DD');
    const noZeroNotifyDay = localStorage.getItem('noZeroNotifyDay');
    const noNightNotifyDay = localStorage.getItem('noNightNotifyDay');
    const noConsumptionNotifyDay = localStorage.getItem('noConsumptionNotifyDay');
    const dispatch = this.props.dispatch;
    const company_code = sessionStorage.getItem('company_code');
    if (noConsumptionNotifyDay === date) {
      console.log('不提醒')
    } else {
      request(`/consumption_abnormality`, {
        method: 'get',
        params: {
          started_at: date,
          ended_at:date,
          page: 1
        }
      }).then((response)=> {
        console.log(response);
        const data = response.data.data
        if (data.length > 0) {
          const args = {
            placement: 'bottomRight',
            message: '用水量异常报警',
            duration: 15,
            key:'noConsumptionNotifyDay',
            description: <div>{data[0].meter_number} 等水表出现用水量异常报警
              <p>
                <a href="javascript:;" onClick={()=> {
                  console.log(' this.noConsumptionNotifyDay', this.noConsumptionNotifyDay)
                  localStorage.setItem('noConsumptionNotifyDay', date);
                  notification.close('noConsumptionNotifyDay')
                }
                }>今天不再提醒</a><span className="ant-divider"/><a href="javascript:;" onClick={()=> {
                dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/water_unusual_analysis`));
              }
              }>查看详情</a>
              </p>
            </div>,
          };
          this.noConsumptionNotifyDay = notification.warning(args);
          console.log(' this.noConsumptionNotifyDay', this.noConsumptionNotifyDay)
        }
      })
    }

    if (noZeroNotifyDay === date) {
      console.log('不提醒')
    } else {
      request(`/zero_abnormality`, {
        method: 'get',
        params: {
          date: date,
          page: 1
        }
      }).then((response)=> {
        console.log(response);
        const data = response.data.data
        if (data.length > 0) {
          const args = {
            placement: 'bottomRight',
            message: '零流量异常报警',
            duration: 15,
            key:'zeroNotify',
            description: <div>{data[0].meter_number} 等水表出现零流量异常
              <p>
                <a href="javascript:;" onClick={()=> {
                  localStorage.setItem('noZeroNotifyDay', date);
                  notification.close('zeroNotify')
                }
                }>今天不再提醒</a><span className="ant-divider"/><a href="javascript:;" onClick={()=> {
                dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/zero_abnormality`));
                //notification.close(this.zeroNotify)
              }
              }>查看详情</a>
              </p>
            </div>,
          };
          this.zeroNotify = notification.warning(args);
        }
      })
    }

    if (noNightNotifyDay === date) {
      console.log('不提醒')
    } else {
      request(`/night_abnormality`, {
        method: 'get',
        params: {
          date: date,
          page: 1
        }
      }).then((response)=> {
        console.log(response);
        const data = response.data.data
        if (data.length > 0) {
          const args = {
            placement: 'bottomRight',
            message: '夜间异常流量报警',
            duration: 15,
            key:'noNightNotifyDay',
            description: <div>{data[0].meter_number} 等水表出现夜间流量异常
              <p>
                <a href="javascript:;" onClick={()=> {
                  localStorage.setItem('noNightNotifyDay', date)
                  notification.close('noNightNotifyDay')
                }
                }>今天不再提醒</a><span className="ant-divider"/><a href="javascript:;" onClick={()=> {
                dispatch(routerRedux.push(`/${company_code}/main/unusual_analysis/night_abnormality`));
                //notification.close(this.nightNotify)
              }
              }>查看详情</a>
              </p>
            </div>,
          };
          this.nightNotify = notification.warning(args);
        }
      })
    }
  }

  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      let {pathname} = nextProps.location;
      const pathArr = pathname.split('/')
      this.setState({
        current: pathArr[pathArr.length - 1]
      })
    }
  }
  componentWillUnmount = ()=> {
    notification.destroy()
  }

  getPageTitle() {
    const {location} = this.props;
    let {pathname} = location;
    const company_name = sessionStorage.getItem('company_name');
    const company_code = sessionStorage.getItem('company_code');
    let title = company_name+projectName;
    getRouteData('HeaderBodyLayout').forEach((item) => {
      // console.log(`/${company_code}/main${item.path}`)
      if (`/${company_code}/main${item.path}` === pathname) {
        title = `${item.name} - ${company_name+projectName}`;
      }
      if (pathname.indexOf(`system_setup`) > 0) {
        title = `系统设置 - ${company_name+projectName}`;
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
    } else {
      this.setState({
        current: e.key,
      });
    }


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
      if ((intersection(permissions, item.permissions).length > 0 || !item.permissions)  && (!item.showCompany || item.showCompany.indexOf(company_code)>=0)) {
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
    const {login} = this.props;
    const company_code = sessionStorage.getItem('company_code');
    const company_name = sessionStorage.getItem('company_name');
    const layout = (
      <Layout style={{minHeight: '100vh'}}>
        <div className={styles.header}>
          <div className="logo">
            <Link to={`/${company_code}/main`} className="logo-up">{company_name}{projectName}</Link>
          </div>
          <Menu
            onClick={this.handleClick}
            theme="dark"
            mode="horizontal"
            style={{lineHeight: '64px'}}
            selectedKeys={[this.state.current]}
          >
            {this.getNavMenuItems(this.menus,company_code+'/main/')}
            <SubMenu style={{float: 'right'}} title={ <span className={`${styles.action} ${styles.account}`}>
                     <Avatar icon="user" className={styles.avatar}/>
              {login.username}
                  </span>}>
              <Menu.Item key="password"><Icon type="user"/>修改密码</Menu.Item>
              <Menu.Item key="logout"><Icon type="logout"/>退出登录</Menu.Item>
            </SubMenu>
          </Menu>
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
  login: state.login
}))(HeaderBodyLayout);
