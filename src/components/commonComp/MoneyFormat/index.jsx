import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';

//页面顶部提示
const comp = (props) => {
  let {children,prefix="￥",acc,} = props;
  
  
  return (
    <div {...props} className={style.box}>
      {prefix}
      {window.number_to_thousandth(children,acc)}
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
