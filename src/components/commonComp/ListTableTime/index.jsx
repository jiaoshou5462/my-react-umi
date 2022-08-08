import React,{useState,useEffect} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {ExclamationCircleFilled,} from '@ant-design/icons';

//页面顶部提示
const comp = (props) => {
  let {children} = props;
  
  const [textDay,setTextDay] = useState('-');
  const [textTime,setTextTime] = useState('');

  useEffect(()=>{
    if(children){
      let _textDay = children.slice(0,10);
      let _textTime = children.slice(10,children.length).trim();
      setTextDay(_textDay);
      setTextTime(_textTime);
    }else{
      setTextDay('-');
      setTextTime('');
    }
  },[children])

  return (
    <div className={style.box}>
      <div className={`${style.box_day} ${textTime ? style.text_bold : ''}`}>{textDay}</div>
      <div className={style.box_time}>{textTime}</div>
    </div>
  )
}

export default connect(({}) => ({
}))(comp)
