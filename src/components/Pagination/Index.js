import React, { PureComponent, createElement } from 'react';
import {Pagination} from 'antd'

export default class MyPagination extends PureComponent {
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  render() {
    const {meta,handPageChange}=this.props
    return (
      <div>
        <Pagination
                    showTotal={(total, range) =>{
                      return `获取第${range[0]}-${range[1]}条  总数 : ${total}`
                    } }
                    showQuickJumper className='pagination' total={meta.pagination.total}
                    current={meta.pagination.current_page} pageSize={meta.pagination.per_page}
                    style={{marginTop: '10px'}} onChange={handPageChange}/>
      </div>
    );
  }
}
