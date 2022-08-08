import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Image, Row, Col, Tag, Steps, Select, message, DatePicker,Upload, Switch,Form, Radio,Input,InputNumber,Button  } from "antd"
import { UploadOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Option } = Select;
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Step } = Steps;
import { formatDate } from '@/utils/date';

import FirstStep from "../components/firstStep";
import SecondStep from "../components/secondStep";

const createStrategicPage = (props) => {
  let { dispatch,currentStep } = props
  let queryId = history.location.query.id;
  let [wanderStrategyCrowdVOList,setWanderStrategyCrowdVOList] = useState([])
  let [wanderStrategyTaskVOList,setWanderStrategyTaskVOList] = useState([])
  let [userSelectedRows,setUserSelectedRows] = useState({})
  let [configData, setConfigData] = useState({})
  let [isSeeType, setIsSeeType] = useState(false);  //是否查看状态
  /*== 更改当前step ==*/ 
  let changeStep = (currentStep) => {
    if(currentStep==0){
      dispatch({
        type: 'createStrategic/isToFirstStep',
        payload: new Date().getTime()
      })
    }else{
      dispatch({
        type: 'createStrategic/isToSecondStep',
        payload: new Date().getTime()
      })
    }
  }
  // 清除缓存
  useEffect(()=>{
    if(queryId){
        dispatch({
          type: 'createStrategic/queryWanderStrategyById',
          payload: {
            method: 'get',
            params: {
              id:queryId
            }
          },
          callback: (res) => {
            if (res.result.code === '0') {
              echoDataChange(res.body)
              if(res.body.status && (res.body.status ===4 || res.body.status ===3 || res.body.status ===2)){
                setIsSeeType(true);
              }else{
                setIsSeeType(false);
              }
            } else {
              message.error(res.result.message)
            }
          }
        })
      }
  },[])
  useEffect(()=>{
    return ()=>{  // 离开当前页面清除数据
      dispatch({
        type: 'createStrategic/setReset',
      })
    }
  },[])
   
  
  useEffect(()=>{
    if(queryId){
      let secondStepData = {
        wanderStrategyCrowdVOList:wanderStrategyCrowdVOList?wanderStrategyCrowdVOList:[],
        wanderStrategyTaskVOList:wanderStrategyTaskVOList?wanderStrategyTaskVOList:[],
        userSelectedRows:userSelectedRows?userSelectedRows:{},
        configData:configData?configData:{}
      }
      dispatch({
        type: 'createStrategic/setEditSecondStepData',
        payload: {
          secondStepData
        }
      })
    }
  },[wanderStrategyCrowdVOList,wanderStrategyTaskVOList,userSelectedRows,configData])
  let echoDataChange = (echoData) =>{
    console.log(echoData,"echoData");
    // 基础设置回显数据处理
    let firstStepEchoData = {

      projectId:echoData.projectId,
      strategyName:echoData.strategyName,
      strategyType:echoData.strategyType
    }
    let strategyTypeInfo = JSON.parse(echoData.strategyTypeInfo)
    for(let x in strategyTypeInfo){
      if(x.indexOf('time_1')>0) {
        strategyTypeInfo[x] = moment(strategyTypeInfo[x])
      }else if(x.indexOf('time_2')>0){
        let str = x+'_'+strategyTypeInfo['repeat_range'] 
        strategyTypeInfo[str] = moment(strategyTypeInfo[x],'HH:mm:ss')
      }else if(x.indexOf('effectiveTime_1')>0){
        strategyTypeInfo[x] = [moment(echoData.validPeriodStartTime),moment(echoData.validPeriodEndTime)]
      }else if(x.indexOf('effectiveTime_2')>0){
        strategyTypeInfo[x] = [moment(echoData.validPeriodStartTime),moment(echoData.validPeriodEndTime)]
      }
    }
    dispatch({
      type: 'createStrategic/setFirstStepData',
      payload: {
        firstStepData:{},
        id:echoData.id
      }
    })
    dispatch({
      type: 'createStrategic/setFirstEchoStepData',
      payload: {
        echoFirstStepData:Object.assign({},firstStepEchoData,strategyTypeInfo),
      }
    })
    // 策略配置触发条件回显
    let configData = echoData.configData?JSON.parse(echoData.configData):{}
    if(configData.rangeStartTime&&configData.rangeEndTime){
       configData.rangeTriggerTime = [(moment(formatDate(configData.rangeStartTime), 'YYYY-MM-DD')),(moment(formatDate(configData.rangeEndTime), 'YYYY-MM-DD'))]
       configData.rangeStartTime = formatDate(configData.rangeStartTime)
       configData.rangeEndTime = formatDate(configData.rangeEndTime)
    }
    if(configData.changeActivityId ){
      configData.changeActivityId = configData.changeActivityId+'_'+configData.changeActivityName
    }
    if(configData.pageBrowsingId){
      configData.pageBrowsingId = configData.pageBrowsingId+'_'+configData.pageBrowsingName
    }
    for(let x in configData) {
      if(x!='triggerSenceId'&& x!='configId'){
        let xStr = x+'_'+configData.configId
        configData[xStr] = configData[x]
        if(x == 'prizeType'){
          //prizeType可能为多个number，需要转字符串
          let xStr = x+'_'+configData.configId
          let configDataStr = configData[x]+'';
          configData[xStr] = configDataStr.split(",").map(item=>{return Number(item)})
        }
      }
    }

    setConfigData(configData)
    // 策略配置回显数据处理
    wanderStrategyCrowdVOList = echoData.wanderStrategyCrowdVOList
    wanderStrategyTaskVOList = echoData.wanderStrategyTaskVOList
    let echoSecondStepData = {}
    //执行任务数据处理，等待时间，频率taskRule处理，用于必填项
    wanderStrategyTaskVOList.forEach((item,index)=>{
      echoSecondStepData['taskType_'+item.id] = item.taskType
      echoSecondStepData.userSource = echoData.userSource
      echoSecondStepData['taskWaitTime_'+item.id] = item.taskWaitTime
      let taskRule = JSON.parse(item.taskRule)
      for(let x in taskRule) {
        let xStr = x+'_'+item.id
        echoSecondStepData[xStr] = taskRule[x]
        item[x] = taskRule[x]
      }
      if(item.taskType==1){
        echoSecondStepData['cardBatch_'+item.id] = item.cardBatch
        cardSelectData(item.cardBatch,item.id,index)
      }
      if(item.taskType==2){
        echoSecondStepData['temp_'+item.id] = item.tempId
        tempMessageData(item.tempId,item.id,index,taskRule)
      }
      if(item.taskType==3){
        item.timestamp = item.id
        echoSecondStepData['popup_'+item.id] = item.popupId
      }      
    })
    echoSecondStepData = Object.assign(echoSecondStepData,configData)
    setWanderStrategyCrowdVOList([...wanderStrategyCrowdVOList])
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
    setUserSelectedRows({
      crowdStr:echoData.crowdStr,
      crowdPeopleCount:echoData.crowdPeopleCount
    })
   
    dispatch({
      type: 'createStrategic/setEditEchoSecondStepData',
      payload: {
        echoSecondStepData
      }
    })
  }
   
  // 获取模板编辑详情，获取模板所需数据较多直接赋值，同时将原来wanderStrategyTaskVOList[index]上id等字段补全
  let tempMessageData = (tempId,id,index,taskRule) => {
      dispatch({
        type: 'createStrategic/getMarketingSceneTemplate',
        payload: {
          method: 'get',
          params: {
            sceneTemplateMessageId:tempId
          }
        },
        callback: (res) => {
          if (res.result.code === '0') {
            let resData = JSON.parse(JSON.stringify(res.body))
            delete resData.data
            for(let x in taskRule){
              resData[x] = taskRule[x]
            }
            resData.timestamp = id
            resData.tempId = tempId
            resData.taskType = 2
            resData.id = id
            resData.wanderStrategyCouponVOList = res.body.sceneTemplateVariableList
            resData.taskWaitTime = wanderStrategyTaskVOList[index].taskWaitTime
            wanderStrategyTaskVOList[index] = resData
            setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
          } else {
            message.error(res.result.message)
          }
        }
      })
  }
  // 获取卡券详情
  let cardSelectData = (cardBatch,id,index) => {
    dispatch({
      type: 'createStrategic/listWanderGrantBatchDetail',
      payload: {
        method: 'postJSON',
        params: {
          grantBatchId:cardBatch,
          cardPackageFlag:4,
          wanderTaskId: id,
          type:2
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          wanderStrategyTaskVOList[index].timestamp = id
          wanderStrategyTaskVOList[index].wanderStrategyCouponVOList = res.body
          setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
        } else {
          message.error(res.result.message)
        }
      }
    })
}
  return (
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <span>{queryId?'编辑':'创建'}营销策略</span>
        </div>
        <div className={ currentStep==0?style.step_content_first:style.step_content_second}>
          <div className={style.step_part}>
            <Steps current={currentStep}>
              <Step title="基础设置" onClick={()=>changeStep(0)}/>
              <Step title="策略配置" onClick={()=>changeStep(1)}/>
            </Steps>
          </div>
         {currentStep==0?<FirstStep isSeeType={isSeeType}/>:<SecondStep isSeeType={isSeeType}/> } 
        </div>
      </div>
    </div>
  )
};
export default connect(({ createStrategic }) => ({
  currentStep:createStrategic.currentStep
}))(createStrategicPage)
