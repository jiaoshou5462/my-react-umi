import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Form, Input, Modal, message, Transfer, DatePicker, Tooltip, Button, Space} from "antd"
const { RangePicker } = DatePicker;
import { InfoCircleOutlined } from '@ant-design/icons'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import style from "./style.less";
import {formatDate, formatTime} from '@/utils/date'
import moment from 'moment'
import 'moment/locale/zh-cn'
const { TextArea } = Input;
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  let [form] = Form.useForm();
  let [copyInfo, setCopyInfo] = useState({});//复制对象
  let [isCopyShow, setIsCopyShow] = useState(false);//二次确认框显示与隐藏
  let [days, setDays] = useState('');//时分秒
  // 复制任务
  let taskCopy = (value) => {
    value.startTime = formatDate(value.date[0])
    value.endTime = formatDate(value.date[1])
    delete value.date
    let info = {
      ...value,
      taskId: modalInfo.taskId,
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
    }
    let timeStr = differTime(info.startTime)
    setDays(timeStr)
    setCopyInfo(info)
    setIsCopyShow(true)
  }
  // 复制任务二次确认
  let CopyShowOk = () => {
    dispatch({
      type:'saleTaskManage/copyTask',
      payload: {
        method: 'postJSON',
        params: copyInfo
      },
      callback: res => {
        if(res.result.code==0) {
          message.success('复制成功!')
          toFatherValue(true)
        }else{
          message.error('复制失败!')
        }
      }
    })
  }
  // 计算两者时间之和
  let differTime = (date) =>{
    let times = `${date} 00:00:00`;
    let endTime = new Date(); // 当前时间
    let usedTime = new Date(times).getTime() - endTime; // 相差的毫秒数
    let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
    let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
    let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
    let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
    let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
    if(days < 0) {
      return `任务开始时间为今天，发布后将立即开始      `;
    }
    return `任务开始时间离当前仅${Math.abs(days)}天${Math.abs(hours)}时${Math.abs(minutes)}分`;
  }
  // 立即开始时间&&立即结束时间集合
  let taskIsStatus = () => {
    dispatch({
      type: 'saleTaskManage/isTaskStatus',
      payload: {
        method: 'postJSON',
        params: {
          status: modalInfo.modalName=='nowStart'? 1 : 2,
          taskId: modalInfo.taskId,
        },
      },
      callback: ((res) => {
        if(res.result.code==0) {
          message.success('成功!')
          toFatherValue(true)
        }else {
          message.error(res.result.message)
        }
      })
    })
  }
  // 删除确认操作
  let taskDelete = () => {
    dispatch({
      type:'saleTaskManage/deleteTask',
      payload: {
        method:'get',
        taskId: modalInfo.taskId,
        createUser: JSON.parse(localStorage.getItem('tokenObj')).channelId
      },
      callback: res => {
        if(res.result.code==0) {
          message.success('删除成功!')
          toFatherValue(true)
        }else {
          message.error('删除失败!')
        }
      }
    })
  }
  // 禁用之前日期
  let disabledDate = (current) => {
    return current && current < moment().startOf('day');
  }
  return (
    <>
      {/* 立即开始 && 立即结束 */}
      <Modal title="提示" visible={modalInfo.modalName == 'nowStart' || modalInfo.modalName=='nowEnd'} onOk={() => {taskIsStatus() }} onCancel={() => {toFatherValue(false) }}>
        <p><InfoCircleOutlined style={{color:"#FAAD14"}}/>{modalInfo.modalName == 'nowStart'? `立即开始时间为${moment().format('YYYY-MM-DD HH:mm:ss')}` : '任务将被立即结束!'}</p>
        <p><span style={{color:"#F04134"}}>{modalInfo.modalName == 'nowStart'? '任务开始后kpi等信息不能修改' : '任务结束后不能再重新开始'}</span>,<span style={{color:'#999999'}}>您还要继续吗？</span></p>
      </Modal>
      {/* 复制 */}
      <Modal title="复制任务" visible={modalInfo.modalName=='taskCopy'} footer={null} onCancel={() => {toFatherValue(false)}} width={800}>
        <div className={style.copy_box}>
          <div style={{ overflow: 'hidden' }}>
            <Form form={form} onFinish={taskCopy}>
              <Row>
                <Col span={24}>
                  <Form.Item label="任务名称" name='taskName' labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择有效期" }]}>
                    <Input placeholder="请输入任务名称" ></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="有效期" name='date' labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择有效期" }]}>
                    <RangePicker locale={locale} disabledDate={disabledDate} style={{ width: '100%' }} format="YYYY-MM-DD"  />
                  </Form.Item>
                </Col>
                <Col span={24} className={style.btn_box}>
                  <Space size={24}>
                    <Button  htmlType="button" onClick={() =>{toFatherValue(false)}}>取消</Button>
                    <Button  htmlType="submit" type="primary">确定</Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
      {/* 复制二次确认框 */}
      <Modal title="提示" visible={isCopyShow} onOk={() => {CopyShowOk()}} onCancel={() => { setIsCopyShow(false) }}>
        <p><InfoCircleOutlined style={{color:"#FAAD14"}}/>{days}</p>
        <p><span style={{color:"#F04134"}}>任务开始后kpi等信息不能修改</span>,<span style={{color:'#999999'}}>您还要继续吗？</span></p>
      </Modal>
      {/* 删除提示 */}
      <Modal title="提示" visible={modalInfo.modalName=='taskDelete'} onOk={() => {taskDelete()}} onCancel={() => { toFatherValue(false) }}>
        <p>确认删除当前任务？</p>
      </Modal>
    </>
  )
}
export default connect(({ saleTaskManage }) => ({
}))(modal)







