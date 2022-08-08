import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {Badge} from 'antd';
import {InfoCircleOutlined}  from '@ant-design/icons'

//页面顶部提示
const comp = (props) => {
  let {children,type,status,color} = props;
  
  return (
    <div {...props} className={style.stateBadge_box}>
      <Badge color={type || color} status={status} text={children} style={{color:'#666'}}/>
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
