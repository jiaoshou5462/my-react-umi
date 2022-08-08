import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Form, Space, Input, Table, Select, Button, Modal } from "antd"
import style from "./style.less"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import TemplateDetailsModal from "./TemplateDetailsModal";
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
import ConfirmModal from "./ConfirmModal";
import AddEditUpModal from "./AddEditUpModal";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Search } = Input
let statusArr = [{
  id: 1,
  title: '活动场景'
}, {
  id: 2,
  title: '订单场景'
}, {
  id: 3,
  title: '卡券'
}, {
  id: 4,
  title: '会员消息'
}, {
  id: 5,
  title: '定向场景'
}]
let triggerType = [{
  id: 1,
  title: "场景推送"
}, {
  id: 2,
  title: "人工推送"
}]
let stateArr = [{
  id: 1,
  title: "未启用"
}, {
  id: 2,
  title: "已启用"
}]
let modalTemplateType = '';
const sceneTemplatePage = (props) => {
  let { dispatch, pageTotal, list } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [pageNum, setPageNum] = useState(1),
    [detailsVisible, setDetailsVisible] = useState(false), //模板详情弹窗
    [confirmVisible, setConfirmVisible] = useState(false),//二次确认弹窗
    [addVisible, setAddVisible] = useState(false),//模板弹窗
    [templateNo, setTemplateNo] = useState(''),//场景模板ID
    [templateNoAdd, setTemplateNoAdd] = useState(''),//新增、编辑、启用场景模板ID
    [templateNoJump, setTemplateNoJump] = useState(''),//跳转详情场景模板ID
    [statusNo, setStatusNo] = useState(''),//z状态ID
    [moduleType, setModuleType] = useState(''),//二次确认类型
    [entryType, setEntryType] = useState(''),//模板弹窗入口
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
    })

  /*回调*/
  useEffect(() => {
    getList()
  }, [pageNum, pageSize, payload])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'sceneTemplate/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }


  let renderColumns = () => {
    return (
      [
        {
          title: '场景模板ID',
          dataIndex: 'sceneTemplateId',
          fixed: 'left',
          width: 120,
          render: (sceneTemplateId) => <span className={style.click_blue} onClick={() => { goToDetail(sceneTemplateId) }}>{sceneTemplateId}</span>
        }, 
        {
          title:'模版类型',
          dataIndex: 'templateTypeName',
          width: 120,
        },
        {
          title: '场景消息分类',
          dataIndex: 'sceneTypeStr',
          width: 120,
        }, 
        {
          title: '场景模板名称',
          dataIndex: 'sceneTemplateName',
          width: 120,
          render: (text, record) => <TextEllipsis>{text}</TextEllipsis>
        }, 
        {
          title: '触发类型',
          dataIndex: 'triggerTypeStr',
          width: 120,
          render:(triggerTypeStr,all)=><TypeTags color={all.triggerType==1?'#32D1AD' : all.triggerType==2?'#FF4A1A':'-'}>{triggerTypeStr}</TypeTags>
        },
        {
          title: '微信模板名称',
          dataIndex: 'templateTitle',
          width: 120,
        }, 
        {
          title: '微信模板ID',
          dataIndex: 'templateId',
          width: 200,
          render: (text, record) => <TextEllipsis>{text}</TextEllipsis>
        }, 
        {
          title: '状态',
          dataIndex: 'status',
          width: 120,
          render: (status, record) => <StateBadge color={badgeValue[status].color}>{badgeValue[status].text}</StateBadge> 
        }, 
        {
          title: '操作',
          fixed: 'right',
          width: 170,
          render: (render) => {
            return <ListTableBtns showNum={3}>
              { render.status == 2 ?<LtbItem onClick={() => setStopUp(render.sceneTemplateId, render.status)}>停用</LtbItem> : null }
              { render.status == 1 || (render.status == 1 && render.triggerType == 2) ?<LtbItem onClick={() => setStartUp(render)}>启用</LtbItem> : null }
              { render.status == 1 || (render.status == 1 && render.triggerType == 2)  ?<LtbItem onClick={() => setEdit(render)}>编辑</LtbItem> : null }
              { render.status == 1 && render.triggerType == 2 ?<LtbItem onClick={() => setDeleteUp(render.sceneTemplateId)}>删除</LtbItem> : null }
            </ListTableBtns>
          }
        }
      ]
    )
  }

  // 状态翻译  
  const badgeValue = {
    1: { color: 'red', text: '未启用' },
    2: { color: 'green', text: '已启用' },
  }

  /*操作*/
  let setStartUp = ({sceneTemplateId, status, triggerType,templateId,templateType}) => { //启用
    console.log(triggerType)
    if (triggerType == 2 || templateId) {
      setTemplateNo(sceneTemplateId)
      setStatusNo(status)
      setModuleType(1)
    } else {
      setTemplateNoAdd(sceneTemplateId)
      modalTemplateType = templateType;
      setAddVisible(true)
      setEntryType(1)
    }
  }

  let setStopUp = (sceneTemplateId, status) => { //停用
    setTemplateNo(sceneTemplateId)
    setStatusNo(status)
    setModuleType(2)
  }

  let setEdit = ({sceneTemplateId,templateType}) => {  //编辑
    setTemplateNoAdd(sceneTemplateId)
    modalTemplateType = templateType;
    setAddVisible(true)
    setEntryType(2)
  }

  let setDeleteUp = (sceneTemplateId) => { //删除
    setTemplateNo(sceneTemplateId)
    setModuleType(3)
  }

  /*跳转详情*/
  let goToDetail = (sceneTemplateId) => {
    setTemplateNoJump(sceneTemplateId)
  }

  //操作弹窗回调
  useEffect(() => {
    if (templateNo) {
      setConfirmVisible(true)
    } else {
      setConfirmVisible(false)
    }
  }, [templateNo])

  //详情弹窗回调
  useEffect(() => {
    if (templateNoJump) {
      setDetailsVisible(true)
    } else {
      setDetailsVisible(false)
    }
  }, [templateNoJump])

  //新增弹窗回调
  useEffect(() => {
    if (templateNoAdd) {
      setAddVisible(true)
    } else {
      setAddVisible(false)
    }
  }, [templateNoAdd])

  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      pageSize,
      pageNum: 1,
    }
    setPageNum(1)
    setPayload(data)
  }

  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    let data = {
      ...e,
      pageSize,
      pageNum: 1,
    }
    setPageNum(1)
    setPayload(data)
  }

  //分页
  const pageChange=(page,pageSize)=>{
    payload.pageSize = pageSize;
    payload.pageNum = page
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(payload)
  }

  /*新增*/
  let addDirectorLaunch = () => {
    setTemplateNoAdd(1)
    modalTemplateType = '1';
    setAddVisible(true)
    setEntryType(3)
  }

  /*设置弹窗回调*/
  let onCallbackSetSales = (e) => {
    setTemplateNo('')
    setTemplateNoJump('')
    setTemplateNoAdd('')
    if (e) {
      getList()
    }
  }

  return (
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <ProFormSelect name="templateType" label="模板类型" placeholder="不限" labelCol={{ flex: '0 0 120px' }} 
            options={[
              {value:null,label:'全部'},
              {value:'1',label:'公众号模板'},
              {value:'2',label:'订阅号模板'},
            ]} />
          <ProFormSelect name="sceneType" label="场景消息分类" placeholder="不限" labelCol={{ flex: '0 0 120px' }} 
          options={statusArr.map((item, key) => {
            return {value:item.id,label:item.title}
          })} />
          <ProFormText name="sceneTemplateName" label="场景模板名称" placeholder="请输入"  labelCol={{ flex: '0 0 120px' }}/>
          <ProFormSelect name="triggerType" label="触发类型" placeholder="不限" labelCol={{ flex: '0 0 120px' }} 
          options={triggerType.map((item, key) => {
            return {value:item.id,label:item.title}
          })} />
          
          <ProFormSelect name="status" label="状态" placeholder="不限" labelCol={{ flex: '0 0 120px' }} 
            options={stateArr.map((item, key) => {
              return {value:item.id,label:item.title}
            })} />
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="场景模板列表">
          <Space size={8}>
            <Button type='primary' onClick={() => { addDirectorLaunch() }}>新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageNum} pageSize={pageSize} total={pageTotal} onChange={pageChange} >
          <Table dataSource={list} scroll={{x:1200}} columns={renderColumns()} pagination={false}></Table>
        </ListTable>
      </div>

      <ConfirmModal //二次确认弹窗
        templateNo={templateNo}
        moduleType={moduleType}
        statusNo={statusNo}
        confirmVisible={confirmVisible}
        onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
      />

      <TemplateDetailsModal //详情弹窗
        templateNo={templateNoJump}
        detailsVisible={detailsVisible}
        onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
      />

      <AddEditUpModal  // 新增、编辑、启动弹窗
        templateNo={templateNoAdd}
        templateType={modalTemplateType}
        entryType={entryType}
        addVisible={addVisible}
        onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
      />
    </div>
  )
};
export default connect(({ sceneTemplate }) => ({
  list: sceneTemplate.list,
  pageTotal: sceneTemplate.pageTotal,
}))(sceneTemplatePage)
