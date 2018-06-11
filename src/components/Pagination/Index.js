import React, {PureComponent, createElement} from 'react';
import {Pagination} from 'antd'

export default class MyPagination extends PureComponent {
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };

  render() {
    const {meta, handPageChange, initPage}=this.props
    return (
      <div>
        <Pagination

          showTotal={(total, range) => {
            if (initPage) {
              return meta ?`获取第${(initPage-1)*(meta.pagination.per_page)+1}-${range[1]?range[1]:''}条  总数 : ${total}`:''
            } else {
              return `获取第${range[0] ? range[0] : ''}-${range[1] ? range[1] : ''}条  总数 : ${total}`
            }
          }
          }
          showQuickJumper className='pagination' total={meta ? meta.pagination.total : 0}
          current={meta ? meta.pagination.current_page : 0} pageSize={meta ? meta.pagination.per_page : 0}
          style={{marginTop: '10px'}} onChange={handPageChange}/>
      </div>
    );
  }
}
