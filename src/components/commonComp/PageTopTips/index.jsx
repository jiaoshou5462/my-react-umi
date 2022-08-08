import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const PageTopTips = (props) => {
  let {children} = props;
  
  
  return (
    <div className={style.tip_con}>
      <ExclamationCircleFilled className={style.tip_icon}/>
      <div className={style.tip_text}>{children}</div>
    </div>
  )
}

export default connect(({}) => ({
}))(PageTopTips)
