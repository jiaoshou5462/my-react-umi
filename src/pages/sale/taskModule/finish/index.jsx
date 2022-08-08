import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Space, Radio, Input, Select, Button, Tooltip, DatePicker, message, Switch,   InputNumber  } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { TextArea, Search } = Input;
const { RangePicker } = DatePicker;
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { connect ,history} from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn'
import styles from './style.less';
const { Option } = Select;

const finish = (props) => {
  let { dispatch, finishInfo } = props
  let [form] = Form.useForm()
  const [totalkpiNum,setTotalkpiNum] = useState(0);
  let [crowdBatch, setCrowdBatch] = useState([]) //客户人群列表
  // 加载任务回显
  useEffect(()=> {
    dispatch({
      type:'saleFinish/completeTaskId',
      payload: {
        method: 'get',
        taskId:history.location.query.taskId,
      }
    })
  },[])
  useEffect(()=>{
    if(finishInfo.avgKpi && finishInfo.avgKpi.length){
      let num = 0;
      for(let item of finishInfo.avgKpi){
        num = num + item.kpiNum;
      }
      setTotalkpiNum(num);
    }
    if(finishInfo.customerCrowdBatch){
      let temp = finishInfo.customerCrowdBatch.split(',')
      setCrowdBatch(temp)
    }
  },[finishInfo])
  // 提交
  let onSubmit = () => {
    localStorage.setItem('taskDetail', 3);
    history.push(`/sale/task/saleTaskModule/info?taskId=${history.location.query.taskId}`)
  }
  // 提交并发布
  let handleSubmitTask = () => {
    dispatch({
      type: 'saleFinish/isTaskStatus',
      payload: {
        method: 'postJSON',
        params: {
          status: 3,
          taskId: finishInfo.taskId,
        },
      },
      callback: ((res) => {
        if(res.result.code==0) {
          message.success('成功!');
          history.push(`/sale/task`)
        }else {
          message.error(res.result.message)
        }
      })
    })
  }

  //匹配任务类型名称
  let getTaskTypeName = (type)=>{
    if(taskType && taskType.length){
      let arr = taskType.filter((item)=>{
        return item.type==type
      });
      return arr.length && arr[0].description;
    }else{
      return ''
    }
  }
  /*上一步*/
  let goBack = () => {
    let taskDetail = localStorage.getItem('taskDetail')
    let temp = finishInfo.taskStatus || '3'
    localStorage.setItem('taskStatus', temp == '3' ? '3' : temp) // 任务状态, 3 为待发布，可编辑
    localStorage.setItem('taskDetail', taskDetail === '2' || taskDetail === '1' ? '2' : taskDetail)
    history.push(`/sale/task/saleTaskModule/distribution?taskId=${history.location.query.taskId}`)
  }
  return (
    <>
      <Form form={form} onFinish={onSubmit} wrapperCol={{ span: 12 }}>
        <Row className={styles.finish_box}>
          <Col span={16}>
            <Row>
              <Col span={8}>
                <div className={styles.finish_item}>
                  <span>任务名称：</span>
                  <span>{finishInfo.taskName}</span>
                </div>
              </Col>
              <Col span={16}>
                <div className={styles.finish_item}>
                  <span>任务类型：</span>
                  <span>{finishInfo.taskType}</span>
                </div>
              </Col>
              {
                crowdBatch.length > 0 ? <Col span={24}>
                  <div className={styles.finish_item}>
                    <span>客户人群：</span>
                    <span>
                      {
                        crowdBatch.map(item => {
                          return item + '批次；'
                        })
                      }
                      客户共 {finishInfo.batchCount} 人
                  </span>
                  </div>
                </Col> : null
              }
              <Col span={24}>
                <div className={styles.finish_item}>
                  <span>生效时间：</span>
                  <span>{moment(finishInfo.startTime).format('YYYY-MM-DD HH:mm:ss')} - {moment(finishInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.finish_item}>
                  <Tooltip placement="top" title="总kpi即在步骤2中实际设置的任务kpi">
                    <span><QuestionCircleOutlined /> 总KPI：</span>
                  </Tooltip>
                  {
                    JSON.stringify(finishInfo) != "{}" ?
                    finishInfo.totalKpi.map((item,index) => {
                      return (
                        <span>{item.typeStr}{item.kpiNum}{(item.type==5 || item.type==7 || item.type==8) ? '次' :  '人'}<span>
                          {index<finishInfo.totalKpi.length-1?', ':''}</span></span>
                      )
                    }) : ''
                  }
                </div>
              </Col>
              <Col span={16}>
                <div className={styles.finish_item}>
                  {/* <span>指定：</span> */}
                  <span>指定{finishInfo.specifyTaskType}：{
                    JSON.stringify(finishInfo) != "{}" ?
                    finishInfo.taskSourceName.map(item => {
                      return (
                        <span>{item}</span>
                      )
                    }) : ''
                  }</span>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.finish_item}>
                  <span>分配员工数：</span>
                  <span>{finishInfo.employeeCount}人</span>
                </div>
              </Col>
              <Col span={16}>
                <div className={styles.finish_item}>
                  <Tooltip placement="top" title="平均每人分配kpi即在步骤3中设置的平均每个员工分配的kpi">
                    <span><QuestionCircleOutlined /> 平均每人分配KPI：</span>
                  </Tooltip>
                  {
                    JSON.stringify(finishInfo) != "{}" ?
                    finishInfo.avgKpi.map((item,index) => {
                      return (
                        <span>{item.typeStr}{item.kpiNum}{(item.type==5 || item.type==7 || item.type==8) ? '次' :  '人'}<span>
                          {index<finishInfo.avgKpi.length-1?', ':''}</span></span>
                      )
                    }) : ''
                  }
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.finish_item}>
                  <span>任务奖励：</span>
                  {
                    JSON.stringify(finishInfo) != "{}" ?
                    finishInfo.taskRewards.map(item =>{
                      return (
                        <span>{ item }</span>
                      )
                    }) : ""
                  }
                </div>
              </Col>
            </Row>
          </Col>
          {/*<Col span={8} className={styles.right_col}>*/}
          {/*  <div className={styles.right_bg} style={{backgroundImage:`url(${require('@/assets/saleTask/task_bg.png')})`}}>*/}
          {/*    <div className={styles.right_info}>*/}
          {/*      <div className={styles.right_word}>*/}
          {/*        <span>{finishInfo.taskName}</span>*/}
          {/*        <p>{finishInfo.taskType}</p>*/}
          {/*      </div>*/}
          {/*      <div className={styles.right_step}><p>完成度 0%</p><p>已完成 0/{totalkpiNum}</p></div>*/}
          {/*    </div>*/}
          {/*    {finishInfo.isRemind ? <div className={styles.content_box} style={{backgroundImage:`url(${require('@/assets/saleTask/task_content.png')})`}}>*/}
          {/*      <div className={styles.right_title} style={{backgroundImage:`url(${require('@/assets/saleTask/title.png')})`}}>任务攻略已上新</div>*/}
          {/*      <div className={styles.task_name}>完成任务，有机会获得丰厚奖励！</div>*/}
          {/*        {*/}
          {/*          JSON.stringify(finishInfo) != "{}" ?*/}
          {/*          <div className={styles.task_tips}>*/}
          {/*            <div className={styles.tip_item}><span>{finishInfo.taskName} {`(0/${totalkpiNum})`}</span><span>未完成</span></div>*/}
          {/*          </div> : ''*/}
          {/*        }*/}
          {/*      <div className={styles.right_btn} style={{backgroundImage:`url(${require('@/assets/saleTask/btn.png')})`}}>去完成</div>*/}
          {/*    </div>:''}*/}
          {/*  </div>*/}
          {/*</Col>*/}

          <Col span={8} className={styles.right_col}>
            <div className={styles.right_bg} style={{backgroundImage:`url(${require('@/assets/saleTask/task_bg.png')})`}}>
              <div className={styles.right_info}>
                <div className={styles.right_word}>
                  <span>{finishInfo.taskName}</span>
                  <p>{finishInfo.taskType}</p>
                </div>
                <div className={styles.right_step}><p>完成度 0%</p><p>已完成 0/{totalkpiNum}</p></div>
              </div>
              <div className={styles.content_view_box}>
                <div className={styles.content_view_item_box}>
                  {
                    finishInfo.isRemind ?  <>
                      <div style={{display: 'flex',justifyContent: 'space-between'}}>
                        <div>{finishInfo.taskName}</div>
                        <div>0/{totalkpiNum}</div>
                      </div>
                      <div className={styles.content_view_item_prize}>
                        {
                          finishInfo.awardsType === 1 ?
                              <img src="https://oneroad-other.oss-cn-hangzhou.aliyuncs.com/modal_cardIcon_20220517.png"/> :
                              <img src="https://oneroad-other.oss-cn-hangzhou.aliyuncs.com/modal_goldIcon_20220517.png"/>
                        }
                        {
                          finishInfo.rewardSituation === 0 ? `排名TOP ${finishInfo.rankTop}可获得${finishInfo.awardsName}` :
                              `任务完成可获得${finishInfo.awardsName}`
                        }
                      </div>
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
              <Button  htmlType="button" onClick={goBack}>上一步</Button>
              {
                finishInfo.taskStatus ==3 ?
                <Button  htmlType="button" type="primary" onClick={() => {handleSubmitTask()}}>提交并发布</Button> : ''
              }
              <Button  htmlType="submit" type="primary">查看任务</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </>
  )
}
export default connect(({ saleFinish }) => ({
  finishInfo: saleFinish.finishInfo
}))(finish);
