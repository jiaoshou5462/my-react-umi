import React,{useState,useEffect} from 'react';
import { connect,} from 'umi';
import style from './style.less';
import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const BottomArea = (props) => {
  let {children,dispatch} = props;

  useEffect(()=>{
    dispatch({
      type:'global/setBottomArea',
      payload: true,
    })
  },[])

  return (
    <div className={style.bottom_area}>
      {children}
    </div>
  )
}

export default connect(({}) => ({
}))(BottomArea)
