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
import { QueryFilter } from '@ant-design/pro-form';

import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";

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
  id: '1',
  title: '已预约'
}, {
  id: '2',
  title: '待取车'
}, {
  id: '3',
  title: '待还车'
}, {
  id: '4',
  title: '已还车'
}, {
  id: '5',
  title: '已完成'
}, {
  id: '6',
  title: '已取消'
}, {
  id: '7',
  title: '待支付'
}, {
  id: '8',
  title: '已失效'
}]
let carType = [{
  id: '1',
  title: '经济型'
}, {
  id: '2',
  title: '舒适型'
}, {
  id: '3',
  title: '精英型'
}]
/*订单来源*/
let OrderSourceArr = [{
  id: 0,
  title: '后台'
}, {
  id: 1,
  title: '用户'
}, {
  id: 2,
  title: '系统'
}
]
const scooterOrderListPage = (props) => {
  let { dispatch, listInfo, list, providerList } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState({
      channelId,
      pageInfo: {
        pageNo,
        pageSize,
      }
    })

  useEffect(() => {
    dispatch({
      type: 'orderPublic/getProviderList',
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
  }, [payload])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'scooterOrderList/getList',
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
        width: 170,
        align: 'left',
        fixed: 'left',
        render: (orderNo) => {
          return <span>{orderNo ? orderNo : '-'}</span>
        },
      }, {
        title: '订单状态',
        width: 100,
        align: 'left',
        dataIndex: 'orderStatusName',
        render: (orderStatusName, renders) => {
          let toorderStatusName = '';
          if (renders.orderStatus == 6) {
            toorderStatusName = <StateBadge color="#C91132">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 1) {
            toorderStatusName = <StateBadge color="#0084FF">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 2) {
            toorderStatusName = <StateBadge color="#7547A7">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 3) {
            toorderStatusName = <StateBadge color="#FFC500">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 4) {
            toorderStatusName = <StateBadge color="#32D1AD">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 5) {
            toorderStatusName = <StateBadge color="#28CB6B">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 7) {
            toorderStatusName = <StateBadge color="#2FB6E4">{orderStatusName}</StateBadge>
          } else if (renders.orderStatus == 8) {
            toorderStatusName = <StateBadge color="#FF4A1A">{orderStatusName}</StateBadge>
          }
          return toorderStatusName;
        },
      }, {
        title: '手机号',
        width: 120,
        align: 'left',
        dataIndex: 'customerPhone',
        render: (customerPhone) => {
          return <span>{customerPhone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}</span>
        },
      }, {
        title: '用车类型',
        width: 100,
        align: 'left',
        dataIndex: 'rentCarTypeName',
        render: (rentCarTypeName, rentCar) => {
          let toRentCarType = null;
          if (rentCar.rentCarType == 1) {
            toRentCarType = <TypeTags type="yellow">{rentCarTypeName}</TypeTags>
          } else if (rentCar.rentCarType == 2) {
            toRentCarType = <TypeTags type="green">{rentCarTypeName}</TypeTags>
          } else if (rentCar.rentCarType == 3) {
            toRentCarType = <TypeTags color="#142ff1">{rentCarTypeName}</TypeTags>
          }
          return <span>{toRentCarType ? toRentCarType : '-'}</span>
        },
      }, {
        title: '用车时间',
        width: 100,
        align: 'left',
        dataIndex: 'rentDays',
        render: (rentDays) => {
          return <span>{rentDays ? rentDays : '-'}</span>
        },
      }, {
        title: '预约取车时间',
        width: 150,
        align: 'left',
        dataIndex: 'pickupTime',
        render: (text) => {
          return <ListTableTime>{text}</ListTableTime>
        }
      }, {
        title: '预约还车时间',
        width: 170,
        align: 'left',
        dataIndex: 'dropoffTime',
        render: (text) => {
          return <ListTableTime>{text}</ListTableTime>
        }
      },
      {
        title: '订单来源',
        dataIndex: 'sourceFlagStr',
        width: 100,
        align: 'left',
        render: (sourceFlagStr) => {
          return <span>{sourceFlagStr ? sourceFlagStr : '-'}</span>
        },
      }, {
        title: '操作',
        width: 100,
        align: 'left',
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
        pathname: '/order/scooterOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>查看</span>
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      channelId,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    let data = {
      ...e,
      channelId,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }

  const pageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    let payloads = JSON.parse(JSON.stringify(payload));
    payloads.pageInfo.pageNo = page;
    payloads.pageInfo.pageSize = pageSize;
    setPayload({ ...payloads })
  }

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    let payload = payload;
    payload.pageInfo.pageNo = page
    setPayload({ ...payload })
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }

  return (
    <div>
      <div className={`${style.block__cont}`}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="手机号：" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="订单号：" name="orderNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="订单状态：" name="orderStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                statusArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="用车类型：" name="rentCarType" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                carType.map((item, key) => {
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
          <Form.Item label="服务商：" name="providerId" labelCol={{ flex: '0 0 120px' }}>
            <Select
              showSearch
              allowClear
              notFoundContent='暂无数据'
              placeholder="输入供应商可筛选"
              optionFilterProp="children"
            >
              {
                providerList.map((item, key) => {
                  return <Option key={key} value={item.providerId}>{item.providerName}</Option>
                })
              }
            </Select>
          </Form.Item>
        </QueryFilter>

      </div>
      <div className={style.block__cont__t}>
        {/* <div className={style.block__header}>结果列表</div> */}
        <ListTitle titleName="结果列表"></ListTitle>
        <div className={style.list_box}>
          <ListTable showPagination current={pageNo} pageSize={pageSize} total={listInfo.totalCount}
            onChange={pageChange}
          >
            <Table columns={renderColumns()} dataSource={list} scroll={{ x: 1200 }} pagination={false}>
            </Table>
          </ListTable>
        </div>
      </div>
    </div>
  )
};
export default connect(({ scooterOrderList, orderPublic }) => ({
  list: scooterOrderList.list,
  listInfo: scooterOrderList.listInfo,
  providerList: orderPublic.providerList
}))(scooterOrderListPage)
