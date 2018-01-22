/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import { Layout, Menu, Modal, Icon, Avatar, message ,BackTop,notification } from 'antd';
import styles from './HeaderBodyLayout.less';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import { getNavData } from '../common/nav';
import { getRouteData } from '../utils/utils';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import intersection from 'lodash/intersection';
import Main from './../routes/HeaderBody/NewPage';
import classNames from 'classnames';
import EditPassword from './../routes/HeaderBody/EditPassword'
import request from './../utils/request'
const { SubMenu } = Menu;
const { Header, Content } = Layout;
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
      editModal:false
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
    setTimeout(function () {
      const args = {
        placement: 'bottomRight',
        message: '检测到异常水表数据',
        description: '显示告警水表信息. 显示告警水表信息. 显示告警水表信息.',
        duration: 0,
      };
      notification.error(args);
    },500)
  }
  getPageTitle() {
    const { location } = this.props;
    let { pathname } = location;
    let title = '珠华远传水表监控系统';
    getRouteData('HeaderBodyLayout').forEach((item) => {
      if (`/main${item.path}` === pathname) {
        title = `${item.name} - 珠华远传水表监控系统`;
      }
      if(pathname.indexOf(`system_setup`)>0){
        title = `系统设置 - 珠华远传水表监控系统`;
      }
    });
    return title;
  }
  handleClick = (e) => {
    console.log('click ', e);
    if(e.key==='logout'){
      this.props.dispatch({
        type: 'login/logout',
      });
    }else if(e.key==='password'){
      this.setState({editModal:true})
    }else{
      this.setState({
        current: e.key,
      });
    }


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

  handleEditPassword = ()=> {
    const that=this;
    const formValues = this.editFormRef.props.form.getFieldsValue();
    console.log(formValues)
    request(`/password`, {
      method: 'PUT',
      data:formValues
    }).then((response)=> {
      console.log(response)
      if(response.status===200){
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
    const {   login } = this.props;
    const layout= (
      <Layout  style={{minHeight:'100vh' }}>
        <div className={styles.header}>
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
              <Menu.Item key="password"><Icon type="user" />修改密码</Menu.Item>
              <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <Layout className={styles.layoutContainer} >
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
          <Modal
            title="修改密码"
            visible={this.state.editModal}
            onOk={this.handleEditPassword}
            onCancel={() => this.setState({
              editModal:false
            })}
          >
            <EditPassword  wrappedComponentRef={(inst) => this.editFormRef = inst} />
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
  login:state.login
}))(HeaderBodyLayout);
