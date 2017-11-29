import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Table,
  Alert,
  Modal,
  message,
  List
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import AddOrEditOrganization from './addOrEditOrganization'
import styles from './CardList.less';
const avatar = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];
const title = [
  ' Alipay',
  ' Angular',
  ' Ant Design',
  ' Ant Design Pro',
  ' Bootstrap',
  ' React',
  ' Vue',
  ' Webpack',
];
const desc = [
  ' 这是一段变焦长的描述，Alipay',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。Angular',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。Ant Design',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。Ant Design Pro',
  ' 这是一段变焦长的描述Bootstrap',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。React',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。Vue',
  ' 这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。这是一段变焦长的描述，这是一段不较长的描述。Webpack',
];
@connect(state => ({
  organization: state.organization,
}))
@Form.create()
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalEditVisible:false,
      data: [{
        id: '0',
        avatar: avatar[Math.floor(Math.random() * avatar.length)],
        title: title[Math.floor(Math.random() * avatar.length)],
        description: desc[Math.floor(Math.random() * avatar.length)]
      },
        {
          id: '01',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '02',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '03',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '04',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '05',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '06',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '07',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        },
        {
          id: '08',
          avatar: avatar[Math.floor(Math.random() * avatar.length)],
          title: title[Math.floor(Math.random() * avatar.length)],
          description: desc[Math.floor(Math.random() * avatar.length)]
        }]
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'organization/fetch',
      payload: {
        page: 1
      }
    });
  }
  handleSearch = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'organization/fetch',
      payload: {
        name:values,
      },
    });
    this.setState({
      query:values,
    })
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  handleModalEditVisible= (flag) => {
    this.setState({
      modalEditVisible: !!flag,
    });
  }
  handleAdd = () => {
    const that = this;
    const formValues =this.formRef.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'organization/add',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('创建机构成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'organization/fetch',
          payload: {
            query: that.state.query,
          }
        });
      }
    });
  }
  handleEdit = () => {
    const that = this;
    const formValues =this.editFormRef.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'organization/edit',
      payload: {
        ...formValues
      },
      callback: function () {
        message.success('修改机构成功')
        that.setState({
          modalVisible: false,
        });
        that.props.dispatch({
          type: 'organization/fetch',
          payload: {
            query: that.state.query,
          }
        });
      }
    });
  }
  handleRemove = (id)=> {
    const that = this;
    this.props.dispatch({
      type: 'organization/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除设备成功')
        that.props.dispatch({
          type: 'organization/fetch',
          payload: {
            query:that.state.query,
          }
        });
      }
    });
  }
  handleForbid = ()=> {
    const id=this.state.editRecord.id
    console.log(id)
    const that = this;
    this.props.dispatch({
      type: 'organization/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除设备成功')
        that.props.dispatch({
          type: 'organization/fetch',
          payload: {
            query:that.state.query,
          }
        });
      }
    });
  }
  handleResetPassword = ()=> {
    const id=this.state.editRecord.id
    console.log(id)
    const that = this;
    this.props.dispatch({
      type: 'organization/remove',
      payload: {
        id:id,
      },
      callback: function () {
        message.success('删除设备成功')
        that.props.dispatch({
          type: 'organization/fetch',
          payload: {
            query:that.state.query,
          }
        });
      }
    });
  }
  onVisibleChange=(visible)=>{
    console.log(visible)
  }
  render() {
    const {organization: {data, meta, loading}} = this.props;
    const { modalVisible,   modalEditVisible,editRecord} = this.state;
    const pageHeaderContent = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleSearch}
          style={{ maxWidth: 522,width:'100%' }}
        />
      </div>
    );

    const itemMenu = (
      <Menu>
        <Menu.Item >
          <a onClick={this.handleResetPassword}>重置密码</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.handleForbid}>禁用</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderLayout title={{label: '机构管理'}} breadcrumb={[{name: '平台管理'}, {name: '机构管理'}]}
                        content={pageHeaderContent}>
        <List
          rowKey="id"
          grid={{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}}
          dataSource={['', ...this.state.data]}
          renderItem={item => (item ? (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[
                  <a onClick={()=>{
                    this.setState(
                      {
                        editRecord:item,
                        modalEditVisible:true
                      }
                    )
                  }}>修改</a>
                  ,
                  <Popconfirm placement="topRight" title={ `确定要删除吗?`}
                              onConfirm={()=>this.handleRemove(item.id)}>
                    <a>删除</a>
                  </Popconfirm>,
                  <Dropdown onVisibleChange={(visible)=>{
                    if(visible){
                      this.setState({
                        editRecord:item,
                      })
                    }else{
                      this.setState({
                        editRecord:{},
                      })
                    }

                  }} overlay={itemMenu}><a >更多<Icon type="ellipsis" /></a></Dropdown>]}>
                  <Card.Meta
                    className={styles.antCardMeta}
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar}/>}
                    title={<a href="#">{item.title}</a>}
                    description={(
                      <p className={styles.cardDescription}>
                        <span>{item.description}</span>
                      </p>
                    )}
                  />
                </Card>
              </List.Item>
            ) : (
              <List.Item>
                <Button onClick={() => this.handleModalVisible(true)} type="dashed" className={styles.newButton}>
                  <Icon type="plus"/> 新建机构
                </Button>
              </List.Item>
            )
          )}
        />
        <Modal
          title="新建机构"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <AddOrEditOrganization  wrappedComponentRef={(inst) => this.formRef = inst}/>
        </Modal>
        <Modal
          key={ Date.parse(new Date())}
          title="修改机构"
          visible={modalEditVisible}
          onOk={this.handleEdit}
          onCancel={() => this.handleModalEditVisible()}
        >
          <AddOrEditOrganization  wrappedComponentRef={(inst) => this.editFormRef = inst} editRecord={editRecord}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
