import React, { useEffect, useState } from 'react';
import { connect ,history} from 'umi';
import {
  Row,
  Col,
  Form,
  Space,
  Radio,
  Input,
  Select,
  Button,
  Tooltip,
  DatePicker,
  message,
  Switch,
  InputNumber,
  Checkbox
} from 'antd';
import { InfoCircleOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn'
import styles from './style.less';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import {formatDate,formatTime} from '@/utils/date'
import BatchModal from '../batchModal'

const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const saleTaskInfo = (props) => {
  let { dispatch, channelList, taskType } = props
  let [form] = Form.useForm();
  const [taskInfo, setTaskInfo] = useState({});
  const [taskRemind, setTaskRemind] = useState(true); // 任务提醒
  const [remindType, setRemindType] = useState(2);// 提醒方式
  const [remindIpt, setRemindIpt] = useState(1);// 提醒方式 天
  const [taskDetail, setTaskDetail] = useState(null);
  const [taskStatus, setTaskStatus] = useState(localStorage.getItem('taskStatus'))
  const [rightTaskName, setRightTaskName] = useState(null)
  const [baninput,setBaninput] = useState(false);
  let [wechatTaskRemind, setWechatTaskRemind] = useState(1) //公众号提醒
  let [throngVisible, setThrongVisible] = useState(false) //客户人群弹窗状态
  let [crowdBatch, setCrowdBatch] = useState([]) //客户人群选中列表
  let [peopleNum, setPeopleNum] = useState(0) //客户人群选中的 总人数
  let [weWorkStatus, setWeWorkStatus] = useState(false) //查询当前渠道是否开通企微
  let [weWorkTaskRemind, setWeWorkTaskRemind] = useState(true) //企微任务通知
  let [endNoticeTime, setEndNoticeTime] = useState(2) //任务即将结束通知时间
  let [noticeType, setNoticeType] = useState([3, 6, 7]) //通知类型(3.企微任务开始通知 ,4.企微奖励 5.企微任务通知开关 6.企微任务完成通知 7.企微任务即将结束通知）

  // 下一步提交
  const onSubmit = (value) => {
    let query = JSON.parse(JSON.stringify(value))
    if(weWorkStatus) {
      let temp = noticeType
      if(weWorkTaskRemind) {
        if(temp.length < 1) {
          message.info('请选择企微任务通知方式')
          return
        }
        if(temp.length > 0) {
          for (let item of temp) {
            if(item === 7 && !endNoticeTime) {
              message.info('请填写任务结束前通知时间')
              return
            }
          }
        }
        let tempStatus = temp.filter(item => item === 5)
        if (tempStatus.length === 0) temp.push(5)
      }else {
        temp = []
      }
      query.noticeType = temp
    }else {
      query.wechatTaskRemind = wechatTaskRemind
    }
    query.endNoticeTime = endNoticeTime
    if(taskInfo.taskType === 2){
      query.crowdBatchCount = peopleNum
      query.customerCrowdBatch = crowdBatch.join(',')
    }
    if(query.date) {
      query.startTime = formatDate(query.date[0])
      query.endTime = formatDate(query.date[1])
    }
    delete query.date
    if(taskRemind) {
      query.isRemind = 1
      if(remindType==2) {
        query.remindValue = '-1'
      }else {
        query.remindValue = remindIpt
      }
    }else{
      query.isRemind = 0;
    }
    if(taskDetail == 1 || taskDetail == 0) {
      delete query.taskId
    }else{
      query.taskId = history.location.query.taskId;
    }
    dispatch({
      type:'saleTaskInfo/saveTask',
      payload: {
        method:"postJSON",
        params: {
          ...query
        }
      },
      callback: res => {
        if(res.result.code==0) {
          localStorage.setItem('taskInfo', JSON.stringify(taskInfo))
          if(taskDetail==3 || taskDetail==2 || taskDetail==4) {
            return history.push(`/sale/task/saleTaskModule/taskreward?taskId=${history.location.query.taskId}`)
          }
          if(taskDetail==1 || taskDetail==0) {
            return history.push(`/sale/task/saleTaskModule/taskreward?taskId=${res.body}`)
          }
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询所属渠道 && 数据回显
  useEffect(()=> {
    getWeWorkAuth()
    queryTaskType();
    let taskDetails = localStorage.getItem('taskDetail')
    queryChannelList();
    setTaskDetail(taskDetails)
    if(taskDetails==1 || taskDetails ==0) return
    dispatch({
      type:"saleTaskManage/queryTaskInfo",
      payload: {
        method: 'get',
        taskId: history.location.query.taskId
      },
      callback: res => {
        if(res.result.code === '0') {
          if(taskDetails==1) {
            form.resetFields();
          }else {
            let date = []
            if(res.body.taskType === 2 && res.body.customerCrowdBatch !== '') {
              setCrowdBatch(res.body.customerCrowdBatch.split(','))
              setPeopleNum(res.body.crowdBatchCount || 0)
            }
            date.push(moment(res.body.startTime), moment(res.body.endTime))
            if(res.body.taskType) setBaninput(true);
            form.setFieldsValue({
              taskName: res.body.taskName,
              taskType: res.body.taskType,
              date: date,
              taskDescribe:res.body.taskDescribe,
            })
            setRightTaskName(res.body.taskName)
            if(res.body.isRemind==0) {
              setTaskRemind(false)
            }else {
              setTaskRemind(true)
              if(res.body.remindValue != -1) {
                setRemindType(1);
                setRemindIpt(res.body.remindValue)
              }else{
                setRemindType(2)
              }
            }
            setWechatTaskRemind(res.body.wechatTaskRemind)
            localStorage.setItem('taskInfo', JSON.stringify({taskType:res.body.taskType}))
            setTaskInfo({taskType:res.body.taskType})
            let temp = res.body.noticeType || []
            if(temp.length > 0) {
              let tempStatus = false
              for (let item of temp) {
                if (item === 5) {
                  tempStatus = true
                  break
                }else {
                  tempStatus = false
                }
              }
              setNoticeType(temp)
              setWeWorkTaskRemind(tempStatus)
              setEndNoticeTime(res.body.endNoticeTime)
            }else {
              setWeWorkTaskRemind(false)
            }
          }
        }else{
          message.error(res.result.message)
        }
      }
    })
  },[])
  // 获取任务分类
  let queryTaskType = () => {
    dispatch({
      type:'saleTaskManage/queryTaskType',
      payload : {
        method: 'get',
      }
    })
  }

  // 获取所属渠道
  let queryChannelList = () => {
    dispatch({
      type: 'saleTaskManage/queryChannelList',
      payload: {
        method: 'get',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
        }
      },
    });
    form.setFieldsValue({
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
    })
  }

  // 禁用之前日期
  let disabledDate = (current) => {
    return current && current < moment().startOf('day');
  }
  //匹配任务类型名称
  let getTaskTypeName = (type)=>{
    if(taskType && taskType.length){
      let arr = taskType.filter((item)=>{
        return item.type == type
      });
      return arr.length && arr[0].description || '';
    }else{
      return ''
    }
  }
  /*公众号提醒change*/
  let onWCRemindChange = (e) => {
    setWechatTaskRemind(e ? 1 : 0)
  }
  /*选择客户人群弹窗回调*/
  let onHideThrong = (e) => {
    if(e.status === 1) {
      setCrowdBatch(e.list)
      let batchId = e.list.join(',')
      dispatch({
        type:'saleTaskInfo/getCrowdBatchCount',
        payload : {
          method: 'getUrlParams',
          params: batchId
        },
        callback: (res) => {
          if (res.result.code === '0') {
            setPeopleNum(res.body)
          }else {
            message.error(res.result.message)
          }
        }
      })
    }
    if(e.status === 2){
      setCrowdBatch([])
      setPeopleNum('')
    }
    setThrongVisible(false)
  }
  useEffect(() => {
    if(taskInfo.taskType !== 2){
      setPeopleNum(0)
      setCrowdBatch([])
    }
  },[taskInfo])

  /*查询当前渠道是否开通企微*/
  let getWeWorkAuth = () => {
    dispatch({
      type:'saleTaskInfo/getWeWorkAuth',
      payload : {
        method: 'getUrlParams',
        params: JSON.parse(localStorage.getItem('tokenObj')).channelId
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setWeWorkStatus(res.body || false)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  let onNoticeTypeChange = (e) => {
    setNoticeType(e)
  }
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  return (
    <>
      <Form form={form} onFinish={onSubmit} wrapperCol={{ span: 12 }}>
        <Row className={styles.saleTaskInfo_box}>
          <Col span={16}>
              <Row justify="center" align="center">
                <Col span={24}>
                  <Form.Item label="客户" name='channelId' labelCol={{flex:'0 0 300px'}} rules={[{ required: true, message: "请选择客户" }]}>
                    <Select placeholder="请选择客户" showSearch disabled={true}>
                      {
                        channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="任务名称" name='taskName' labelCol={{flex:'0 0 300px'}} rules={[{ required: true, message: "请输入任务名称" }]}>
                    <Input placeholder="请输入任务名称" disabled={taskStatus==2} onChange={(e) => {setRightTaskName(e.target.value)}}></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="任务类型" name='taskType' labelCol={{flex:'0 0 300px'}} rules={[{ required: true, message: "请选择任务类型" }]}>
                    <Select placeholder="请选择任务类型" showSearch disabled={baninput} onChange={(e)=>{setTaskInfo({taskType:e})}}>
                      {
                        taskType.map(v => <Option value={v.type}>{v.description}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="有效期" name='date' labelCol={{flex:'0 0 300px'}} rules={[{ required: true, message: "请选择有效期" }]}>
                    <RangePicker locale={locale} disabledDate={disabledDate} style={{ width: '100%' }} format="YYYY-MM-DD" disabled={taskStatus==1 || taskStatus==2} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="任务说明" name='taskDescribe' labelCol={{flex:'0 0 300px'}}>
                    <TextArea rows={4} placeholder="请输入任务说明" disabled={taskStatus==2}/>
                  </Form.Item>
                </Col>
                {
                  taskInfo.taskType === 2 ? <>
                    <Col span={24}>
                      <Form.Item label={
                        <>
                          <Tooltip placement="top" title="支持添加指定的客户人群，添加后，任务将关联到指定客户，业务员只有对指定客户执行任务，才会计入任务完成统计">
                            <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                          </Tooltip>
                          选择客户人群
                        </>
                      } labelCol={{flex:'0 0 300px'}}>
                        <Button type="primary" onClick={() => {setThrongVisible(!throngVisible)}}>选择客户人群</Button>
                      </Form.Item>
                    </Col>
                    {
                      crowdBatch.length > 0 ? <Col span={24}>
                        <Form.Item label='已选择' labelCol={{flex:'0 0 300px'}}>
                          {
                            crowdBatch.map(item => {
                              return item + '批次；'
                            })
                          }
                          客户共 {peopleNum} 人
                        </Form.Item>
                      </Col> : null
                    }
                  </> : null
                }
                <Col span={24}>
                  <Form.Item label={
                    <>
                    <Tooltip placement="top" title="用户进入小程序,首页弹出任务提醒弹窗,提醒用户执行未完成的任务">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                      站内任务提醒</>
                  } name='isRemind' labelCol={{flex:'0 0 300px'}}>
                    <Switch
                        checked={taskRemind}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        disabled={taskStatus==2}
                        onChange={(e)=> {setTaskRemind(e)}}
                    />
                  </Form.Item>
                </Col>
                {
                  taskRemind ?
                  <Col span={24}>
                    <Form.Item label="提醒方式"  labelCol={{flex:'0 0 300px'}}>
                      <Radio.Group disabled={taskStatus==2} value={remindType} defaultValue={remindType} onChange={(e)=> {setRemindType(e.target.value)}}>
                        <Radio value={1}>每 <InputNumber min={1} value={remindIpt} onChange={(e)=> {setRemindIpt(e)}}/> 天提醒1次</Radio>
                        <Radio value={2}>每次进入小程序提醒</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col> : null
                }
                {
                  !weWorkStatus ? <Col span={24}>
                    <Form.Item label={
                      <>
                        <Tooltip placement="top" title="新任务开始后，相关业务员将在公众号中收到一条新任务提醒的模板消息">
                          <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                        </Tooltip>
                        公众号任务通知
                      </>
                    } name='wechatTaskRemind' labelCol={{flex:'0 0 300px'}}>
                      <Switch
                          checkedChildren="开启"
                          unCheckedChildren="关闭"
                          checked={wechatTaskRemind === 1 ? true : false}
                          disabled={taskStatus == 2}
                          onChange={onWCRemindChange}
                      />
                    </Form.Item>
                  </Col> : null
                }
                {
                  weWorkStatus ? <>
                    <Col span={24}>
                      <Form.Item label='企微任务通知' name='isRemind' labelCol={{flex:'0 0 300px'}}>
                        <Switch
                            checked={weWorkTaskRemind}
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            disabled={taskStatus == 2}
                            onChange={(e)=> {setWeWorkTaskRemind(e)}}
                        />
                      </Form.Item>
                    </Col>
                    {
                      weWorkTaskRemind ?
                          <Col span={24}>
                            <Form.Item label="通知方式"  labelCol={{flex:'0 0 300px'}}>
                              <Checkbox.Group style={{width: '100%' }} value={noticeType} onChange={onNoticeTypeChange}>
                                <Checkbox value={3}>任务开始通知</Checkbox>
                                <Checkbox value={6} style={{margin: 0}}>任务完成通知</Checkbox>
                                <Checkbox value={7} style={{margin: 0}}>
                                  任务即将结束通知，结束前 <Input style={{width: '100px'}} value={endNoticeTime} onChange={(e)=> {setEndNoticeTime(e.target.value)}}/> 小时通知
                                </Checkbox>
                              </Checkbox.Group>
                            </Form.Item>
                          </Col> : null
                    }
                  </> : null
                }
              </Row>
          </Col>
          <Col span={8} className={styles.right_col}>
            <div className={styles.right_bg} style={{backgroundImage:`url(${require('@/assets/saleTask/task_bg.png')})`}}>
              <div className={styles.right_info}>
                <div className={styles.right_word}>
                  <span>{rightTaskName}</span>
                  <p>{getTaskTypeName(taskInfo.taskType)}</p>
                </div>
                <div className={styles.right_step}><p>完成度 0%</p><p>已完成 0/0</p></div>
              </div>
             <div className={styles.content_view_box}>
               <div className={styles.content_view_item_box}>
                 {
                   taskRemind && taskInfo.taskType ? <>
                     <div>{rightTaskName}</div>
                     <div>0/0</div>
                   </> : null
                 }
               </div>
               <div className={styles.content_view_btn}>去完成</div>
              <div className={styles.content_view_check_box}>
                <img src="https://oneroad-other.oss-cn-hangzhou.aliyuncs.com/modal_notCheck_20220517.png"/>
                <span>今天不再提醒</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} className={styles.btn_box}>
          <Space size={24}>
            <Button  htmlType="button" onClick={()=> {history.push(`/sale/task`)}}>返回列表</Button>
            <Button  htmlType="submit" type="primary">下一步</Button>
          </Space>
        </Col>
      </Row>
    </Form>
    <BatchModal
        crowdBatch={crowdBatch}
        onHideThrong={onHideThrong}
        taskType={taskInfo.taskType}
        throngVisible={throngVisible}
    />
    </>
  )
}
export default connect(({ saleTaskManage, saleTaskInfo }) => ({
  channelList: saleTaskManage.channelList,
  taskType: saleTaskManage.taskType

}))(saleTaskInfo);
