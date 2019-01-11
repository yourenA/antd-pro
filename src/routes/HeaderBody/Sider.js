import React, {PureComponent} from 'react';
import {Icon, Tree, Layout, Input, Tooltip} from 'antd';
import siderJson from './sider.json'
import {connect} from 'dva';
import request from '../../utils/request';
import forEach from 'lodash/forEach'
const TreeNode = Tree.TreeNode;
const {Sider} = Layout;
const Search = Input.Search;
@connect(state => ({
  sider_regions: state.sider_regions,
  global: state.global,
}))
class SiderTree extends PureComponent {
  constructor(props) {
    super(props);
    this.dataList = [];
    const {isMobile} =this.props.global;
    this.state = {
      collapsed: isMobile,
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
      searchValue: '',
    }
  }

  componentDidMount() {
    const {dispatch}=this.props;
    this.queryVillages(true);
  }

  componentWillReceiveProps = (nextProps)=> {
    if (nextProps.refreshSider !== this.props.refreshSider) {
      console.log('刷新sider');
      this.queryVillages(true);
    }
  }
  queryVillages = (initial)=> {
    const that = this;
    request(`/villages`, {
      method: 'GET',
      params: {
        return: 'all'
      }
    }).then((response)=> {
      console.log('response', response.data.data);
      request(`/concentrators`, {
        method: 'GET',
        params: {
          return: 'all'
        }
      }).then((concentratorsResponse)=> {
        console.log('concentratorsResponse', concentratorsResponse)
        if (that.props.showConcentrator !== false) {
          response.data.data.unshift({id: 'null', name: '全部集中器', tooltip: "列出所有的集中器号，与安装小区无关", children: []})
          for (let i = 0; i < concentratorsResponse.data.data.length; i++) {
            response.data.data[0].children.push({
              id: concentratorsResponse.data.data[i].id + '5',
              number: concentratorsResponse.data.data[i].number,
              parent_village_id: ''
            })
          }
        }
        that.setState({
          treeData: this.props.showSiderCon === false ? response.data.data : that.transilate(response.data.data)
        }, function () {
          that.generateList(that.state.treeData);
          // console.log(that.dataList)
        })
        if (initial) {
          if (response.data.data.length > 0) {
            // this.setState({
            //   expandedKeys:[that.state.treeData[1].id]
            // });
            // console.log('that.props.initConcentrator',that.props.initConcentrator)
            if (that.props.noClickSider) {
            } else {
              if (this.props.cantSelectArea) {
                if(response.data.data[0].children.length>0){
                  that.setState({
                    selectedKeys: [`${response.data.data[0].children[0].id}#`]
                  })
                  this.props.changeConcentrator(response.data.data[0].children[0].number)
                }
                return false
              }
              that.setState({
                selectedKeys: [response.data.data[0].id]
              })
              if (response.data.data[0].id === 'null') {
                that.props.changeArea('')
              } else {
                that.props.changeArea(response.data.data[0].id)
              }
            }
          } else {
            that.props.changeArea('')
          }
        }
      })


    })
  }
  transilate = (data)=> {
    if (!data) return null;
    return data.map((item) => {
      if (item.concentrators && this.props.showConcentrator !== false) {
        if (item.concentrators.length > 0) {
          item.children = item.children || [];
          for (let i = 0; i < item.concentrators.length; i++) {
            item.concentrators[i].parent_village_id = item.id
          }
          let concatR = item.children ? item.children.concat(item.concentrators) : item.concentrators;
          // console.log('concatR',concatR)
          item.children = concatR
        }
      }
      if (item.monitoring_meters && this.props.showMonitor === true) {
        if (item.monitoring_meters.length > 0) {
          item.children = item.children || [];
          for (let i = 0; i < item.monitoring_meters.length; i++) {
            item.monitoring_meters[i].parent_village_id = item.id
            item.monitoring_meters[i].id = item.monitoring_meters[i].site_id
            item.monitoring_meters[i].name = item.monitoring_meters[i].site_name
          }
          let concatR = item.children ? item.children.concat(item.monitoring_meters) : item.monitoring_meters;
          // console.log('concatR',concatR)
          item.children = concatR
        }
      }
      this.transilate(item.children)
      return item
    });
  }
  onExpandNode = (expandedKeys, expanded)=> {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  renderTreeNodes = (data) => {
    // console.log(data)
    return data.map((item) => {
      const index = item.name ? item.name.indexOf(this.state.searchValue) : item.number.indexOf(this.state.searchValue);
      const beforeStr = item.name ? item.name.substr(0, index) : item.number.substr(0, index);
      const afterStr = item.name ? item.name.substr(index + this.state.searchValue.length) : item.number.substr(index + this.state.searchValue.length);
      const title = index > -1 ? (
        <span title={beforeStr+this.state.searchValue+afterStr}>
          {beforeStr}
          <span style={{color: '#f50'}}>{this.state.searchValue}</span>
          {afterStr}
        </span>
      ) : <span title={item.name ? item.name : item.number}>{item.name ? item.name : item.number}</span>;
      if (item.children && !this.props.onlyShowOneLevel) {
        return (
          <TreeNode title={<span>{title}{item.tooltip ?
            <Tooltip placement="top" title={item.tooltip}><Icon style={{marginLeft: '5px'}} type="question-circle-o"/>
            </Tooltip> : ''}</span>} key={item.id} dataRef={item}  icon={<Icon type="home" />} className="treeItem">
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if (item.number) {
        return <TreeNode title={title} key={`${item.id}#${item.parent_village_id}`} dataRef={item}
                         className="concentrator" icon={<Icon type="setting"/>}/>;
      }
      if (item.site_id) {
        return <TreeNode title={title} key={`${item.id}#${item.parent_village_id}`} dataRef={item}
                         className="concentrator" icon={<Icon type="line-chart"/>}/>;
      }
      return <TreeNode title={title} key={item.id} dataRef={item}  icon={<Icon type="home" />} className="village"/>;
    });
  }
  onCollapse = () => {
    const that=this;
    this.setState({
      collapsed: !this.state.collapsed,
    },function () {
    });
  }
  onSelect = (selectedKeys, info) => {
    if (info.selected === false) {
      return false
    }
    if (this.props.cantSelectArea && !info.node.props.dataRef.number) {
      return false
    }
    this.setState({selectedKeys});
    if (info.node.props.dataRef.number) {
      console.log('集中器', info.node.props.dataRef);
      console.log('父级id', info.node.props.dataRef.parent_village_id)
      this.props.changeConcentrator(info.node.props.dataRef.number, info.node.props.dataRef.parent_village_id)
    }else if(info.node.props.dataRef.site_id){
      console.log('点击监控表',info.node.props.dataRef.site_id)
      this.props.changeMonitor(info.node.props.dataRef.site_id,info.node.props.dataRef.site_name)
    } else {
      console.log('地区')
      if (selectedKeys[0] === 'null') {
        this.props.changeArea('')
      } else {
        this.props.changeArea(selectedKeys[0])

      }
    }
  }
  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.id;
      if (node.number) {
        this.dataList.push({id: key, name: node.number});
      } else {
        this.dataList.push({id: key, name: node.name});
      }
      if (node.children) {
        this.generateList(node.children, node.id);
      }
    }
  };
  onChange = (e) => {
    const value = e.target.value;
    const expandedKeys = this.dataList.map((item) => {
      // console.log(item.name)
      if (item.name.indexOf(value) > -1) {
        console.log(this.getParentKey(item.id, this.state.treeData))
        return this.getParentKey(item.id, this.state.treeData);
      }
      return null;
    });
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  render() {
    const {sider_regions:{data}}=this.props;
    return (
      <Sider collapsed={this.state.collapsed} collapsedWidth={0} className="sider" width="210">
        <div className="sider-title">
          区域信息
        </div>
        <Search style={{marginTop: '20px', marginLeft: '12px', marginBottom: '8px', width: '88%'}}
                placeholder="搜索小区或集中器号" onChange={this.onChange}/>
        <div className="sider-content">
          {(this.state.treeData.length)
            ?
            <Tree
              showIcon={true}
              //loadData={this.onLoadData}
              onExpand={this.onExpandNode}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
               onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
              //defaultExpandedKeys={[data[0].id]}
              //defaultSelectedKeys={[this.state.treeData[0].id]}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
            : null}
          {
            this.props.showArea === false ? <div className="hideSider"></div> : null
          }
        </div>

        <div className="showToggle" onClick={this.onCollapse}>
          <Icon type={this.state.collapsed ? "right" : "left"}/>
        </div>
      </Sider>
    );
  }
}

export default SiderTree
