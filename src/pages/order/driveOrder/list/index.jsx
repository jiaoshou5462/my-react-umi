import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Form,
  Input,
  Table,
  Select,
  DatePicker
} from "antd"
import {
  LtbItem,
  ListTitle,
  ListTable,
  StateBadge,
  ListTableTime,
  ListTableBtns
} from "@/components/commonComp/index"
import {QueryFilter} from "@ant-design/pro-form"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let statusArr = [{
  id: '0',
  color: '#FFC500',
  title: '待确认'
},{
  id: '1',
  color: '#32D1AD',
  title: '已预约'
},{
  id: '2',
  color: '#2FB6E4',
  title: '已接单'
},{
  id: '3',
  color: '#7545A7',
  title: '已到达'
},{
  id: '4',
  color: '#0084FF',
  title: '已出发'
},{
  id: '5',
  color: '#28CB6B',
  title: '已完成'
},{
  id: '6',
  color: '#FF4A1A',
  title: '已取消'
},{
  id: '7',
  color: '#FF9500',
  title: '待支付'
},{
  id: '8',
  color: '#C91132',
  title: '已失效'
},{
  id: '9',
  color: '#5E5CE6',
  title: '待派单'
},{
  id: '10',
  color: '#4B7FE8',
  title: '调度中'
},{
  id: '11',
  color: '#AF52DE',
  title: '取消待确认'
},]

/*订单来源*/
let OrderSourceArr = [{
  id: 0,
  title: '后台'
},{
  id: 1,
  title: '用户'
},{
  id: 2,
  title: '系统'
}
]

const driveOrderListPage =(props)=>{
  let {dispatch, pageTotal, list} = props,
    [form] = Form.useForm(),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [payload, setPayload] = useState({
      channelId,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    })

  /*回调*/
  useEffect(()=>{
    if(channelId){
      getList()
    }
  },[payload])

  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'driveOrderList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }

  let renderColumns = () => {
    return (
        [{
          title: '订单号',
          dataIndex: 'orderNo',
          width: 190,
          fixed: 'left',
        }, {
          title: '订单状态',
          width: 130,
          dataIndex: 'orderStatusName',
          render: (orderStatusName, record) => statusRender(orderStatusName, record)
        }, {
          title: '手机号',
          width: 150,
          dataIndex: 'customerPhone',
        }, {
          title: '出发地',
          width: 230,
          dataIndex: 'customerAddress',
        }, {
          title: '申请时间',
          width: 180,
          dataIndex: 'createTime',
          render: (createTime) => {
            return <ListTableTime>{createTime}</ListTableTime>
          }
        }, {
          title: '预约时间',
          width: 180,
          dataIndex: 'bookTime',
          render: (bookTime) => {
            return <ListTableTime>{bookTime}</ListTableTime>
          }
        }, {
          title: '完成时间',
          width: 180,
          dataIndex: 'finishTime',
          render: (finishTime) => {
            return <ListTableTime>{finishTime}</ListTableTime>
          }
        }, {
          title: '订单来源',
          dataIndex: 'sourceFlagStr',
          width: 100,
          render: (sourceFlagStr) => {
            return <span>{sourceFlagStr || '-'}</span>
          }
        }, {
          title: '操作',
          width: 100,
          fixed: 'right',
          dataIndex: 'objectId',
          render: (objectId) => operateRender(objectId)
        }]
    )
  }
  /*操作*/
  let operateRender = (objectId) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/order/driveOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={goToDetail}>查看</LtbItem>
    </ListTableBtns>
  }
  let statusRender = (name, record) => {
    let tempColor = ''
    statusArr.map(item => {
      if(Number(item.id) === record.orderStatus){
        tempColor = item.color
      }
    })
    return <StateBadge color={tempColor}>{name}</StateBadge>
  }
  /*清空内容*/
  let resetBtnEvent = ()=> {
    form.resetFields()
    let data = {
      channelId,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    }
    setPayload(data)
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let data = {
      ...e,
      channelId,
      createTimeEnd,
      createTimeStart,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    }
    setPayload(data)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    let temp = JSON.parse(JSON.stringify(payload))
    temp.pageInfo.pageNo = page
    temp.pageInfo.pageSize = pageSize
    setPayload(temp)
  }

  return(
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="订单号：" name="orderNo" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="手机号：" name="customerPhone" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="申请时间：" name="createTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker
                allowClear
                locale={locale}
                style={{width: '100%'}}
                placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item label="订单状态：" name="orderStatus" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                statusArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="订单来源" name="sourceFlag" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="请选择" allowClear>
              {
                OrderSourceArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表" />
        <ListTable
            showPagination
            total={pageTotal}
            onChange={onNextChange}
            current={payload.pageInfo.pageNo}
            pageSize={payload.pageInfo.pageSize}
        >
          <Table
              locale={{emptyText: '暂无数据'}}
              columns={renderColumns()}
              dataSource={list}
              pagination={false}
              scroll={{
                x: 600
              }}
              loading={{
                spinning: false,
                delay: 500
              }}
          />
        </ListTable>
      </div>
    </div>
  )
};
export default connect(({driveOrderList})=>({
  list: driveOrderList.list,
  pageTotal: driveOrderList.pageTotal,
}))(driveOrderListPage)
