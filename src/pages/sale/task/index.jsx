import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import style from './style.less';
import {
  Form,
  Table,
  Space,
  Button,
  Tooltip,
  message,
} from "antd";
import { QuestionCircleOutlined, } from '@ant-design/icons'
import { QueryFilter, ProFormText,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
const { Column } = Table;
import ModalBox from './components/modal'
import { formatDate, formatTime } from '@/utils/date'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from "antd/lib/locale-provider/zh_CN";

import {
  ListTitle,
  ListTable,
  ListTableBtns,
  LtbItem,
  TypeTags,
  StateBadge,
  ListTableTime
} from "@/components/commonComp/index";


const Task = (props) => {
  const { dispatch, channelList, saleTaskList, pageTotal, taskType } = props;
  let [form] = Form.useForm()
  let [pageNo, setPage] = useState(1)
  let [pageSize, setPageSize] = useState(10)
  const [filterData, setFilterData] = useState({})
  const [callList, setCallList] = useState(false)
  const [modalInfo, setMdalInfo] = useState('');//Modal数据
  let [payload, setPayload] = useState({
    pageInfo: {
      pageNo,
      pageSize,
    }
  })
  useEffect(() => {
    dispatch({
      type: 'saleFinish/onReset'
    })
  }, [])

  // modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if (flag) {
      setCallList(!callList)
    }
  }
  /*回调*/
  useEffect(() => {
    setCallList(!callList)
  }, [pageNo, pageSize, payload])
  //表单提交
  const submitData = (val) => {
    setFilterData(JSON.parse(JSON.stringify(val)))
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize,
      }
    }
    setPage(1)
    setPayload(data)
  }
  //表单重置
  const resetForm = () => {
    form.resetFields();
    setFilterData({})
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize,
      }
    }
    setPage(1)
    setPayload(data)
  }
  //列表接口
  useEffect(() => {
    queryChannelList();
    queryTaskType();
    queryTaskList();
  }, [callList])
  // 获取任务列表
  let queryTaskList = () => {
    let query = JSON.parse(JSON.stringify(filterData))
    if (query.date) {
      query.startTime = formatDate(query.date[0])
      query.endTime = formatDate(query.date[1])
    }
    if (query.createTask) {
      query.createTimeL = formatDate(query.createTask[0])
      query.createTimeR = formatDate(query.createTask[1])
    }
    delete query.date
    delete query.createTask
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId
    dispatch({
      type: 'saleTaskManage/querySaleTaskList',
      payload: {
        method: 'postJSON',
        params: {
          pageInfo: payload.pageInfo,
          ...query
        }
      },
    });
  }
  // 获取任务分类
  let queryTaskType = () => {
    dispatch({
      type: 'saleTaskManage/queryTaskType',
      payload: {
        method: 'get',
      }
    })
  }
  // 表格任务类型翻译
  const tableTaskType = (status, record) => {
    if (record.taskType == 1) return <TypeTags color="#FF4A1A">{status}</TypeTags>
    if (record.taskType == 2) return <TypeTags color="#2FB6E4">{status}</TypeTags>
    if (record.taskType == 3) return <TypeTags color="#32D1AD">{status}</TypeTags>
    if (record.taskType == 4) return <TypeTags color="#7545A7">{status}</TypeTags>
  }
  // 表格任务状态翻译   0未开始，1进行中，2已结束 3 待发布
  const tableTaskStatus = (status) => {
    if (status == 0) return <StateBadge color="#FFC500">未开始</StateBadge>
    if (status == 1) return <StateBadge color="#32D1AD">进行中</StateBadge>
    if (status == 2) return <StateBadge color="#C91132">已结束</StateBadge>
    if (status == 3) return <StateBadge color="#2FB6E4">待发布</StateBadge>
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
  // 回调
  useEffect(() => {
    /*taskDetail 无操作为0， 1为新增，2为编辑*/
    localStorage.setItem('taskDetail', '0');
  }, [])
  // 新增
  const handleAdd = () => {
    localStorage.setItem('taskDetail', 1);
    localStorage.removeItem('taskStatus', 3); // 任务状态, 3 为待发布，可编辑
    history.push('/sale/task/saleTaskModule/info')
  }
  // 编辑
  const editTask = (item) => {
    console.log('item',item)
    localStorage.setItem('taskDetail', 2);
    localStorage.setItem('taskStatus', item.taskStatus);
    history.push(`/sale/task/saleTaskModule/info?taskId=${item.taskId}`);
  }
  // 详情
  let queryDetails = (item) => {
    localStorage.setItem('taskDetail', 4);
    localStorage.setItem('taskStatus', item.taskStatus);
    history.push(`/sale/task/saleTaskModule/info?taskId=${item.taskId}`);
  }
  // 跳转数据看板
  let goToDataView = (record) => {
    history.push({
      pathname: '/sale/task/taskDataView',
      state: {
        data: { ...record }
      }
    })
  }
  // 发布
  let handleRelease = (item) => {
    dispatch({
      type: 'saleTaskManage/isTaskStatus',
      payload: {
        method: 'postJSON',
        params: {
          status: 3,
          taskId: item.taskId,
        },
      },
      callback: ((res) => {
        if (res.result.code == 0) {
          message.success('成功!');
          setCallList(!callList)
        } else {
          message.error(res.result.message)
        }
      })
    })
  }
  /*导出奖励发放失败名单excel*/
  let onDownloadExcel = (fileCode) => {
    dispatch({
      type: 'cardDetailList/onImportExcelFile',
      payload: {
        method: 'getDownloadExcel',
        params: { fileCode },
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '奖励发放失败名单.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  /*跳转模板消息记录*/
  let goToMsgHistory = () => {
    history.push({ pathname: '/carowner/messageInteraction/messageHistory', state: { templateId: {} } })
  }

  //分页
  const pageChange=(page,pageSize)=>{
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }



  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <ProFormText name="taskId" label="任务ID" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormText name="taskName" label="任务名称" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormSelect name="taskType" label="任务类型" labelCol={{ flex: '0 0 120px' }}
            options={taskType.map((v)=>{
              return {value:v.type,label:v.description}
            })} />
          <ProFormDateRangePicker format="YYYY-MM-DD" name="date" label="有效期" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormDateRangePicker format="YYYY-MM-DD" name="createTask" label="创建时间" labelCol={{ flex: '0 0 120px' }}/>
          <ProFormSelect name="taskStatus" label="状态" labelCol={{ flex: '0 0 120px' }}
            options={[
              {value:'0',label:'未开始'},
              {value:'1',label:'进行中'},
              {value:'2',label:'已结束'},
              {value:'3',label:'待发布'},
            ]} />
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={handleAdd} type="primary">新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageNo} pageSize={pageSize} total={pageTotal} onChange={pageChange}>
          <Table pagination={false} dataSource={saleTaskList} scroll={{ x: 1200 }} >
            <Column title="任务ID" width={100}  dataIndex="taskId" key="taskId" />
            <Column title="任务名称" width={130}  dataIndex="taskName" key="taskName" />
            <Column title="任务类型" width={100} dataIndex="taskTypeStr" key="taskTypeStr" render={(text, record) => tableTaskType(text, record)} />
            <Column title={
              <div>有效期&nbsp;
                <Tooltip placement='top' title='任务有效期，任务只在有效期内生效'>
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            } width={260}  dataIndex="startTime" key="startTime" render={(text, record) => (
              <Space size="middle">{record.startTime ? record.startTime : ''}{record.endTime ? '-' : ''}{record.endTime ? record.endTime : ''}</Space>
            )} />
            <Column title="状态" width={100} dataIndex="taskStatus" key="taskStatus" render={(text, record) => tableTaskStatus(text)} />
            <Column title="客户" width={120} dataIndex="channelName" key="channelName" />
            <Column title="创建时间" width={170}  dataIndex="createTime" key="createTime" render={(text, record) => <ListTableTime>{text || '-'}</ListTableTime>} />
            <Column width={200}  fixed={'right'} title="操作" key="taskStatus" render={(text, record) => (
              <ListTableBtns showNum={3}>
                { record.taskStatus == 3 ? <LtbItem onClick={() => { handleRelease(record) }}>发布</LtbItem> : null }
                { record.taskStatus == 1 ? <LtbItem onClick={() => { setMdalInfo({ modalName: 'nowEnd', ...record }) }}>立即结束</LtbItem> : null }
                { record.taskStatus == 0 ? <LtbItem onClick={() => { setMdalInfo({ modalName: 'nowStart', ...record }) }}>立即开始</LtbItem> : null }
                { record.taskStatus == 2 ? <LtbItem onClick={() => { queryDetails(record) }}>详情</LtbItem> : null }
                { record.taskStatus == 1 || record.taskStatus == 2 ? <LtbItem onClick={() => { goToDataView(record) }}>数据看板</LtbItem> : null }
                { record.taskStatus != 2 ? <LtbItem onClick={() => { editTask(record) }}>编辑</LtbItem> : null }
                { record.taskStatus == 2 || record.taskStatus == 3 ? <LtbItem onClick={() => { setMdalInfo({ modalName: 'taskDelete', ...record }) }}>删除</LtbItem> : null }
                { record.taskId > 98 ? <LtbItem onClick={() => { setMdalInfo({ modalName: 'taskCopy', ...record }) }}>复制</LtbItem> : null }
                { record.taskStatus == 1 || record.taskStatus == 2 ? <LtbItem onClick={goToMsgHistory}>消息通知记录</LtbItem> : null }
                { record.taskStatus == 2 && record.sendRewardFail ? <LtbItem onClick={() => { onDownloadExcel(record.sendRewardFail) }}>奖励发放失败名单</LtbItem> : null }
              </ListTableBtns>
            )}/>
          </Table>

        </ListTable>
      </div>
      {modalInfo ? <ModalBox modalInfo={modalInfo} toFatherValue={(flag) => callModal(flag)} /> : ''}
    </>
  )
}
export default connect(({ saleTaskManage }) => ({
  pageTotal: saleTaskManage.pageTotal,
  channelList: saleTaskManage.channelList,
  saleTaskList: saleTaskManage.saleTaskList,
  taskType: saleTaskManage.taskType
}))(Task);
