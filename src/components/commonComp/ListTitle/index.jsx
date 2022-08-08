import React,{useState} from 'react';
import { connect } from 'umi';
import styles from './style.less';
import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const comp = (props) => {
  let {children,titleName,className} = props;
  
  
  return (
    <div {...props} className={`${styles.list_title} ${className}`}>
      <div className={styles.title_name}>{titleName}</div>
      <div className={styles.title_btn}>{children}</div>
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
