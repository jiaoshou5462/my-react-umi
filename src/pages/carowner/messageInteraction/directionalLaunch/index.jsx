import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Col, Space, Button, DatePicker, Modal, message, ConfigProvider, Pagination, Badge } from "antd";
import { QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns, LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime, MoneyFormat,} from "@/components/commonComp/index";
import style from "./style.less";
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { DownOutlined, RightOutlined, PlusSquareOutlined } from '@ant-design/icons'
import TemplatePushTask from './components/templatePushTask'
import DirectionLaunchDetail from './components/directionLaunchDetail'
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const directionalLaunch = (props) => {
  let { dispatch } = props
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
  let [form] = Form.useForm()
  const [modalInfo, setModalInfo] = useState(null)
  const [detailMmodalInfo, setDetailMmodalInfo] = useState(null)
  const [list, setList] = useState()
  const [delObjectId, setDelObjectId] = useState()
  const [editObjectId, setEditObjectId] = useState()
  const [updateStatusTemplateData, setUpdateStatusTemplateData] = useState({}) //启用禁用data
  const [delDirectionalLaunchVisiabled, setDelDirectionalLaunchVisiabled] = useState(false)//删除弹框
  const [updDirectionalLaunchVisiabled, setUpdDirectionalLaunchVisiabled] = useState(false)//修改弹框
  const [pageInfo, setPageInfo] = useState({
    pageNum: 1,
    pageSize: 10,
  })
  const [payload, setPayload] = useState({
    pageInfo: {
      pageNo: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
    }
  })
  // 推送机制数据
  let sendTypeList = [
    { value: 1, sendTypeName: '立即推送'},
    { value: 3, sendTypeName: '周期推送'},
    { value: 2, sendTypeName: '定时推送'},
  ]
  // 推送机制翻译
  let sendTypeListTranslate = (text, record) => {
    let newList = sendTypeList.filter(v => v.value==text)
    return <TypeTags color={text==1 ? '#FF4A1A' : text==2 ? '#2FB6E4' : '#32D1AD'}>{newList[0].sendTypeName}</TypeTags>
  }
  // 任务状态数据
  let statusList = [
    {color: '#FF4A1A', text: '未启用', value: 1},
    {color: '#AF52DE', text: '待推送', value: 2},
    {color: '#2FB6E4', text: '推送中', value: 3},
    {color: '#28CB6B', text: '推送完成', value: 4},
    {color: '#FFC500', text: '已停用', value: 5},
    {color: '#C91132', text: '推送失败', value: 6},
  ]
  // 任务状态翻译
  let statusListTranslate = (text, record) => {
    let newList = statusList.filter(v => v.value==text)
    return text ? <StateBadge color={newList[0].color}>{newList[0].text}</StateBadge> : ''
  }
  // 重置
  let resetForm = () => {
    form.resetFields();
    setPayload({
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      }
    })
  }
  // 查询该群发详情
  useEffect(() => {
    findListByCondition()
  }, [payload])

  // 查询场景模板列表
  let findListByCondition = () => {
    dispatch({
      type: 'directionalLaunch/findListByCondition',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: res => {
        if (res.result.code == '0') {
          setList(res.body.list)
          setPageInfo({
            pageNum: res.body.pageNum,
            pageSize: res.body.pageSize,
            total: res.body.total,
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询
  let submitData = (value) => {
    let param = JSON.parse(JSON.stringify(value))
    if (value.createStartTime) {
      param.createStartTime = moment(value.createStartTime[0]).format('YYYY-MM-DD')
      param.createEndTime = moment(value.createStartTime[1]).format('YYYY-MM-DD')
    }
    param.pageInfo = {
      pageNo: 1,
      pageSize: pageInfo.pageSize,
    }
    setPayload(param)
  }

  let renderColumns = () => {
    return (
      [
        {
          title: '消息批次ID',
          dataIndex: 'objectId',
          width: 100,
          render: (text, record) => <span className={style.click_blue} onClick={() => { setDetailMmodalInfo({ modalName: 'todirectionalLaunchDetail', objectId: text }) }}>{text}</span>
        }, 
        {
          title: '公众号',
          dataIndex: 'wechatAppName',
          width: 90,
          render: (text, record) => <TextEllipsis>{text}</TextEllipsis>
        }, 
        {
          title: '任务名称',
          dataIndex: 'taskName',
          width: 90,
        }, 
        {
          title: '场景模板名称',
          dataIndex: 'sceneTemplateName',
          width: 90,
          render: (text, record) => <TextEllipsis>{text}</TextEllipsis>
        }, 
        {
          title: '推送机制',
          dataIndex: 'sendType',
          width: 90,
          render: (text, record) => sendTypeListTranslate(text, record)
        }, 
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 90,
          render: (text, record) => <ListTableTime>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</ListTableTime>
        }, 
        {
          title: '任务状态',
          dataIndex: 'status',
          width: 90,
          render: (text, record) =>  statusListTranslate(text, record)
        }, 
        {
          title: '目标',
          dataIndex: 'targetNum',
          width: 70,
        }, 
        {
          title: '送达',
          dataIndex: 'logReceivce',
          width: 70,
          render: (text, record) => <span>{ text ? text.toString().replace(',','/') : ''}</span>
        },
        {
          title: '操作',
          width: 110,
          fixed: 'right',
          render: (text, record) => {
            return <ListTableBtns showNum={3}>
              { record.status == 1 ?<LtbItem onClick={() => { toUpdStatusDirectionalLaunch(record, 2) }}>启用</LtbItem> : null }
              { record.status == 1 ?<LtbItem onClick={() => { toEditDirectionalLaunch(record) }}>编辑</LtbItem> : null }
              { record.status == 1 ?<LtbItem onClick={() => { delDirectionalLaunch(record) }}>删除</LtbItem> : null }
              { record.status == 2 || record.status == 3?<LtbItem onClick={() => { toUpdStatusDirectionalLaunch(record, 1) }}>停用</LtbItem> : null }
              { record.status !=1 || record.status !=2 ?<LtbItem onClick={() => { pushHistory(record) }}>推送明细</LtbItem> : null }
            </ListTableBtns>
          }
        }
      ]
    )
  }

  let toEditDirectionalLaunch = (record) => {
    setModalInfo({ modalName: 'edit', objectId: record.objectId })
  }

  let updateStatus = (param) => {
    dispatch({
      type: 'directionalLaunch/updateStatusTemplate',
      payload: {
        method: 'post',
        params: {
          objectId: editObjectId,
          status: param
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setUpdDirectionalLaunchVisiabled(false)
          setEditObjectId(null)
          resetForm()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  let delDirectionalLaunch = (record) => {
    setDelObjectId(record.objectId)
    setDelDirectionalLaunchVisiabled(true)
  }

  // 修改状态 打开弹框 赋值objectId
  let toUpdStatusDirectionalLaunch = (record, param) => {
    setUpdDirectionalLaunchVisiabled(true)
    let data = {
      title: (param == 2 ? '启用' : '停用') + '任务',
      content: '请确认是否' + (param == 2 ? '启用' : '停用') + '当前发送任务',
      status: param
    }
    setEditObjectId(record.objectId)
    setUpdateStatusTemplateData(data)
  }

  let pushHistory = (record) => {
    history.push({ pathname: '/carowner/messageInteraction/messageHistory', state: { templateId: record } })
  }

  // 确认删除事件
  let deleteDirectionalLaunch = () => {
    dispatch({
      type: 'directionalLaunch/deleteTemplate',
      payload: {
        method: 'post',
        params: {
          objectId: delObjectId
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setDelDirectionalLaunchVisiabled(false)
          setDelObjectId(null)
          resetForm()
        } else {
          message.error(res.result.message)
        }
      }
    })

  }

  // 添加定向投放
  let addDirectorLaunch = () => {
    setModalInfo({ modalName: 'addMessagePushTask' })
  }

  //分页
  const pageChange=(page,pageSize)=>{
    let pageChangeInfo = JSON.parse(JSON.stringify(pageInfo))
    let newPayload = JSON.parse(JSON.stringify(payload));
    pageChangeInfo.pageNum = page
    pageChangeInfo.pageSize = pageSize;
    newPayload.pageInfo = {
      pageNo: page,
      pageSize: pageSize
    }
    setPayload(newPayload)
  }

  let closeTemplatePushTaskVisiable = (param) => {
    setModalInfo(null)
    if (param) {
      resetForm()
    }
  }
  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <Form.Item label="起始时间" name="createStartTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="任务名称" name="taskName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="任务名称/场景模板名称" />
          </Form.Item>
          <Form.Item label="任务状态" name="status" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="任务状态">
              {
                statusList.map(v => <Option value={v.value}>{v.text}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="推送机制" name="sendType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="推送机制">
              {
                sendTypeList.map(v => <Option value={v.value}>{v.sendTypeName}</Option>)
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        {/* 表格标题 功能按钮 */}
        <ListTitle titleName="消息批次列表">
          <Space size={8}>
            <Button type='primary' onClick={() => { addDirectorLaunch() }}>新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNum} pageSize={pageInfo.pageSize} total={pageInfo.total} onChange={pageChange} >
          <Table dataSource={list} scroll={{x:1200}} columns={renderColumns()} pagination={false}></Table>
        </ListTable>
      </div>

      <Modal title="删除任务" visible={delDirectionalLaunchVisiabled} onOk={deleteDirectionalLaunch} onCancel={() => { setDelDirectionalLaunchVisiabled(false) }}>
        请确认是否删除当前发送任务
      </Modal>

      <Modal title={updateStatusTemplateData.title} visible={updDirectionalLaunchVisiabled} onOk={() => updateStatus(updateStatusTemplateData.status)} onCancel={() => { setUpdDirectionalLaunchVisiabled(false) }}>
        {updateStatusTemplateData.content}
      </Modal>

      {modalInfo ? <TemplatePushTask modalInfo={modalInfo} toFatherValue={(param) => closeTemplatePushTaskVisiable(param)} /> : ''}

      {detailMmodalInfo ? <DirectionLaunchDetail modalInfo={detailMmodalInfo} closeMode={() => setDetailMmodalInfo(null)} /> : ''}

    </>
  )
}

export default connect(({ directionalLaunch }) => ({
}))(directionalLaunch)