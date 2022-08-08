//基础信息
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Radio
} from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import UserAttribute from '@/pages/dataModule/components/userAttribute/userAttribute'
import UserAction from '@/pages/dataModule/components/userAction/userAction'
import TagAttribute from '../tagAttribute/tagAttribute'


let indexTitle = 1;
let defaultObj = {
  propertiesEventRelation:'AND',//属性/行为 关系 总关系
  remark:'',
  eventRelation:'AND',//行为关系
  propertiesRelation:'AND',//属性关系
  propertiesDefinitionGroups: [],//属性数组
  eventDefinitionGroups:[],//行为数组
  tagDefinitionGroups:[],
  tagRelation:'AND',
}
const TagRules = (props) => {
  const { tagLayerInfos, dispatch, modalType,isCustomFlag } = props;
  //属性行为 关系
  const relationTag=(index)=>{
    let thisRel = tagLayerInfos[index].propertiesEventRelation == 'AND'?'OR':'AND';
    let _tagLayerInfos = JSON.parse(JSON.stringify(tagLayerInfos));
    _tagLayerInfos[index].propertiesEventRelation = thisRel;
    dispatch({
      type: 'setGroupList/setTagLayerInfos',
      payload: _tagLayerInfos
    });
  }

  //页面加载，初始创建分层
  useEffect(()=>{
    let _tagLayerInfos = JSON.parse(JSON.stringify(tagLayerInfos))
    let obj = JSON.parse(JSON.stringify(defaultObj));
    if(modalType == "create" && !_tagLayerInfos.length) {//新增
      _tagLayerInfos = [obj];
    }
    obj.layerName = "分层" + indexTitle;
    dispatch({
      type: 'setGroupList/setTagLayerInfos',
      payload: _tagLayerInfos
    });
  },[]);

  return (
    <div className={style.layer_box}>
      {/* 用户属性动态表单 */}
      {
        tagLayerInfos.map((item, index) => {
          return <div key={item.id}>
            <div className={style.tagBox}>
              {isCustomFlag == 'custom' ? <> <div className={style.tagRaletion}>
                <span className={style.relationLine}></span>
                <span className={style.clickBtn} onClick={()=>relationTag(index)}>{item.propertiesEventRelation=='AND'?'且':'或'}</span>
                <span className={style.relationLine}></span>
              </div>
              <div className={style.tagItem}>
                <UserAttribute tagLayerInfosItem={item} itemIndex={index} />
                <UserAction tagLayerInfosItem={item} itemIndex={index} />
              </div></>:
              <TagAttribute tagLayerInfosItem={item} itemIndex={index}/>}
            </div>
          </div>
        })
      }
    </div >
  )
}
export default connect(({ setGroupList }) => ({
  tagLayerInfos: setGroupList.tagLayerInfos,
  hierarchyIndex: setGroupList.hierarchyIndex,
  allUserGroupData: setGroupList.allUserGroupData,
  modalType: setGroupList.modalType,
  isCustomFlag: setGroupList.isCustomFlag,
}))(TagRules);