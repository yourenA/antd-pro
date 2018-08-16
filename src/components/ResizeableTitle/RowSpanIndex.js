import { Table ,Badge} from 'antd';
import React, {PureComponent} from 'react';
import { Resizable } from 'react-resizable';
import {renderIndex, ellipsis2,renderRowSpan} from './../../utils/utils'

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

export default class Demo extends React.Component {
  state = {
    columns: this.props.columns,
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };
  componentWillReceiveProps(nextProps){
    if(this.props.canOperate !== undefined &&nextProps.canOperate !== this.props.canOperate){
      if(nextProps.canOperate){
        this.state.columns.push(this.props.operate)
        this.setState({
          columns:this.state.columns
        })
      }else{
        this.state.columns.pop()
        this.setState({
          columns:this.state.columns
        })
      }
    }
  }
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      if(nextColumns[index].title==='序号'){
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
          render: (val, record, index) => {
            const children=renderIndex(this.props.meta,this.props.initPage,record.index)
            return renderRowSpan(children,record)
          }
        };
      }else{
        const pathname=this.props.history.location.pathname.split('/');
        switch(pathname[pathname.length-1]){
          case 'user_archives':
            switch(nextColumns[index].dataIndex){
              case 'number':
              case 'real_name':
              case 'address':
              case 'id_card':
              case 'phone':
              case 'created_at':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    const children= (
                      ellipsis2(val, size.width)
                    )
                    return renderRowSpan(children,record)
                  }
                };
                break;
              case 'reader':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    const children= (
                      ellipsis2(val)
                    )
                    return renderRowSpan(children,record)
                  }
                };
                break;
              case 'status':
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: (val, record, index) => {
                    if(val===undefined){
                      return ''
                    }
                    return (
                      <p>
                        <Badge status={val === 1 ? "success" : "error"}/>{record.status_explain}
                      </p>
                    )
                  }
                };
                break;
              default:
                nextColumns[index] = {
                  ...nextColumns[index],
                  width: size.width,
                  render: nextColumns[index].render? (val, record, index) => {
                    return ellipsis2(val, size.width)

                  } : (val, record, index) => {
                    return (
                    {val}
                    )
                  }
                };
            }
            break;

          default:
              nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
                render: nextColumns[index].render? (val, record, index) => {
                  return ellipsis2(val, size.width)

                } : (val, record, index) => {
                  return (
                  {val}
                  )
                }
              };
        }

      }
      return { columns: nextColumns };
    });
  };

  render() {
    let dataSource =this.props.dataSource;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Table
        className={this.props.className?this.props.className:'meter-table'}
        bordered
        components={this.components}
        columns={columns}
        dataSource={dataSource}
        scroll={this.props.scroll}
        pagination={false}
        size="small"
        loading={this.props.loading}
        rowKey={this.props.rowKey}
      />
    );
  }
}
