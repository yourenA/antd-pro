import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Table, Icon, Divider} from 'antd';
import {Link, Route, Redirect, Switch, routerRedux} from 'dva/router';
import Dash from './Dashboard.js'

class NewPage extends PureComponent {
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项

    this.path='/home'
  }
  componentDidMount() {
    this.props.findChildFunc(this.props.activeKey,this.fetch)
  }
  fetch=()=>{
    console.log('fetch')
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.foce){
      this.fetch()
    }
  }


  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false}>
              <Link to="/home/123">卡片内容</Link>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewPage
