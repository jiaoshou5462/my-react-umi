import React,{useState} from 'react';
import { connect } from 'umi';
import styles from './style.less';
import {InfoCircleOutlined}  from '@ant-design/icons'
import {Pagination} from 'antd';

//页面顶部提示
const comp = (props) => {
  const {children,
    pageSize=10,
    defaultPageSize=10,
    current=1,
    total=0,
    onChange,
    showPagination=true,
    style={},
    className=''} = props;
  const onPageTotal = (total, range) => {
    let numStart = (current-1) * pageSize +1 ;
    let numEnd = current * pageSize;
    return  `第${numStart}-${numEnd}条，总共${total}条`;
  }

  return (
    <div style={style} className={`${styles.list_table} ${className}`}>
      {children}
      {showPagination ? <Pagination
        className={styles.pagination}
        showQuickJumper
        showTitle={false}
        current={current}
        defaultPageSize={defaultPageSize}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        pageSizeOptions={['10', '20', '30', '60']}
        showTotal={onPageTotal}
      ></Pagination> : ''}
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
