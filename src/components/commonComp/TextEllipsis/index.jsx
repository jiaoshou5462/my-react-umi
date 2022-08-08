import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {Tooltip} from 'antd';
// import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const comp = (props) => {
  let {children} = props;
  
  
  return (
    <>
      {children ? 
      <Tooltip {...props} placement="top" title={children} color="#333">
        <div className={style.feedbackContent}>{children}</div>
      </Tooltip>:'-'}
    </>
    
  )
}

export default connect(({}) => ({
}))(comp)
