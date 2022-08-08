import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Steps, Select, message, DatePicker, TimePicker,Form, Radio,Input,InputNumber,Button  } from "antd"
import style from "./style.less";
const { Option } = Select;
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Step } = Steps;

const firstStepStrategic = (props) => {
  let { dispatch,echoFirstStepData,toSecondStep,queryId,isSeeType} = props
  let [form] = Form.useForm();
  let [formData,setFormData] = useState({  
    singleOrRepeat:1,
    strategyType:1,
    repeat_range:null
  })
  let [marketingList,setMarketingList] = useState([])
  let [monthDays,setMonthDays] = useState([])
  let strategyTypeInfoData = {
    '1_1':{   // 定时单次字段
      singleOrRepeat:1,
      single_time_1:null
    },
    '1_2':{ // 定时重复参与1次
      singleOrRepeat:2,
      repeat_time_2:null,
      repeat_range:null,
      repeat_effectiveTime_1:null
    },
    '1_2':{ // 定时重复参与多次
      singleOrRepeat:2,
      repeat_range:null,
      repeat_time_2:null,
      repeat_effectiveTime_1:null
    },
    '2_1':{ // 实时场景触发
      scene_effectiveTime_2:null,
      singleOrRepeat:1
    }
  }
  useEffect(()=>{
    let monthDays = []
    for(let i = 1;i<=31;i++){
      monthDays.push(i+'号')
    }
    setMonthDays(monthDays)
    marketList()
  },[])
  useEffect(()=>{
    form.resetFields()
    if(echoFirstStepData){
      for(let x  in formData){
        formData[x] = echoFirstStepData[x]?echoFirstStepData[x]:formData[x] // 避免第二步回来重新选择单选出现未选择的情况
      }
      setFormData({...formData})
      form.setFieldsValue(echoFirstStepData)
    }else{
      let formData = {
        singleOrRepeat:1,
        strategyType:1,
        repeat_range:null
      }
      setFormData(formData)
      form.setFieldsValue({...formData})
    }
   
  },[echoFirstStepData])
  /* == 获取营销项目 == */
  const marketList = () => {
    let channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId
    dispatch({
      type: 'createStrategic/listMarketProject',//列表
      payload: {
        method: 'postJSON',
        params: {
          channelId:channelId
        }
      },callback:(res)=>{
        if(res.result.code=='0'){
          setMarketingList(res.body)
        }else{
          message.error(res.result.message)
        }
      }
    });
  }

  /* == 单选选择 == */
  let radioChange = (e,type) =>{
    formData[type] = e.target.value
    setFormData({...formData})
  }
  useEffect(()=>{
    if(toSecondStep){
        form.validateFields().then(values => {
          nextStep()
        })
        .catch(errorInfo => {
        });
    }
  },[toSecondStep])

  // 选择每天每月
  let repeatRangeChange = (e)=>{
    formData.repeat_range= e
    setFormData({...formData})
    let getFieldData = form.getFieldsValue()
    getFieldData.repeat_time_2 = null
    form.setFieldsValue({...getFieldData})
  }
  // 禁止选当前时间
  let disabledDate = (current) => {
    return current && current <moment().subtract(1, "days")
  }

  /*== 进入下一步 ==*/
  let nextStep = () => {
    // 暂存第一步必填字段
    dispatch({
      type: 'createStrategic/setFirstEchoStepData',
      payload: {
        echoFirstStepData:form.getFieldValue(),
      }
    })
    let firstStep = form.getFieldsValue()
    let firstStepData = {
      projectId:firstStep.projectId_name?firstStep.projectId_name.split('_')[0]:null,
      strategyName:firstStep.strategyName,
      strategyType:firstStep.strategyType,
      strategyTypeInfo:''
    }
    let strategyTypeInfoIndex = null
    if(firstStep.strategyType==1){
      strategyTypeInfoIndex = firstStep.strategyType+'_'+ firstStep.singleOrRepeat
    }else{
      strategyTypeInfoIndex = firstStep.strategyType+'_1'
    }
    let strategyTypeInfo = strategyTypeInfoData[strategyTypeInfoIndex]
    //根据策略，定时，参与限制匹配对应的字段 以及时间格式更改
    for(let x in strategyTypeInfo ){
      if(x.indexOf('time_1')>0) {
        strategyTypeInfo[x] = moment(firstStep[x]).format('YYYY-MM-DD HH:mm:ss')
      }else if(x.indexOf('time_2')>0){
        let str = x+'_'+firstStep['repeat_range'] 
        strategyTypeInfo[x] = moment(firstStep[str]).format('HH:mm:ss')
      }else if(x.indexOf('effectiveTime_1')>0){
        firstStepData.validPeriodStartTime = moment(firstStep[x][0]).format('YYYY-MM-DD')+' 00:00:00'
        firstStepData.validPeriodEndTime = moment(firstStep[x][1]).format('YYYY-MM-DD')+' 23:59:59' 
      }else if(x.indexOf('effectiveTime_2')>0){
        firstStepData.validPeriodStartTime = moment(firstStep[x][0]).format('YYYY-MM-DD HH:mm:ss')
        firstStepData.validPeriodEndTime = moment(firstStep[x][1]).format('YYYY-MM-DD HH:mm:ss')
      }else{
        strategyTypeInfo[x] = firstStep[x]?firstStep[x]:strategyTypeInfo[x]
      } 
    }
    strategyTypeInfo.projectId_name = firstStep.projectId_name
    // 重复每周每月数据处理
    if(firstStep.singleOrRepeat==2){
      if(firstStep.repeat_range==2){
        strategyTypeInfo.repeat_range_week = firstStep.repeat_range_week
        strategyTypeInfo.repeat_range_month = null
      } else if(firstStep.repeat_range==3){
        strategyTypeInfo.repeat_range_month = firstStep.repeat_range_month
        strategyTypeInfo.repeat_range_week = null
      }else{
        strategyTypeInfo.repeat_range_week = null
        strategyTypeInfo.repeat_range_month = null
      }
    }

    firstStepData.strategyTypeInfo = JSON.stringify(strategyTypeInfo)
    firstStepData.id = queryId
    firstStepData.step = 1
    dispatch({
      type: 'createStrategic/saveWanderInfo',//列表
      payload: {
        method: 'postJSON',
        params: firstStepData
      },callback:(res)=>{
        if(res.result.code=='0'){
          dispatch({
            type: 'createStrategic/setFirstStepData',
            payload: {
              firstStepData:firstStepData,
              id:res.body.id
            }
          })
          dispatch({
            type: 'createStrategic/setCurrentStep',
            payload: 1
          })
        }else{
          message.error(res.result.message)
        }
      }
    });
  }
  return (
    <div className={style.first_step}>
      <Form form={form} onFinish={nextStep}>
        <Form.Item label="营销项目" labelCol={{flex:'0 0 120px'}} name="projectId_name" rules={[{ required: true }]} >
          <Select optionFilterProp="children" allowClear showSearch placeholder="请选择" disabled={isSeeType}>
            {marketingList.map(item=>{ return <Option value={item.objectId+'_'+item.marketProjectName}>{item.marketProjectName}</Option>})}
          </Select>
        </Form.Item>
        <Form.Item label="策略名称" labelCol={{flex:'0 0 120px'}} name="strategyName"  rules={[{ required: true }]}>
          <Input  placeholder="请输入策略名称" disabled={isSeeType}/>
        </Form.Item>
        <Form.Item label="策略类型" name='strategyType'  labelCol={{flex:'0 0 120px'}} rules={[{ required: true }]} >
          <Radio.Group onChange={(e)=>radioChange(e,'strategyType')} disabled={isSeeType}>
            <Radio value={1}>定时触发</Radio>
            <Radio value={2}>场景触发(实时)</Radio>
          </Radio.Group>
        </Form.Item>
        {formData.strategyType==1?
          // 定时触发
          <div>
            <Form.Item label="单次/重复" labelCol={{flex:'0 0 120px'}} name="singleOrRepeat" rules={[{ required: true,message:'请选择单次/重复' }]} >
              <Radio.Group  onChange={(e)=>radioChange(e,'singleOrRepeat')}  >
                <Radio value={1}>单次</Radio>
                <Radio value={2}>重复</Radio>
              </Radio.Group>
            </Form.Item>
            {formData.singleOrRepeat==1?<div className={style.type_part}>
              {/* 单次 */}
                <Form.Item label="触发时间" labelCol={{flex:'0 0 120px'}}  name="single_time_1" rules={[{required:true}]}>
                  <DatePicker showTime showNow={false} format="YYYY-MM-DD HH:mm:ss"  disabledDate={disabledDate} disabled={isSeeType}/>
                </Form.Item>
                <span className={style.start_tip}>开始执行策略</span>
              </div>:
              <div className={style.type_part}>
                {/* 重复 */}
                <Form.Item label="触发时间" labelCol={{flex:'0 0 120px'}}  name="repeat_range" style={{width:'240px',marginRight:'10px',float:'left'}}  rules={[{required:true}]}>
                  <Select onChange={repeatRangeChange} placeholder="请选择" disabled={isSeeType}>
                    <Option value={1}>每天</Option>
                    <Option value={2}>每周</Option>
                    <Option value={3}>每月</Option>
                  </Select>
                </Form.Item>
                {
                 formData.repeat_range==2? 
                 <Form.Item name="repeat_range_week" style={{width:'160px',marginRight:'10px',float:'left'}}  rules={[{required:true,message:'请输入触发时间'}]}>
                   <Select disabled={isSeeType}>
                      <Option value={1}>星期一</Option>
                      <Option value={2}>星期二</Option>
                      <Option value={3}>星期三</Option>
                      <Option value={4}>星期四</Option>
                      <Option value={5}>星期五</Option>
                      <Option value={6}>星期六</Option>
                      <Option value={7}>星期日</Option>
                    </Select>
                  </Form.Item>
                  : formData.repeat_range==3?
                    <Form.Item name="repeat_range_month" style={{width:'160px',marginRight:'10px',float:'left'}}  rules={[{required:true,message:'请输入触发时间'}]}>
                      <Select disabled={isSeeType}>
                        {monthDays.map((item,index)=>{return <Option value={index+1}>{item}</Option>})}
                      </Select>
                    </Form.Item>
                  :null
                }
                <Form.Item  labelCol={{flex:'0 0 120px'}}  name={`repeat_time_2_${formData.repeat_range}`}  rules={[{required:true,message:'请输入触发时间'}]} format="HH:mm:ss">
                  <TimePicker format="HH:mm:ss" disabled={isSeeType}/>
                </Form.Item>
                <span className={style.start_tip}>开始执行策略</span>
                <Form.Item label="有效期起止时间" labelCol={{flex:'0 0 120px'}}  name="repeat_effectiveTime_1" rules={[{required:true}]}>
                  <RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} disabled={isSeeType}/>
                </Form.Item>
              </div>}
          </div>
        // 场景触发
       :<div className={style.type_part}>
         <Form.Item label="有效期起止时间" labelCol={{flex:'0 0 120px'}} name="scene_effectiveTime_2" rules={[{required:true}]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} disabled={isSeeType}/>
          </Form.Item> 
        </div>}
        <div className={style.btn_content}>
          <Button type="primary" htmlType="submit" className={style.next_setp}>下一步</Button>
         </div>
      </Form>
      
    </div>
  )
};
export default connect(({ createStrategic }) => ({
  echoFirstStepData:createStrategic.echoFirstStepData,
  toSecondStep:createStrategic.toSecondStep,
  queryId:createStrategic.queryId
}))(firstStepStrategic)
