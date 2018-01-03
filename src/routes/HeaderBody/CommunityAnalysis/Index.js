import React, {PureComponent} from 'react';
import {Pagination , Table , Card, Icon, Tree, Layout} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DefaultSearch from './../../../components/DefaultSearch/index'
const TreeNode = Tree.TreeNode;
const {Header, Footer, Sider, Content} = Layout;

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        {
          title: 'Expand to load ChildChild ',
          key: '0',
          children: [{
            title: 'ChildChildC hildChild  Node',
            key: `11`,
            children: [{title: 'ChildChildC hildChild  Node', key: `111`}, {
              title: 'Child Node',
              key: `112`
            }, {title: 'Child Node', key: `113`}]
          }, {title: 'Child Node', key: `12`}, {title: 'Child Node', key: `13`}]
        },
        {
          title: 'Expand to load',
          key: '1234vsf2',
          children: [{title: 'Child Node', key: `2vs1`}, {title: 'Child Node', key: `2ytu2`}, {
            title: 'Child Node',
            key: `2dh3`
          }]
        },
        {
          title: 'Expand to load',
          key: '1v3',
          children: [{title: 'Child Node', key: `2vs1`}, {title: 'Child Node', key: `22tyed`}, {
            title: 'Child Node',
            key: `ss23`
          }]
        },
        {
          title: 'Expand to load',
          key: 'vs1',
          children: [{title: 'Child Node', key: `vszx21`}, {title: 'Child Node', key: `2dd2`}, {
            title: 'Child Node',
            key: `2ss3`
          }]
        },
        {
          title: 'Expand to load',
          key: '1vs',
          children: [{title: 'Child Node', key: `2ygh1`}, {title: 'Child Node', key: `22dhd`}, {
            title: 'Child Node',
            key: `ss23`
          }]
        },
        {
          title: 'Expand to load',
          key: '112vs',
          children: [{title: 'Child Node', key: `2hd1`}, {title: 'Child Node', key: `2dhh2`}, {
            title: 'Child Node',
            key: `sgr23`
          }]
        },
        {
          title: 'Expand to load',
          key: '21aaa',
          children: [{title: 'Child Node', key: `31`}, {title: 'Child Node', key: `32`}, {
            title: 'Child Node',
            key: `33`
          }]
        },
      ],
      collapsed: false,
      data:[],
      loading:true,
      tableY:0
    }
  }

  componentDidMount() {
    this.setState({
      tableY:document.body.offsetHeight-document.querySelector('.meter-table').offsetTop-(68+54+50+38+15)
    })
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        set:Math.random(),
        address: `London Park London ParLondon  Par no. ${i}`,
      });
    }
    const that=this
    setTimeout(function () {
      that.setState({
        data:data,
        loading:false
      })
    },300)
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  }
  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const columns = [
      { title: 'Full Name', width: 150, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
      { title: 'Column 1', dataIndex: 'address', key: '1' },
      { title: 'Column 2', dataIndex: 'address', key: '2' ,width: 150,},
      { title: 'Column 3', dataIndex: 'address', key: '3' ,width: 150,},
      { title: 'Column 4', dataIndex: 'address', key: '4' ,width: 150,},
      { title: 'Column 5', dataIndex: 'set', key: '5',width: 150,},
      { title: 'Column 6', dataIndex: 'address', key: '6'},
      { title: 'Column 7', dataIndex: 'address', key: '7'},
      { title: 'Column 8', dataIndex: 'address', key: '8' },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a href="#">action</a>,
      },
    ];
    console.log('tableY',this.state.tableY)
    return (
      <Layout className="layout">
        <Sider collapsed={this.state.collapsed} className="sider" width="250">
          <div className="sider-title">
            区域信息
          </div>
          <Tree showLine>
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
          <div className="toggle" onClick={this.onCollapse}>
            <Icon type={this.state.collapsed ? "right" : "left"}/>
          </div>
        </Sider>
        <Content style={{background:'#fff'}}>
          <div className="content">
            <PageHeaderLayout title="实例列表" breadcrumb={[{name: '接入管理'}, {name: '实例列表'}]}>
              <Card bordered={false} style={{margin:'-24px -24px 0'}}>
                <div className='tableList'>
                  <div className='tableListForm'>
                    <DefaultSearch handleSearch={this.handleSearch} handleFormReset={this.handleFormReset}/>
                  </div>
                </div>
                <Table
                  className='meter-table'
                  loading={this.state.loading}
                  rowKey={record => record.key}
                  dataSource={this.state.data}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: 1800, y: this.state.tableY }}
                  size="small"
                />
                <Pagination showQuickJumper className='pagination' total={15}
                            current={1} pageSize={10}
                            style={{marginTop: '10px'}} onChange={this.handPageChange}/>
              </Card>
          </PageHeaderLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Dashboard
