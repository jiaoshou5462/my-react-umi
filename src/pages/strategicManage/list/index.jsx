import React,{useEffect, useState} from 'react';
import { connect,history } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select,message,Row, Space, Button,Col,ConfigProvider,Pagination,DatePicker} from "antd";
const { Column } = Table;
const { RangePicker } = DatePicker
const { Option } = Select
import {formatDate,formatTime} from '@/utils/date'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment' 
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { QueryFilter, ProFormText, ProFormDatePicker,ProFormDateRangePicker,ProFormSelect } from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

const strategicManageList = (props) =>{
  const { dispatch} = props;
  let [form] = Form.useForm()
  let [dataList,setDataList] = useState([]),
      [pageConfig,setPageConfig] = useState({}),
      [pageInfo, setPageInfo] =  useState({
        pageNo: 1,
        pageSize: 10
      })

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
      type: 'strategicList/queryWanderList',
      payload: {
        method: 'postJSON',
        params: Object.assign({},data,pageInfo)
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setDataList(res.body.list)
          setPageConfig({
            total:res.body.total,
            pages:res.body.pages,
            pageNum:res.body.pageNum
          })
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
  // 更改状态
  //1.生效，2失效
  let updateStatus = (record) => {
    dispatch({
      type: 'strategicList/updateStatus',
      payload: {
        method: 'postJSON',
        params: {
          status: record.status,
          id:record.id
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          getList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 删除
  let deleteWander = (record) => {
    dispatch({
      type: 'strategicList/deleteWander',
      payload: {
        method: 'get',
        params: {
          id:record.id
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          getList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 创建营销策略
  let toCreateStrategic = (type,record) =>{
    if(type=='new'){
      history.push('/strategicManage/list/createStrategic')
    }else{
      history.push({
        pathname: '/strategicManage/list/createStrategic',
        query: {
          id:record.id, //2350715
        }
      })
    } 
  }
 // 进入详情统计页面
 let toDetail = (record) =>{
    history.push({
      pathname: '/strategicManage/list/strategicDetail',
      query: {
        id:record.id, //2350715
      }
    })
 }
 // 进入详情
 let toTriggerLog = (record) => {
  history.push({
    pathname: '/strategicManage/triggerLog',
    query: {
      strategyName:record.strategyName, //2350715
    }
  })
 }
  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} onFinish={searchData} onReset={resetForm}>
          <ProFormSelect label="策略类型"  name="strategyType" labelCol={{ flex: '0 0 120px' }} 
            options={[
              {value:1,label:'定时'},
              {value:2,label:'实时'},
          ]} />
          <ProFormText label="策略名称" name='strategyName' placeholder='请输入' labelCol={{flex:'0 0 120px'}}/>
          <ProFormSelect label="策略状态"  name="status" labelCol={{ flex: '0 0 120px' }} 
            options={[
              {value:1,label:'待生效'},
              {value:2,label:'生效中'},
              {value:3,label:'已失效'},
                {value:4,label:'已结束'},
          ]} />
          <ProFormDateRangePicker label="创建时间" name="timeRange"  format="YYYY-MM-DD"   labelCol={{ flex: '0 0 120px' }}/>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type='primary' onClick={()=>toCreateStrategic('new')}>创建营销策略</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={pageConfig.total} onChange={pageChange}>
          <Table dataSource={dataList} scroll={{x:1200}} pagination={false}>
            <Column title="策略ID" dataIndex="id" key="id" width={100} fixed="left" 
              render={(text, record) => {
                return  <span className={style.name} onClick={()=>toCreateStrategic('edit',record)}>{text}</span>
              }} />
            <Column title="策略名称" dataIndex="strategyName" key="strategyName" width={200} />
            <Column title="策略类型" dataIndex="strategyTypeStr" key="strategyTypeStr" width={180} 
              render={(text, record) => {
                return <TypeTags color={`${record.strategyType==1? '#2FB6E4': '#FF4A1A'}`}>{text}</TypeTags>
              }}/>
            <Column title="受众用户" dataIndex="userSourceStr" key="userSourceStr" width={160} />
            <Column title="最近触发时间/触发人次" dataIndex="lastTriggerTime" key="lastTriggerTime" width={240} />
            <Column title="策略计划时间" dataIndex="lastTriggerTimeStr" key="lastTriggerTimeStr" width={180} />
            <Column title="执行任务数量" dataIndex="taskNum" key="taskNum" width={160} />
            <Column title="策略状态" dataIndex="statusStr" key="statusStr" width={160} 
              render={(text, record) => {
                return <>
                  {
                    record.status==1?<StateBadge color="#FFE76B">{text}</StateBadge>:
                    record.status==2?<StateBadge color="#4BDB85">{text}</StateBadge>:
                    record.status==3?<StateBadge color="#ED1F45">{text}</StateBadge>:
                    <StateBadge color="#CCCCCC">{text}</StateBadge>
                  }
                </>
              }}/>
            <Column title="创建时间" dataIndex="createTime" key="createTime" width={200}  
              render={(text, record) => {
                return <ListTableTime>{formatTime(text)}</ListTableTime>
              }}/>
            <Column title="操作" fixed="right"  width={160}
              render={(text, record)=>(
                <ListTableBtns>
                  { record.status==1 ? <LtbItem  onClick={()=>{toCreateStrategic('edit',record)}}>编辑</LtbItem> : ''}
                  { record.status==1 ? <LtbItem  onClick={()=>{updateStatus(record)}}>生效</LtbItem> : ''}
                  { record.status==2 ? <LtbItem  onClick={()=>{updateStatus(record)}}>失效</LtbItem> : ''}
                  { record.status==2 || record.status==3|| record.status==4 ? <LtbItem  onClick={()=>{toDetail(record)}}>查看执行明细</LtbItem> : ''}
                  { record.status==1 ? <LtbItem  onClick={()=>{deleteWander(record)}}>删除</LtbItem> : ''}
                </ListTableBtns>
              )} />
          </Table>
        </ListTable>
      </div>
    </>
  )
}
export default connect(({ strategicList }) => ({
}))(strategicManageList);