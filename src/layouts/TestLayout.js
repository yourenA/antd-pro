/**
 * Created by Administrator on 2018/1/2.
 */
import React from 'react';
import { Layout, Menu, Modal, Icon, Avatar, message ,BackTop,notification} from 'antd';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch,routerRedux } from 'dva/router';
import { getNavData } from '../common/nav';
import { getRouteData } from '../utils/utils';
import DocumentTitle from 'react-document-title';
import NotFound from './../routes/Exception/404';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
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

class TestLayout extends React.PureComponent {
  constructor(props) {
    super(props);
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
      payload:pathname
    });
  }
  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      let {pathname} = nextProps.location;
      const pathArr = pathname.split('/')
      const company_code = sessionStorage.getItem('company_code');
      if(pathArr[1]!==company_code){
        console.log('url code 已经改变');
        this.props.dispatch({
          type: 'login/toLoginPage',
          payload:pathname
        });
        // this.props.dispatch(routerRedux.replace(`/login/${pathArr[1]}`));
      }
    }
  }
  componentWillUnmount=()=>{
    notification.destroy()
  }
  getPageTitle() {
    const { location } = this.props;
    let { pathname } = location;
    let title = '测试';
    getRouteData('TestLayout').forEach((item) => {
      if (`/test${item.path}` === pathname) {
        title = `${item.name}`;
      }
    });
    return title;
  }

  render() {
    const company_code = sessionStorage.getItem('company_code');
    const layout= (
          <Switch>
          {
            getRouteData('TestLayout').map(item =>{
                return(
                  <Route
                    key={item.path}
                    path={`/${company_code}/test${item.path}`}
                    component={item.component}
                  />
                )
              }
            )
          }
          </Switch>
    )
    if(company_code==='hy'){
      return (<NotFound></NotFound>)
    }
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
}))(TestLayout);
