//创建弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Button, Modal, Steps, message,Radio } from 'antd';
import SelectCreate from '../selectCreate/selectCreate'
import CreateMessage from '../createMessage/createMessage'
import TagRules from '../tagRules/tagRules'
import Complate from '../complate'
import { cardIncludes } from '@/pages/dataModule/tagModule/dict.js';
//表单数据(回显问题保证数据源)
let defaultFrom = {
  groupName: "",//标签显示名
  groupCode: "",//标签ID
  refreshType: "",//更新方式
  remark: "",//备注
  runStatus: '1',
}
const { Step } = Steps;
//自定义步骤
const steps = [
  {title: '创建方式'},
  {title: '基础信息'},
  {title: '分群规则'},
  {title: '完成'},
];
//导入
const stepsExport = [
  {title: '创建方式'},
  {title: '基础信息'},
  {title: '完成'},
];
const getControlType = (list,id)=>{
  for(let item of list){
    if(id == item.id){
      return item.controlType;
    }
  }
}

const CreateTagModal = (props) => {
  const { tagLayerInfos, allImportUserGroupData, allUserGroupData, isCustomFlag, current, isCreateModalVisible, dispatch,modalType,twoListData} = props;
  const [defalultObjs, seDefalultObjs] = useState(defaultFrom)
  const childRef = useRef();
  const [createLoading,setCreateLoading] = useState(false);
  const [policyUnique,setPolicyUnique] = useState(false);
  let tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};

  //设置去重
  useEffect(() => {
    setPolicyUnique(allUserGroupData.policyUnique || false)
  }, [allUserGroupData]);
 
  //下一步
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
            type: 'setGroupList/num',
            payload: current + 1,
          });
          //跳转到下一个页面时保存数据
          let newObjs = {
            groupName: objs.groupName,//标签显示名
            groupCode: objs.groupCode,//标签ID
            website: objs.website,//自动更新
            remark: objs.remark,//备注
            runStatus: objs.runStatus===true? '1':'0',
          }
          seDefalultObjs({
            ...defalultObjs,
            ...newObjs
          })
        } else {
          return false;
        }
      }).catch((e) => { console.log(e) })
    } else {
      if(current==2 && !formVeri()) return;
      dispatch({
        type: 'setGroupList/num',
        payload: current + 1,
      });
    }
  };
  //清空缓存
  const clearData = ()=>{
    dispatch({
      type: 'setGroupList/clearDataAction',
      payload: '',
    });
  }
  //关闭弹窗
  const handleCancel = (type) => {
    clearData();
    dispatch({
      type: 'setGroupList/isCreateModalVisible',
      payload: false,
    });
  };
  const prev = () => {
    dispatch({
      type: 'setGroupList/num',
      payload: current - 1,
    });
    // setCurrent(current - 1);
  };

  const formVeri=()=>{
    //非空校验
    if(isCustomFlag=='tag'){//标签人群校验
      let item = tagLayerInfos[0];
      if(item.tagDefinitionGroups.length) {
        for (let item1 of item.tagDefinitionGroups) {
          if(item1.tagDefinitionVos) {
            for (let item2 of item1.tagDefinitionVos) {
              if(item2.dataTypeKey!=="HIDE") {
                if(!item2.tagLayerInfoIds){
                  Modal.error({content: '用户属性满足信息填写不完整，请完善全部信息后再提交'});
                  return false;
                }
              }
            }
          }
        }
      }else{
        Modal.error({content: '用户属性满足必填，请完善全部信息后再提交'});
        return false;
      }
    }else{//自定义人群
      let item = tagLayerInfos[0];
      if(!item.eventDefinitionGroups.length && !item.propertiesDefinitionGroups.length){
        Modal.error({content: '用户属性满足或用户行为满足信息选填一项，请完善全部信息后再提交'});
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
                    Modal.error({content: '用户属性满足信息填写不完整，请完善全部信息后再提交'});
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
                  Modal.error({content: '用户行为满足信息填写不完整，请完善全部信息后再提交'});
                  return false;
                } 
              }else{
                if(!item2.dateExtraValue){
                  Modal.error({content: '用户行为满足信息填写不完整，请完善全部信息后再提交'});
                  return false;
                }  
              }
              if(item2.eventPropertiesGroup.eventPropertiesDefinitions) {
                for (let item3 of item2.eventPropertiesGroup.eventPropertiesDefinitions) {
                  if(item3.controlType !=='HIDE'){
                    if(!item3.propertyValue){
                      Modal.error({content: '用户行为满足信息填写不完整，请完善全部信息后再提交'});
                      return false;
                    }
                  }
                }
              }
              if(item2.eventCountGroup.eventCountDefinitions) {
                for (let item3 of item2.eventCountGroup.eventCountDefinitions) {
                  if(!item3.propertyValue){
                    Modal.error({content: '用户行为满足信息填写不完整，请完善全部信息后再提交'});
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
          let isEdit = JSON.stringify(allImportUserGroupData) != "{}";
          setCreateLoading(true);
          let sendObj={
            createType: 'IMPORT',
            groupName: objs.groupName,
            groupCode:`user_group${objs.groupCode}`,
            remark:objs.remark,
            channelName: tokenObj.channelName,
            channelId: tokenObj.channelId,
            code:objs.code,
            runStatus: objs.runStatus === true ? '1':'0',
          }
          if(isCustomFlag == 'import'){
            sendObj.useNewFile = objs.useNewFile;
          }
          if(isEdit){
            sendObj.id = allImportUserGroupData.id;
          }
          dispatch({
            type: isEdit? 'setGroupList/putAllImportUserGroupData' : 'setGroupList/postTagImportData',
            payload: {
              method: isEdit? 'put':'postJSON',
              params: sendObj,
            },
            callback: (res) => {
              if(res) {
                setCreateLoading(false);
                handleCancel()
                message.success('提交成功');
                dispatch({
                  type: 'setGroupList/getUserGroupData',
                  payload: {
                    method: 'postJSON',
                    params: {
                      pageNum: 1,
                    }
                  },
                });
              }
            }
          });
        } else {
          return false;
        }
      }).catch((e) => {})
    } else {

      if(!formVeri()) return;
      //规则创建
      form.validateFields().then(valid => {
        if (valid) {
          let objs = form.getFieldValue();
          objs.channelName = tokenObj.channelName
          objs.channelId = tokenObj.channelId
          objs.groupCode = 'user_group'+objs.groupCode
          objs.eventDefinitionGroups = tagLayerInfos[0].eventDefinitionGroups;
          objs.propertiesDefinitionGroups = tagLayerInfos[0].propertiesDefinitionGroups;
          objs.tagDefinitionGroups = tagLayerInfos[0].tagDefinitionGroups;
          objs.eventRelation = tagLayerInfos[0].eventRelation;
          objs.createType = isCustomFlag=='tag' ? 'TAG' : 'CUSTOMIZE';
          objs.policyUnique = policyUnique || false;
          objs.runStatus = objs.runStatus === true ? '1':'0';
          let isEdit = JSON.stringify(allUserGroupData) != "{}";
          if(isEdit) {
            objs.id = allUserGroupData.id
          }
          setCreateLoading(true);
          let url = '';
          if(isCustomFlag=='tag'){
            url = 'setGroupList/channelUserGroupTag';
            objs.tagRelation = tagLayerInfos[0].tagRelation;
          }else{
            url = 'setGroupList/putAllUserGroupData';
            objs.propertiesEventRelation = tagLayerInfos[0].propertiesEventRelation;
            objs.propertiesRelation = tagLayerInfos[0].propertiesRelation;
          }
          dispatch({
            type: url,
            payload: {
              method: isEdit?'putJSON':'postJSON',
              params: objs
            },
            callback: (res) => {
              if(res) {
                setCreateLoading(false);
                handleCancel()
                message.success('提交成功');
                dispatch({
                  type: 'setGroupList/getUserGroupData',
                  payload: {
                    method: 'postJSON',
                    params: {
                      pageNum: 1,
                    }
                  },
                });
              }
            }
          });
        }
      }).catch((e) => {})
      
    }
  };
  
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'setGroupList/isModalVisible',
      });
    }
  }, []);
  return (
    <div>
      <Modal title={modalType=='create'?"创建用户群":"修改用户群"} width={current==2 || current==3 ? 1200 : 1000}
      visible={isCreateModalVisible} maskClosable={false} onCancel={handleCancel}
        footer={[
          <div className={style.steps_cancel}>
            <Button
              type="default"
              key="cancel"
              onClick={()=>{handleCancel('cancel')}}
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
            {isCustomFlag !='import' && current != 0 && current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {(current == 3 || isCustomFlag=='import') && (
              <Button type="primary" loading={createLoading} onClick={() => create()}>
                {modalType=='create'?"创建":"修改"}
              </Button>
            )}
          </div>
        ]}>
        <Steps className={style.steps} current={current}>
          {isCustomFlag !='import' ? steps.map((item) => (
            <Step key={item.title} title={item.title} />
          )) : stepsExport.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          {
            current == 0 ? <SelectCreate /> : <div>
              <div style={{display: current == 1?'block':'none'}}>
                <CreateMessage props={props} cRef={childRef} data={defalultObjs} />
              </div>
              {current ==2 ? <TagRules props={props} /> : ''}
              {current ==3 ? <Complate data={defalultObjs} /> : ''}
            </div>
          }
        </div>
        {current ==2 && isCustomFlag=='custom' ? <div className={style.unrepeat}>
          取数去重规则：
          <Radio.Group onChange={(e)=>setPolicyUnique(e.target.value)} value={policyUnique}>
            <Radio value={false}>按用户唯一去重</Radio>
            <Radio value={true}>按用户保单唯一去重</Radio>
          </Radio.Group>
        </div>:''}
      </Modal>
    </div>
  )
}
export default connect(({ setGroupList,tagAttribute }) => ({
  isCreateModalVisible: setGroupList.isCreateModalVisible,
  current: setGroupList.num,
  modalType: setGroupList.modalType,
  isCustomFlag: setGroupList.isCustomFlag,
  attributeObj: setGroupList.attributeObj,
  attributeRelationOne: setGroupList.attributeRelationOne,
  attributeRelationTwo: setGroupList.attributeRelationTwo,
  tagLayerInfos: setGroupList.tagLayerInfos,
  allImportUserGroupData: setGroupList.allImportUserGroupData,
  allUserGroupData: setGroupList.allUserGroupData,
  twoListData: tagAttribute.twoListData,
}))(CreateTagModal);