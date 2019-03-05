import React, {PureComponent, createElement} from 'react';
import {Pagination} from 'antd'
import {connect} from 'dva';
import {injectIntl} from 'react-intl';
@connect(state => ({
  global:state.global,
}))
@injectIntl
export default class MyPagination extends PureComponent {
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  onShowSizeChange=(current, pageSize)=> {
    console.log(current, pageSize);
    this.props.handPageSizeChange(pageSize)
  }
  render() {
    const { intl:{formatMessage} } = this.props;
    const {isMobile} =this.props.global;
    const {meta, handPageChange, initPage}=this.props
    console.log('meta',meta)
    return (
      <div>
        <Pagination
          size={isMobile?"small":""}
          showSizeChanger onShowSizeChange={this.onShowSizeChange}
          pageSizeOptions={['30','50','100','200','500']}
          showTotal={(total, range) => {
            if (initPage) {
              return meta ?`${formatMessage({id: 'intl.get'})} ${(initPage-1)*(meta.pagination.per_page)+1}-${range[1]?range[1]:''}  ${formatMessage({id: 'intl.total'})} : ${total}`:''
            } else {
              return `${formatMessage({id: 'intl.get'})} ${range[0] ? range[0] : ''}-${range[1] ? range[1] : ''}  ${formatMessage({id: 'intl.total'})} : ${total}`
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
