import React,{useEffect, useState} from 'react';
import { connect,history } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select,message,Row, Space, Button,Col,ConfigProvider,Pagination,DatePicker} from "antd";
const { RangePicker } = DatePicker
const { Option } = Select
import {formatDate,formatTime} from '@/utils/date'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment' 
import 'moment/locale/zh-cn'
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

moment.locale('zh-cn')

const strategicManageList = (props) =>{
  const { dispatch} = props;
  let strategyName = history.location.query.strategyName
  let [form] = Form.useForm()
  let [dataList,setDataList] = useState([]),
      [pageConfig,setPageConfig] = useState({}),
      [pageInfo, setPageInfo] =  useState({
        pageNo: 1,
        pageSize: 10,
        strategyName:strategyName
      })
  // 表格数据
  let renderColumns = () => {
    return (
      [{
        title: '策略ID',
        dataIndex: 'strategyId',  
        width:160,
        fixed:'left'
      },{
        title: '策略名称',
        dataIndex: 'strategyName',  
        width:200
      }, {
        title: '执行任务',
        dataIndex: 'sort',  
        width:200,
        render: (text, record) => {
          return  <span >执行任务{text+1}</span>
        }
      },{
        title: '任务类型',
        dataIndex: 'taskTypeStr',
        width:180,
        render: (text, record) => taskTypeRender(text, record)
      },
      {
        title: '触达内容',
        dataIndex: 'taskTypeContent',      
        width: 220,
        render: (text) => <TextEllipsis>{text}</TextEllipsis>
      }, {
        title: '触发场景',
        dataIndex: 'tiggerRecordTypeStr',
        width: 240,
      }, {
        title: '触发时间',
        dataIndex: 'time',
        width:160,
        render: (text) => <ListTableTime>{text}</ListTableTime>
      }, {
        title: '用户手机号',
        dataIndex: 'phone',
        width:160,
      },{
        title: '证件号',
        dataIndex: 'identityNo',
        width: 200
      },{
        title: 'openid',
        dataIndex: 'openId',
        width: 230
      }]
    )
  }
  // 获取列表数据
  useEffect(() => {
    getList()
  },[pageInfo])
  let getList = () => {
    let data = JSON.parse(JSON.stringify(form.getFieldsValue()))
    if(data.timeRange){
      data.startTime =  moment(data.timeRange[0]).format('YYYY-MM-DD')+' 00:00:00'
      data.endTime =  moment(data.timeRange[1]).format('YYYY-MM-DD')+ ' 23:59:59' 
    }else{
      data.startTime = ''
      data.endTime = ''
    }
    delete data.timeRange
    dispatch({
      type: 'triggerLog/queryTriggerRecordList',
      payload: {
        method: 'postJSON',
        params: Object.assign({},pageInfo,data)
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setDataList(res.body.body.list)
          setPageConfig({
            total:res.body.body.total,
            pages:res.body.body.pages,
            pageNum:res.body.body.pageNum
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  let [configList, setConfigList] = useState([])
  useEffect(()=>{
    let getFormFile = form.getFieldsValue()
    getFormFile.strategyName=strategyName
    form.setFieldsValue(getFormFile)
    queryTriggerConfigList()
  },[])

  let queryTriggerConfigList = () => {
    dispatch({
      type: 'triggerLog/queryTriggerConfigList',
      payload: {
        method: 'postJSON' 
     },
      callback: (res) => {
        if (res.result.code === '0') {
          setConfigList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询
  let searchData = (val) => {
    pageInfo.pageNo = 1
    setPageInfo({...pageInfo})
  }
  //表单重置
  const resetForm = () => {
    form.resetFields();
    pageInfo.pageNo = 1
    pageInfo.strategyName = null
    setPageInfo({...pageInfo})
  }

  //分页
  const pageChange=(page,pageSize)=>{
    setPageInfo({
      ...pageInfo,
      pageNo:page,
      pageSize:pageSize
    })
  }

  let taskTypeRender = (text, all) => {
    if(all.taskType==1) return <TypeTags color="#2FB6E4">{text}</TypeTags>
    if(all.taskType==2) return <TypeTags color="#32D1AD">{text}</TypeTags>
    if(all.taskType==3) return <TypeTags color="#FF4A1A">{text}</TypeTags>
  }


  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchData} onReset={resetForm}>
          <ProFormText label="策略名称" name='strategyName' placeholder='请输入' labelCol={{flex:'0 0 120px'}}/>
          <ProFormSelect label="任务类型"  name="taskType" labelCol={{ flex: '0 0 120px' }} 
            options={[
              {value:1,label:'卡券发放'},
                {value:2,label:'模板发放'},
              {value:3,label:'弹窗'},
          ]} />
          <ProFormSelect label="场景触发"  name="tiggerRecordType" labelCol={{ flex: '0 0 120px' }} 
            options={configList.map(item=>{
              return {value:item.id,label:item.triggerName}
          })} />
          <ProFormDateRangePicker label="触发时间" name="timeRange"  format="YYYY-MM-DD"   labelCol={{ flex: '0 0 120px' }}/>
          <ProFormText label="openid" name='openId' placeholder='请输入' labelCol={{flex:'0 0 120px'}}/>
          <ProFormText label="手机号" name='phone' placeholder='请输入' labelCol={{flex:'0 0 120px'}}/>
          <ProFormText label="证件号" name='identityNo' placeholder='请输入' labelCol={{flex:'0 0 120px'}}/>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表"></ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={pageConfig.total} onChange={pageChange}>
          <Table columns={renderColumns()} dataSource={dataList} pagination={false} scroll={{ x: 1200 }} />
        </ListTable>
      </div>
    </>
  )
}
export default connect(({ strategicList }) => ({
}))(strategicManageList);