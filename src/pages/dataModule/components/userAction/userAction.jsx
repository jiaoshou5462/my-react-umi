//用户行为
import React, { useEffect, useState, useRef, } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Button, Select, Space
} from 'antd';
import { PlusSquareOutlined, MinusSquareOutlined, CloseOutlined, PlusCircleOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import UserActionModal from './userActionModal'

const { Option } = Select;
const selectData = {
  oneList: [],
  twoList: [],
  threeList:[],
}
let compId = 0;//子组件自增id，用于渲染key
const userAction = (props) => {
  const {dispatch, tagLayerInfosItem,itemIndex,parentsData} = props;
  const [isClose, setIsClose] = useState(true)//展开收缩
  const [layarData, setLayarData] = useState(tagLayerInfosItem) //当前层对象
  
  const setParentsData=(parentsData)=>{
    if(JSON.stringify(parentsData) == '{}') return;
    if(parentsData.indexObj && parentsData.indexObj.levelIndex == itemIndex){
      let {index,pIndex} = parentsData.indexObj;
      if(tagLayerInfosItem.eventDefinitionGroups[pIndex]){
        tagLayerInfosItem.eventDefinitionGroups[pIndex].eventDefinitions[index] = parentsData.data;
        let _tagLayerInfosItem = JSON.parse(JSON.stringify(tagLayerInfosItem));
        setLayarData(_tagLayerInfosItem);
      }
    }
  };
  //内层添加
  const addObj = (index) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let itemObj = {
      behaviorType:'DONE',//下拉框1
      startDate:'',//开始时间
      endDate:'',//结束时间
      userEventInfoId:'',//用户行为
      eventPropertiesGroup:{
        relationValue:'AND',
        eventPropertiesDefinitions:[],
      },//行为属性-并且满足
      eventCountGroup:{
        relationValue:'AND',
        eventCountDefinitions:[],
      },//行为统计-总计
      loopId:`loop${++compId}`,
    }
    thisObj.eventDefinitionGroups[index].eventDefinitions.push(itemObj);
    tagLayerInfosItem.eventDefinitionGroups[index].eventDefinitions.push(itemObj);//同步数据
    setLayarData(thisObj);
    setIsClose(true);
  }
  //外层添加
  const attributeAdd = () => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let itemObj = {
      relationValue:'AND',
      eventDefinitions:[{
        behaviorType:'DONE',//下拉框1
        startDate:'',//开始时间
        endDate:'',//结束时间
        userEventInfoId:'',//用户行为
        dateType:'BETWEEN',
        eventPropertiesGroup:{
          relationValue:'AND',
          eventPropertiesDefinitions:[],
        },//行为属性-并且满足
        eventCountGroup:{
          relationValue:'AND',
          eventCountDefinitions:[],
        },//行为统计-总计
      }],
      loopId: `loop${++compId}`,
    }
    thisObj.eventDefinitionGroups.push(itemObj);
    tagLayerInfosItem.eventDefinitionGroups.push(itemObj);//同步数据
    setLayarData(thisObj);
    setIsClose(true);
  }
  //删除
  const deleteChild = (index,parentsIndex) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let list = thisObj.eventDefinitionGroups[parentsIndex].eventDefinitions;
    list.splice(index,1);
    tagLayerInfosItem.eventDefinitionGroups[parentsIndex].eventDefinitions.splice(index,1);//同步数据
    if(list.length<=0){//全部删除干净 清空外层数组
      thisObj.eventDefinitionGroups.splice(parentsIndex,1);
      tagLayerInfosItem.eventDefinitionGroups.splice(parentsIndex,1);//同步数据
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
    let rel = thisObj.eventRelation == 'AND'? 'OR' : 'AND';
    thisObj.eventRelation = rel;
    tagLayerInfosItem.eventRelation = rel;
    setLayarData(thisObj);
  }
  //二层关系
  const relationTwo = (item,parentsIndex) => {
    let thisObj = JSON.parse(JSON.stringify(layarData));
    let rel = item.relationValue=='AND'? 'OR' : 'AND';
    thisObj.eventDefinitionGroups[parentsIndex].relationValue = rel;
    tagLayerInfosItem.eventDefinitionGroups[parentsIndex].relationValue = rel;
    setLayarData(thisObj);
  }
  //内层dom渲染
  const twoDomRander = (list,index,pIndex)=>{
    let item = list[index];
    return <div className={style.attributeItem} key={item.id || item.loopId}>
      <UserActionModal twoObj={item} indexObj={{index:index,pIndex:pIndex,levelIndex:itemIndex}} setParentsData={setParentsData}/>
      {list && list.length-1==index ? <div className={style.activeBtn} style={{bottom: list.length>1 ? '20px':'10px',}}
      onClick={() => addObj(pIndex)}>
        <span className={style.icon}>
          <PlusCircleOutlined />
        </span>
        <span className={style.text}>新增</span>
      </div>:''}
      <span className={style.deletebtn} onClick={() => deleteChild(index,pIndex)}>
        <CloseOutlined />
      </span>
  </div>
  }

  //外层渲染
  const traverseObj = (list) => {
    return list.map((pItem,pIndex)=>{
      return <div className={style.oneBox} key={pItem.id || pItem.loopId}>
        <div className={pItem.eventDefinitions.length>1 ? style.attributeBox:''} >
          {pItem.eventDefinitions.length>1 ? <div className={style.filterCon}>
            <div className={style.relation}>
              <span className={style.relationLine}></span>
              <span className={style.clickBtn} onClick={()=>relationTwo(pItem,pIndex)}>
                {pItem.relationValue == 'AND' ? "且" : "或"}
              </span>
              <span className={style.relationLine}></span>
            </div>
          </div>:''}
          <div className={style.condition}>
            {
              pItem.eventDefinitions.map((item,index)=>{
                return twoDomRander(pItem.eventDefinitions,index,pIndex)
              })
            }
          </div>
        </div>
      </div>
    })
  }

  return (
    <div className={style.userActionBox}>
      {/* 用户属性满足 */}
      <div className={style.title}>
        <div className={style.leftBox}>
          <span className={style.check} onClick={checkBtn}>
            {
              isClose ? <MinusSquareOutlined /> : <PlusSquareOutlined />
            }
          </span>
          <span>用户行为满足</span>
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
          {layarData.eventDefinitionGroups.length > 0 ?
            <div className={style.filterCon}>
              <div className={style.relation}>
                <span className={style.relationLine}></span>
                <span className={style.clickBtn} onClick={relationOne}>{layarData.eventRelation == 'AND' ? "且" : "或"}</span>
                <span className={style.relationLine}></span>
              </div>
            </div> : ""
          }
          <div className={style.condition}>
            {
              traverseObj(layarData.eventDefinitionGroups)
            }
          </div>
        </div>
      }
    </div >
  )
}
export default connect(({ dataModule_userAction }) => ({
  parentsData: dataModule_userAction.parentsData,
}))(userAction);