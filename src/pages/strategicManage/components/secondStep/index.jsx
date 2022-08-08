import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Modal, Steps, Select, message, DatePicker,Upload, Table,Form, Radio,InputNumber,Button  } from "antd"
import { UploadOutlined,SendOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Option } = Select;
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import PeopleSelectModel from '../peopleSelectModel';
import CardSelectModel from '../cardSelectModel'
import TempSelectModel from '../tempSelectModel'
import ContentSelectModal from '../../../popupTouchManage/directionalPopup/contentSelectModal'

const { Step } = Steps;

const createStrategic = (props) => {
  let { dispatch,firstStepData,secondStepData,echoSecondStepData,toFirstStep,checkedContList,editconfigIdCodeData ,isSeeType} = props
  let [form] = Form.useForm();
  let [peopleSelectVisible,setPeopleSelectVisible] = useState(false),
      [cardSelectVisible,setCardSelectVisible] = useState(false),
      [formData,setFormData] = useState({
        userSource:1,
        identification:1,
        condition:1,
        operation:1,
        triggerConditionType:1,
        taskType_00000:1,
        triggerType_00000:1
      }),
      [userSelectedRows,setUserSelectedRows] = useState({})// 选择用户群
  let [modalInfo,setModalInfo] = useState({objectId:''})
  let [taskId,setTaskId] = useState('')
  let [popupId, setPopupId] = useState('')

  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  
  const columns = [
    { title: '卡券编号', dataIndex: 'couponNo', key: 'couponNo',align:'center'},
    { title: '卡券名称', dataIndex: 'skuCardName', key: 'skuCardName',align:'center' },
    { title: '卡券品类', dataIndex: 'skuCardCategoryName', key: 'skuCardCategoryName',align:'center'  },
    { title: '面值', dataIndex: 'faceValue', key: 'faceValue',align:'center'  },
    { title: '默认有效期', dataIndex: 'effectiveDays', key: 'effectiveDays',align:'center',render:(text,all)=>{
       return <span>{text} 天</span>
    }},
    { title: '可否转增', dataIndex: 'isGive', key: 'isGive',align:'center',
       render:(text, all) => text == 1 ? '否' : '是'}]

  /* ==进入页面获取触发条件：触发场景数据，活动数据，中奖奖品数据，是否是实时场景类型 ==*/
  let [triggerSenceData,setTriggerSenceData] = useState([])
  let [configIdData,setConfigIdData] = useState([])
  let [strategyType,setStrategyType] = useState(-1)
  let [singleOrRepeat,setSingleOrRepeat] = useState(0)  // 第一步选择单次/重复，选中单次之后，执行频率只显示首次触发执行
  let [configIdCodeData, setConfigIdCodeData] = useState({})  // 暂存每个触发场景下选择的触发节点code、id
  useEffect(()=>{
    queryTriggerSence()
    queryActivityList()
    queryPrize()
    queryPageBrowing()
    setStrategyType(firstStepData.strategyType)
    let strategyTypeInfo = JSON.parse(firstStepData.strategyTypeInfo)
    setSingleOrRepeat(firstStepData.strategyType==1?strategyTypeInfo.singleOrRepeat:0)
  },[])
  
  /*== 对编辑数据进行处理，echoSecondStepData必填数据，wanderStrategyTaskVOList执行任务数据，wanderStrategyCrowdVOList人群数据，触发条件数据 ==*/ 
  useEffect(()=>{
    console.log(echoSecondStepData,"echoSecondStepData");
    if(echoSecondStepData){
      form.setFieldsValue(echoSecondStepData)
      formData.userSource = echoSecondStepData.userSource
      setFormData({...formData})
    }else{
      form.setFieldsValue(formData)
    }
    if(secondStepData.wanderStrategyTaskVOList){
      let getFieldData = form.getFieldValue()
      secondStepData.wanderStrategyTaskVOList.forEach(item=>{
        if(firstStepData.strategyType==1&&item.taskType==3){
          item.taskType = 1
          getFieldData['taskType_'+item.timestamp] = 1
        }
      })
      form.setFieldsValue({...getFieldData})
      setWanderStrategyTaskVOList(secondStepData.wanderStrategyTaskVOList)
    }
    if(secondStepData.wanderStrategyCrowdVOList){
      setWanderStrategyCrowdVOList(secondStepData.wanderStrategyCrowdVOList)
      setUserSelectedRows(secondStepData.userSelectedRows)
    }
    if(secondStepData.configData){
      for(let x in triggerFormData) {
        triggerFormData[x] = secondStepData.configData[x]
      }
      setTriggerFormData(triggerFormData)
    }
  },[echoSecondStepData,secondStepData])
  
  /*== 触发类型编辑时根据id获取对应数据 ==*/
  useEffect(()=>{
    if(triggerSenceData.length>0){
      triggerSenceData.forEach((item=>{
        if(item.id === triggerFormData.triggerSenceId){   
          setConfigIdData(item.triggerSenceVOs)  // 根据场景id匹配触发节点
          if(item.triggerSenceVOs.length>0){
            item.triggerSenceVOs.forEach(element => {
               if(element.id==triggerFormData.configId){  
                  triggerFormData.configIdCode = element.triggerCode  // 根据节点id匹配code
                  if(!editconfigIdCodeData){    // 编辑状态下判断，是否重新选择过触发条件，重新选择过使用本地暂存数据
                    let defaultSelectCode = {}
                    defaultSelectCode[triggerFormData.triggerSenceId]={
                      configIdCode:triggerFormData.configIdCode,
                      configId:triggerFormData.configId
                    }
                    setConfigIdCodeData({...defaultSelectCode})
                  }
               }
            })
          }
        }
      }))
    }
    if(editconfigIdCodeData){
      setConfigIdCodeData({...editconfigIdCodeData})
    }
  },[triggerSenceData,editconfigIdCodeData])

  /*== 获取触发条件数据 ==*/
  let [triggerFormData,setTriggerFormData] = useState({
    triggerSenceId:null,
    configId:null,
    configIdCode:null,
    rangeTriggerTime:[],
    rangeStartTime:null,
    rangeEndTime:null,
    changeActivityId:null,
    changeActivityName:null,
    isPrize:null,
    prizeType:null,
    time:null,
    timeUnit:null,
    pageProwsingType:null,
    pageBrowsingId:null,
    pageProwsingTimeUnit:null
  })
  // 获取触发场景数据
  let queryTriggerSence = () => {
    dispatch({
      type: 'createStrategic/queryTriggerSence',//列表
      payload: {
        method: 'postJSON',
      },callback:(res)=>{
        if(res.result.code=='0'){
          setTriggerSenceData(res.body)
        }else{
          message.error(res.result.message)
        }}
    })
  }
  // 获取活动列表数据
  let [activityList,setActivityList] = useState([])
  let  queryActivityList = () => {
    let channelId=JSON.parse(localStorage.getItem('tokenObj')).channelId;
    dispatch({
      type: 'createStrategic/queryActivityList',//列表
      payload: {
        method: 'postJSON',
        params: {
          channelId:channelId,
          pageNo:1,
          pageSize:500,
          status:6
        }
      },callback:(res)=>{
        if(res.result.code=='0'){
          setActivityList(res.body.list)
        }else{
          message.error(res.result.message)
        }}
    })
  }
  // 中奖类型数据
  let [prizeData,setPrizeData] = useState([])
  let queryPrize = () => {
    dispatch({
      type: 'createStrategic/queryPrize',//列表
      payload: {
        method: 'postJSON',
      },callback:(res)=>{
        if(res.result.code=='0'){
          setPrizeData(res.body)
        }else{
          message.error(res.result.message)
        }}
    })

  }
  let [browePageList,setBrowePageList] = useState([])
  // 获取页面浏览数据
  let queryPageBrowing = () => {
    dispatch({
      type: 'createStrategic/queryPageBrowing',//列表
      payload: {
        method: 'postJSON',
      },callback:(res)=>{
        if(res.result.code=='0'){
          setBrowePageList(res.body)
        }else{
          message.error(res.result.message)
        }}
    })
  }

  // 触发条件单选，根据id查找对应的触发节点
  let radioTriggerChange = (e,type) => {
    let getFields = form.getFieldValue() 
    triggerFormData[type] = e.target.value
    if (type=='triggerSenceId') {
      triggerSenceData.forEach((item=>{
        if(item.id == e.target.value){
          setConfigIdData(JSON.parse(JSON.stringify(item.triggerSenceVOs)))
        }
      }))
      form.resetFields(['configId',[undefined]]);
      let configIdCodeDataSelect = configIdCodeData[e.target.value]? configIdCodeData[e.target.value]:{}
      triggerFormData.configIdCode =configIdCodeDataSelect.configIdCode?configIdCodeDataSelect.configIdCode:null
      getFields.configId = configIdCodeDataSelect.configId?configIdCodeDataSelect.configId:null
      triggerFormData.configId = configIdCodeDataSelect.configId?configIdCodeDataSelect.configId:null
      if(e.target.value == 8){
        triggerFormData.configId = 1005
      }
    }else{
      configIdData.forEach(item=>{
        if(item.id == e.target.value){
          triggerFormData[type+'Code'] = item.triggerCode
          configIdCodeData[triggerFormData.triggerSenceId] = {configIdCode:item.triggerCode,configId:e.target.value}
        }
      })
      setConfigIdCodeData({...configIdCodeData})
    }
    form.setFieldsValue({...getFields})
    setTriggerFormData({...triggerFormData})
  }
  // 页面浏览触发节点选择
  let pageTriggerChange = (e, type) => {
    triggerFormData[type] = e.target.value
    if(!triggerFormData.pageProwsingTimeUnit&&e.target.value==1){
      form.resetFields(['pageProwsingTimeUnit',[undefined]]);
    }
    setTriggerFormData({...triggerFormData})
  }
  // 页面浏览选择秒数
  let triggerInputChange = (e,type) => {
    triggerFormData[type] = e
    setTriggerFormData({...triggerFormData})
  }
  // 触发条件多选
  let selectTrigger = (e, type) => {
    triggerFormData[type] = e.toString()
    setTriggerFormData({...triggerFormData})
  }
  //触发条件时间筛选
  let selectTriggerTime = (e) => {
    if(e){
        if(e.length==2){
          triggerFormData.rangeStartTime = moment(e[0]).format('YYYY-MM-DD')
          triggerFormData.rangeEndTime = moment(e[1]).format('YYYY-MM-DD')
          triggerFormData.rangeTriggerTime = e
        }
    }else{
      triggerFormData.rangeStartTime = null
      triggerFormData.rangeEndTime = null
    }
  }
  /* == 单选选择 == */
  let radioChange = (e,type) =>{
    formData[type] = e.target.value
    setFormData({...formData})
  }
  let selectChange = (e,type) =>{
    formData[type] = e
    setFormData({...formData})
  }
   /*== 打开/关闭选择用户群组弹窗 ==*/
  let openPeopleSelectModel = () => {
    setPeopleSelectVisible(true)
  }
  //用户来源填写字段
  let [wanderStrategyCrowdVOList,setWanderStrategyCrowdVOList] = useState([])
  let hidePeopelSelectModel = (data) => {
    setPeopleSelectVisible(false)
    if(data){
      setWanderStrategyCrowdVOList(data)
      let fieldsValue = form.getFieldsValue()
      let crowdStr =[]
      let countNum = 0
      data.forEach(item=>{
        crowdStr.push(item.crowdName)
        if(item.countNum){
          countNum= countNum+item.countNum
        }
      })
      fieldsValue.crowdName = crowdStr.join('，')
      form.setFieldsValue({...fieldsValue})
      setUserSelectedRows({
        crowdStr:crowdStr.join('，'),
        crowdPeopleCount:countNum
      })
    }

  }
   /*== 打开/关闭卡券投放选择弹窗 ==*/
   let [wanderStrategyTaskVOList,setWanderStrategyTaskVOList] = useState([
    {
      cardBatch: null,
      sort: 0,
      strategyId: 0,
      taskType: 1,
      taskWaitTime: '',
      tempId:'',
      tempType: '',
      timestamp:'00000',
      triggerType:1,
      time:null,
      timeUnit:null,
      wanderStrategyCouponVOList: []
    }
   ])
   let [cardSelectOpenIndex,setCardSelectOpenIndex] = useState(-1)
   let [openCardShowData,setOpenCardShowData] = useState({})
   let openCardSelectModel = (index,id) => {
    setCardSelectVisible(true)
    setCardSelectOpenIndex(index)
    setTaskId(id)
    setOpenCardShowData(JSON.parse(JSON.stringify(wanderStrategyTaskVOList))[index])
  }
  let hideCardSelectModel = (data,index) => {
    setCardSelectVisible(false)
    if(data){
      wanderStrategyTaskVOList[index].cardBatch = data.cardBatch
      wanderStrategyTaskVOList[index].wanderStrategyCouponVOList = data.selectedRows
      setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
    }
  }
  /* 添加执行任务 */
  let addTask = () => {
    let timestamp = new Date().getTime()
    let task = {
      cardBatch: null,
      sort: 0,
      taskType: 1,
      taskWaitTime: null,
      tempId: null,
      tempType: 0,
      timestamp:timestamp,
      triggerType:1,
      time:null,
      timeUnit:null,
      wanderStrategyCouponVOList: []
    }
    wanderStrategyTaskVOList.push(task)
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
    let fieldsValue = form.getFieldsValue()
    fieldsValue['taskType_'+timestamp] = 1
    fieldsValue['triggerType_'+timestamp] = 1
    form.setFieldsValue({...fieldsValue})
  }
  /* ==打开/关闭模板弹窗== */
  let [tempSelectVisible, setTempSelectVisible] = useState(false)
  let openTempSelectModel = (index,id)=>{
    setTempSelectVisible(true)
    setCardSelectOpenIndex(index)
    setModalInfo({
      objectId:id
    })
  }
  //确认之后关闭消息弹窗，整合数据
  let hideTempSelectModel = (data,index,id)=>{
    setTempSelectVisible(false)
    if(data){
      data.timestamp = wanderStrategyTaskVOList[index].timestamp
      data.taskWaitTime =  wanderStrategyTaskVOList[index].taskWaitTime
      data.triggerType =  wanderStrategyTaskVOList[index].triggerType
      data.time =  wanderStrategyTaskVOList[index].time
      data.timeUnit =  wanderStrategyTaskVOList[index].timeUnit
      wanderStrategyTaskVOList[index]=data
      wanderStrategyTaskVOList[index].tempId =id
      wanderStrategyTaskVOList[index].taskType = 2
      wanderStrategyTaskVOList[index].wanderStrategyCouponVOList = data.sceneTemplateVariableList
      setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
    }
  }
  /* 打开关闭执行任务中弹窗选择 */
  let [contVisible, setContVisible] = useState(false)
  let openPopupSelectModel = (index,id) => {
    setContVisible(true)
    setCardSelectOpenIndex(index)
    setPopupId(id)
  } 
  /* 获取选中的弹窗数据 */
  useEffect(()=>{
    if(checkedContList.length>0&&cardSelectOpenIndex>=0){
      let index = cardSelectOpenIndex
      wanderStrategyTaskVOList[index].popupId = checkedContList[0].id
      wanderStrategyTaskVOList[index].popupName = checkedContList[0].contentName
      setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
    }
  },[checkedContList])
  let hidePopupSelectModel = () => {
    setContVisible(false)
  }
  useEffect(() => {
    dispatch({
      type: 'directionalPopupManage/setContData',// 重置
      payload: {
        checkedContList: [],
        isUpdate: false
      }
    })
  }, [])
 
  /* 删除执行任务 */
  let deleteTask = (index) => {
    wanderStrategyTaskVOList.splice(index,1)
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
  }
  /* 执行任务操作选择 */
  let radioOperationChange = (e,type,index)=>{
    wanderStrategyTaskVOList[index].taskType = e.target.value
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
  }
  /* 执行频率选择 */
  let radioChangeCommon = (e,type,index)=>{
    wanderStrategyTaskVOList[index][type] = e.target.value
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
  }
  /* 执行时/天/月选择 */
  let selectChangeCommon = (e,type,index)=>{
    wanderStrategyTaskVOList[index][type] = e
    setWanderStrategyTaskVOList([...wanderStrategyTaskVOList])
  }
  /*== 提交 ==*/
  let [submitdata,setSubmitdata] = useState({})
  let [confirmVisible,setConfirmVisible] = useState(false)
  let saveSubmit = () => {
    wanderStrategyTaskVOList.forEach((item,index)=>{
      item.taskWaitTime = index==0?0:item.taskWaitTime
      item.sort = index
      if(item.taskType==1){
        item.tempId = null
        item.popupId = null
      }else if(item.taskType==2){
        item.cardBatch = null
        item.popupId = null
      }else if(item.taskType==3){
        item.cardBatch = null
        item.tempId = null
      }
    })
    //保存对触发条件数据处理
    let triggerFormDataSave = JSON.parse(JSON.stringify(triggerFormData))
    console.log(triggerFormDataSave,"triggerFormDataSave");
    console.log(triggerFormDataSave)
    if(firstStepData.strategyType==2){
      if(triggerFormDataSave.changeActivityId){
        triggerFormDataSave.changeActivityName = triggerFormDataSave.changeActivityId.split('_')[1]
        triggerFormDataSave.changeActivityId = Number(triggerFormDataSave.changeActivityId.split('_')[0])
      }
      if(triggerFormDataSave.configIdCode==1||triggerFormDataSave.configIdCode==3){
        triggerFormDataSave.isPrize = null
        triggerFormDataSave.prizeType = null
      }
      if(triggerFormDataSave.isPrize == 1){  // 是否选择奖品，选择否，清空奖品类型选择
        triggerFormDataSave.prizeType = null
      }
      // 页面浏览多传递一个pageBrowsingName
      if(triggerFormDataSave.pageBrowsingId){
        triggerFormDataSave.pageBrowsingName = triggerFormDataSave.pageBrowsingId.split('_')[1]
        triggerFormDataSave.pageBrowsingId = Number(triggerFormDataSave.pageBrowsingId.split('_')[0])
      }
    }else{
      for(let x in triggerFormDataSave){
        triggerFormDataSave[x] = null
      }
    }
    // 触发条件车辆信息
    if(triggerFormDataSave.configIdCode == 4) {
      let saveFields = ['triggerSenceId','configId','configIdCode']
      for(let x in triggerFormDataSave){
        if(saveFields.indexOf(x)<0){
          triggerFormDataSave[x] = null
        }
      }
      triggerFormDataSave.time = form.getFieldsValue().time
      triggerFormDataSave.timeUnit = form.getFieldsValue().timeUnit
    }
    // 页面浏览保存信息处理
    if(triggerFormDataSave.pageProwsingType !=2){
      triggerFormDataSave.pageProwsingTimeUnit = null
    }

    let secondStepDataSubmit = {
      wanderStrategyTaskVOList:wanderStrategyTaskVOList, // 卡券数据
      wanderStrategyCrowdVOList:wanderStrategyCrowdVOList, // 人群数据 
      userSource:form.getFieldsValue().userSource,
      triggerConditionCrowdVOList:[],
      step:2,
      ...triggerFormDataSave
    }
    let submitdata = Object.assign({},firstStepData,secondStepDataSubmit)
    setSubmitdata(submitdata)
    setConfirmVisible(true)
    
  }
  /*== 确认保存 ==*/
  let confirmSave = () => {
    dispatch({
      type: 'createStrategic/saveWanderInfo',//列表
      payload: {
        method: 'postJSON',
        params: submitdata
      },callback:(res)=>{
        if(res.result.code=='0'){
          history.goBack()
        }else{
          message.error(res.result.message)
        }
      }
    });
    setConfirmVisible(false)
  }
  let cancelSave = () => {
    setConfirmVisible(false)
  }
  let taskWaitTimeChange = (e,index) =>{
    wanderStrategyTaskVOList[index].taskWaitTime = e
  }

  useEffect(()=>{
    if(toFirstStep){
      previousStep()
    }
  },[toFirstStep])

  /*== 上一步== */
  let previousStep = () => {
    dispatch({
      type: 'createStrategic/setEditEchoSecondStepData',
      payload: {
        echoSecondStepData:form.getFieldValue()
      }
    })
    
    let secondStepData = {
      wanderStrategyTaskVOList:wanderStrategyTaskVOList, // 卡券数据
      wanderStrategyCrowdVOList:wanderStrategyCrowdVOList, // 人群数据 
      userSelectedRows:userSelectedRows,
      configData: triggerFormData
    }
    dispatch({
      type:'createStrategic/setEditSecondStepData',
      payload:{
        secondStepData:secondStepData
      }
    })

    dispatch({
      type: 'createStrategic/setCurrentStep',
      payload: 0
    })
    // 存储触发条件节点信息到model
    dispatch({
      type:'createStrategic/setEditconfigIdCodeData',
      payload:{
        editconfigIdCodeData:configIdCodeData
      }
    })
  }
  return (
    <div className={style.second_step}>
      <Form form={form} onFinish={saveSubmit}>
        {strategyType==2?<div className={style.taggerPart_content}>
          <div className={style.sub_title}><i>*</i>触发条件</div>
          <Form.Item label="触发场景" name='triggerSenceId'  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择触发场景'}]}>
            <Radio.Group  onChange={(e)=>radioTriggerChange(e,'triggerSenceId')} disabled={isSeeType}>
              {triggerSenceData.map((item)=>{
                return strategyType==2&&item.id==1?'':<Radio value={item.id} disabled={item.deleted==1}>{item.triggerName}</Radio>
              })}
            </Radio.Group>
          </Form.Item>
        {
          triggerFormData.triggerSenceId == 8?  
            <><Form.Item label="触发页面" name='pageBrowsingId'  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择触发页面'}]}>
              <Select disabled={isSeeType} placeholder="请选择" style={{width:'686px'}} optionFilterProp="children" showSearch onChange={(e)=>selectTrigger(e,'pageBrowsingId')} allowClear>
                {browePageList.map(item => {
                  return <Option value={item.id+'_'+item.pageName}>{item.pageName}</Option>
                })}
              </Select>
           </Form.Item>
           <Form.Item label="触发节点" name='pageProwsingType'  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择触发节点'}]}>
              <Radio.Group disabled={isSeeType} onChange={(e)=>pageTriggerChange(e,'pageProwsingType')}>
                <Radio value={1}>立即触发</Radio>
                <Radio value={2}>浏览  
                    <Form.Item  labelCol={{flex:'0 0 120px'}} style={{height:'0px',margin:'0 8px',marginTop:'-4px'}} name='pageProwsingTimeUnit' 
                      className={style.item_inline} rules={[{required:triggerFormData.pageProwsingType==2?true:false,message:'请输入数字'}]} >
                    <InputNumber min={0} onChange={(e)=>triggerInputChange(e,'pageProwsingTimeUnit')}/></Form.Item>秒后，触发
                </Radio>
              </Radio.Group>
           </Form.Item>
           </>:null
        }
        {configIdData.length>0&&triggerFormData.triggerSenceId!=8?
          <Form.Item label="触发节点" name='configId'  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择触发节点'}]}>
            <Radio.Group disabled={isSeeType} value={triggerFormData.configId} onChange={(e)=>radioTriggerChange(e,'configId')}>
              {configIdData.map((item)=>{
                  return <Radio value={item.id}>{item.triggerName}</Radio>
              })}
            </Radio.Group>
          </Form.Item>:null
        }
        {triggerFormData.configIdCode==1||triggerFormData.configIdCode==2||triggerFormData.configIdCode==3?
          <div className={style.taggerPart}>
            <Form.Item label="时间范围" name={'rangeTriggerTime_'+triggerFormData.configId}  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择时间范围'}]}>
              <RangePicker disabled={isSeeType} format="YYYY-MM-DD" onChange={(e)=>selectTriggerTime(e)}/>
            </Form.Item>
            <Form.Item label="选择活动" name={'changeActivityId_'+triggerFormData.configId}  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择活动'}]}>
              <Select disabled={isSeeType} placeholder="请选择" optionFilterProp="children" showSearch onChange={(e)=>selectTrigger(e,'changeActivityId')} allowClear>
                {activityList.map(item => {
                  return <Option value={item.objectId+'_'+item.internalName}>{item.internalName}</Option>
                })}
              </Select>
            </Form.Item>
            {triggerFormData.configIdCode==2?
              <div>
                <Form.Item label="是否中奖" name={'isPrize_'+triggerFormData.configId} labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择是否中奖'}]}>
                  <Select disabled={isSeeType} placeholder="请选择" onChange={(e)=>selectTrigger(e,'isPrize')} allowClear>
                    <Option value={1}>否</Option>
                    <Option value={2}>是</Option>
                  </Select>
                </Form.Item>
                {triggerFormData.isPrize==2?
                  <Form.Item label="中奖奖品类型" name={'prizeType_'+triggerFormData.configId}  labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择中奖奖品类型'}]}>
                    <Select disabled={isSeeType}   mode="multiple" placeholder="请选择" optionFilterProp="children" showSearch onChange={(e)=>selectTrigger(e,'prizeType')} allowClear>
                      {prizeData.map((item)=>{
                        return item.prizeId!=5?<Option value={item.prizeId}>{item.prizeName}</Option>:null
                      })}
                    </Select>
                  </Form.Item>:null}
              </div>:null}
          </div>:
          triggerFormData.configIdCode==4?
            <div className={style.car_select_style} style={{marginLeft:'52px'}}>
              <span>同一辆车在上次被奖励</span>
                <Form.Item  labelCol={{flex:'0 0 120px'}} name='time' className={style.item_inline} rules={[{required:true,message:'请输入数字'}]} ><InputNumber disabled={isSeeType} min={0}/></Form.Item>
                <Form.Item name='timeUnit' className={style.item_inline} style={{marginLeft:'0px'}} labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择'}]}>
                  <Select disabled={isSeeType} allowClear className={style.car_time} style={{width:'90px'}}>
                    <Option value={1}>天</Option>
                    <Option value={2}>月</Option>
                  </Select>
                </Form.Item>
                <span>后，可再次奖励</span>
            </div>:null
        }
        </div>:null}
        <div className={style.sub_title}><i>*</i>受众用户</div>
        <Form.Item label="用户来源" name='userSource'  labelCol={{flex:'0 0 120px'}} >
          <Radio.Group value={formData.userSource} onChange={(e)=>radioChange(e,'userSource')} disabled={isSeeType}>
            <Radio value={1}>用户群组</Radio>
            {/* <Radio value={2} disabled>导入指定名单</Radio>
            <Radio value={3} disabled>接口实时传输</Radio> */}
            <Radio value={3} >全部人群</Radio>
          </Radio.Group>
        </Form.Item>
        {formData.userSource==1?<div className={style.part_content}>
            {userSelectedRows.crowdStr?
              <div><div className={style.vertical_gap}>已选群组：{userSelectedRows.crowdStr} <Button type="link" onClick={openPeopleSelectModel}>重新选择用户群组</Button> </div>
              <div className={style.peopel_forecast}>预估人数:<InputNumber disabled value={userSelectedRows.crowdPeopleCount} />人</div></div>
            : <div>
                 <Form.Item rules={[{required:true,message:'请选择用户群组'}]} name='crowdName'>
                    <Button onClick={openPeopleSelectModel} disabled={isSeeType}>+选择用户群组</Button>
                  </Form.Item>
              </div>
            }
            </div>:null}
        <div className={style.sub_title}><i>*</i>执行任务 <Button type="primary" disabled={isSeeType} className={style.add_task} onClick={addTask}>添加执行任务</Button></div>
        {wanderStrategyTaskVOList.map((item,index)=>{
          return <div className={style.operation_content}>
              <div className={style.sub_title_n}>执行任务{index+1} 
                {wanderStrategyTaskVOList.length>1 && !isSeeType?<span className={style.delete_task} onClick={()=>deleteTask(index)}>删除任务</span>:null}
              </div>
              <Form.Item label="执行操作" name={`taskType_${item.timestamp}`} labelCol={{flex:'0 0 120px'}} >
                <Radio.Group disabled={isSeeType} onChange={(e)=>radioOperationChange(e,'operation',index)}>
                  <Radio value={1}>卡券发放</Radio>
                  <Radio value={2}>发送模板消息</Radio>
                  {strategyType==2?<Radio value={3}>弹窗</Radio>:null}
                </Radio.Group>
              </Form.Item>
              {
                item.taskType==1?<div className={style.operation_part}>
                  {index==0?null:<div>
                      等待时长：上次任务执行后等待<Form.Item style={{margin:'0 10px',marginTop:'-4px',marginBottom:'10px'}} name={`taskWaitTime_${item.timestamp}`}  rules={[{required:true,message:'请填入时间'}]} className={style.item_inline}>
                      <InputNumber disabled={isSeeType} min={0} onChange={(e)=>taskWaitTimeChange(e,index)}/>
                    </Form.Item> 分钟
                  </div>}
                  {item.cardBatch?
                    <div>
                      {
                        !isSeeType?
                        <div className={style.operation_detail}>已关联卡券投放批次：{item.cardBatch}  <Button type="link" onClick={()=>openCardSelectModel(index,item.id)}>重新设置卡券批次</Button></div>:null
                      }
                        
                        <Table columns={columns} dataSource={item.wanderStrategyCouponVOList} pagination={false} className={style.select_part_content}/>
                    </div>: 
                    <Form.Item rules={[{required:true,message:'请选择卡券'}]}  name={`cardBatch_${item.timestamp}`} className={style.operation_button}>
                      <Button disabled={isSeeType} onClick={()=>openCardSelectModel(index)}>+关联卡券批次</Button>
                    </Form.Item>
                  }
                  {singleOrRepeat!=1?
                    <><Form.Item label="执行频率" name={`triggerType_${item.timestamp}`} 
                        extra={item.triggerType==1?'该策略运行期间，该任务仅被执行1次':
                              item.triggerType==2?'该策略运行期间，在每个策略周期内该任务可被执行多次':
                              item.triggerType==3?'该策略运行期间，同一用户每次触发该任务均被执行':''}
                              rules={[{required:true,message:'请选择频率'}]}>
                      <Radio.Group disabled={isSeeType}  onChange={(e)=>radioChangeCommon(e,'triggerType',index)}>
                        <Radio value={1}>首次触发执行</Radio>
                        <Radio value={2}>策略周期内执行</Radio>
                        <Radio value={3}>不限制</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {item.triggerType==2?
                      <div><span>同一个用户在上次被触发执行</span>
                        <Form.Item  labelCol={{flex:'0 0 120px'}} name={`time_${item.timestamp}`} className={style.item_inline} rules={[{required:true,message:'请输入数字'}]} ><InputNumber disabled={isSeeType} min={0} onChange={(e)=>selectChangeCommon(e,'time',index)}/></Form.Item>
                        <Form.Item name={`timeUnit_${item.timestamp}`} className={style.item_inline} labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择'}]}>
                          <Select disabled={isSeeType} onChange={(e)=>selectChangeCommon(e,'timeUnit',index)} allowClear style={{width:'100px',marginRight:'8px'}}>
                            <Option value={1}>分钟</Option>
                            <Option value={2}>小时</Option>
                            <Option value={3}>天</Option>
                          </Select>
                        </Form.Item>
                        <span>后，该任务可被再次执行</span>
                      </div>:null}
                    </>:null}
                </div>:
                item.taskType==2?<div className={style.operation_part}>
                  {index==0?null:<div>
                      等待时长：上次任务执行后等待<Form.Item style={{margin:'0 10px',marginTop:'-4px',marginBottom:'10px'}} name={`taskWaitTime_${item.timestamp}`}  rules={[{required:true,message:'请填入时间'}]} className={style.item_inline}>
                      <InputNumber disabled={isSeeType} min={0} onChange={(e)=>taskWaitTimeChange(e,index)}/>
                    </Form.Item> 分钟
                  </div>}
                  {item.sceneTemplateName?
                      <div className={style.operation_detail}>已选择模板消息：{item.sceneTemplateName} <Button type="link" disabled={isSeeType}  onClick={()=>openTempSelectModel(index,item.tempId)} >点击设置模板消息</Button></div>
                    :
                    <Form.Item rules={[{required:true,message:'请选择模板消息'}]}  name={`temp_${item.timestamp}`} className={style.operation_button}>
                       <Button disabled={isSeeType} onClick={()=>openTempSelectModel(index)}>+设置模板消息</Button>
                    </Form.Item>
                  }
                  {item.sceneTemplateVariableList?
                    <div className={`${style.item_inline} ${style.select_part_content}`} style={{minWidth:'300px',marginLeft:'0'}}>
                        <div className={style.temp_content}>
                          <div className={style.temp_title}>{item.sceneTemplateName}</div>
                          <div className={style.temp_part}>
                            <div>{item.templateTitle}</div>
                            {item.sceneTemplateVariableList.map(element=>{
                                return <div>
                                    <span>{element.templateFieldCode+'.DATA'}:</span>
                                    <span>{element.content}</span>
                                </div>
                            })}
                          </div>
                        </div>                 
                    </div>:null}   
                  {singleOrRepeat!=1?
                    <><Form.Item label="执行频率" name={`triggerType_${item.timestamp}`} 
                        extra={item.triggerType==1?'该策略运行期间，该任务仅被执行1次':
                              item.triggerType==2?'该策略运行期间，在每个策略周期内该任务可被执行多次':
                              item.triggerType==3?'该策略运行期间，同一用户每次触发该任务均被执行':''}
                              rules={[{required:true,message:'请选择频率'}]}>
                      <Radio.Group disabled={isSeeType} onChange={(e)=>radioChangeCommon(e,'triggerType',index)}>
                        <Radio value={1}>首次触发执行</Radio>
                        <Radio value={2}>策略周期内执行</Radio>
                        <Radio value={3}>不限制</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {item.triggerType==2?
                      <div><span>同一个用户在上次被触发执行</span>
                        <Form.Item  labelCol={{flex:'0 0 120px'}} name={`time_${item.timestamp}`} className={style.item_inline} rules={[{required:true,message:'请输入数字'}]} ><InputNumber min={0} onChange={(e)=>selectChangeCommon(e,'time',index)}/></Form.Item>
                        <Form.Item name={`timeUnit_${item.timestamp}`} className={style.item_inline} labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择'}]}>
                          <Select disabled={isSeeType} onChange={(e)=>selectChangeCommon(e,'timeUnit',index)} allowClear style={{width:'100px',marginRight:'8px'}}>
                            <Option value={1}>分钟</Option>
                            <Option value={2}>小时</Option>
                            <Option value={3}>天</Option>
                          </Select>
                        </Form.Item>
                        <span>后，该任务可被再次执行</span>
                      </div>:null}
                    </>:null}
                </div>:
                item.taskType==3?<div className={style.operation_part}>
                  {index==0?null:<div>
                      等待时长：上次任务执行后等待<Form.Item style={{margin:'0 10px',marginTop:'-4px',marginBottom:'10px'}} name={`taskWaitTime_${item.timestamp}`}  rules={[{required:true,message:'请填入时间'}]} className={style.item_inline}>
                      <InputNumber disabled={isSeeType} min={0} onChange={(e)=>taskWaitTimeChange(e,index)}/>
                    </Form.Item> 分钟
                  </div>}
                   {item.popupId?
                      <div className={style.operation_detail}>已选择弹窗：{item.popupName} <Button type="link" disabled={isSeeType} onClick={()=>openPopupSelectModel(index,item.popupId)} >更改弹窗内容</Button></div>
                    :
                    <Form.Item rules={[{required:true,message:'请选择弹窗内容'}]}  name={`popup_${item.timestamp}`} className={style.operation_button}>
                       <Button disabled={isSeeType} onClick={()=>openPopupSelectModel(index)}>+选择弹窗内容</Button>
                    </Form.Item>
                  }
                  {singleOrRepeat!=1?
                    <><Form.Item label="执行频率" name={`triggerType_${item.timestamp}`} 
                        extra={item.triggerType==1?'该策略运行期间，该任务仅被执行1次':
                              item.triggerType==2?'该策略运行期间，在每个策略周期内该任务可被执行多次':
                              item.triggerType==3?'该策略运行期间，同一用户每次触发该任务均被执行':''}
                              rules={[{required:true,message:'请选择频率'}]}>
                      <Radio.Group disabled={isSeeType} onChange={(e)=>radioChangeCommon(e,'triggerType',index)}>
                        <Radio value={1}>首次触发执行</Radio>
                        <Radio value={2}>策略周期内执行</Radio>
                        <Radio value={3}>不限制</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {item.triggerType==2?
                      <div><span>同一个用户在上次被触发执行</span>
                        <Form.Item  labelCol={{flex:'0 0 120px'}} name={`time_${item.timestamp}`} className={style.item_inline} rules={[{required:true,message:'请输入数字'}]} ><InputNumber disabled={isSeeType} min={0} onChange={(e)=>selectChangeCommon(e,'time',index)}/></Form.Item>
                        <Form.Item name={`timeUnit_${item.timestamp}`} className={style.item_inline} labelCol={{flex:'0 0 120px'}} rules={[{ required: true,message:'请选择'}]}>
                          <Select disabled={isSeeType} onChange={(e)=>selectChangeCommon(e,'timeUnit',index)} allowClear style={{width:'100px',marginRight:'8px'}}>
                            <Option value={1}>分钟</Option>
                            <Option value={2}>小时</Option>
                            <Option value={3}>天</Option>
                          </Select>
                        </Form.Item>
                        <span>后，该任务可被再次执行</span>
                      </div>:null}
                    </>:null}
                </div>:null
              }
          </div>
        })}
        
        <div className={style.btn_content}>
          {
            isSeeType?<Button type="primary" onClick={()=>{
              history.push({
                pathname: '/strategicManage/list'
              })
            }} className={`${style.next_setp} ${style.part_gap}`}>返回列表</Button>:
            <Button type="primary" htmlType="submit"  className={`${style.next_setp} ${style.part_gap}`}>保存</Button>
          }
          
          <Button disabled={isSeeType} className={style.next_setp} onClick={ previousStep }>上一步</Button>
        </div>
      </Form>
      {peopleSelectVisible?<PeopleSelectModel peopleSelectVisible={peopleSelectVisible} hidePeopelSelectModel={hidePeopelSelectModel} wanderStrategyCrowdVOList={wanderStrategyCrowdVOList}/>:null}
      {cardSelectVisible?<CardSelectModel cardSelectVisible={cardSelectVisible} hideCardSelectModel={hideCardSelectModel} cardSelectOpenIndex={cardSelectOpenIndex} openCardShowData={openCardShowData} taskId={taskId}/>:null}
      {tempSelectVisible?<TempSelectModel modalInfo={modalInfo} tempSelectVisible={tempSelectVisible} hideTempSelectModel={hideTempSelectModel} cardSelectOpenIndex={cardSelectOpenIndex}/>:null}
      {contVisible ?<ContentSelectModal contVisible={contVisible} closeModal={hidePopupSelectModel} popupId={popupId}/> : null}
      <Modal title="确定保存该策略吗？" visible={confirmVisible} onOk={confirmSave} onCancel={cancelSave}>
        <p>提交保存不会立即生效，请至列表点击“生效”按钮操作生效</p>
      </Modal>
    </div>
  )
};
export default connect(({ createStrategic,directionalPopupManage}) => ({
  firstStepData:createStrategic.firstStepData,
  secondStepData:createStrategic.secondStepData,
  echoSecondStepData:createStrategic.echoSecondStepData,
  toFirstStep:createStrategic.toFirstStep,
  checkedContList:directionalPopupManage.checkedContList,
  editconfigIdCodeData:createStrategic.editconfigIdCodeData
}))(createStrategic)
