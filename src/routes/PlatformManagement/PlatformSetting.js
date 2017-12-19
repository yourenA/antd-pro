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
  Pagination,
  message,
  Tree,
  Steps,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import DefaultSearch from './../../components/DefaultSearch/index'
const { Step } = Steps;
const TreeNode = Tree.TreeNode;
@connect(state => ({
  endpoints: state.endpoints,
}))
@Form.create()
export default class EndpointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: 'Expand to load', key: '0',children:[ { title: 'Child Node', key: `11` }, { title: 'Child Node', key: `12` }, { title: 'Child Node', key: `13` }]},
        { title: 'Expand to load', key: '1' ,children:[ { title: 'Child Node', key: `21` }, { title: 'Child Node', key: `22` }, { title: 'Child Node', key: `23` }]},
        { title: 'Expand to load', key: '2' ,children:[ { title: 'Child Node', key: `31` }, { title: 'Child Node', key: `32` }, { title: 'Child Node', key: `33` }]},
      ],
    }
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode selectable={item.selectable} title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  render() {
    const desc1 = (
      <div >
        <div>
          曲丽丽
          <Icon type="dingding-o" style={{ marginLeft: 8 }} />
        </div>
        <div>2016-12-12 12:32</div>
      </div>
    );

    const desc2 = (
      <div >
        <div>
          周毛毛
          <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
        </div>
        <div><a href="">催一下</a></div>
      </div>
    );
    return (
      <PageHeaderLayout title={{label: '组织管理'}} breadcrumb={[{name: '平台管理'}, {name: '组织管理'}]}>
        <Card bordered={false} >
          <div>
            <Tree  showLine>
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
        </Card>
        <Card bordered={false} style={{marginTop:'24px'}}>
          <div>
            <Steps direction='horizontal' current={1} progressDot >
              <Step title="创建项目" description={desc1} />
              <Step title="部门初审" description={desc2} />
              <Step title="财务复核" />
              <Step title="完成" />
            </Steps>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
