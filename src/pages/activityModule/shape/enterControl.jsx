import React,{useState} from 'react';
import { connect } from 'umi';
import styles from './style.less'

//元素组件控制器 根据权限选择是否展示组件
const enterControl = (props) => {
  let {children,compCode} = props;
  let activityEnter = window.carowner_config.activityEnter[process.env.REACT_APP_ENV];
  let showComp = false;
  for(let key in activityEnter){
    let item = activityEnter[key]
    if(key === compCode){
      showComp = item;
      break;
    }
  }
  return (
    <>
      {showComp ? children : 
      <div className={styles.enterControl_tips}>尽情期待</div>
      }
    </>
  )
}

export default connect(({}) => ({
}))(enterControl)
