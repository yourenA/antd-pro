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
  Tree
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import DefaultSearch from './../../components/DefaultSearch/index'

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
    return (
      <PageHeaderLayout title={{label: '组织管理'}} breadcrumb={[{name: '平台管理'}, {name: '组织管理'}]}>
        <Card bordered={false} >
          <div>
            <Tree  showLine>
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
