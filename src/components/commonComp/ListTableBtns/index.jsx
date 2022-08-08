import React,{useState,useEffect} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {Dropdown} from 'antd';
import {UnorderedListOutlined}  from '@ant-design/icons';

//深度遍历 找到LtbItem组件层
const eachList = (list,roleElement)=>{
  let returnList = [];
  if(list instanceof Array){
    for(let item of list){
      if(item){
        if(item.type && item.type.displayName && item.type.displayName=='Connect(LtbItem)'){
          //找到LtbItem存入数组
          returnList.push(item);
        }else if(item.type && item.type.displayName && item.type.displayName=='Connect(CompAuthControl)'){
          for(let role of roleElement){
            if(role.code === item.props.compCode){
              returnList.push(item.props.children);
              break;
            }
          }
        }else if(item.props.children && item.props.children instanceof Array){
          //存在嵌套list
          returnList = returnList.concat(eachList(item.props.children,roleElement));
        }else if(item.props.children && item.props.children.type){
          //存在嵌套单个对象
          returnList = returnList.concat(eachList(item.props.children,roleElement));
        }
      }
    }
  }else{
    if(list.type && list.type.displayName && list.type.displayName=='Connect(LtbItem)'){
      returnList.push(list);
    }else if(list.type && list.type.displayName && list.type.displayName=='Connect(CompAuthControl)'){
      for(let role of roleElement){
        if(role.code === list.props.compCode){
          returnList.push(list.props.children);
          break;
        }
      }
    }else{
      returnList = returnList.concat(eachList(list.props.children,roleElement));
    }
  }
  return returnList;
}

//页面顶部提示
const comp = (props) => {
  let {children,showNum=3,roleElement} = props;
  
  const [dom,setDom] = useState(null);
  const [dropDom,setDropDom] = useState(null);
  useEffect(()=>{
    if(children.length){
      let list = [];
      for(let item of children){
        if(item) list.push(item);
      }
      list = eachList(list,roleElement);
      let _showNum = showNum=='all' ? list.length : Number(showNum);
      if(list.length > _showNum){
        let _dom = list.slice(0,_showNum);
        let _dropDom = list.slice(_showNum,list.length);
        setDom(_dom)
        setDropDom(_dropDom)
      }else{
        setDom(list);
        setDropDom(null)
      }
    }else{
      setDom(children);
      setDropDom(null)
    }
  },[children])

  const dropMenu = ()=>{
    return <div className={style.drop_box}>
      {
        dropDom.map((item)=>{
          return <div className={style.drop_item}>{item}</div>
        })
      }
    </div>
  }
  
  return (
    <div className={style.btn_box}>
      {dom}
      {dropDom?<Dropdown overlay={dropMenu} placement="bottomLeft" arrow>
        <UnorderedListOutlined className={style.drop_btn}/>
      </Dropdown>:''}
    </div>
  )
}

export default connect(({login}) => ({
  roleElement: login.roleElement
}))(comp)
