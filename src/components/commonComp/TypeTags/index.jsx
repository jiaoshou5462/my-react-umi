import React,{useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const TypeTags = (props) => {
  let {children,type,color} = props;
  
  const colorRender = (type,isText)=>{
    if(type=='red'){
      if(isText) return '#C91132';
      if(!isText) return '#FDE3E8';
    }
    if(type=='orange'){
      if(isText) return '#FF4A1A';
      if(!isText) return '#FDF0ED';
    }
    if(type=='yellow'){
      if(isText) return '#FFC500';
      if(!isText) return '#FFF7DD';
    }
    if(type=='purple'){
      if(isText) return '#7545A7';
      if(!isText) return '#F4EAFF';
    }
    if(type=='green'){
      if(isText) return '#28CB6B';
      if(!isText) return '#DBFBE8';
    }
    if(type=='indigo'){
      if(isText) return '#32D1AD';
      if(!isText) return '#E0FFF7';
    }
    if(type=='blue'){
      if(isText) return '#2FB6E4';
      if(!isText) return '#DDF6FF';
    }
    if(!type){
      if(color){
        return color;
      }else{
        if(isText) return '#2FB6E4';
        if(!isText) return '#DDF6FF';
      }
    }
  }
  
  return (
    <div {...props} className={style.type_tags}>
      <span className={style.text_color} 
        style={{color:colorRender(type,true)}}>{children}</span>
      <div className={style.bg} 
        style={{
          backgroundColor:colorRender(type),
          opacity:color ? 0.1:1,
        }}></div>
    </div>
  )
}

export default connect(({}) => ({
}))(TypeTags)
