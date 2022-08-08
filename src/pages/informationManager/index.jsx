import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import { Row, Col,Form, Modal,  Select, Input, DatePicker, Button, Table, Space, ConfigProvider, Pagination,message  } from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import NewInfomation from './components/newInfomation'
import ForwardNum from './components/forwardNum'
import {formatDate} from '@/utils/date'

import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

moment.locale('zh-cn');
const { confirm } = Modal
const { RangePicker } = DatePicker;
const informationManagere =(props)=>{
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
  let {dispatch } = props,
  [form] = Form.useForm()

  const [payload, setPayload] = useState({
    channelId:tokenObj.channelId,
    newsCategory: '', // 品类Id
    newsStatus: null,  //状态
    title: '',  //标题
    reportStartTime:'',   //开始时间
    reportEndTime:'' ,    //结束时间
    pageSize: 10,
    pageNum:1
  })
  const [list, setList] = useState([]) // 列表
  const [channelList, setChannelList] = useState([])
  const [callList, setCallList] = useState(false)//重置使用
  const [isModalDelVisible, setIsModalDelVisible] = useState(false)//删除弹框
  const [isModalUpdVisible, setIsModalUpdVisible] = useState(false)//启用/禁用弹框
  const [statusName, setStatusName] = useState('')//名称
  const [categoryList, setCategoryList] = useState(2)//分类下拉框
  const [pageInfo, setPageInfo] = useState({})//分页器
  const [updInfomation, setUpdInfomation] = useState({objectId:0,newsStatus:0})//禁用/启用使用
  const [objectId, setObjectId] = useState(0)//删除使用
  
  //搜索条件
  useEffect(() => {
    customerChannelList(tokenObj.channelId);
    let formData = {
      channelId:tokenObj.channelId,
      title:"",
      categoryId:"",
      status:"",
      start:""
    }
    form.setFieldsValue(formData)
  },[callList])

  useEffect(() => {
    // 分类下拉框
    crmNewsCategoryList()
  },[])

  useEffect(() => {
    // 列表查询
    getNewsList()
  },[payload, callList])



  // 获取渠道列表
  let customerChannelList = (channelId) => {
    dispatch({
      type: 'informationManager/customerChannelList',
      payload: {
        method:'get',
        params: {
          channelId:channelId,
        }
      },
      callback: res => {
        if(res.body.code=='000') {
          setChannelList(res.body.data.channelList)
        }
      }
    })
  }
  // 下拉框分类
  let crmNewsCategoryList = () => {
    dispatch({
      type: 'informationManager/crmNewsCategoryList',
      payload: {
        method:'post',
        params: {
        }
      },
      callback: res => {
        if(res.result.code == '0'){
          setCategoryList(res.body.data)
        }
      }
    })
  }
  //列表查询
  let getNewsList = () => {
    dispatch({
      type: 'informationManager/getNewsList',
        payload: {
          method:'postJSON',
          params: payload
        },
        callback: res => {
          if(res.result.code == '0'){
            setList(res.body.data)
            setPageInfo(res.body.pageInfo)
          }
        }
      }) 
  }

   let updateNewsStatus = updInfomation =>{
    dispatch({
      type: 'informationManager/updateNewsStatus',
      payload: {
        method:'postJSON',
        params: {
          newsStatus:updInfomation.newsStatus===1?2:1,
          objectId:updInfomation.objectId
        }
      },
      callback: res => {
        if(res.result.code == '0' ){
          message.success(res.result.message)
          getNewsList();
        }else{
          message.error(res.result.message)
        }
      }
    })
   }
   

  // 提交
  const searchBtnEvent = (val) => {
    console.log(val,"val")
    let query = JSON.parse(JSON.stringify(val))
    if(val.start) {
      query.reportStartTime = formatDate(val.start[0])
      query.reportEndTime = formatDate(val.start[1])
    }
    setPayload(query)
  }
  //启用/禁用转态
  let updStatus = (record)=>{
    setStatusName(record.newsStatus==2?'停用':'启用')
    setUpdInfomation({newsStatus:record.newsStatus,objectId:record.objectId})
    setIsModalUpdVisible(true)
  }
  //删除资讯
  let delInfomation = (record) =>{
    console.log("record",record)
    setObjectId(record.objectId);
    setIsModalDelVisible(true)
  }
  //编辑资讯 打开弹框
  let editInfomation = (record) =>{
    console.log(record,"record")
    setMdalInfo({modalName: 'edit',objectId:record.objectId})
  }
  // 转发数量
  let forwardNum = (text,record) =>{
    setForwordNum({modalName: 'forward',data:record})
    console.log(forwordNum)
  }
  
  //操作组件
  const Operation= (text,record) =>{
    // 状态为启用 显示编辑 禁用  状态为禁用显示 启用编辑删除
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={()=> {editInfomation(record)}}>编辑</LtbItem>
      { text.newsStatus === 1 ? <LtbItem onClick = {()=>{updStatus(record)}}>启用</LtbItem> : null }
      { text.newsStatus === 1 ? <LtbItem onClick={()=>{delInfomation(record)}}>删除</LtbItem> : null }
      { text.newsStatus === 2 ? <LtbItem onClick = {()=>{updStatus(record)}}>禁用</LtbItem> : null }
    </ListTableBtns>
  }
  //重置
  let resetBtnEvent = ()=>{
    setPayload({
      channelId:tokenObj.channelId,
      newsCategory: '', // 品类Id
      newsStatus: null,  //状态
      title: '',  //标题
      reportStartTime:'',   //开始时间
      reportEndTime:'' ,    //结束时间
      pageSize: 10,
      pageNum:1
    })
    form.resetFields();
    setCallList(!callList)
  }

  //列表字段
  let renderColumns = () => {
    return (
      [{
        title: '客户',
        dataIndex: 'channelName',
        fixed: 'left',
      }, {
        title: '分类',
        dataIndex: 'newsCategoryName',
      },
       {
        title: '标题',
        dataIndex: 'title',
        render: (title) => <TextEllipsis>{title}</TextEllipsis>
      },
      {
        title: '内容简介',
        dataIndex: 'textContent',
        render: (textContent) => <TextEllipsis>{textContent}</TextEllipsis>
      }, {
        title: '生效时间',
        dataIndex: 'reportTime',
        render: (reportTime) => <ListTableTime>{reportTime}</ListTableTime>
      }, {
        title: '状态',
        dataIndex: 'newsStatus',
        render:(text, record) => {return text === 2 ?<StateBadge status="success">启用</StateBadge>:<StateBadge type="red">禁用</StateBadge>}
      }, {
        title: '排序',
        dataIndex: 'newsOrderNo',
      }, {
        title: '转发数量',
        dataIndex: 'forwardNum',
        render: (text, record) => <ListTableBtns >
          <LtbItem onClick={()=>forwardNum(text,record)}>{text}</LtbItem>
        </ListTableBtns>
      }, {
        title: '转发点击数量',
        dataIndex: 'forwardClickNum',
        render:(text, record)=> <ListTableBtns >
          <LtbItem onClick={()=>forwardNum(text,record)}>{text}</LtbItem>
        </ListTableBtns>
      }, {
        title: '操作',
        dataIndex: '',
        fixed: 'right',
        render: (text, record) => Operation(text, record)
      }]
    )
  }


  //Modal数据
  const [modalInfo, setMdalInfo] = useState('')
  //转发/点击转发数量
  const [forwordNum, setForwordNum] = useState('')
  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if(flag) {
      setCallList(!callList)
    }
  }

   //modal回调
   const callModalForword = (flag) => {
    setForwordNum('')
    // if(flag) {
    //   setCallList(!callList)
    // }
  }
  // 删除弹框确认
  let handleDelVisibleOk = (record)=>{

    dispatch({
      type: 'informationManager/delInfomation',
      payload: {
        method:'delete',
        newsId:objectId
      },
      callback: res => {
        if(res.result.code == '0'){
          message.success(res.result.message)
          getNewsList()
        }else{
          message.error(res.result.message)
        }
      }
    }) 

    setIsModalDelVisible(false)
  }
   // 删除弹框取消
   let handleDelVisibleCancel = ()=>{
    setIsModalDelVisible(false)
  }
  // 启用/禁用弹框确认
  let handleUpdVisibleOk = (record)=>{
    updateNewsStatus(updInfomation)
    setIsModalUpdVisible(false)
  }
   // 启用/禁用弹框取消
   let handleUpdVisibleCancel = ()=>{
    setIsModalUpdVisible(false)
  }
  //分页
  const pageChange=(page,pageSize)=>{
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }

  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="客户" name="channelId" labelCol={{flex:'0 0 120px'}}>
            <Select showSearch notFoundContent='暂无数据' placeholder="请输入" optionFilterProp="children" disabled>
              {
                channelList && channelList.length ? channelList.map((item, key) => <Option key={key} value={item.id}>{item.channelName}</Option>): ''
              }
            </Select>
          </Form.Item>
          <Form.Item label="分类" name="newsCategory" labelCol={{flex:'0 0 120px'}}>
            <Select showSearch notFoundContent='暂无数据' placeholder="请输入" optionFilterProp="children">
                {
                  categoryList && categoryList.length ? categoryList.map((item, key) => <Option key={key} value={item.objectId}>{item.categoryName}</Option>): ''
                }
            </Select>
          </Form.Item>
          <Form.Item label="标题" name="title" labelCol={{flex:'0 0 120px'}}>
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item label="生效时间" name="start" labelCol={{flex:'0 0 120px'}}>
            <RangePicker style={{ width: '100%' }} onClick={(e)=> {console.log(e)}} format="YYYY-MM-DD"/>
          </Form.Item>
          <Form.Item label="状态" name="newsStatus" labelCol={{flex:'0 0 120px'}}>
            <Select showSearch placeholder="请选择状态" optionFilterProp="children" >
              <option value={2}>启用</option>
              <option value={1}>禁用</option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type="primary" onClick={()=> {setMdalInfo({modalName: 'add'})}}>新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={pageInfo.totalCount} onChange={pageChange}>
          <Table scroll={{x:1200}} columns={renderColumns()} dataSource={list} pagination={false} />
        </ListTable>
      </div>
      <Modal title="删除" visible={isModalDelVisible} onOk={handleDelVisibleOk} onCancel={handleDelVisibleCancel}>
          你确认删除吗？
      </Modal>
      <Modal title={statusName} visible={isModalUpdVisible} onOk={() =>{handleUpdVisibleOk()}} onCancel={handleUpdVisibleCancel}>
          你确定要{statusName}吗？
      </Modal>
      {modalInfo?<NewInfomation modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
      {forwordNum?<ForwardNum modalInfo={forwordNum} toFatherValue={(flag)=>callModalForword(flag)} />:''}
  </>
  )
};
export default connect(({informationManager})=>({

}))(informationManagere)


