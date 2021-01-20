import React, { PureComponent } from 'react';
import {Pagination} from 'antd'
export default class TopProjectTitle extends PureComponent {
  render() {
    const {meta}=this.props
    const paginationProps = {
      showTotal: (total, range)  => {
        return <span>
          当前显示 <span className="pagination-blue">{range[0]}</span> 到 <span className="pagination-blue">{range[1]}</span> 条 , 共 <span  className="pagination-blue">{total}</span> 条
        </span>
      },
      pageSize: meta.per_page,
      total:meta.total,
      size:'small',
      current: meta.current_page,
      onChange: (page, pageSize)=> {
        this.props.handleSearch({page, per_page: pageSize, ...this.props.searchCondition})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.props.handleSearch({page, per_page: pageSize,  ...this.props.searchCondition})
      },
    };
    return (
      <Pagination {...paginationProps} />
    );
  }
}
