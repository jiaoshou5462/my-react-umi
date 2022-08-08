import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {InfoCircleOutlined}  from '@ant-design/icons'

//页面顶部提示
const comp = (props) => {
  let {children} = props;
  
  return (
    <div className={style.list_tips_box}>
      <div className={style.list_tips}>
        <div className={style.tips_icon}><InfoCircleOutlined /></div>
        <div className={style.tips_box}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
