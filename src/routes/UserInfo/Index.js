/**
 * Created by Administrator on 2017/12/8.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Col,
  Row,
  Icon,
  Modal,
  message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import AddOrEditPassword from './AddOrEditPassword'
import request from './../../utils/request'
@connect(state => ({
  login: state.login
}))
@Form.create()
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalEditVisible: false
    }
  }

  componentDidMount() {
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
        message.success('修改密码成功')
        that.setState({
          modalEditVisible: false
        })
      }

    }).catch((err)=> {
      console.log(err)
    });
  }

  render() {
    const {modalEditVisible}=this.state
    const {username, permissions, role_display_name}=this.props.login;
    const renderPermissions = permissions.map((item, index)=> {
      return (
        <div key={index} className="float-tag">
          {item.display_name}
        </div>
      )
    })
    return (
      <PageHeaderLayout title={{label: '个人中心'}} breadcrumb={[]}>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="基本信息"
              style={{marginBottom: 24}}
            >
              <Row>
                <Col md={8} sm={24}>
                  <div className="desc-title">用户名</div>
                  <div className="desc-detail">{username}</div>
                </Col>
                <Col md={8} sm={24}>
                  <div className="desc-title">显示名称</div>
                  <div className="desc-detail">{role_display_name}</div>
                </Col>
                <Col md={8} sm={24}></Col>
                <Col md={24} sm={24}>
                  <div className="desc-title">权限列表</div>
                  <div className="desc-detail">{renderPermissions}</div>
                </Col>
              </Row>
            </Card>

          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              title="安全信息"
            >
              <Row>
              <Col md={24} sm={24}>
                <div className="desc-title">密码</div>
                <div className="desc-detail edit" onClick={()=> {
                  this.setState(
                    {
                      modalEditVisible: true
                    }
                  )
                }}>修改<Icon type="edit"/></div>
              </Col>
                </Row>
            </Card>

          </Col>
        </Row>
        <Modal
          key={ Date.parse(new Date())}
          title="修改密码"
          visible={modalEditVisible}
          onOk={this.handleEditPassword}
          onCancel={() => {
            this.setState({
              modalEditVisible: false
            })
          }
          }
        >
          <AddOrEditPassword wrappedComponentRef={(inst) => this.editFormRef = inst}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
