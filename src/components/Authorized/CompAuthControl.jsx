import React,{useState} from 'react';
import { connect } from 'umi';

//元素组件控制器 根据权限选择是否展示组件
const CompAuthControl = (props) => {
  let {children,compCode,roleElement} = props;
  
  let showComp = false;
  for(let item of roleElement){
    if(item.code === compCode){
      showComp = true;
      break;
    }
  }
  return (
    <>
      {showComp ? children : ''}
    </>
  )
}
CompAuthControl.displayName = "CompAuthControl";
export default connect(({ login }) => ({
  roleElement: login.roleElement
}))(CompAuthControl)
