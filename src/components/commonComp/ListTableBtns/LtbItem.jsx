import React,{useState,useEffect} from 'react';
import { connect } from 'umi';
import styles from './style.less';

//页面顶部提示
const LtbItem = (props) => {
  let {children,} = props;
  return (
    <div {...props} className={styles.btn_item}>
      {children}
    </div>
  )
}
LtbItem.displayName = "LtbItem";

export default connect(({}) => ({
}))(LtbItem)
