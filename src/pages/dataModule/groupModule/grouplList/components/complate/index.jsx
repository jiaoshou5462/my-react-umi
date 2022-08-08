// 用户群详情
//创建弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Button, Modal, Table, Radio } from 'antd';
import { behaviorTypeDict, countTypeDict, 
  eventDataType_Dict,eventDataTypeDown_Dict,eventDataTypeDown_bt_Dict,cardIncludes,cardSel_dict } from '@/pages/dataModule/tagModule/dict.js';

//匹配字典表
const getDictName=(dict,id,valueName='value')=>{
  for(let item of dict){
    if(item.id == id){
      return item[valueName];
    }
  }
  return id;
}
//匹配字典表 标签
const getTagName=(dict,id)=>{
  for(let one of dict){
    for(let two of one.tagInfos){
      if(two.id == id){
        return `${one.tagGroupName} / ${two.tagName}`;
      }
    }
  }
  return '';
}
const getThreeNameEach=(dict,ids)=>{
  let arr = [];
  for(let one of dict){
    for(let two of ids){
      if(one.id == two){
        arr.push(one.layerName);
      }
    }
  }
  return arr.join(',');
}
const getThreeName=(dict,ids,dictId)=>{
  let list = [];
  let idArr = ids.split(',');
  for(let one of dict){
    for(let two of one.tagInfos){
      if(two.id == dictId){
        list = two.tagLayers;
        return getThreeNameEach(list,idArr);
      }
    }
  }
  return ids;
}
//自定义标签 属性 谓语
const getSelectTwoName=(dict,id,dictId)=>{
  let list = [];
  for(let one of dict){
    if(one.id == dictId){
      list = one.dataTypeInfo.predicateInfoList;
      break;
    }
  }
  for(let item of list){
    if(item.id == id){
      return item.predicateName
    }
  }
  return id;
}
let createType={
  'import':'导入指定名单',
  'custom':'自定义人群',
  'tag':'标签人群',
}
let ruleType={
  'custom':'用户属性满足、用户行为满足',
  'tag':'用户属性满足（标签）',
}
const listDetail = (props) => {
  let { dispatch,modalInfo,complateObj,data,isCustomFlag,attributeSelectData,actionSelectData,selectData,twoListData } = props;
  let [pageInfo,setPageInfo] = useState({
    createUser:false,
    current:1,
    pageSize:10,
  })
  let [total, setTotal] = useState(0);
  let [list, setList] = useState([]);
  let [totalData,setTotalData] = useState({});
  
  //渲染 且/或关系
  const preRelation=(value)=>{
    return <div className={style.pre_relation}>
      <span></span><p>{value=='AND'?'且':'或'}</p><span></span>
    </div>
  }
  //用户行为 区间匹配
  const eventOne = (item)=>{
    if(item.dateType=='BETWEEN'){
      return <>
        <span>{getDictName(eventDataType_Dict,item.dateType)}</span>
        <span>{item.startDate.substr(0,10)} 至 {item.endDate.substr(0,10)}</span>
        <span>{getDictName(behaviorTypeDict,item.behaviorType)}</span>
        <span>{getDictName(actionSelectData.oneList,item.userEventInfoId,'nameZh')}</span>
      </>
    }
    if(item.dateType=='BEFORE_AFTER_NOW_BET'){
      let arr = item.dateExtraValue.split(',');
      return <>
        <span>{getDictName(eventDataType_Dict,item.dateType)}</span>
        <span>在</span>
        <span>{getDictName(eventDataTypeDown_bt_Dict,arr[0])}</span>
        {
          arr[0] != 'now'?<>
            <span>{arr[1]}</span>
            <span>到</span>
            <span>{arr[2]}</span>
            <span>天之间</span>
          </>:''
        }
        <span>{getDictName(behaviorTypeDict,item.behaviorType)}</span>
        <span>{getDictName(actionSelectData.oneList,item.userEventInfoId,'nameZh')}</span>
      </>
    }
    if(item.dateType=='BEFORE_AFTER_NOW'){
      let arr = item.dateExtraValue.split(',');
      return <>
        <span>{getDictName(eventDataType_Dict,item.dateType)}</span>
        <span>在</span>
        <span>{arr[0]}</span>
        <span>天</span>
        <span>{getDictName(eventDataTypeDown_Dict,arr[1])}</span>
        <span>{getDictName(behaviorTypeDict,item.behaviorType)}</span>
        <span>{getDictName(actionSelectData.oneList,item.userEventInfoId,'nameZh')}</span>
      </>
    }
  }

  // 用户属性 区间匹配
  const eventOneProp = (item,showValue)=>{
    let arr = showValue.split(',');
    if(item.dataTypeKey=='DATE'){
      return <>
        <span>在 {arr[0].substr(0,10)} 到 {arr[1].substr(0,10)}</span>
      </>
    }
    if(item.dataTypeKey=='SINGLE_DROP_INPUT_RANG'){
      let arr = showValue.split(',');
      return <>
        <span>在</span>
        <span>{getDictName(eventDataTypeDown_bt_Dict,arr[0])}</span>
        {
          arr[0] != 'now'?<>
            <span>{arr[1]}</span>
            <span>到</span>
            <span>{arr[2]}</span>
            <span>天之间</span>
          </>:''
        }
      </>
    }
    if(item.dataTypeKey=='INPUT_SINGLE_DROP'){
      let arr = showValue.split(',');
      return <>
        <span>在</span>
        <span>{arr[0]}</span>
        <span>天</span>
        <span>{getDictName(eventDataTypeDown_Dict,arr[1])}</span>
      </>
    }
    return showValue;
  }


  //用户属性 谓语值显示
  const showPropertiesValue=(item2)=>{
    let splitList = item2.propertyValue.split(';');
    if(item2.meta && cardIncludes.includes(item2.meta.metaKey)){
      return <>
      <span>{getDictName(cardSel_dict,splitList[0])}</span>
      <span>{splitList[1]}</span>
      <span>{splitList[2] ? eventOneProp(item2,splitList[2]) : ''}</span>
      </>
    }else{
      return <span>{item2.propertyValue}</span>
    }
  }

  return (
    <div className={style.complate_box}>
      <div className={style.block}>
        <div className={style.name}>用户群名称：</div>
        <div className={style.content}>{data.groupName}</div>
      </div>
      <div className={style.block}>
        <div className={style.name}>创建方式：</div>
        <div className={style.content}>{createType[isCustomFlag]}</div>
      </div>
      <div className={style.block}>
        <div className={style.name}>更新方式：</div>
        <div className={style.content}>{data.refreshType=='AUTO'?'例行更新(每天)':'手动更新'}</div>
      </div>
      {isCustomFlag == 'custom' || isCustomFlag=='tag' ?<div className={style.block}>
        <div className={style.name}>分群规则：</div>
        <div className={style.content}>
          <p>{ruleType[isCustomFlag]}</p>
          <div className={style.preview}>
          { 
          //标签群组
          isCustomFlag=='tag' ? <div className={style.tag_box}>
            <div className={style.pre_relation}>
              <span></span><p>{complateObj.tagRelation=='AND'?'且':'或'}</p><span></span>
            </div>
            {complateObj.tagDefinitionGroups.map((item,index)=>{
              return <div className={style.pre_one} style={{paddingLeft:item.tagDefinitionVos.length>1?'30px':'0'}}>
                {item.tagDefinitionVos.length>1?
                <div className={style.pre_relation}>
                  <span></span><p>{item.relationValue=='AND'?'且':'或'}</p><span></span>
                </div>:''}
                {item.tagDefinitionVos.map((item2)=>{
                  return <div className={style.pre_two}>
                  <span>{getTagName(selectData.oneList,item2.tagInfoId)}</span>
                  <span>{getDictName(twoListData,item2.predicateInfoId,'predicateName')}</span>
                  <span>{getThreeName(selectData.oneList,item2.tagLayerInfoIds,item2.tagInfoId)}</span>
                </div>
                })}
              </div>
            })}
          </div>:
          // 自定义群组
          <div className={style.cus_box}>
            <div className={style.pre_relation}>
              <span></span><p>{complateObj.propertiesEventRelation=='AND'?'且':'或'}</p><span></span>
            </div>
            {complateObj.propertiesDefinitionGroups.length ?<>
              <p>用户属性满足：</p>
              <div className={style.cus_block} style={{paddingLeft:'30px'}}>
                {preRelation(complateObj.propertiesRelation)}
                {complateObj.propertiesDefinitionGroups.map((item,index)=>{
                  return <div className={style.pre_one} style={{paddingLeft: item.propertiesDefinitions.length>1?'30px':'0'}}>
                    {item.propertiesDefinitions.length>1?preRelation(item.relationValue):''}
                    {item.propertiesDefinitions.map((item2)=>{
                      return <div className={style.pre_two}>
                      <span>{getDictName(attributeSelectData.oneList,item2.userMetaInfoId,'metaName')}</span>
                      <span>{getSelectTwoName(attributeSelectData.oneList,item2.predicateInfoId,item2.userMetaInfoId)}</span>
                      {
                        showPropertiesValue(item2)
                      }
                    </div>
                    })}
                  </div>
                })}
              </div>
            </>:''}
            {complateObj.eventDefinitionGroups.length ? <>
              <p>用户行为满足：</p>
              <div className={style.cus_block} style={{paddingLeft:'30px'}}>
                {preRelation(complateObj.eventRelation)}
                  {complateObj.eventDefinitionGroups.map((item,index)=>{
                  return <div className={style.pre_one} style={{paddingLeft:'30px'}}>
                    {preRelation(item.relationValue)}
                    {item.eventDefinitions.map((item2)=>{
                        return <><div className={style.pre_two}>
                        {eventOne(item2)}
                      </div>
                      {/* 行为筛选 */}
                      <div className={style.pre_and}>
                        {item2.eventPropertiesGroup.eventPropertiesDefinitions.length>1?<p>并且满足</p>:''}
                        <div className={style.pre_and_block} 
                        style={{paddingLeft: item2.eventPropertiesGroup.eventPropertiesDefinitions.length>1?'30px':'0'}}>
                        {item2.eventPropertiesGroup.eventPropertiesDefinitions.length>1?preRelation(item2.eventPropertiesGroup.relationValue):''}
                        {
                          item2.eventPropertiesGroup.eventPropertiesDefinitions.map((item3)=>{
                            return <div className={style.pre_count_item}>
                              <span>{getDictName(actionSelectData.twoList,item3.userEventPropertiesInfoId,'nameZh')}</span>
                              <span>{getDictName(actionSelectData.threeList,item3.predicateInfoId,'predicateName')}</span>
                              <span>{item3.propertyValue}</span>
                            </div>
                          })
                        }
                        </div>
                      </div>
                      {/* 行为数量 统计 */}
                      <div className={style.pre_count} style={{paddingLeft: item2.eventCountGroup.eventCountDefinitions.length>1?'30px':'0'}}>
                        {item2.eventCountGroup.eventCountDefinitions.length>1?preRelation(item2.eventCountGroup.relationValue):''}
                        {
                          item2.eventCountGroup.eventCountDefinitions.map((item3)=>{
                            return <div className={style.pre_count_item}>
                              <span>{getDictName(countTypeDict,item3.countType)}</span>
                              <span>{item3.operatorValue}</span>
                              <span>{item3.propertyValue}</span>
                            </div>
                          })
                        }
                      </div>
                    </>
                    })}
                  </div>
                })}
              </div>
            </>:''}
          </div>}
          </div>
        </div>
      </div>:''}
      <div className={style.block}>
        <div className={style.name}>状态：</div>
        <div className={style.content}>
          {data.runStatus=='1'? <span style={{color:'#52c41a'}}>启用</span>: <span style={{color:'#f5222d'}}>禁用</span>}
        </div>
      </div>
    </div>
  )
}
export default connect(({ setGroupList,dataModule_common,tagAttribute }) => ({
  listDetailShow:setGroupList.listDetailShow,
  complateObj: setGroupList.tagLayerInfos[0],
  isCustomFlag: setGroupList.isCustomFlag,
  attributeSelectData: dataModule_common.attributeSelectData,
  actionSelectData: dataModule_common.actionSelectData,
  selectData: tagAttribute.selectData,
  twoListData: tagAttribute.twoListData,
}))(listDetail);