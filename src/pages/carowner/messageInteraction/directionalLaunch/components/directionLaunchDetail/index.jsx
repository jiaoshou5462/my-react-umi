import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Modal, Space, message, Divider, Table, Button, Row, Select, Col, Descriptions, DatePicker } from "antd"
import style from "./style.less";
import moment from 'moment';
const { Option } = Select;
const directionLaunchDetail = (props) => {

  let { dispatch, modalInfo, closeMode } = props;
  const [data, setData] = useState({})//详情数据
  const [list, setList] = useState([])//列表数据

  useEffect(() => {
    getTemplateDetail(modalInfo.objectId);
  }, [])

  // 查询场景模板详情接口
  let getTemplateDetail = (param) => {
    dispatch({
      type: 'directionalLaunch/getTemplateDetail',
      payload: {
        method: 'get',
        objectId: param
      },
      callback: res => {
        if (res.result.code == '0') {
          if (res.body) {
            setData(res.body)
            setList(res.body.logList)
          }
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let dateShowFix = () => {
    return <span className={style.template_id} onClick={() => { todirectionalLaunchDetail(text, record) }}>{text}</span>
  }
  let renderColumns = () => {
    return (
      [{
        title: '发送时间',
        dataIndex: 'createTime',
        width: 50,
        align: 'center',
        render: (text, record) => { return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span> }
      }, {
        title: '发送人数',
        dataIndex: 'sendNum',
        width: 50,
        align: 'center',
      }, {
        title: '送达人数',
        dataIndex: 'sendReceivce',
        width: 50,
        align: 'center',
      }, {
        title: '已读',
        dataIndex: 'logRead',
        width: 50,
        align: 'center',
      }, {
        title: '未读',
        dataIndex: 'noRead',
        width: 50,
        align: 'center',
      }]
    )
  }

  let pushMes = (data) => {
    let headTxt = ''
    let footTxt = ''
    if (data.sendType == 1) {
      headTxt = '立即推送'
    } else if (data.sendType == 2) {
      headTxt = '定时推送'
      footTxt = moment(data.sendTime).format('YYYY-MM-DD HH:mm')
    } else {
      headTxt = '周期推送'
      let footest = ''
      let center = ''
      if (data.hour + 's'.length > 1) {
        footest = footest + data.hour + ':'
      } else {
        footest = "0" + data.hour + ':'
      }
      if (data.minute + 's'.length > 1) {
        footest = footest + data.minute
      } else {
        footest = footest + "0" + data.minute
      }
      if (data.cyclePeriod == 0) {
        center = center + ' 每日 '
      } else if (data.cyclePeriod == 1) {
        let days = data.week == 1 ? '一' : data.week == 2 ? '二' : data.week == 3 ? '三' : data.week == 4 ? '四' : data.week == 5 ? '五' : data.week == 6 ? '六' : '七'
        center = center + ' 每周 周' + days
      } else {
        center = center + ' 每月 ' + data.day + '号'
      }

      footTxt += data.cycleSendTimeStart + ' 至 ' + data.cycleSendTimeEnd + center + " " + footest
    }


    return headTxt + ' - ' + footTxt
  }

  return (
    <>
      <Modal width={1000} visible={modalInfo.modalName == 'todirectionalLaunchDetail'} footer={null} onCancel={() => { closeMode() }}>
        <div>
          <div className={style.change_variable_title}>任务详情</div>
          <Divider />
          <div className={style.center_row}>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="任务名称">{data.taskName}</Descriptions.Item>
              <Descriptions.Item label="公众号">{data.wechatAppName}</Descriptions.Item>
              <Descriptions.Item label="推送人群">{data.sendPerson == 1 ? '全量发送' : data.sendPerson == 2 ? '指定人群' : '用户群组'}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="场景消息分类">{data.sceneType == 1 ? '活动场景' : data.sceneType == 2 ? '订单场景' : data.sceneType == 3 ? '卡券' : data.sceneType == 4 ? '会员消息' : '自定义场景'}</Descriptions.Item>
              <Descriptions.Item label="场景模板名称">{data.sceneTemplateName}</Descriptions.Item>
              <Descriptions.Item label="跳转方式">{data.jumpType == 1 ? '无' : data.jumpType == 2 ? '小程序' : '链接地址'}</Descriptions.Item>
            </Descriptions>
            {data.jumpType == 2 ? <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="小程序ID">{data.miniAppid}</Descriptions.Item>
              <Descriptions.Item label="小程序页面地址">{data.miniPagepath}</Descriptions.Item>
              <Descriptions.Item label="备用网页链接">{data.backupUrl}</Descriptions.Item>
            </Descriptions> : ''}

            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              {data.jumpType == 3 ?
                <Descriptions.Item label="链接地址">{data.linkUrl}</Descriptions.Item>
                : ''}
              <Descriptions.Item label="创建时间">{data.createDate ? moment(data.createDate).format('YYYY-MM-DD HH:mm') : ''}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
              <Descriptions.Item label="推送机制">{pushMes(data)}</Descriptions.Item>
            </Descriptions>


          </div>
          <div className={style.change_variable_title}>数据详情</div>
          <Table
            scroll={{ x: 800 }}
            locale={{ emptyText: '暂无数据' }}
            columns={renderColumns()}
            dataSource={list}
            pagination={false}
            loading={{
              spinning: false,
              delay: 500
            }}
          />
        </div>





      </Modal>
    </>
  )
}


export default connect(({ directionalLaunch }) => ({
}))(directionLaunchDetail)







