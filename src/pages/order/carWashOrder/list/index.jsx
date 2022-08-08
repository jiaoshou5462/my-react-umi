import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
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
import {
  LtbItem,
  TypeTags,
  ListTitle,
  ListTable,
  StateBadge,
  TextEllipsis,
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
const { Search } = Input
/*状态*/
let statusArr = [{
  id: '1',
  color: '#32D1AD',
  title: '预约中'
},{
  id: '2',
  color: '#2FB6E4',
  title: '预约完成'
},{
  id: '3',
  color: '#7545A7',
  title: '已到店'
},{
  id: '5',
  color: '#0084FF',
  title: '服务完成'
},{
  id: '6',
  color: '#FF4A1A',
  title: '服务取消'
},{
  id: '7',
  color: '#FF9500',
  title: '待支付'
},{
  id: '8',
  color: '#C91132',
  title: '已失效'
}]

/*服务项目*/
let orderTypeArr = [{
  id: '3',
  title: '普通洗车'
},{
  id: '29',
  title: '精细洗车'
}]

/*用户反馈*/
let assessmentResultArr = [{
  id: '2',
  title: '好评'
},{
  id: '3',
  title: '中评'
},{
  id: '4',
  title: '差评'
}]

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

const carWashOrderListPage =(props)=>{
  let {dispatch, pageTotal, list, providerList, reserveStoreList,
        reserveStoreTotal, actualStoreList, actualStoreTotal} = props,
    [form] = Form.useForm(),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [payload, setPayload] = useState({
      channelId,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    }),
    [storePageSize, setStorePageSize] = useState(30), //门店size
    [reserveStorePageNo, setReserveStorePage] = useState(1), //预约门店页数
    [reserveStorePageInfo, setReserveStorePageInfo] = useState({
      pageInfo: {
        pageSize: storePageSize,
        pageNo: reserveStorePageNo,
      }
    }), //预约门店page
    [actualStorePageNo, setActualStorePage] = useState(1), //实际门店页数
    [actualStorePageInfo, setActualStorePageInfo] = useState({
      pageInfo: {
        pageSize: storePageSize,
        pageNo: actualStorePageNo,
      }
    }) //实际门店page
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
  useEffect(()=>{
    if(channelId){
      getList()
    }
  },[payload, channelId])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'carWashOrderList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }
  useEffect(() => {
    getReserveStoreList() //预约
  },[reserveStorePageNo, reserveStorePageInfo])
  useEffect(() => {
    getActualStoreList() //实际
  },[actualStorePageNo, actualStorePageInfo])
  /*获取预约门店列表*/
  let getReserveStoreList = () => {
    dispatch({
      type: 'orderPublic/getReserveStoreList',
      payload: {
        method: 'postJSON',
        params: reserveStorePageInfo
      },
    })
  }
  /*获取实际门店列表*/
  let getActualStoreList = () => {
    dispatch({
      type: 'orderPublic/getActualStoreList',
      payload: {
        method: 'postJSON',
        params: actualStorePageInfo
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
          title: '服务项目',
          width: 100,
          dataIndex: 'orderTypeName',
          render: (orderTypeName, record) => {
            return <TypeTags type={record.orderType === 3 ? 'orange' : 'green'}>{orderTypeName}</TypeTags>
          }
        }, {
          title: '验证码',
          dataIndex: 'verifiyCode',
          width: 180,
          render: (verifiyCode) => {
            return <TextEllipsis>{verifiyCode || '-'}</TextEllipsis>
          }
        }, {
          title: '车主姓名',
          dataIndex: 'customerName',
          width: 120,
          align: 'center',
        }, {
          title: '车主电话',
          dataIndex: 'customerPhone',
          width: 150,
        }, {
          title: '下单时间',
          dataIndex: 'createTime',
          width: 170,
          render: (createTime) => {
            return <ListTableTime>{createTime}</ListTableTime>
          }
        }, {
          title: '预约日期',
          dataIndex: 'bookTime',
          width: 170,
          render: (bookTime) => {
            return <ListTableTime>{bookTime}</ListTableTime>
          }
        }, {
          title: '预约时段',
          dataIndex: 'bookTimePeriod',
          width: 170,
          render: (bookTimePeriod) => {
            return <span>{bookTimePeriod || '-'}</span>
          }
        }, {
          title: '预约门店',
          dataIndex: 'bookLocationName',
          width: 150,
          render: (text, record) => {
            return <TextEllipsis>{text}</TextEllipsis>
          }
        }, {
          title: '用户反馈',
          dataIndex: 'assessmentResultText',
          width: 120,
          render: (assessmentResultText) => {
            return <TextEllipsis>{assessmentResultText || '-'}</TextEllipsis>
          }
        }, {
          title: '反馈备注',
          dataIndex: 'assessmentRemark',
          width: 120,
          render: (assessmentRemark) => {
            return <TextEllipsis>{assessmentRemark || '-'}</TextEllipsis>
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
        pathname: '/order/carWashOrder/list/detail',
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
    form.resetFields();
    let data = {
      channelId,
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      }
    }
    setPayload(data)
    onActualStoreSearch()
    onReserveStoreSearch()
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    //下单时间
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    //预约检测时间
    let bookTimeEnd = e.bookTime ? moment(e.bookTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let bookTimeStart = e.bookTime ? moment(e.bookTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    //实际完成时间
    let actualTimeEnd = e.actualTime ? moment(e.actualTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let actualTimeStart = e.actualTime ? moment(e.actualTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let data = {
      ...e,
      channelId,
      bookTimeEnd,
      bookTimeStart,
      actualTimeEnd,
      actualTimeStart,
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

  /*预约门店页数方法 点击下一页上一页*/
  let onReserveStoreNextChange = (page, pageSize) =>{
    reserveStorePageInfo.pageInfo.pageNo = page
    reserveStorePageInfo.pageInfo.pageSize = pageSize
    setReserveStorePage(page)
    setStorePageSize(pageSize)
    setReserveStorePageInfo(reserveStorePageInfo)
  }
  /*预约门店 搜索*/
  let onReserveStoreSearch = (e) => {
    let data = {
      locationName: e ? e : null,
      pageInfo: {
        pageNo: 1,
        pageSize: storePageSize,
      }
    }
    setReserveStorePage(1)
    setReserveStorePageInfo(data)
  }
  /*实际门店页数方法 点击下一页上一页*/
  let onActualStoreNextChange = (page, pageSize, e) =>{
    actualStorePageInfo.pageInfo.pageNo = page
    actualStorePageInfo.pageInfo.pageSize = pageSize
    setActualStorePage(page)
    setStorePageSize(pageSize)
    setActualStorePageInfo(actualStorePageInfo)
  }
  /*实际门店 搜索*/
  let onActualStoreSearch = (e) => {
    let data = {
      locationName: e ? e : null,
      pageInfo: {
        pageNo: 1,
        pageSize: storePageSize,
      }
    }
    setActualStorePage(1)
    setActualStorePageInfo(data)
  }

  return(
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="订单号：" name="orderNo" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
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
          <Form.Item label="下单时间：" name="createTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker
                allowClear
                locale={locale}
                style={{width: '100%'}}
                placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item label="车主姓名：" name="customerName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="车主手机号：" name="customerPhone" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="验证码：" name="verifiyCode" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="预约洗车时间：" name="bookTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker
                allowClear
                locale={locale}
                style={{width: '100%'}}
                placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item label="预约洗车门店：" name="bookLocationId" labelCol={{flex: '0 0 120px'}}>
            <Select
                allowClear
                placeholder="不限"
                notFoundContent='暂无数据'
                dropdownRender={menu => (
                    <div>
                      <Search placeholder="输入门店名称可筛选" allowClear onSearch={onReserveStoreSearch}/>
                      {menu}
                      <ConfigProvider locale={zh_CN}>
                        <Pagination
                            simple
                            showSizeChanger={false}
                            total={reserveStoreTotal}
                            className={style.store_page}
                            current={reserveStorePageNo}
                            defaultPageSize={storePageSize}
                            onChange={onReserveStoreNextChange}
                        />
                      </ConfigProvider>
                    </div>
                )}
            >
              {
                reserveStoreList.map((item, key) => {
                  return <Option key={key} value={item.objectId}>{item.locationName}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="实际完成时间：" name="actualTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker
                allowClear
                locale={locale}
                style={{width: '100%'}}
                placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item label="实际完成门店：" name="actualLocationId" labelCol={{flex: '0 0 120px'}}>
            <Select
                allowClear
                placeholder="不限"
                notFoundContent='暂无数据'
                dropdownRender={menu => (
                    <div>
                      <Search placeholder="输入门店名称可筛选" allowClear onSearch={onActualStoreSearch}/>
                      {menu}
                      <ConfigProvider locale={zh_CN}>
                        <Pagination
                            simple
                            showSizeChanger={false}
                            total={actualStoreTotal}
                            className={style.store_page}
                            current={actualStorePageNo}
                            defaultPageSize={storePageSize}
                            onChange={onActualStoreNextChange}
                        />
                      </ConfigProvider>
                    </div>
                )}
            >
              {
                actualStoreList.map((item, key) => {
                  return <Option key={key} value={item.objectId}>{item.locationName}</Option>
                })
              }
            </Select>
          </Form.Item>

       {/* <Form.Item label="供应商：" name="providerId" labelCol={{flex: '0 0 120px'}}>
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
          <Form.Item label="服务商订单号：" name="outOrderNo" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>*/}
          <Form.Item label="服务项目：" name="orderType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                orderTypeArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="用户反馈：" name="assessmentResult" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                assessmentResultArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="反馈备注：" name="assessmentRemark" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
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
              scroll={{ x: 1200 }}
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
export default connect(({carWashOrderList, orderPublic})=>({
  list: carWashOrderList.list,
  pageTotal: carWashOrderList.pageTotal,
  providerList: orderPublic.providerList,
  actualStoreList: orderPublic.actualStoreList,
  actualStoreTotal: orderPublic.actualStoreTotal,
  reserveStoreList: orderPublic.reserveStoreList,
  reserveStoreTotal: orderPublic.reserveStoreTotal,
}))(carWashOrderListPage)
