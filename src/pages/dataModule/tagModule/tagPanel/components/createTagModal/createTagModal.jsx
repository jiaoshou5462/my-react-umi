//创建弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Row, Col, Form, Select, Input, Button, Tree, Modal, Tooltip, Steps, message } from 'antd';
import SelectCreate from '../selectCreate/selectCreate'
import CreateMessage from '../createMessage/createMessage'
import TagRules from '../tagRules/tagRules'
import { cardIncludes } from '@/pages/dataModule/tagModule/dict.js';
//表单数据(回显问题保证数据源)
let defaultFrom = {
  tagName: "",//标签显示名
  tagCode: "",//标签ID
  tagGroupId: "",//分类
  refreshType: "",//更新方式
  remark: "",//备注
}

const { Step } = Steps;
const CreateTagModal = (props) => {
  const { tagLayerInfos, isCustomFlag, current,modalType, isCreateModalVisible, labelAllInfoData, importLabelAllInfoData, dispatch } = props;
  const [defalultObjs, seDefalultObjs] = useState(defaultFrom)
  const [flag, setFlag] = useState(true) //創建
  const childRef = useRef();
  const [createLoading,setCreateLoading] = useState(false);
  let tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  const next = () => {
    if (current == 1) {
      const form = childRef.current.getForm();
      // 首先表单校验
      form.validateFields().then(valid => {
        if (valid) {
          //也可以在不需要正则验证的地方直接通过这种方式来获取值
          let objs = form.getFieldValue();
          //设置自动更新与手动更新的区别
          dispatch({
            type: 'setTagPanel/num',
            payload: current + 1,
          });
          //跳转到下一个页面时保存数据
          let newObjs = {
            tagName: objs.tagName,//标签显示名
            tagCode: objs.tagCode,//标签ID
            tagGroupId: objs.tagGroupId,//分类
            website: objs.website,//自动更新
            remark: objs.remark,//备注
          }
          seDefalultObjs({
            ...defalultObjs,
            ...newObjs
          }, (res) => {

          })
        } else {
          return false;
        }
      }).catch((e) => { console.log(e) })
    } else {
      dispatch({
        type: 'setTagPanel/num',
        payload: current + 1,
      });
    }
    // setCurrent(current + 1);
  };
  //清空缓存
  const clearData = ()=>{
    dispatch({
      type: 'setTagPanel/clearDataAction',
      payload: '',
    });
  }
  const handleCancel = () => {
    clearData();
    dispatch({
      type: 'setTagPanel/isCreateModalVisible',
      payload: false,
    });
    dispatch({
      type: 'setTagPanel/isCustomFlag',
      payload: true,
    });
    
  };
  const prev = () => {
    dispatch({
      type: 'setTagPanel/num',
      payload: current - 1,
    });
    dispatch({
      type: 'setTagPanel/isCustomFlag',
      payload: true,
    });
    // setCurrent(current - 1);
  };

  useEffect(()=> {
    setFlag(JSON.stringify(labelAllInfoData) == "{}" && JSON.stringify(importLabelAllInfoData) == "{}")
  },[labelAllInfoData, importLabelAllInfoData])
  const formVeri=()=>{
    //非空校验
    for (let item of tagLayerInfos) {
      if(!item.layerName){
        Modal.error({content: '分层名称不能为空，请完善全部信息后再提交'});
        return false;
      }
      if(!item.eventDefinitionGroups.length && !item.propertiesDefinitionGroups.length){
        Modal.error({content: `(${item.layerName}) 用户属性满足或用户行为满足信息选填一项，请完善全部信息后再提交`});
        return false;
      }
      //用户属性满足
      if(item.propertiesDefinitionGroups.length) {
        for (let item1 of item.propertiesDefinitionGroups) {
          if(item1.propertiesDefinitions) {
            for (let item2 of item1.propertiesDefinitions) {
              if(item2.metaKey && cardIncludes.includes(item2.metaKey)){
                let splitList = item2.propertyValue.split(';');
                if(splitList.length<2){
                  if(item2.dataTypeKey!=="HIDE"){
                    Modal.error({content: '用户属性满足信息填写不完整，请完善全部信息后再提交'});
                    return false;
                  }
                }else{
                  if(splitList[0]=='all_coupon'){
                    if(!splitList[1]){
                      Modal.error({content: '用户属性满足信息填写不完整，请完善全部信息后再提交'});
                      return false;
                    }
                  }
                  if(splitList[0]=='coupon' || splitList[0]=='coupon_category'){
                    if(!splitList[1] || !splitList[2] ){
                      Modal.error({content: '用户属性满足信息填写不完整，请完善全部信息后再提交'});
                      return false;
                    }
                  }
                }
              }else{
                if(item2.dataTypeKey!=="HIDE") {
                  if(!item2.propertyValue){
                    Modal.error({content: `(${item.layerName}) 用户属性满足信息填写不完整，请完善全部信息后再提交`});
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      if(item.eventDefinitionGroups.length) {
        for (let item1 of item.eventDefinitionGroups) {
          if(item1.eventDefinitions) {
            for (let item2 of item1.eventDefinitions) {
              if(item2.dateType == 'BETWEEN'){
                if(!item2.startDate || !item2.endDate){
                  Modal.error({content: `(${item.layerName}) 用户行为满足信息填写不完整，请完善全部信息后再提交 (时间区间)`});
                  return false;
                } 
              }else{
                if(!item2.dateExtraValue){
                  Modal.error({content: `(${item.layerName}) 用户行为满足信息填写不完整，请完善全部信息后再提交`});
                  return false;
                }  
              }
              if(item2.eventPropertiesGroup.eventPropertiesDefinitions) {
                for (let item3 of item2.eventPropertiesGroup.eventPropertiesDefinitions) {
                  if(item3.controlType !=='HIDE'){
                    if(!item3.propertyValue){
                      Modal.error({content: `(${item.layerName}) 用户行为满足信息填写不完整，请完善全部信息后再提交 (筛选条件)`});
                      return false;
                    }
                  }
                }
              }
              if(item2.eventCountGroup.eventCountDefinitions) {
                for (let item3 of item2.eventCountGroup.eventCountDefinitions) {
                  if(!item3.propertyValue){
                    Modal.error({content: `(${item.layerName}) 用户行为满足信息填写不完整，请完善全部信息后再提交 (次数统计)`});
                    return false;
                  } 
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
  const create = () => {
    const form = childRef.current.getForm();
    if (current == 1) {
      // 首先表单校验
      form.validateFields().then(valid => {
        if (valid) {
          //也可以在不需要正则验证的地方直接通过这种方式来获取值
          let objs = form.getFieldValue();
          //设置自动更新与手动更新的区别
          let formData = new FormData()
          formData.append('createType', 'IMPORT');
          formData.append('tagName', objs.tagName);
          formData.append('tagCode', 'user_'+objs.tagCode);
          formData.append('tagGroupId', objs.tagGroupId);
          // formData.append('identifyType', objs.identifyType);
          formData.append('remark', objs.remark);
          formData.append('channelName', tokenObj.channelName);
          formData.append('channelId', tokenObj.channelId);
          objs.tagLayers.forEach((item,index) => {
            formData.append(`tagLayers[`+index+`].layerName`, item.layerName);
            if(item.id) {
              formData.append(`tagLayers[`+index+`].id`, item.id);
            }
            if(item.file) {
              formData.append(`tagLayers[`+index+`].file`, item.file);
            }
          })
          let isEdit = JSON.stringify(importLabelAllInfoData) != "{}";
          if(isEdit){
            formData.append('id', importLabelAllInfoData.id);
          }
          setCreateLoading(true);
          dispatch({
            type: isEdit?'setTagPanel/putImportLabelData':'setTagPanel/postTagImportData',
            payload: {
              method: isEdit?'put':'upload',
              headers: {'Content-Type': 'multipart/form-data'},
              params: formData
            },
            callback: (res) => {
              if(res) {
                setCreateLoading(false);
                message.success('提交成功');
                handleCancel()
                dispatch({
                  type: 'setTagPanel/getGroupAllData',
                  payload: {
                    method: 'get',
                    params: {}
                  },
                });
              }
            }
          });
        } else {
          return false;
        }
      }).catch((e) => { console.log(e) })
    } else {
      //非空校验
      if(!formVeri()) return;
      //规则创建
      form.validateFields().then(valid => {
        if (valid) {
          let objs = form.getFieldValue();
          objs.tagLayerInfos = tagLayerInfos;
          objs.tagCode = 'user_'+ objs.tagCode;
          objs.channelName = tokenObj.channelName;
          objs.channelId = tokenObj.channelId
          objs.createType = 'CUSTOMIZE'
          objs.tagLayers = undefined;
          let isEdit = JSON.stringify(labelAllInfoData) != "{}";
          if(isEdit){
            objs.id = labelAllInfoData.id
          }
          setCreateLoading(true);
          dispatch({
            type: isEdit? 'setTagPanel/putUserLaberData':'setTagPanel/createTag',
            payload: {
              method: isEdit ? 'putJSON':'postJSON',
              params: objs
            },
            callback: (res) => {
              if(res) {
                setCreateLoading(false);
                message.success('提交成功');
                handleCancel()
                dispatch({
                  type: 'setTagPanel/getGroupAllData',
                  payload: {
                    method: 'get',
                    params: {}
                  },
                });
              }
            }
          });
        }
      }).catch((e) => { console.log(e) })
      
    }
  };

  //自定义步骤
  const steps = [
    {
      title: '创建方式',
      content: 'First-content',
    },
    {
      title: '基础信息',
      content: 'Second-content',
    },
    {
      title: '标签规则',
      content: 'Last-content',
    },
  ];
  //导入
  const stepsExport = [
    {
      title: '创建方式',
      content: 'First-content',
    },
    {
      title: '基础信息',
      content: 'Second-content',
    }
  ];

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'setTagPanel/isModalVisible',
      });
    }
  }, []);
  return (
    <div>
      <Modal title={modalType=='create'?"创建用户标签":"修改用户标签"} width={current==2 ? 1200 : 1000}
      visible={isCreateModalVisible} maskClosable={false} onCancel={handleCancel}
        footer={[
          <div className={style.steps_cancel}>
            <Button
              type="default"
              key="cancel"
              onClick={handleCancel}
            >
              取消
            </Button>
          </div>,
          <div className={style.steps_action}>
            {(modalType=='create' && current>0 ) || (modalType=='edit' && current>1 ) ? (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            ):''}
            {/* isAuto是否是自定义自动更新,isCustomFlag是否是自定义 */}
            {isCustomFlag && current != 0 && current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {( current == 2 || !isCustomFlag) && (
              <Button type="primary" loading={createLoading} onClick={() => create()}>
                {modalType=='create'?"创建":"修改"}
              </Button>
            )}
          </div>
        ]}>
        <Steps className={style.steps} current={current}>
          {isCustomFlag ? steps.map((item, index) => (
            <Step key={index} title={item.title} />
          )) : stepsExport.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          {
            current == 0 ? <SelectCreate /> : <div>
              <div style={{display: current == 1?'block':'none'}}><CreateMessage props={props} cRef={childRef} data={defalultObjs} /></div>
              {/* <div style={{display: current != 1?'block':'none'}}><TagRules props={props} /></div> */}
              {current !=1 ? <TagRules props={props} /> : ''}
            </div>
          }
        </div>
      </Modal>
    </div>
  )
}
export default connect(({ setTagPanel }) => ({
  isCreateModalVisible: setTagPanel.isCreateModalVisible,
  current: setTagPanel.num,
  modalType: setTagPanel.modalType,
  isCustomFlag: setTagPanel.isCustomFlag,
  attributeObj: setTagPanel.attributeObj,
  attributeRelationOne: setTagPanel.attributeRelationOne,
  attributeRelationTwo: setTagPanel.attributeRelationTwo,
  tagLayerInfos: setTagPanel.tagLayerInfos,
  codeUnique: setTagPanel.codeUnique,
  labelAllInfoData: setTagPanel.labelAllInfoData,
  importLabelAllInfoData: setTagPanel.importLabelAllInfoData,
}))(CreateTagModal);