import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Space,
  Input,
  Table,
  Select,
  Button,
  Pagination,
  ConfigProvider,
  DatePicker
} from "antd"
const { Column } = Table;
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Search } = Input
let statusArr = [{
  id: 1,
  title: '预约中'
}, {
  id: 2,
  title: '预约成功'
}, {
  id: 3,
  title: '预约失败'
}, {
  id: 4,
  title: '取消待确认'
}, {
  id: 5,
  title: '已完成'
}, {
  id: 6,
  title: '已取消'
}, {
  id: 7,
  title: '待支付'
}, {
  id: 8,
  title: '已失效'
}]

import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const eMaintOrderListPage = (props) => {
  let { dispatch, pageTotal,list, queryStoreSelectLists } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageNum, setPageNum] = useState(1),
    [payload, setPayload] = useState({
      channelId,
      pageNum,
      pageSize,
      pageInfo: {
      }
    })

  useEffect(() => {
    dispatch({
      type: 'eMaintOrderList/getQueryStoreSelectList',
      payload: {
        method: 'postJSON',
        params: {}
      },
    })
  }, [])
  /*回调*/
  useEffect(() => {
    if (channelId) {
      getList()
    }
  }, [pageNum, pageSize, payload])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'eMaintOrderList/getList',
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
        align: 'left',
        fixed: 'left',
      }, {
        title: '订单状态',
        align: 'left',
        dataIndex: 'orderStatusName',
        render: (text, record) => orderStatusRender(text, record)
      }, {
        title: '车主姓名',
        align: 'left',
        dataIndex: 'customerName',
      }, {
        title: '车主手机号',
        align: 'left',
        dataIndex: 'customerPhone',
      }, {
        title: '下单时间',
        align: 'left',
        dataIndex: 'orderTimeStr',
        render: (text) => <ListTableTime>{text}</ListTableTime>
      }, {
        title: '预约时间',
        align: 'left',
        dataIndex: 'bookTimeStr',
        render: (text) => <ListTableTime>{text}</ListTableTime>
      }, {
        title: '预约门店',
        align: 'left',
        dataIndex: 'storeName',
        render: (text) => <TextEllipsis>{text}</TextEllipsis>
        
      }, {
        title: '操作',
        align: 'left',
        fixed: 'right',
        dataIndex: 'id',
        render: (id) => operateRender(id)
      }]
    )
  }


  /*操作*/
  let operateRender = (objectId) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/order/eMaintOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <ListTableBtns><LtbItem onClick={()=>{goToDetail()}}>查看</LtbItem></ListTableBtns>
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      channelId,
      pageSize,
      pageNum: 1,
      pageInfo: {
      }
    }
    setPageNum(1)
    setPayload(data)
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    //下单时间
    let placeEndDate = e.placeDate ? moment(e.placeDate[1]).endOf('day').format('YYYY-MM-DD')  : null
    let placeStartDate = e.placeDate ? moment(e.placeDate[0]).startOf('day').format('YYYY-MM-DD')  : null
    //预约时间
    let bookEndDate = e.bookDate ? moment(e.bookDate[1]).endOf('day').format('YYYY-MM-DD')  : null
    let bookStartDate = e.bookDate ? moment(e.bookDate[0]).startOf('day').format('YYYY-MM-DD')  : null
    let data = {
      ...e,
      channelId,
      pageSize,
      pageNum: 1,
      placeEndDate,
      placeStartDate,
      bookEndDate,
      bookStartDate,
      pageInfo: {
      }
    }
    setPageNum(1)
    setPayload(data)
  }

  //分页
  const pageChange=(page,pageSize)=>{
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPageNum(page)
    setPageSize(pageSize)
    setPayload(this_payload)
  }

  // 订单状态翻译
  let orderStatusRender = (text, record) => {
    if(record.orderStatus==1) return <StateBadge color="#2FB6E4">{text}</StateBadge>
    if(record.orderStatus==2) return <StateBadge color="#32D1AD">{text}</StateBadge>
    if(record.orderStatus==3) return <StateBadge color="#C91132">{text}</StateBadge>
    if(record.orderStatus==4) return <StateBadge color="#FFC500">{text}</StateBadge>
    if(record.orderStatus==5) return <StateBadge color="#28CB6B">{text}</StateBadge>
    if(record.orderStatus==6) return <StateBadge color="#FF4A1A">{text}</StateBadge>
    if(record.orderStatus==7) return <StateBadge color="#7545A7">{text}</StateBadge>
    if(record.orderStatus==8) return <StateBadge color="#CCCCCC">{text}</StateBadge>
  }

  return (
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>            
          <Form.Item label="车主手机号" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="车主姓名" name="customerName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="订单状态" name="orderStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                statusArr.map((item, key) => <Option key={key} value={item.id}>{item.title}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="下单时间" name="placeDate" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker allowClear locale={locale} style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
          </Form.Item>
          <Form.Item label="预约日期" name="bookDate" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker allowClear locale={locale} style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
          </Form.Item>
          <Form.Item label="预约门店" name="storeId" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch allowClear notFoundContent='暂无数据' placeholder="输入门店可筛选" optionFilterProp="children" >
              {
                queryStoreSelectLists.map((item, key) => <Option key={key} value={item.storeId}>{item.storeName}</Option>)
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表"></ListTitle>
        <ListTable showPagination current={pageNum} pageSize={pageSize} total={pageTotal} onChange={pageChange} >
          <Table columns={renderColumns()} dataSource={list} pagination={false} scroll={{ x: 1200 }} />
        </ListTable>
      </div>
    </div>
  )
};
export default connect(({ eMaintOrderList, orderPublic }) => ({
  list: eMaintOrderList.list,
  queryStoreSelectLists: eMaintOrderList.queryStoreSelectLists,
  pageTotal: eMaintOrderList.pageTotal,
  providerList: orderPublic.providerList
}))(eMaintOrderListPage)
