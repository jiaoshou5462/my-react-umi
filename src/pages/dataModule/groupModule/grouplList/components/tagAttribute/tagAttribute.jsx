//用户属性
import React, { useEffect, useState, useRef, } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Button, Select, Space
} from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined, CloseOutlined, PlusCircleOutlined,} from '@ant-design/icons';
import UserAttributeModule from './tagAttributeModule'

const { Option } = Select;
const selectData = {
  oneList: [],
  twoList: [],
  threeList:[],
}
let compId = 0;//子组件自增id，用于渲染key
const TagAttribute = (props) => {
  let {tagLayerInfosItem,itemIndex} = props;
  const [isClose, setIsClose] = useState(true)//展开收缩
  const [layarData, setLayarData] = useState(tagLayerInfosItem) //当前层对象
  //接受子组件传递的数据
  const setParentsData=(parentsData)=>{
    console.log(parentsData)
    if(JSON.stringify(parentsData) =='{}') return;
    if(parentsData.indexObj && parentsData.indexObj.levelIndex == itemIndex){
      let {index,pIndex} = parentsData.indexObj;
      if(tagLayerInfosItem.tagDefinitionGroups[pIndex]){
        tagLayerInfosItem.tagDefinitionGroups[pIndex].tagDefinitionVos[index] = parentsData.data;
        let _tagLayerInfosItem = JSON.parse(JSON.stringify(tagLayerInfosItem));
        setLayarData(_tagLayerInfosItem);
      }
    }
  }
  //内层添加
  const addObj = (index) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let itemObj = {
      tagInfoId:'',//下拉框1
      predicateInfoId:'',//下拉框2
      tagLayerInfoIds:'',//输入框
      tagLayerInfoIds_name:'',
      loopId:++compId,
    }
    itemObj.selectData = JSON.parse(JSON.stringify(selectData));
    thisObj.tagDefinitionGroups[index].tagDefinitionVos.push(itemObj);
    tagLayerInfosItem.tagDefinitionGroups[index].tagDefinitionVos.push(itemObj);//同步数据
    setLayarData(thisObj);
    setIsClose(true);
  }
  //外层添加
  const attributeAdd = () => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let itemObj = {
      relationValue:'AND',
      tagDefinitionVos:[{
        tagInfoId:'',//下拉框1
        predicateInfoId:'',//下拉框2
        tagLayerInfoIds:'',//输入框
        tagLayerInfoIds_name:'',
      }],
      loopId:++compId,
    }
    itemObj.selectData = JSON.parse(JSON.stringify(selectData));
    thisObj.tagDefinitionGroups.push(itemObj);
    tagLayerInfosItem.tagDefinitionGroups.push(itemObj);//同步数据
    setLayarData(thisObj);
    setIsClose(true);
  }
  //删除
  const deleteChild = (index,parentsIndex) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let list = thisObj.tagDefinitionGroups[parentsIndex].tagDefinitionVos;
    list.splice(index,1);
    tagLayerInfosItem.tagDefinitionGroups[parentsIndex].tagDefinitionVos.splice(index,1);//同步数据
    if(list.length<=0){//全部删除干净 清空外层数组
      thisObj.tagDefinitionGroups.splice(parentsIndex,1);
      tagLayerInfosItem.tagDefinitionGroups.splice(parentsIndex,1);//同步数据
    }
    setLayarData(thisObj);
  }

  //设置展开收缩
  const checkBtn = () => {
    setIsClose(!isClose)
  }

  //一层关系
  const relationOne = () => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let thisRel = thisObj.tagRelation == 'AND'? 'OR' : 'AND';
    thisObj.tagRelation = thisRel;
    tagLayerInfosItem.tagRelation = thisRel;//同步数据
    setLayarData(thisObj);
  }
  //二层关系
  const relationTwo = (item,parentsIndex) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let thisRel = item.relationValue=='AND'? 'OR' : 'AND';
    thisObj.tagDefinitionGroups[parentsIndex].relationValue = thisRel;
    tagLayerInfosItem.tagDefinitionGroups[parentsIndex].relationValue = thisRel;
    setLayarData(thisObj);
  }

  //内层渲染
  const renderTwo = (list,parents,parentsIndex)=>{
    return <div className={list.length>1 ? style.attributeBox:''}>
      {list.length>1 ? <div className={style.filterCon}>
        <div className={style.relation}>
          <span className={style.relationLine}></span>
          <span className={style.clickBtn} onClick={()=>relationTwo(parents,parentsIndex)}>{parents.relationValue == 'AND' ? "且" : "或"}</span>
          <span className={style.relationLine}></span>
        </div>
      </div>:''}
      <div className={style.condition}>
        {
          list.map((item,index)=>{
            return <div className={style.attributeItem} key={item.loopId}>
              <UserAttributeModule twoObj={item} indexObj={{index:index,pIndex:parentsIndex,levelIndex:itemIndex}} setParentsData={setParentsData}/>
              <span className={style.deletebtn} onClick={() => deleteChild(index,parentsIndex)}>
                <CloseOutlined />
              </span>
            </div>
          })
        }
      </div>
    </div>
  }

  //外层渲染
  const traverseObj = (list) => {
    return list.map((item,index)=>{
      return <div className={style.oneBox} key={item.loopId}>
        {renderTwo(item.tagDefinitionVos,item,index)}
        <div className={style.activeBtn} style={{bottom: item.tagDefinitionVos.length>1 ? '20px':'10px',}}>
          <span className={style.addBtn} onClick={() => addObj(index)}>
            <span className={style.icon}>
              <PlusCircleOutlined />
            </span>
            <span className={style.text}>新增</span>
          </span>
        </div>
      </div>
    })
  }

  return (
    <div className={style.userAttributeBox}>
      {/* 用户属性满足 */}
      <div className={style.title}>
        <div className={style.leftBox}>
          <span className={style.check} onClick={checkBtn}>
            {
              isClose ? <MinusSquareOutlined /> : <PlusSquareOutlined />
            }
          </span>
          <span>用户属性满足 (标签)</span>
        </div>
        <div className={style.rightBox} onClick={attributeAdd}>
          <span className={style.icon}>
            <PlusCircleOutlined />
          </span>
          <span>添加</span>
        </div>
      </div>
      {
        <div className={style.attributeBox} style={{display:isClose?'flex':'none'}}>
          {layarData.tagDefinitionGroups.length > 0 ?
            <div className={style.filterCon}>
              <div className={style.relation}>
                <span className={style.relationLine}></span>
                <span className={style.clickBtn} onClick={relationOne}>{layarData.tagRelation == 'AND' ? "且" : "或"}</span>
                <span className={style.relationLine}></span>
              </div>
            </div> : ""
          }
          <div className={style.condition}>
            {
              traverseObj(layarData.tagDefinitionGroups)
            }
          </div>
        </div>
      }
    </div >
  )
}
export default connect(({ tagAttribute }) => ({
  parentsData: tagAttribute.parentsData,
}))(TagAttribute);